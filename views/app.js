// Main App Router and State

class BrandSyncApp {
    constructor() {
        window.BrandSyncAppInstance = this;
        this.contentArea = document.getElementById('app-content');
        this.pageTitle = document.getElementById('page-title');
        this.navItems = document.querySelectorAll('.nav-item[data-path]');
        this.views = {};

        // AUTH CHECK
        this.checkAuth();
    }

    checkAuth() {
        if (localStorage.getItem('BS_GATEWAY_AUTH') === 'true') {
            document.getElementById('masterLockOverlay').style.display = 'none';
            document.getElementById('mainAppContainer').style.display = 'flex';
            this.bootLayout();
        } else {
            document.getElementById('masterLockOverlay').style.display = 'flex';
            document.getElementById('mainAppContainer').style.display = 'none';
        }
    }

    lockInterface() {
        localStorage.removeItem('BS_GATEWAY_AUTH');
        // Clear sensitive input immediately
        const input = document.getElementById('masterKeyInput');
        if (input) input.value = '';

        // Instant visual feedback: hide app, show lock
        document.getElementById('masterLockOverlay').style.display = 'flex';
        document.getElementById('mainAppContainer').style.display = 'none';

        // Atomic reload to wipe all memory-based states
        location.replace(location.pathname);
    }

    attemptUnlock() {
        const inputEl = document.getElementById('masterKeyInput');
        const key = inputEl.value.trim();
        const err = document.getElementById('authError');

        // Master Password: dadasafa
        if (key === 'dadasafa') {
            localStorage.setItem('BS_GATEWAY_AUTH', 'true');
            document.getElementById('masterLockOverlay').style.transition = '0.5s';
            document.getElementById('masterLockOverlay').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('masterLockOverlay').style.display = 'none';
                document.getElementById('mainAppContainer').style.display = 'flex';
                this.bootLayout();
            }, 500);
        } else {
            err.style.display = 'block';
            setTimeout(() => err.style.display = 'none', 3000);
        }
    }

    bootLayout() {
        if (window.BrandSyncAPI && window.BrandSyncAPI.init) window.BrandSyncAPI.init();
        this.init();
        this.refreshBalance();
        this.setupTopUp();
        this.updateSidebarCounts();
        this.refreshGatewayStatus();

        setInterval(() => this.refreshGatewayStatus(), 5000);

        const badge = document.getElementById('header-credits-badge');
        if (badge) badge.addEventListener('click', () => {
            this.refreshBalance();
            this.updateSidebarCounts();
        });
    }

    async refreshGatewayStatus() {
        if (!window.BrandSyncAPI || !window.BrandSyncAPI.getMessages) return;
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
    }

    async toggleGateway() {
        const flyout = document.getElementById('gatewayFlyout');
        if (!flyout) return;
        const current = flyout.style.display;
        flyout.style.display = current === 'none' ? 'block' : 'none';

        if (flyout.style.display === 'block') {
            // 0. Calculate Operational Metrics via Case-Insensitive Storage Reconciliation
            try {
                const mKey = BS_STORAGE_KEYS.MESSAGES || 'brandsync_messages';
                const msgs = JSON.parse(localStorage.getItem(mKey) || '[]');
                const unreadCount = msgs.filter(m => (m.sender === 'contact' && (m.isRead === false || m.isRead === undefined))).length;

                const sKey = (window.Scheduler && window.Scheduler.STORAGE_KEY) || 'brandsync_scheduled_messages';
                const scheduled = JSON.parse(localStorage.getItem(sKey) || '[]');
                const scheduledCount = scheduled.filter(s => (s.status || '').toLowerCase() === 'pending').length;

                const campaigns = JSON.parse(localStorage.getItem('brandsync_campaigns') || '[]');
                const campaignsCount = campaigns.length;

                // Update UI directly if flyout is open
                const elInCount = document.getElementById('gateway_inbox_count');
                const elSched = document.getElementById('gateway_scheduled_count');
                const elCamp = document.getElementById('gateway_campaigns_count');

                if (elInCount) elInCount.innerText = unreadCount;
                if (elSched) elSched.innerText = scheduledCount;
                if (elCamp) elCamp.innerText = campaignsCount;
            } catch (e) { console.error("Health Check Metrics Error", e); }

            const closer = (e) => {
                const btn = e.target.closest('button');
                if (!flyout.contains(e.target) && (!btn || !btn.onclick || !btn.onclick.toString().includes('toggleGateway'))) {
                    flyout.style.display = 'none';
                    document.removeEventListener('mousedown', closer);
                }
            };
            setTimeout(() => document.addEventListener('mousedown', closer), 10);
        }
    }

    init() {
        // Pre-register views logic to be loaded from components/
        this.registerViews();

        // Window hash change event mapping to routes
        window.addEventListener('hashchange', () => this.handleRoute());

        // Handle nav clicks
        this.navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Remove active from all
                this.navItems.forEach(n => n.classList.remove('active'));
                // Add active to current
                e.currentTarget.classList.add('active');
            });
        });

        // Trigger initial route
        if (!window.location.hash) {
            window.location.hash = '#dashboard';
        } else {
            this.handleRoute();
        }
    }

    async handleGlobalSearch(query) {
        const resultsBox = document.getElementById('globalSearchResults');
        if (!query || query.length < 1) { resultsBox.style.display = 'none'; return; }

        const contacts = await window.BrandSyncAPI.getContacts();
        const filtered = contacts.filter(c =>
            (c.name || '').toLowerCase().includes(query.toLowerCase()) ||
            (c.phone || '').includes(query)
        ).slice(0, 6);

        if (filtered.length > 0) {
            resultsBox.innerHTML = filtered.map(c => `
                <div onclick="window.BrandSyncAppInstance.openDirectEdit('${c.id}'); document.getElementById('globalSearchResults').style.display='none'; document.getElementById('globalSearch').value='';" style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 12px;" onmouseover="this.style.background='rgba(255,159,10,0.1)'" onmouseout="this.style.background='transparent'">
                    <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; color: #fff; font-weight: 800; font-size: 0.75rem;">${(c.name || '?')[0]}</div>
                    <div style="flex:1;">
                        <div style="color: #fff; font-weight: 700; font-size: 0.85rem;">${c.name || 'Unknown'}</div>
                        <div style="color: rgba(255,255,255,0.35); font-size: 0.7rem; font-family: monospace;">+${c.phone}</div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
            `).join('');
            resultsBox.style.display = 'block';
        } else {
            resultsBox.style.display = 'none';
        }
    }

    async openDirectEdit(cid) {
        const contacts = await window.BrandSyncAPI.getContacts();
        const contact = contacts.find(c => String(c.id) === String(cid));
        if (!contact) return;

        // Navigate to contacts and show Global Pool
        window.location.hash = '#contacts';

        setTimeout(async () => {
            if (!window.ContactsView) return;

            // Reset to Global Pool
            window.ContactsView.activeGroupId = null;

            // Pre-fill search with contact name to isolate the row
            const searchInput = document.getElementById('contactSearch');
            if (searchInput) {
                searchInput.value = contact.name || contact.phone || '';
            }

            // Reload data with the filter applied
            await window.ContactsView.loadData();

            // Wait a frame for the DOM to paint the rows
            setTimeout(() => {
                // Find the matching row by phone number text
                const rows = document.querySelectorAll('#contactsTableBody tr');
                let targetRow = null;
                rows.forEach(row => {
                    if (row.innerText.includes(contact.phone)) targetRow = row;
                });

                if (!targetRow) return;

                // Scroll the row into view
                targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Add a glowing highlight animation to the phone cell (2nd td with monospace)
                const phoneTd = targetRow.querySelector('td:nth-child(3)');
                if (phoneTd) {
                    phoneTd.style.transition = 'all 0.3s';
                    phoneTd.style.background = 'rgba(10, 132, 255, 0.25)';
                    phoneTd.style.borderRadius = '8px';
                    phoneTd.style.boxShadow = '0 0 20px rgba(10, 132, 255, 0.5)';
                    phoneTd.style.color = '#fff';

                    // Pulse 3 times then fade out
                    let count = 0;
                    const pulse = setInterval(() => {
                        count++;
                        phoneTd.style.background = count % 2 === 0
                            ? 'rgba(10, 132, 255, 0.25)'
                            : 'rgba(10, 132, 255, 0.5)';
                        if (count >= 6) {
                            clearInterval(pulse);
                            setTimeout(() => {
                                phoneTd.style.background = '';
                                phoneTd.style.boxShadow = '';
                                phoneTd.style.borderRadius = '';
                            }, 800);
                        }
                    }, 300);
                }

                // Also highlight the full row briefly
                targetRow.style.background = 'rgba(10, 132, 255, 0.08)';
                setTimeout(() => targetRow.style.background = '', 2500);

            }, 150);
        }, 400);
    }

    registerViews() {
        // Add stub functions to be overwritten by view specific scripts
        this.views = {
            'dashboard': () => this.renderPlaceholder('Dashboard', 'View real-time statistics and SMS delivery metrics.'),
            'send-sms': () => this.renderPlaceholder('Send SMS', 'Compose and send SMS accurately calculating segments.'),
            'contacts': () => this.renderPlaceholder('Contacts', 'Manage your CRM contacts with ease.'),
            'inbox': () => this.renderPlaceholder('Inbox', 'Two-way conversational real-time messaging.'),
            'campaigns': () => this.renderPlaceholder('Campaigns', 'Blast SMS to groups with customized variables.'),
            'scheduled': () => this.renderPlaceholder('Scheduled Messages', 'Manage your automation queue.'),
            'templates': () => this.renderPlaceholder('Templates', 'Save reusable message structures.'),
            'automation': () => this.renderPlaceholder('Automation', 'Node-based visual trigger management.'),
            'blacklist': () => this.renderPlaceholder('Blacklist', 'Manage blocked numbers automatically.'),
            'api': () => this.renderPlaceholder('API & Integrations', 'Configure PhilSMS OAuth and API keys.')
        };
    }

    async handleRoute() {
        const hash = window.location.hash.substring(1) || 'dashboard';

        // Update Title via UI mapping
        const titleMap = {
            'dashboard': 'Dashboard',
            'send-sms': 'Send SMS',
            'inbox': 'Inbox',
            'campaigns': 'Campaigns',
            'scheduled': 'Scheduled Messages',
            'contacts': 'Contacts Management',
            'templates': 'Templates',
            'automation': 'Automation Logic',
            'blacklist': 'Blacklist Management',
            'api': 'API Settings'
        };

        const currentHash = hash.toLowerCase();
        this.pageTitle.innerText = titleMap[currentHash] || 'Dashboard';

        // Show correct nav active state on reload
        this.navItems.forEach(n => n.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[data-path="${hash}"]`);
        if (activeNav) activeNav.classList.add('active');

        // Clear and animate
        this.contentArea.innerHTML = '';
        this.contentArea.classList.remove('fade-in');

        // Allow a micro frame reflow to trigger CSS animation restart
        void this.contentArea.offsetWidth;
        this.contentArea.classList.add('fade-in');

        // Load correct view if exists
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
            'api': window.ApiView
        };

        const viewComponent = viewMap[hash];
        if (viewComponent && viewComponent.render) {
            await viewComponent.render(this.contentArea);
            if (hash === 'inbox') {
                this.markInboxAsRead();
            }
        } else if (this.views[hash]) {
            await this.views[hash]();
        } else {
            this.contentArea.innerHTML = `<div class="card"><p>404 - View not found</p></div>`;
        }

        // Always try to update balance on route change
        this.refreshBalance();
        this.updateSidebarCounts();
    }

    updateSidebarCounts() {
        // Legacy method deprecated. Heartbeat pulse now handles all operational counts.
        if (window.BrandSyncAPI && window.BrandSyncAPI.runHealth) {
            window.BrandSyncAPI.runHealth();
        }
    }

    confirmAction(title, text, confirmColor, onConfirm) {
        const modal = document.getElementById('confirmModal');
        const titleEl = document.getElementById('confirmTitle');
        const textEl = document.getElementById('confirmText');
        const cancelBtn = document.getElementById('confirmCancel');
        const proceedBtn = document.getElementById('confirmProceed');

        if (!modal || !titleEl || !textEl || !cancelBtn || !proceedBtn) return;

        titleEl.innerText = title;
        textEl.innerText = text;
        proceedBtn.style.background = confirmColor || '#ff453a';

        modal.style.display = 'flex';

        const close = () => {
            modal.style.display = 'none';
            cancelBtn.onclick = null;
            proceedBtn.onclick = null;
        };

        cancelBtn.onclick = close;
        proceedBtn.onclick = () => {
            close();
            onConfirm();
        };
    }

    async refreshBalance() {
        if (!window.BrandSyncAPI) return;

        // Show loading state
        const headerVal = document.getElementById('header-credits-val');
        const sidebarVal = document.getElementById('sidebar-credits-val');

        try {
            const balance = await window.BrandSyncAPI.getBalance();
            const formatted = new Intl.NumberFormat().format(balance);

            if (headerVal) headerVal.innerText = formatted;
            if (sidebarVal) sidebarVal.innerText = formatted;
        } catch (err) {
            console.error("Failed to refresh balance", err);
        }
    }

    renderPlaceholder(title, desc) {
        this.contentArea.innerHTML = `
            <div class="view-container active">
                <div class="card">
                    <h2>${title}</h2>
                    <p style="color: var(--text-secondary)">${desc}</p>
                    <div class="search-box glass-input" style="position: relative; margin-bottom: 16px;">
                        <i class="icon-lucide-search"></i>
                        <input type="text" id="globalSearch" placeholder="Search identity index..." oninput="window.app.handleGlobalSearch(this.value)" onblur="setTimeout(() => document.getElementById('globalSearchResults').style.display='none', 200)">
                        <div id="globalSearchResults" class="glass-panel" style="display:none; position: absolute; top: 100%; left:0; width: 100%; max-height: 250px; overflow-y: auto; z-index: 50000; margin-top: 10px; border-radius: 12px; background: rgba(30,30,35,0.95); border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupTopUp() {
        const btnTopUp = document.getElementById('btnTopUp');
        const modal = document.getElementById('topUpModal');
        const closeBtn = document.getElementById('closeTopUp');
        const amountInput = document.getElementById('rechargeAmountInput');
        const calcUnitsDisplay = document.getElementById('calcUnits');
        const calcPriceDisplay = document.getElementById('calcUnitPrice');

        if (!btnTopUp || !modal) return;

        btnTopUp.onclick = () => {
            modal.style.display = 'flex';
        };

        const closeModal = () => {
            modal.style.display = 'none';
        };

        closeBtn.onclick = closeModal;
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        amountInput.addEventListener('input', () => {
            const php = parseFloat(amountInput.value) || 0;
            let unitPrice = 0.35;

            // Updated calculator rules based on user guide
            if (php >= 3001) unitPrice = 0.31;
            else if (php >= 1001) unitPrice = 0.32;
            else if (php >= 501) unitPrice = 0.33;
            else if (php >= 101) unitPrice = 0.34;
            else unitPrice = 0.35;

            // PhilSMS native conversion uses standard rounding (e.g. 1 / 0.35 = 2.85 -> 3 units)
            const units = Math.round(php / unitPrice);
            if (calcUnitsDisplay) calcUnitsDisplay.innerText = new Intl.NumberFormat().format(units);
            if (calcPriceDisplay) calcPriceDisplay.innerText = `₱ ${unitPrice.toFixed(2)}`;
        });
    }

    updateHeartbeatUI(health) {
        const btn = document.querySelector('button[onclick*="toggleGateway"]');
        const icon = btn?.querySelector('i');
        const mainBadge = document.getElementById('gatewayMainBadge');

        const elInt = document.getElementById('health_internet');
        const elGh = document.getElementById('health_github');
        const elSms = document.getElementById('health_philsms');
        const elDis = document.getElementById('health_dispatch');

        const flyoutBadge = document.getElementById('gatewayMainBadge_flyout');
        const inboxBadge = document.getElementById('gatewayBadge');

        // Status Style Helper
        const getStatusStyles = (active, latency) => {
            if (!active || latency > 3000) return { status: 'CRITICAL', text: 'DISCONNECTED', color: '#ff453a', glow: '0 0 15px #ff453a' };
            if (latency > 500) return { status: 'DEGRADED', text: `RECONNECTING... (${latency}ms)`, color: '#ff9f0a', glow: '0 0 15px #ff9f0a' };
            return { status: 'PERFECT', text: `CONNECTED (${latency}ms)`, color: '#32d74b', glow: '0 0 15px #32d74b' };
        };
        const stInt = getStatusStyles(health.internet, health.latencyNet);
        const stGh = getStatusStyles(health.github, health.latencyGh);
        const stSms = getStatusStyles(health.philsms, health.latencySms);

        // Individual UI Updates
        if (elInt) { elInt.innerText = stInt.text; elInt.style.color = stInt.color; elInt.style.textShadow = stInt.glow; }
        if (elGh) { elGh.innerText = stGh.text; elGh.style.color = stGh.color; elGh.style.textShadow = stGh.glow; }
        if (elSms) { elSms.innerText = stSms.text; elSms.style.color = stSms.color; elSms.style.textShadow = stSms.glow; }

        // Aggregate Visual Alignment (Button)
        const allConnected = health.internet && health.github && health.philsms;
        const anyDegraded = health.latencyNet > 500 || health.latencyGh > 500 || health.latencySms > 500;

        let activeColor = '#32d74b'; // PERFECT / LIME GREEN
        let activeBg = 'rgba(50, 215, 75, 0.25)';
        let activeShadow = '0 0 25px rgba(50, 215, 75, 0.5)';

        if (!allConnected) {
            activeColor = '#ff453a'; // CRITICAL / RED
            activeBg = 'rgba(255, 69, 58, 0.4)';
            activeShadow = '0 0 40px rgba(255, 69, 58, 0.8)';
        } else if (anyDegraded) {
            activeColor = '#ff9f0a'; // DEGRADED / AMBER YELLOW
            activeBg = 'rgba(255, 159, 10, 0.4)';
            activeShadow = '0 0 35px rgba(255, 159, 10, 0.8)';
        }

        // Apply to Header Button & Icons
        if (btn) {
            btn.style.background = activeBg;
            btn.style.boxShadow = activeShadow;
            btn.style.border = `1px solid ${activeColor}`; // Higher contrast border
        }
        if (icon) {
            icon.style.color = activeColor;
            icon.style.textShadow = `0 0 15px ${activeColor}`;
        }
        if (mainBadge) {
            mainBadge.style.background = activeColor;
            mainBadge.style.boxShadow = `0 0 15px ${activeColor}`;
        }
        if (flyoutBadge) {
            flyoutBadge.style.background = activeColor;
            flyoutBadge.style.boxShadow = `0 0 20px ${activeColor}`;
        }        // Core Operational Status Nodes (Gateway & Sidebar)
        const elInCount = document.getElementById('gateway_inbox_count');
        const elSched = document.getElementById('gateway_scheduled_count');
        const elCamp = document.getElementById('gateway_campaigns_count');
        const elSideNotif = document.getElementById('sidebar_inbox_notif');
        const elSideSched = document.getElementById('sidebar_scheduled_count');
        const elSideCamp = document.getElementById('sidebar_campaigns_count');

        // Gateway NOC Row Updates
        if (elInCount) {
            elInCount.innerText = health.unreadCount;
            elInCount.style.color = health.unreadCount > 0 ? '#fff' : 'rgba(255,255,255,0.3)';
        }
        if (elSched) {
            elSched.innerText = health.scheduledCount;
            elSched.style.color = health.scheduledCount > 0 ? '#ff9f0a' : 'rgba(255,255,255,0.4)';
        }
        if (elCamp) {
            elCamp.innerText = health.campaignsCount;
            elCamp.style.color = health.campaignsCount > 4 ? '#0a84ff' : 'rgba(255,255,255,0.4)';
        }

        // Sidebar Menu Node Updates
        const elSideIn = document.getElementById('sidebar_inbox_count');
        const elSideSch = document.getElementById('sidebar_scheduled_count');
        const elSideCam = document.getElementById('sidebar_campaigns_count');

        if (elSideIn) {
            elSideIn.innerText = health.unreadCount;
            elSideIn.style.color = health.unreadCount > 0 ? '#ff453a' : 'rgba(255,255,255,0.4)';
            elSideIn.style.textShadow = health.unreadCount > 0 ? '0 0 10px rgba(255, 69, 58, 0.5)' : 'none';
        }
        if (elSideSch) {
            elSideSch.innerText = health.scheduledCount;
            elSideSch.style.color = health.scheduledCount > 0 ? '#ff9f0a' : 'rgba(255,255,255,0.4)';
            elSideSch.style.textShadow = health.scheduledCount > 0 ? '0 0 10px rgba(255, 159, 10, 0.4)' : 'none';
        }
        if (elSideCam) {
            elSideCam.innerText = health.campaignsCount;
            elSideCam.style.color = health.campaignsCount > 0 ? '#0a84ff' : 'rgba(255,255,255,0.4)';
            elSideCam.style.textShadow = health.campaignsCount > 0 ? '0 0 10px rgba(10, 132, 255, 0.4)' : 'none';
        }

        if (inboxBadge) {
            inboxBadge.innerText = health.unreadCount;
            inboxBadge.style.display = health.unreadCount > 0 ? 'flex' : 'none';
        }
    }

    markInboxAsRead() {
        try {
            const msgs = JSON.parse(localStorage.getItem('brandsync_messages') || '[]');
            let changed = false;
            msgs.forEach(m => {
                if (!m.isRead) {
                    m.isRead = true;
                    changed = true;
                }
            });
            if (changed) {
                localStorage.setItem('brandsync_messages', JSON.stringify(msgs));
                // Trigger global health pulse for instantaneous UI reactivity
                if (window.BrandSyncAPI && window.BrandSyncAPI.runHealth) {
                    window.BrandSyncAPI.runHealth();
                }
            }
        } catch (e) { console.error("Inbox: Failed to clear notifications."); }
    }
}

// Boot application
const bootApp = () => {
    window.app = new BrandSyncApp();
    if (window.Scheduler) {
        window.Scheduler.restoreTimers();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
} else {
    bootApp();
}
