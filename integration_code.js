/**
 * BRAND-SYNC: LEAD SYNDICATION SCRIPT (v2 — Dual Source + Failover)
 * ----------------------------------------------------
 * Project: brandsyncsms (External Pull)
 * Passcode: dadasafa
 * 
 * Data Sources:
 *   Primary:  https://brand-sync.onrender.com
 *   Mirror:   https://brand-sync-1-mcnq.onrender.com
 * 
 * Flow:
 *   1. Check /api/db-status on both servers to verify DB health
 *   2. Pull leads from /api/external/sync?pass=<passcode>
 *   3. Fallback to mirror if primary is down
 *   4. Merge leads into local pending contacts for review
 */

const SYNC_CONFIG = {
    SOURCES: [
        {
            name: 'BrandSync Primary',
            baseUrl: 'https://brand-sync.onrender.com',
            healthEndpoint: '/api/db-status',
            syncEndpoint: '/api/external/sync'
        },
        {
            name: 'BrandSync Mirror',
            baseUrl: 'https://brand-sync-1-mcnq.onrender.com',
            healthEndpoint: '/api/db-status',
            syncEndpoint: '/api/external/sync'
        }
    ],
    PASSCODE: 'dadasafa',
    CORS_PROXY: 'https://corsproxy.io/?',
    TIMEOUT_MS: 15000
};

/**
 * Fetch with timeout helper
 */
function fetchWithTimeout(url, timeoutMs = SYNC_CONFIG.TIMEOUT_MS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { signal: controller.signal })
        .finally(() => clearTimeout(timeoutId));
}

/**
 * Check server health via /api/db-status
 */
async function checkServerHealth(source) {
    try {
        const url = `${SYNC_CONFIG.CORS_PROXY}${encodeURIComponent(source.baseUrl + source.healthEndpoint)}`;
        const res = await fetchWithTimeout(url, 8000);
        if (!res.ok) return { healthy: false, source: source.name, error: `HTTP ${res.status}` };
        const data = await res.json();
        // Expect: {"success":true,"message":"Database is reachable","data":[{"connected":1}]}
        const isConnected = data.success && data.data && data.data[0] && data.data[0].connected === 1;
        return { healthy: isConnected, source: source.name, message: data.message || '' };
    } catch (err) {
        return { healthy: false, source: source.name, error: err.message };
    }
}

/**
 * Pull leads from a specific source
 */
async function pullFromSource(source) {
    const targetUrl = `${source.baseUrl}${source.syncEndpoint}?pass=${SYNC_CONFIG.PASSCODE}`;
    const proxiedUrl = `${SYNC_CONFIG.CORS_PROXY}${encodeURIComponent(targetUrl)}`;
    
    const response = await fetchWithTimeout(proxiedUrl);
    
    if (!response.ok) {
        if (response.status === 401) throw new Error('Invalid Passcode');
        throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
}

/**
 * Main function to fetch leads from the Brand-Sync servers with failover
 * @param {boolean} isBackground - If true, skip toasts and manual button updates
 */
async function pullLeadsFromBrandSync(isBackground = false) {
    console.log(`--- INITIATING LEAD PULL (v2 Dual Source | ${isBackground ? 'Background' : 'Manual'}) ---`);
    
    const statusEl = document.getElementById('sync-status');
    const btn = document.getElementById('pull-leads-btn');
    const startTime = Date.now();

    if (!isBackground && statusEl) {
        statusEl.textContent = 'Checking server health...';
        statusEl.style.color = '#ff9f0a';
    }

    if (!isBackground && window.ContactsView && window.ContactsView.setPendingLoading) {
        window.ContactsView.setPendingLoading(true, "Synchronizing Gateway Nodes...");
    }
    
    let originalHtml = '';
    if (!isBackground && btn) {
        btn.disabled = true;
        originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="icon-lucide-loader-2" style="animation: spin 1s linear infinite;"></i> Connecting...';
    }

    let pullData = null;
    let usedSource = null;

    try {
        // STEP 1: Health Check — probe both servers in parallel
        if (statusEl) statusEl.textContent = 'Probing server health...';
        
        const healthResults = await Promise.allSettled(
            SYNC_CONFIG.SOURCES.map(s => checkServerHealth(s))
        );
        
        console.log('Health check results:', healthResults.map(r => r.value || r.reason));
        
        // Find healthy sources (in order of priority)
        const healthySources = [];
        healthResults.forEach((result, i) => {
            if (result.status === 'fulfilled' && result.value.healthy) {
                healthySources.push(SYNC_CONFIG.SOURCES[i]);
            }
        });

        if (healthySources.length === 0) {
            // Try all sources anyway — db-status might be unreachable but sync might work
            console.warn('No healthy servers detected via /api/db-status, attempting direct sync...');
            healthySources.push(...SYNC_CONFIG.SOURCES);
        }

        // STEP 2: Pull Leads — try each healthy source with failover
        if (!isBackground && btn) btn.innerHTML = '<i class="icon-lucide-loader-2" style="animation: spin 1s linear infinite;"></i> Pulling leads...';
        if (!isBackground && statusEl) statusEl.textContent = 'Fetching leads data...';

        for (const source of healthySources) {
            try {
                console.log(`Attempting pull from: ${source.name} (${source.baseUrl})`);
                if (statusEl) statusEl.textContent = `Pulling from ${source.name}...`;
                
                pullData = await pullFromSource(source);
                usedSource = source;
                console.log(`✅ Success from ${source.name}: ${pullData.count || (pullData.leads || []).length} leads`);
                break; // Success — stop trying other sources
            } catch (err) {
                console.warn(`❌ Failed from ${source.name}:`, err.message);
                // Continue to next source
            }
        }

        if (!pullData) {
            throw new Error('All servers unreachable. Please try again later.');
        }

        // STEP 3: Process and save leads locally
        const leads = pullData.leads || [];
        const count = pullData.count || leads.length;

        if (!isBackground && btn) btn.innerHTML = '<i class="icon-lucide-loader-2" style="animation: spin 1s linear infinite;"></i> Saving locally...';
        if (!isBackground && statusEl) statusEl.textContent = 'Processing leads...';

        // Save leads into the pending contacts store
        const pendingKey = 'brandsync_pending_contacts';
        const existing = JSON.parse(localStorage.getItem(pendingKey) || '[]');
        
        // Look into BOTH pending and main contacts to hot-patch broken historic imports
        const mainKey = 'brandsync_contacts';
        const existingMain = JSON.parse(localStorage.getItem(mainKey) || '[]');
        let newCount = 0;
        let updatedCount = 0;
        let mainUpdatedCount = 0;

        leads.forEach(lead => {
            const mappedCompany = lead.organization || lead.company || lead.organizations || '';
            const mappedPosition = lead.role || lead.position || lead.roles || lead.job_title || '';
            const mappedEvent = lead.event || lead.event_name || '';
            const mappedInterest = lead.selected_topic || lead.selected_topics || lead.topics || lead.interest || lead.interests || lead.brand_interest || lead.brand_interested || '';

            const leadPhone = String(lead.phone || '').replace(/\D/g, '');
            const extIdx = existing.findIndex(e => {
                const ep = String(e.phone || '').replace(/\D/g, '');
                return (e.id && String(e.id) === String(lead.id)) || (ep && ep === leadPhone);
            });
            const mainIdx = existingMain.findIndex(e => {
                const ep = String(e.phone || '').replace(/\D/g, '');
                return (e.id && String(e.id) === String(lead.id)) || (ep && ep === leadPhone);
            });

            if (mainIdx !== -1) {
                // If the lead was already approved into the main contacts, repair here
                // Aggressive Hot-patch: Always recover interest if it looks like junk or is missing
                const currentInt = String(existingMain[mainIdx].interest || '').toLowerCase();
                const isJunk = !currentInt || currentInt === 'n/a' || currentInt.includes('object object') || currentInt === '...';
                
                if (mappedInterest && (isJunk || String(mappedInterest).length > currentInt.length)) {
                    existingMain[mainIdx].interest = mappedInterest;
                }
                mainUpdatedCount++;
            } else if (extIdx !== -1) {
                // Force update existing pending records to repair empty field mappings
                existing[extIdx].company = mappedCompany || existing[extIdx].company;
                existing[extIdx].position = mappedPosition || existing[extIdx].position;
                existing[extIdx].event = mappedEvent || existing[extIdx].event;
                existing[extIdx].interest = mappedInterest || existing[extIdx].interest;
                updatedCount++;
            } else {
                existing.push({
                    id: lead.id,
                    name: lead.name || 'Unknown',
                    phone: lead.phone || '',
                    email: lead.email || '',
                    company: mappedCompany,
                    position: mappedPosition,
                    familiarity: lead.familiarity || 0,
                    event: mappedEvent,
                    event_id: lead.event_id || null,
                    status: lead.status || 'Standard',
                    approval_status: lead.approval_status || 'Pending',
                    interest: mappedInterest,
                    consent: lead.consent || 0,
                    created_at: lead.created_at || new Date().toISOString(),
                    sync_status: lead.sync_status || 'Pending',
                    assigned: lead.assigned || '',
                    country: lead.country || null,
                    country_code: lead.country_code || null,
                    _source: usedSource.name,
                    _pulled_at: new Date().toISOString()
                });
                newCount++;
            }
        });
        
        localStorage.setItem(pendingKey, JSON.stringify(existing));
        if (mainUpdatedCount > 0) localStorage.setItem(mainKey, JSON.stringify(existingMain));
        
        // Also trigger cloud sync if available
        if (window.BrandSyncAPI && window.BrandSyncAPI.syncCloudNow) {
            try { await window.BrandSyncAPI.syncCloudNow(); } catch(e) {}
        }

        // Refresh the pending contacts UI
        if (window.ContactsView && typeof window.ContactsView.loadPendingData === 'function') {
            window.ContactsView.loadPendingData();
        }

        if (window.ContactsView && typeof window.ContactsView.loadData === 'function') {
            window.ContactsView.loadData();
        }

        // Update status
        if (!isBackground && statusEl) {
            statusEl.textContent = `✓ ${count} leads (${newCount} new, ${updatedCount + mainUpdatedCount} refreshed)`;
            statusEl.style.color = '#32d74b';
        }
        
        if (!isBackground && window.showToast) {
            window.showToast(`Pull Successful: ${newCount} new leads, ${updatedCount} cached pending, ${mainUpdatedCount} active updated.`, 'success');
        }

        // Always show toast if NEW leads were found, even in background?
        // Let's stick to user request: "shows how many is pending" - they'll see it on heartbeat.
        if (isBackground && newCount > 0 && window.showToast) {
            window.showToast(`Background Sync: ${newCount} new pending leads discovered.`, 'info');
        }

        // ARTIFICIAL RELAXATION: Ensure scan lasts 10-15 seconds for premium feel
        if (!isBackground) {
            const elapsed = Date.now() - startTime;
            const minDuration = 10000 + (Math.random() * 5000); // 10-15s
            if (elapsed < minDuration) {
                if (window.ContactsView && window.ContactsView.setPendingLoading) {
                    window.ContactsView.setPendingLoading(true, "Optimizing Neural Index...");
                }
                await new Promise(r => setTimeout(r, minDuration - elapsed));
            }
        }

        if (!isBackground && window.ContactsView && window.ContactsView.setPendingLoading) {
            window.ContactsView.setPendingLoading(false);
        }

        return leads;

    } catch (error) {
        console.error('Lead pull failed:', error.message);
        if (statusEl) {
            statusEl.textContent = 'Sync failed: ' + error.message;
            statusEl.style.color = '#ff453a';
        }
        if (window.showToast) window.showToast('Sync Error: ' + error.message, 'error');
        return null;
    } finally {
        if (!isBackground && btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    }
}

/**
 * Display leads in your project (Contacts list)
 * @param {Array} leads - The list of visitors/leads
 */
function renderLeads(leads) {
    const container = document.getElementById('contacts'); 
    if (!container) return;
    console.log('Rendering synced leads to preview...', leads);
}

// Make globally available
window.pullLeadsFromBrandSync = pullLeadsFromBrandSync;

// Global Event Delegation for dynamic buttons
document.addEventListener('click', (e) => {
    if (e.target && (e.target.id === 'pull-leads-btn' || e.target.closest('#pull-leads-btn'))) {
        pullLeadsFromBrandSync();
    }
});
