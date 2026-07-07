// BrandSync Scheduler Service
// Saves scheduled messages to localStorage and fires them at the exact time via setTimeout

window.Scheduler = {
    STORAGE_KEY: 'brandsync_scheduled_messages',

    // Save a new scheduled message
    save(payload) {
        const messages = this.getAll();
        const entry = {
            id: Date.now().toString(),
            senderId: payload.senderId,
            recipients: payload.recipients,
            message: payload.message,
            segments: payload.segments,
            scheduleTime: payload.scheduleTime,  // ISO string: "2024-03-27T19:30"
            scheduledAt: new Date().toISOString(),
            status: 'pending',  // pending | sent | failed
            recurring: payload.recurring || { type: 'none' },
            remoteScheduled: !!payload.remoteScheduled // Lock this in BEFORE persisting
        };
        messages.push(entry);
        this._persist(messages);
        
        // Arm the timer locally
        this.armTimer(entry);
        
        return entry;
    },

    // Get all scheduled messages from storage
    getAll() {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        } catch {
            return [];
        }
    },

    // Delete a scheduled message by ID
    cancel(id) {
        const messages = this.getAll().filter(m => m.id !== id);
        this._persist(messages);
        // Clear the timer if stored
        if(this._timers && this._timers[id]) {
            clearTimeout(this._timers[id]);
            delete this._timers[id];
        }
    },

    // Update a pending scheduled message and re-arm its timer
    update(id, changes) {
        const messages = this.getAll();
        const idx = messages.findIndex(m => m.id === id);
        if(idx === -1) return false;
        // Cancel old timer
        if(this._timers && this._timers[id]) {
            clearTimeout(this._timers[id]);
            delete this._timers[id];
        }
        Object.assign(messages[idx], changes);
        this._persist(messages);
        // Re-arm with new time
        this.armTimer(messages[idx]);
        return true;
    },

    // Update message status
    _updateStatus(id, status, errorReason = null) {
        const messages = this.getAll();
        const idx = messages.findIndex(m => m.id === id);
        if(idx !== -1) {
            messages[idx].status = status;
            if(errorReason) messages[idx].errorReason = errorReason;
            this._persist(messages);
            
            // Sync UI counters globally
            if(window.BrandSyncAppInstance) window.BrandSyncAppInstance.updateSidebarCounts();
        }
    },

    // Persist to localStorage AND trigger GitHub sync
    _persist(messages) {
        if (window.BrandSyncAPI && window.BrandSyncAPI._set) {
            window.BrandSyncAPI._set(this.STORAGE_KEY, messages);
        } else {
            // Fallback during early boot before API is ready
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(messages));
        }
    },

    // Arm a setTimeout to fire the message at the scheduled time
    armTimer(entry) {
        if(!this._timers) this._timers = {};
        
        // Local arming is now mandatory for reliable scheduling
        // (Gateway scheduling is bypassed to avoid 'send now' behavior)

        // Cancel existing timer to prevent double firing on sync/restore
        if(this._timers[entry.id]) {
            clearTimeout(this._timers[entry.id]);
            delete this._timers[entry.id];
        }

        const fireAt = new Date(entry.scheduleTime).getTime();
        const now = Date.now();
        const delay = fireAt - now;

        if(delay <= 0) {
            console.warn('Scheduled time is in the past for ID:', entry.id);
            this._updateStatus(entry.id, 'failed', 'Execution time bypassed or invalid timestamp.');
            return;
        }

        console.log(`[Scheduler] Message ID ${entry.id} will fire in ${Math.round(delay/1000)}s`);

        this._timers[entry.id] = setTimeout(async () => {
            console.log('[Scheduler] Firing scheduled message:', entry.id);

            // EMERGENCY FAILSAFE GUARD: Block dispatch if kill-switch is active
            if (localStorage.getItem('brandsync_failsafe') === 'true') {
                console.warn('[Scheduler] FAILSAFE ACTIVE — Message blocked:', entry.id);
                this._updateStatus(entry.id, 'failed', 'Blocked by Emergency Failsafe.');
                if (window.showToast) window.showToast('🛑 Failsafe Active: Scheduled message was blocked.', 'error');
                return;
            }

            try {
                const res = await window.BrandSyncAPI.sendSMS({
                    senderId: entry.senderId,
                    recipients: entry.recipients,
                    message: entry.message,
                    segments: entry.segments,
                    scheduleTime: null  // send immediately now (real time hit)
                });
                this._updateStatus(entry.id, 'sent');
                window.showToast(`📅 Scheduled message sent! ${res.message}`, 'success');

                // --- ADVANCED RECURRING LOGIC ---
                if(entry.recurring && entry.recurring.type !== 'none') {
                    const now = new Date(entry.scheduleTime);
                    const nextTime = new Date(now);
                    const type = entry.recurring.type;
                    
                    if(type === 'daily') {
                        nextTime.setDate(nextTime.getDate() + 1);
                    } else if(type === 'weekly') {
                        // Days array: 1=Mon, 7=Sun
                        const allowedDays = entry.recurring.days || [1,2,3,4,5]; 
                        let found = false;
                        // Search for the next closest allowed day in the next 7 days
                        for(let i=1; i<=7; i++) {
                            const check = new Date(now);
                            check.setDate(check.getDate() + i);
                            let dayIdx = check.getDay(); // 0=Sun, 1=Mon...
                            if(dayIdx === 0) dayIdx = 7;
                            if(allowedDays.includes(dayIdx)) {
                                nextTime.setTime(check.getTime());
                                found = true;
                                break;
                            }
                        }
                        if(!found) nextTime.setDate(nextTime.getDate() + 7);
                    } else if(type === 'monthly') {
                        nextTime.setMonth(nextTime.getMonth() + 1);
                    } else if(type === 'yearly') {
                        nextTime.setFullYear(nextTime.getFullYear() + 1);
                    }

                    // Create NEXT occurrence if within end date
                    if (entry.recurring.endDate && nextTime.getTime() > new Date(entry.recurring.endDate).getTime()) {
                        console.log(`[Scheduler] Sequence finished. Date ${nextTime.toISOString()} is after end date.`);
                    } else {
                        this.save({
                            senderId: entry.senderId,
                            recipients: entry.recipients,
                            message: entry.message,
                            segments: entry.segments,
                            scheduleTime: nextTime.toISOString().slice(0, 16),
                            recurring: entry.recurring
                        });
                    }
                }

                // Refresh the scheduled view if open
                if(window.ScheduledView && document.querySelector('#scheduled-list')) {
                    window.ScheduledView.renderList();
                }
            } catch(e) {
                const errStr = e.error || (typeof e === 'string' ? e : e.message) || 'Unknown Dispatch Error';
                this._updateStatus(entry.id, 'failed', errStr);
                window.showToast(`❌ Scheduled send failed: ${errStr}`, 'error');
            }
        }, delay);
    },

    // On app start: re-arm timers for all pending messages
    restoreTimers() {
        const messages = this.getAll().filter(m => m.status === 'pending');
        let restored = 0;
        messages.forEach(m => {
            const fireAt = new Date(m.scheduleTime).getTime();
            if(fireAt > Date.now()) {
                // Always arm local timers for pending messages
                this.armTimer(m);
                restored++;
            } else {
                // Past due - mark as failed
                this._updateStatus(m.id, 'failed', 'This message was scheduled for a time when the system was offline and could not be sent.');
            }
        });
        if(restored > 0) console.log(`[Scheduler] Restored ${restored} pending timer(s).`);
    }
};

// Aliases for convenience
window.Scheduler.add = window.Scheduler.save.bind(window.Scheduler);
