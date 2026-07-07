// Main App Router and State — RBAC Unified Edition
class BrandSyncApp {
    constructor() {
        window.BrandSyncAppInstance = this;
        this.contentArea = document.getElementById('app-content');
        this.pageTitle = document.getElementById('page-title');
        this.navItems = document.querySelectorAll('.nav-item[data-path]');
        this.views = {};

        // 1. Initialized Auth Service
        if (window.AuthService) window.AuthService.init();

        // 2. Initialized Core UI Components
        this.registerViews();
        
        // 3. AUTH CHECK & BOOT
        this.checkAuth();
    }

    checkAuth() {
        if (window.AuthService && window.AuthService.isLoggedIn()) {
            document.getElementById('masterLockOverlay').style.display = 'none';
            const aiLoading = document.getElementById('aiLoadingScreen');
            const aiText = aiLoading.querySelector('.ai-loading-text');

            if (aiLoading) {
                aiLoading.classList.add('active');
            }

            // Cycle status messages for engagement
            const messages = [
                "Re-establishing Neural Link",
                "Authenticating Session Token",
                "Preparing Workspace Index",
                "Establishing Secure Uplink"
            ];
            
            let msgIdx = 0;
            const msgInterval = setInterval(() => {
                if (aiText) {
                    aiText.style.opacity = '0';
                    setTimeout(() => {
                        aiText.innerText = messages[msgIdx % messages.length];
                        aiText.style.opacity = '1';
                        msgIdx++;
                    }, 400);
                }
            }, 800);

            // Simulate System Prep for returning users
            setTimeout(() => {
                clearInterval(msgInterval);
                if (aiLoading) {
                    aiLoading.classList.remove('active');
                    aiLoading.style.transform = 'scale(1.05)';
                }
                
                setTimeout(() => {
                    if (aiLoading) {
                        aiLoading.style.transform = 'none';
                    }
                    if (aiText) aiText.innerText = "Initializing BrandSync SMS";

                    document.getElementById('mainAppContainer').style.display = 'flex';
                    this.bootLayout();
                }, 1000);
            }, 3000); 
        } else {
            document.getElementById('masterLockOverlay').style.display = 'flex';
            document.getElementById('mainAppContainer').style.display = 'none';
        }
    }

    handleLogin() {
        const userEl = document.getElementById('loginUsername');
        const passEl = document.getElementById('loginPassword');
        const errEl = document.getElementById('authError');

        if (!userEl || !passEl) return;

        const username = userEl.value.trim();
        const password = passEl.value;

        if (!username || !password) {
            if (window.showToast) window.showToast('Please enter both username and password.', 'error');
            return;
        }

        const result = window.AuthService.login(username, password);

        if (result.success) {
            // Visual transition -> AI Scanning Loading Screen
            const overlay = document.getElementById('masterLockOverlay');
            const aiLoading = document.getElementById('aiLoadingScreen');
            const aiText = aiLoading.querySelector('.ai-loading-text');
            
            // Hide login, show AI scanning
            overlay.style.display = 'none';
            aiLoading.classList.add('active');

            // Cycle status messages for engagement
            const messages = [
                "Initializing Neural Link",
                "Optimizing Message Payloads",
                "Sanitizing Gateway Nodes",
                "Establishing Secure Uplink",
                "Synchronizing Identity Index",
                "Decrypting Session Keys"
            ];
            
            let msgIdx = 0;
            const msgInterval = setInterval(() => {
                if (aiText) {
                    aiText.style.opacity = '0';
                    setTimeout(() => {
                        aiText.innerText = messages[msgIdx % messages.length];
                        aiText.style.opacity = '1';
                        msgIdx++;
                    }, 400);
                }
            }, 1800);

            // Randomize duration between 6-9 seconds for "System Optimization" feel
            const duration = 6500 + (Math.random() * 2500);

            setTimeout(() => {
                clearInterval(msgInterval);
                aiLoading.classList.remove('active');
                aiLoading.style.transform = 'scale(1.1)';

                setTimeout(() => {
                    aiLoading.style.transform = 'none';
                    if (aiText) aiText.innerText = "Initializing BrandSync SMS"; // Reset for next time
                    
                    this.checkAuth();
                    // Trigger initial route
                    this.handleRoute();
                }, 1200);
            }, duration);
        } else {
            if (errEl) {
                errEl.innerText = result.error;
                errEl.style.display = 'block';
                setTimeout(() => errEl.style.display = 'none', 3000);
            }
            if (window.showToast) window.showToast(result.error, 'error');
        }
    }

    lockInterface() {
        if (window.AuthService) window.AuthService.logout();
        
        const overlay = document.getElementById('masterLockOverlay');
        const main = document.getElementById('mainAppContainer');
        
        overlay.style.display = 'flex';
        main.style.display = 'none';

        // Reset login fields
        const userEl = document.getElementById('loginUsername');
        const passEl = document.getElementById('loginPassword');
        if (userEl) userEl.value = '';
        if (passEl) passEl.value = '';

        location.replace(location.pathname);
    }

    toggleFailsafe() {
        const isActive = localStorage.getItem('brandsync_failsafe') === 'true';
        const newState = !isActive;
        
        localStorage.setItem('brandsync_failsafe', newState);
        
        if (newState) {
            if (window.showToast) window.showToast('EMERGENCY FAILSAFE ACTIVE: SYSTEM DISCONNECTED', 'error');
            console.error('[BrandSync] Emergency Failsafe Triggered. All outgoing API communication blocked.');
        } else {
            if (window.showToast) window.showToast('Systems Restored: Failsafe Disengaged', 'success');
            console.log('[BrandSync] Systems Restored. Normal operation resumed.');
        }
        
        this.updateFailsafeUI();
        
        // Broadcast state to Cloud via Gist
        if (window.BrandSyncAPI && window.BrandSyncAPI.githubPush) {
            const config = window.BrandSyncConfig;
            window.BrandSyncAPI.githubPush(config.DEFAULT_GITHUB_TOKEN, config.DEFAULT_GIST_ID);
        }
    }

    updateFailsafeUI() {
        const isActive = localStorage.getItem('brandsync_failsafe') === 'true';
        const btn = document.getElementById('failsafeToggleBtn');
        const icon = document.getElementById('failsafeIcon');
        
        if (!btn || !icon) return;
        
        if (isActive) {
            btn.classList.add('failsafe-active');
            document.body.classList.add('failsafe-global-alert');
            btn.title = 'EMERGENCY FAILSAFE ACTIVE (Click to Restore)';
            if (icon) {
                icon.className = 'icon-lucide-alert-triangle';
                icon.style.color = '#ff453a'; // Bright Red
                icon.style.filter = 'drop-shadow(0 0 12px #ff453a)';
            }
        } else {
            btn.classList.remove('failsafe-active');
            document.body.classList.remove('failsafe-global-alert');
            btn.title = 'Emergency Failsafe (Standard Mode)';
            if (icon) {
                icon.className = 'icon-lucide-alert-triangle';
                icon.style.color = '#ffd60a'; // Warning Yellow
                icon.style.filter = 'none';
            }
        }
    }

    bootLayout() {
        // Run API health heartbeats
        if (window.BrandSyncAPI && window.BrandSyncAPI.init) window.BrandSyncAPI.init();
        
        // Sync UI roles and visibility
        if (window.RBAC) window.RBAC.applyNavVisibility();
        this._updateSidebarUser();

        this.init();
        this.refreshBalance();
        this.setupTopUp();
        this.refreshGatewayStatus();
        this.updateFailsafeUI();

        setInterval(() => this.refreshGatewayStatus(), 5000);

        // BACKGROUND SYNC SERVICE: Every 5 minutes
        setInterval(() => {
            if (window.pullLeadsFromBrandSync) window.pullLeadsFromBrandSync(true);
        }, 300000);

        // Initial Background Pull: 30 seconds after boot to stay fresh
        setTimeout(() => {
            if (window.pullLeadsFromBrandSync) window.pullLeadsFromBrandSync(true);
        }, 30000);

        const badge = document.getElementById('header-credits-badge');
        if (badge) badge.onclick = () => {
            this.refreshBalance();
        };
    }

    _updateSidebarUser() {
        const user = window.AuthService.getCurrentUser();
        if (!user) return;
        const nameEl = document.querySelector('.user-name');
        if (nameEl) nameEl.innerText = user.fullName || user.username;
        const avatarEl = document.querySelector('.avatar');
        if (avatarEl) avatarEl.innerText = (user.fullName || user.username || '?')[0].toUpperCase();
    }

    async refreshGatewayStatus() {
        if (!window.BrandSyncAPI || !window.BrandSyncAPI.getMessages) return;
        try {
            const msgs = await window.BrandSyncAPI.getMessages();
            const unreadCount = msgs.filter(m => m.sender === 'contact' && !m.isRead).length;

            const badge = document.getElementById('gatewayBadge');
            if (badge) {
                if (unreadCount > 0) {
                    badge.innerText = unreadCount;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }
        } catch (e) { console.warn("Gateway Heartbeat Sync Delayed"); }
    }

    async toggleGateway() {
        const flyout = document.getElementById('gatewayFlyout');
        if (!flyout) return;
        const current = flyout.style.display;
        flyout.style.display = current === 'none' ? 'block' : 'none';

        if (flyout.style.display === 'block') {
            try {
                const mKey = (window.BS_STORAGE_KEYS && window.BS_STORAGE_KEYS.MESSAGES) || 'brandsync_messages';
                const msgs = JSON.parse(localStorage.getItem(mKey) || '[]');
                const unreadCount = msgs.filter(m => (m.sender === 'contact' && !m.isRead)).length;

                const sKey = (window.Scheduler && window.Scheduler.STORAGE_KEY) || 'brandsync_scheduled_messages';
                const scheduled = JSON.parse(localStorage.getItem(sKey) || '[]');
                const scheduledCount = scheduled.filter(s => (s.status || '').toLowerCase() === 'pending').length;

                const campaigns = JSON.parse(localStorage.getItem('brandsync_campaigns') || '[]');
                const campaignsCount = campaigns.length;

                const elInCount = document.getElementById('gateway_inbox_count');
                const elSched = document.getElementById('gateway_scheduled_count');
                const elCamp = document.getElementById('gateway_campaigns_count');

                if (elInCount) elInCount.innerText = unreadCount;
                if (elSched) elSched.innerText = scheduledCount;
                if (elCamp) elCamp.innerText = campaignsCount;
            } catch (e) { console.error("Gateway Sync Error", e); }

            const closer = (e) => {
                if (!flyout.contains(e.target) && !e.target.closest('button[onclick*="toggleGateway"]')) {
                    flyout.style.display = 'none';
                    document.removeEventListener('mousedown', closer);
                }
            };
            setTimeout(() => document.addEventListener('mousedown', closer), 10);
        }
    }

    async handleCloudSync(btn) {
        const label = document.getElementById('syncLabel');
        const status = document.getElementById('syncStatus');
        if (!window.BrandSyncAPI || !window.BrandSyncAPI.syncCloudNow) return;

        btn.disabled = true;
        label.innerText = "Synchronizing...";
        
        const res = await window.BrandSyncAPI.syncCloudNow();
        
        btn.disabled = false;
        label.innerText = "Synchronize Cloud Index";
        if (res.success) {
            status.innerText = "Status: Sync Complete";
            if (window.showToast) window.showToast("Cloud synchronization successful", "success");
        } else {
            status.innerText = "Status: Sync Failed";
            if (window.showToast) window.showToast(res.message, "error");
        }
    }

    init() {
        // Register route transitions
        window.addEventListener('hashchange', () => this.handleRoute());

        // Initialize Router
        if (!window.location.hash) {
            window.location.hash = '#dashboard';
        } else {
            this.handleRoute();
        }

        // Apply global search logic
        const searchInput = document.getElementById('globalSearch');
        if (searchInput) {
            searchInput.oninput = (e) => this.handleGlobalSearch(e.target.value);
            searchInput.onblur = () => setTimeout(() => {
                const res = document.getElementById('globalSearchResults');
                if (res) res.style.display = 'none';
            }, 200);
        }

        // Apply navigation clicks
        this.navItems.forEach(n => {
            n.onclick = (e) => {
                const path = n.getAttribute('data-path');
                if (path) window.location.hash = '#' + path;
            };
        });
    }

    registerViews() {
        this.views = {
            'dashboard': () => this.renderStatic('Dashboard', 'View real-time statistics and SMS metrics.'),
            'send-sms': () => this.renderStatic('Send SMS', 'Compose and deliver message payloads.'),
            'contacts': () => this.renderStatic('Contacts', 'Manage CRM database and growth segmentations.'),
            'inbox': () => this.renderStatic('Inbox', 'Real-time two-way messaging terminal.'),
            'campaigns': () => this.renderStatic('Campaigns', 'Execute large-scale broadcast operations.'),
            'scheduled': () => this.renderStatic('Scheduled', 'Monitor and manage the automation queue.'),
            'templates': () => this.renderStatic('Templates', 'Reusable message structures and variables.'),
            'automation': () => this.renderStatic('Automation', 'Node-based logic triggers.'),
            'blacklist': () => this.renderStatic('Blacklist', 'Global suppression list management.'),
            'api': () => this.renderStatic('API Settings', 'Configure PhilSMS and external gateway keys.'),
            'users': () => this.renderStatic('User Management', 'Admin portal for role-based access control.'),
            'profile': () => this.renderStatic('My Profile', 'Personal account settings and activity logs.')
        };
    }

    async handleRoute() {
        const hash = (window.location.hash.substring(1) || 'dashboard').toLowerCase();
        
        // RBAC Navigation Guard
        const navActions = {
            'users': 'nav_users',
            'api': 'nav_api',
            'automation': 'nav_automation',
            'blacklist': 'nav_blacklist'
        };

        if (navActions[hash] && window.RBAC && !window.RBAC.can(navActions[hash])) {
            if (window.showToast) window.showToast("Access Denied", "error");
            window.location.hash = '#dashboard';
            return;
        }

        // Update Title UI
        const titleMap = {
            'dashboard': 'Intelligence Dashboard',
            'send-sms': 'Message Composer',
            'inbox': 'Conversation Terminal',
            'campaigns': 'Campaign Manager',
            'scheduled': 'Automation Queue',
            'contacts': 'CRM Directory',
            'templates': 'Resource Library',
            'automation': 'Logic Engine',
            'blacklist': 'Suppression Index',
            'api': 'Gateway Integration',
            'users': 'User Management',
            'profile': 'Account Settings'
        };
        if (this.pageTitle) this.pageTitle.innerText = titleMap[hash] || 'BrandSync';

        // Update Sidebar Active state
        this.navItems.forEach(n => {
            n.classList.toggle('active', n.getAttribute('data-path') === hash);
        });

        // Load View
        this.contentArea.innerHTML = '';
        this.contentArea.classList.remove('fade-in');
        void this.contentArea.offsetWidth;
        this.contentArea.classList.add('fade-in');

        const viewMap = {
            'dashboard': window.DashboardView,
            'send-sms': window.SendSMSView,
            'contacts': window.ContactsView,
            'inbox': window.InboxView,
            'campaigns': window.CampaignsView,
            'scheduled': window.ScheduledView,
            'templates': window.TemplatesView,
            'automation': window.AutomationView,
            'blacklist': window.BlacklistView,
            'api': window.ApiView,
            'users': window.UsersView,
            'profile': window.ProfileView
        };

        const inst = viewMap[hash];
        if (inst && inst.render) {
            // SHOW SCANNER
            this.showLoading("Neural Processing: " + (titleMap[hash] || "BrandSync"));
            
            // ARTIFICIAL RELAXATION: Minimum 1000ms scan for premium feel
            const startRouteAt = Date.now();
            
            await inst.render(this.contentArea);
            if (hash === 'inbox') this.markInboxAsRead();
            
            const elapsed = Date.now() - startRouteAt;
            if (elapsed < 1000) await new Promise(r => setTimeout(r, 1000 - elapsed));
            
            this.hideLoading();
        } else {
            this.contentArea.innerHTML = `<div class="card" style="padding:40px; text-align:center;"><p style="color:var(--text-muted);">View component not initialized for: <b>${hash}</b></p></div>`;
        }

        this.refreshBalance();
        if (window.RBAC) window.RBAC.applyNavVisibility();
    }

    showLoading(text = "Optimizing Neural Index...") {
        const overlay = document.getElementById('globalLoadingOverlay');
        if (!overlay) return;
        const textEl = overlay.querySelector('.scanner-text');
        if (textEl) textEl.innerText = text;
        overlay.classList.add('active');
    }

    hideLoading() {
        const overlay = document.getElementById('globalLoadingOverlay');
        if (overlay) overlay.classList.remove('active');
    }

    renderStatic(title, desc) {
        this.contentArea.innerHTML = `
            <div class="view-container active">
                <div class="card">
                    <h2>${title}</h2>
                    <p style="color: var(--text-secondary)">${desc}</p>
                </div>
            </div>
        `;
    }

    async handleGlobalSearch(query) {
        const resultsBox = document.getElementById('globalSearchResults');
        if (!query || query.length < 1) { if (resultsBox) resultsBox.style.display = 'none'; return; }

        try {
            const contacts = await window.BrandSyncAPI.getContacts();
            const filtered = contacts.filter(c =>
                (c.name || '').toLowerCase().includes(query.toLowerCase()) ||
                (c.phone || '').includes(query)
            ).slice(0, 6);

            if (filtered.length > 0 && resultsBox) {
                resultsBox.innerHTML = filtered.map(c => `
                    <div onclick="window.BrandSyncAppInstance.openDirectEdit('${c.id}');" style="padding:12px 16px; border-bottom:1px solid rgba(255,255,255,0.05); cursor:pointer; display:flex; align-items:center; gap:12px;">
                        <div style="width:32px; height:32px; border-radius:8px; background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:0.75rem;">${(c.name || '?')[0]}</div>
                        <div style="flex:1;">
                            <div style="color:#fff; font-weight:700; font-size:0.85rem;">${c.name || 'Unknown'}</div>
                            <div style="color:rgba(255,255,255,0.35); font-size:0.75rem;">+${c.phone}</div>
                        </div>
                    </div>
                `).join('');
                resultsBox.style.display = 'block';
            } else if (resultsBox) {
                resultsBox.style.display = 'none';
            }
        } catch (e) {}
    }

    confirmAction(title, text, color, onConfirm) {
        const modal = document.getElementById('confirmModal');
        const titleEl = document.getElementById('confirmTitle');
        const textEl = document.getElementById('confirmText');
        const proceedBtn = document.getElementById('confirmProceed');
        const cancelBtn = document.getElementById('confirmCancel');

        if (!modal) return;
        titleEl.innerText = title;
        textEl.innerText = text;
        proceedBtn.style.background = color || '#ff453a';
        modal.style.display = 'flex';

        proceedBtn.onclick = () => { modal.style.display = 'none'; onConfirm(); };
        cancelBtn.onclick = () => { modal.style.display = 'none'; };
    }

    async refreshBalance() {
        if (!window.BrandSyncAPI || !window.BrandSyncAPI.getBalance) return;
        try {
            const balance = await window.BrandSyncAPI.getBalance();
            const formatted = new Intl.NumberFormat().format(balance);
            const hb = document.getElementById('header-credits-val');
            const sb = document.getElementById('sidebar-credits-val');
            if (hb) hb.innerText = formatted;
            if (sb) sb.innerText = formatted;
        } catch (err) {}
    }

    setupTopUp() {
        const btn = document.getElementById('btnTopUp');
        const modal = document.getElementById('topUpModal');
        const close = document.getElementById('closeTopUp');
        if (!btn || !modal) return;

        btn.onclick = () => modal.style.display = 'flex';
        close.onclick = () => modal.style.display = 'none';
        window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

        const input = document.getElementById('rechargeAmountInput');
        if (input) {
            input.oninput = () => {
                const php = parseFloat(input.value) || 0;
                let rate = 0.35;
                if (php >= 3001) rate = 0.31;
                else if (php >= 1001) rate = 0.32;
                else if (php >= 501) rate = 0.33;
                else if (php >= 101) rate = 0.34;
                const units = Math.round(php / rate);
                document.getElementById('calcUnits').innerText = new Intl.NumberFormat().format(units);
                document.getElementById('calcUnitPrice').innerText = `₱ ${rate.toFixed(2)}`;
            };
        }
    }

    markInboxAsRead() {
        try {
            const msgs = JSON.parse(localStorage.getItem('brandsync_messages') || '[]');
            msgs.forEach(m => m.isRead = true);
            localStorage.setItem('brandsync_messages', JSON.stringify(msgs));
            if (window.BrandSyncAPI && window.BrandSyncAPI.runHealth) window.BrandSyncAPI.runHealth();
        } catch (e) {}
    }

    updateHeartbeatUI(health) {
        const formatLatency = (ms) => {
            if (ms < 0) return { text: 'OFFLINE', color: '#ff453a', priority: 3 };
            if (ms < 200) return { text: `${ms}ms`, color: '#32d74b', priority: 1 };
            if (ms < 800) return { text: `${ms}ms`, color: '#ffd60a', priority: 2 };
            return { text: `${ms}ms`, color: '#ff453a', priority: 3 };
        };

        const net = formatLatency(health.internet !== false ? health.latencyNet : -1);
        const gh = { text: 'CONNECTED', color: '#32d74b', priority: 1 };
        const sms = formatLatency(health.philsms !== false ? health.latencySms : -1);

        const elNet = document.getElementById('health_internet');
        const elGh = document.getElementById('health_github');
        const elSms = document.getElementById('health_philsms');

        if (elNet) {
            elNet.innerText = net.text;
            elNet.style.color = net.color;
            elNet.style.textShadow = `0 0 12px ${net.color}`;
        }
        if (elGh) {
            elGh.innerText = gh.text;
            elGh.style.color = gh.color;
            elGh.style.textShadow = `0 0 12px ${gh.color}`;
        }
        if (elSms) {
            elSms.innerText = sms.text;
            elSms.style.color = sms.color;
            elSms.style.textShadow = `0 0 12px ${sms.color}`;
        }

        const worstPriority = Math.max(net.priority, sms.priority);
        let overallColor = '#32d74b';
        if (worstPriority === 2) overallColor = '#ffd60a';
        if (worstPriority === 3) overallColor = '#ff453a';

        const btn = document.getElementById('gatewayHeartbeatBtn');
        const icon = document.getElementById('gatewayHeartbeatIcon');
        const pulseNode = document.getElementById('heart-pulse-node');

        if (btn) {
            if (overallColor === '#32d74b') btn.style.background = 'rgba(50,215,75,0.1)';
            else if (overallColor === '#ffd60a') btn.style.background = 'rgba(255,214,10,0.12)';
            else btn.style.background = 'rgba(255,69,58,0.12)';
            if (overallColor === '#32d74b') btn.style.borderColor = 'rgba(50,215,75,0.3)';
            else if (overallColor === '#ffd60a') btn.style.borderColor = 'rgba(255,214,10,0.4)';
            else btn.style.borderColor = 'rgba(255,69,58,0.4)';
            btn.style.boxShadow = `0 0 18px ${overallColor}44`;
        }
        if (icon) icon.style.color = overallColor;
        if (pulseNode) {
            pulseNode.style.background = overallColor;
            pulseNode.style.boxShadow = `0 0 12px ${overallColor}`;
        }

        const apiIssues = [net, sms].filter(s => s.priority >= 2).length;
        let opsAlerts = (health.unreadCount || 0) + (health.scheduledCount || 0) + (health.campaignsCount || 0);

        try {
            const pendingLeads = JSON.parse(localStorage.getItem('brandsync_pending_contacts') || '[]');
            opsAlerts += pendingLeads.length;

            const elInbox = document.getElementById('gateway_inbox_notif');
            const elInCount = document.getElementById('gateway_inbox_count');
            const elSched = document.getElementById('gateway_scheduled_count');
            const elCamp = document.getElementById('gateway_campaigns_count');
            const elLeads = document.getElementById('gateway_brandsync_count');

            if (elInbox) {
                if ((health.unreadCount || 0) > 0) {
                    elInbox.innerText = health.unreadCount;
                    elInbox.style.display = 'flex';
                } else {
                    elInbox.style.display = 'none';
                }
            }
            if (elInCount) elInCount.innerText = health.unreadCount || 0;
            if (elSched) elSched.innerText = health.scheduledCount || 0;
            if (elCamp) elCamp.innerText = health.campaignsCount || 0;
            if (elLeads) elLeads.innerText = pendingLeads.length;
        } catch (e) {}

        const totalBadge = apiIssues + opsAlerts;
        const badge = document.getElementById('gatewayBadge');
        if (badge) {
            if (totalBadge > 0) {
                badge.innerText = totalBadge;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    updateSidebarCounts() {
        // This method is called by various components to refresh global notification counts
        if (window.BrandSyncAPI && window.BrandSyncAPI.runHealth) {
            window.BrandSyncAPI.runHealth();
        }
    }
}

// Initialized Application Node
const bootApp = () => {
    window.app = new BrandSyncApp();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
} else {
    bootApp();
}
