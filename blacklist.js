// Blacklist View Component
window.BlacklistView = {
    render(container) {
        container.innerHTML = `
            <div class="view-container active fade-in">
                
                <div style="display:flex; justify-content: space-between; align-items:center;">
                    <div>
                        <h2 style="font-size: 1.35rem; font-weight: 700; color: #fff; letter-spacing: -0.02em;">Global Blocklist</h2>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Numbers here will never receive messages from your system.</p>
                    </div>
                    <button class="btn primary-btn" onclick="window.BlacklistView.openModal()" style="background: var(--danger-color); box-shadow: 0 4px 12px rgba(255, 69, 58, 0.3); border-color: rgba(255, 69, 58, 0.3);"><i class="icon-lucide-shield-ban"></i> Block Number</button>
                </div>

                <!-- Settings Toggle -->
                <div class="card" style="flex-direction: row; justify-content: space-between; align-items: center; border-left: 4px solid var(--warning-color); margin-top:24px;">
                    <div>
                        <h3 style="font-size: 1rem; font-weight:700; color:#fff;">Auto-block failed numbers</h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">Automatically add phone numbers to blacklist after 3 consecutive hard bounces.</p>
                    </div>
                    <!-- CSS Toggle Switch Mockup -->
                    <div style="width: 48px; height: 26px; background: var(--success-color); border-radius: 13px; position: relative; cursor: pointer; transition: 0.3s; box-shadow: 0 0 15px rgba(50, 215, 75, 0.2);">
                        <div style="width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 3px; right: 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
                    </div>
                </div>

                <!-- Blacklist Table -->
                <div class="card" style="padding: 0; overflow: hidden; margin-top:24px;">
                    <div style="padding: 16px 20px; display:flex; gap: 12px; border-bottom: 1px solid var(--border-glass);">
                        <div class="glass-input" style="flex: 1;">
                            <i class="icon-lucide-search"></i>
                            <input type="text" placeholder="Search blocked numbers...">
                        </div>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="background: rgba(255,255,255,0.03); border-bottom: 1px solid var(--border-glass);">
                                <th style="padding: 18px 20px; font-weight: 600; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Phone Number</th>
                                <th style="padding: 18px 20px; font-weight: 600; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Reason</th>
                                <th style="padding: 18px 20px; font-weight: 600; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Date Blocked</th>
                                <th style="padding: 18px 20px; text-align: right; font-weight: 600; font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Action</th>
                            </tr>
                        </thead>
                        <tbody id="blacklistTableBody">
                            <!-- Dynamic Numbers -->
                        </tbody>
                    </table>
                </div>

                <!-- Block Modal (Portal) -->
                <div id="blockModal" style="display:none; position:fixed; inset:0; z-index:20000; background:rgba(0,0,0,0.6); backdrop-filter:blur(24px); align-items:center; justify-content:center; padding:20px;">
                    <div class="glass-panel" style="width:440px; padding:32px; border-radius:32px; border:1px solid rgba(255,69,58,0.2); background:rgba(35,25,25,0.95); position: relative; animation: slideUp 0.3s cubic-bezier(0.1, 0.9, 0.2, 1);">
                        <div style="position: absolute; top: 24px; right: 24px;">
                            <button onclick="window.BlacklistView.closeModal()" style="width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; color:#fff; border:1px solid rgba(255,255,255,0.15); transition:0.2s; font-size:1.4rem; font-weight:800; line-height:1;" onmouseover="this.style.background='rgba(255,255,255,0.15)';this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.08)';this.style.transform='scale(1)'">&times;</button>
                        </div>
                        
                        <h3 style="font-size:1.4rem; font-weight:800; color:#ff453a; margin-bottom:28px; letter-spacing:-0.02em;">Block New Number</h3>
                        
                        <div style="display:flex; flex-direction:column; gap:20px;">
                            <div>
                                <label style="display:block; font-size:0.65rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-weight:800; margin-bottom:8px; letter-spacing:0.05em;">Mobile Number</label>
                                <input id="block_phone" type="text" placeholder="e.g. 639170000000" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:12px 16px; color:#fff; font-size:1rem; outline:none;">
                            </div>
                            
                            <div>
                                <label style="display:block; font-size:0.65rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-weight:800; margin-bottom:8px; letter-spacing:0.05em;">Blocking Reason</label>
                                <select id="block_reason" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:12px 16px; color:#fff; font-size:0.95rem; outline:none; appearance: none;">
                                    <option value="Stop Request">Customer requested STOP</option>
                                    <option value="Invalid Number">Invalid / Dead number</option>
                                    <option value="Spam Complaint">Spam complaint reported</option>
                                    <option value="Manual Block">Manual admin restriction</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style="display:flex; gap:12px; margin-top:32px;">
                            <button onclick="window.BlacklistView.closeModal()" style="flex:1; height:48px; background:rgba(255,255,255,0.06); border:none; border-radius:16px; color:#fff; font-weight:700; cursor:pointer;">Cancel</button>
                            <button onclick="window.BlacklistView.saveBlock()" style="flex:1.5; height:48px; background:var(--danger-color); border:none; border-radius:16px; color:#fff; font-weight:800; cursor:pointer; box-shadow:0 8px 20px rgba(255,69,58,0.3);">Apply Block</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.updateList();
    },

    blocked: [
        { phone: "639170000001", reason: "User replied STOP", date: "Oct 12, 2024" },
        { phone: "639180000002", reason: "Auto-blocked (Hard Bounces)", date: "Nov 01, 2024" }
    ],

    updateList() {
        const tbody = document.getElementById('blacklistTableBody');
        if(!tbody) return;

        tbody.innerHTML = this.blocked.map(b => `
            <tr style="border-bottom: 1px solid var(--border-glass); transition: 0.2s;">
                <td style="padding: 16px 20px; font-family: monospace; font-size: 0.95rem; color: var(--danger-color); font-weight:700;">+${b.phone}</td>
                <td style="padding: 16px 20px; color: rgba(255,255,255,0.7); font-size: 0.9rem;">${b.reason}</td>
                <td style="padding: 16px 20px; color: rgba(255,255,255,0.4); font-size: 0.85rem;">${b.date}</td>
                <td style="padding: 16px 20px; text-align: right;">
                    <button class="btn icon-btn" onclick="window.BlacklistView.unblock('${b.phone}')" style="width: 32px; height: 32px; padding: 0; background:rgba(50,215,75,0.1); border:1px solid rgba(50,215,75,0.2); color:var(--success-color); display: flex; align-items: center; justify-content: center;" title="Restore Access">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                    </button>
                </td>
            </tr>
        `).join('') || `<tr><td colspan="4" style="padding:32px; text-align:center; color:rgba(255,255,255,0.2);">The blocklist is currently empty.</td></tr>`;
    },

    openModal() {
        const m = document.getElementById('blockModal');
        if(!m) return;
        document.body.appendChild(m);
        m.style.display = 'flex';
        document.querySelector('.app-container').style.filter = 'blur(12px) grayscale(0.5)';
    },

    closeModal() {
        const m = document.getElementById('blockModal');
        if(m) m.style.display = 'none';
        document.querySelector('.app-container').style.filter = '';
    },

    saveBlock() {
        const p = document.getElementById('block_phone').value.replace(/[^\d]/g, '');
        const r = document.getElementById('block_reason').value;
        if(!p) return window.showToast("Enter a valid number.", "warning");
        
        this.blocked.unshift({ phone: p, reason: r, date: new Date().toLocaleDateString() });
        this.updateList();
        this.closeModal();
        window.showToast("Number has been blacklisted.", "error");
    },

    unblock(phone) {
        if(!window.BrandSyncAppInstance) return;

        window.BrandSyncAppInstance.confirmAction(
            "Restore Access",
            `Are you sure you want to unblock +${phone}? This number will be able to receive messages again.`,
            "#32d74b",
            () => {
                // Secondary Security Confirmation
                setTimeout(() => {
                    window.BrandSyncAppInstance.confirmAction(
                        "Final Approval",
                        "Confirming removal from the Global Privacy Blocklist. This action is audited.",
                        "#28a745",
                        () => {
                            this.blocked = this.blocked.filter(b => b.phone !== phone);
                            this.updateList();
                            window.showToast("Access restored for +" + phone, "success");
                        }
                    );
                }, 100);
            }
        );
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if(window.app) window.app.views['blacklist'] = () => window.BlacklistView.render(window.app.contentArea);
    }, 100);
});
