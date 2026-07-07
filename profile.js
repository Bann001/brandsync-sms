// BrandSync Profile View
// Personal profile editor for the currently logged-in user.

window.ProfileView = {
    render(container) {
        const user = window.AuthService.getCurrentUser();
        if (!user) {
            container.innerHTML = '<div class="view-container active"><div class="card" style="padding:60px; text-align:center; color:rgba(255,255,255,0.3);">Not logged in.</div></div>';
            return;
        }

        const rc = window.RBAC.roleColor(user.role);
        const initials = (user.fullName || user.username || '??').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
        const memberSince = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';

        container.innerHTML = `
            <div class="view-container active fade-in">
                <div style="display:flex; gap:28px; flex-wrap:wrap;">
                    <!-- Profile Card -->
                    <div style="flex:0 0 340px;">
                        <div class="card" style="padding:32px; border-radius:28px; border:1px solid rgba(255,255,255,0.08); text-align:center;">
                            <div style="width:80px; height:80px; border-radius:24px; background:${rc.bg}; border:2px solid ${rc.border}; display:flex; align-items:center; justify-content:center; color:${rc.color}; font-weight:900; font-size:1.6rem; margin:0 auto 16px; box-shadow:0 8px 30px rgba(0,0,0,0.3);">${initials}</div>
                            <h2 style="font-size:1.2rem; font-weight:800; color:#fff; margin-bottom:4px;">${user.fullName || user.username}</h2>
                            <p style="font-size:0.82rem; color:rgba(255,255,255,0.35); margin-bottom:16px; font-family:monospace;">@${user.username}</p>
                            <span style="padding:5px 14px; border-radius:10px; font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; background:${rc.bg}; color:${rc.color}; border:1px solid ${rc.border};">${window.RBAC.roleLabel(user.role)}</span>

                            <div style="margin-top:24px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.06); text-align:left; display:flex; flex-direction:column; gap:12px;">
                                <div style="display:flex; justify-content:space-between; font-size:0.8rem;">
                                    <span style="color:rgba(255,255,255,0.3);">Position</span>
                                    <span style="color:#fff; font-weight:600;">${user.position || '—'}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; font-size:0.8rem;">
                                    <span style="color:rgba(255,255,255,0.3);">Company</span>
                                    <span style="color:#fff; font-weight:600;">${user.company || '—'}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; font-size:0.8rem;">
                                    <span style="color:rgba(255,255,255,0.3);">Member Since</span>
                                    <span style="color:#fff; font-weight:600;">${memberSince}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; font-size:0.8rem;">
                                    <span style="color:rgba(255,255,255,0.3);">Last Login</span>
                                    <span style="color:#fff; font-weight:600;">${user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : '—'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Edit Forms -->
                    <div style="flex:1; min-width:300px; display:flex; flex-direction:column; gap:20px;">
                        <!-- Profile Details -->
                        <div class="card" style="padding:28px; border-radius:24px; border:1px solid rgba(255,255,255,0.08);">
                            <h3 style="font-size:1rem; font-weight:800; color:#fff; margin-bottom:20px; display:flex; align-items:center; gap:10px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a84ff" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                Profile Details
                            </h3>
                            <div style="display:flex; flex-direction:column; gap:14px;">
                                <div>
                                    <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; display:block;">Full Name</label>
                                    <input type="text" id="profileFullName" value="${user.fullName || ''}" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:13px; color:#fff; font-size:0.9rem; outline:none;">
                                </div>
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
                                    <div>
                                        <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; display:block;">Position</label>
                                        <input type="text" id="profilePosition" value="${user.position || ''}" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:13px; color:#fff; font-size:0.9rem; outline:none;">
                                    </div>
                                    <div>
                                        <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; display:block;">Company</label>
                                        <input type="text" id="profileCompany" value="${user.company || ''}" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:13px; color:#fff; font-size:0.9rem; outline:none;">
                                    </div>
                                </div>
                                <button onclick="window.ProfileView.saveProfile()" style="align-self:flex-end; height:42px; padding:0 24px; background:#0a84ff; border:none; border-radius:14px; color:#fff; font-weight:800; cursor:pointer; font-size:0.85rem; transition:0.3s; box-shadow:0 8px 20px rgba(10,132,255,0.3);" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">Save Changes</button>
                            </div>
                        </div>

                        <!-- Change Password -->
                        <div class="card" style="padding:28px; border-radius:24px; border:1px solid rgba(255,255,255,0.08);">
                            <h3 style="font-size:1rem; font-weight:800; color:#fff; margin-bottom:20px; display:flex; align-items:center; gap:10px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff9f0a" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                Change Password
                            </h3>
                            <div style="display:flex; flex-direction:column; gap:14px;">
                                <div>
                                    <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; display:block;">Current Password</label>
                                    <input type="password" id="profileOldPw" placeholder="Enter current password" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:13px; color:#fff; font-size:0.9rem; outline:none;">
                                </div>
                                <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
                                    <div>
                                        <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; display:block;">New Password</label>
                                        <input type="password" id="profileNewPw" placeholder="New password" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:13px; color:#fff; font-size:0.9rem; outline:none;">
                                    </div>
                                    <div>
                                        <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; display:block;">Confirm New Password</label>
                                        <input type="password" id="profileConfirmPw" placeholder="Confirm new password" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:13px; color:#fff; font-size:0.9rem; outline:none;">
                                    </div>
                                </div>
                                <button onclick="window.ProfileView.changePassword()" style="align-self:flex-end; height:42px; padding:0 24px; background:rgba(255,159,10,0.15); border:1px solid rgba(255,159,10,0.4); border-radius:14px; color:#ff9f0a; font-weight:800; cursor:pointer; font-size:0.85rem; transition:0.3s;" onmouseover="this.style.background='rgba(255,159,10,0.25)'" onmouseout="this.style.background='rgba(255,159,10,0.15)'">Update Password</button>
                            </div>
                        </div>

                        <!-- Recent Activity -->
                        <div class="card" style="padding:28px; border-radius:24px; border:1px solid rgba(255,255,255,0.08);">
                            <h3 style="font-size:1rem; font-weight:800; color:#fff; margin-bottom:16px; display:flex; align-items:center; gap:10px;">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#32d74b" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                Your Recent Activity
                            </h3>
                            <div id="profileActivityList" style="max-height:250px; overflow-y:auto;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.renderActivity(user.id);
    },

    renderActivity(userId) {
        const el = document.getElementById('profileActivityList');
        if (!el) return;
        const logs = window.AuditLog.getByUser(userId, 20);

        if (logs.length === 0) {
            el.innerHTML = '<div style="padding:20px; text-align:center; color:rgba(255,255,255,0.2); font-size:0.82rem;">No activity recorded yet.</div>';
            return;
        }

        el.innerHTML = logs.map(l => {
            const color = window.AuditLog.actionColor(l.action);
            return `
                <div style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.04); display:flex; align-items:center; gap:12px;">
                    <div style="width:6px; height:6px; border-radius:50%; background:${color}; flex-shrink:0;"></div>
                    <div style="flex:1; font-size:0.8rem; color:rgba(255,255,255,0.7);">${window.AuditLog.actionLabel(l.action)} <span style="color:rgba(255,255,255,0.3);">— ${l.details}</span></div>
                    <div style="font-size:0.65rem; color:rgba(255,255,255,0.25); flex-shrink:0;">${window.AuditLog.formatTime(l.timestamp)}</div>
                </div>
            `;
        }).join('');
    },

    saveProfile() {
        const user = window.AuthService.getCurrentUser();
        if (!user) return;

        const fullName = document.getElementById('profileFullName').value.trim();
        const position = document.getElementById('profilePosition').value.trim();
        const company = document.getElementById('profileCompany').value.trim();

        const result = window.AuthService.updateUser(user.id, { fullName, position, company });
        if (!result.success) { window.showToast(result.error, 'error'); return; }

        window.showToast('Profile updated successfully.', 'success');

        // Refresh sidebar user info
        this._updateSidebarUser();
        this.render(window.app?.contentArea || document.getElementById('app-content'));
    },

    changePassword() {
        const user = window.AuthService.getCurrentUser();
        if (!user) return;

        const oldPw = document.getElementById('profileOldPw').value;
        const newPw = document.getElementById('profileNewPw').value;
        const confirmPw = document.getElementById('profileConfirmPw').value;

        if (!oldPw) { window.showToast('Enter your current password.', 'error'); return; }
        if (!newPw || newPw.length < 4) { window.showToast('New password must be at least 4 characters.', 'error'); return; }
        if (newPw !== confirmPw) { window.showToast('Passwords do not match.', 'error'); return; }

        const result = window.AuthService.changePassword(user.id, oldPw, newPw);
        if (!result.success) { window.showToast(result.error, 'error'); return; }

        window.showToast('Password updated successfully.', 'success');
        document.getElementById('profileOldPw').value = '';
        document.getElementById('profileNewPw').value = '';
        document.getElementById('profileConfirmPw').value = '';
    },

    _updateSidebarUser() {
        const user = window.AuthService.getCurrentUser();
        if (!user) return;
        const nameEl = document.querySelector('.user-name');
        if (nameEl) nameEl.innerText = user.fullName || user.username;
        const avatarEl = document.querySelector('.avatar');
        if (avatarEl) avatarEl.innerText = (user.fullName || user.username || '?')[0].toUpperCase();
    }
};

// Register route
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.app) window.app.views['profile'] = () => window.ProfileView.render(window.app.contentArea);
    }, 100);
});
