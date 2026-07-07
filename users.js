// BrandSync User Management View
// Full CRUD interface for managing user accounts with RBAC enforcement.

window.UsersView = {
    activeFilter: 'all',
    searchQuery: '',

    render(container) {
        if (!window.RBAC.enforce('manage_users')) {
            container.innerHTML = `<div class="view-container active fade-in"><div class="card" style="padding:60px; text-align:center;"><h2 style="color:#ff453a;">Access Denied</h2><p style="color:rgba(255,255,255,0.4);">You do not have permission to manage users.</p></div></div>`;
            return;
        }

        container.innerHTML = `
            <div class="view-container active fade-in">
                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:24px; gap:16px; flex-wrap:wrap;">
                    <div>
                        <h2 style="font-size:1.35rem; font-weight:700; color:#fff; letter-spacing:-0.03em;">Users & Accounts</h2>
                        <p style="color:var(--text-muted); font-size:0.9rem;">Manage team access, roles, and permissions.</p>
                    </div>
                    <div style="display:flex; gap:12px; align-items:center;">
                        <div style="position:relative;">
                            <svg style="position:absolute; left:14px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.3);" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" id="userSearchInput" placeholder="Search users..." oninput="window.UsersView.searchQuery=this.value; window.UsersView.renderList();" style="width:240px; height:44px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.12); border-radius:14px; padding:0 14px 0 40px; color:#fff; font-size:0.9rem; outline:none;">
                        </div>
                        <button id="addUserBtn" onclick="window.UsersView.openUserModal()" style="height:44px; padding:0 20px; background:#0a84ff; border:none; border-radius:14px; color:#fff; font-weight:800; cursor:pointer; font-size:0.85rem; display:flex; align-items:center; gap:8px; transition:0.3s; box-shadow:0 8px 20px rgba(10,132,255,0.3);" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform=''">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            Add User
                        </button>
                    </div>
                </div>

                <!-- Role Filter Tabs -->
                <div id="userFilterTabs" style="display:flex; gap:8px; margin-bottom:20px;"></div>

                <!-- Users Grid -->
                <div id="usersGrid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:16px;"></div>

                <!-- Audit Log Section -->
                <div style="margin-top:40px;">
                    <h3 style="font-size:1.1rem; font-weight:700; color:#fff; margin-bottom:16px; display:flex; align-items:center; gap:10px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a84ff" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                        Recent Activity Log
                    </h3>
                    <div id="auditLogList" class="card" style="padding:0; overflow:hidden; border-radius:20px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02); max-height:400px; overflow-y:auto;"></div>
                </div>
            </div>

            <!-- User Modal (Add/Edit) -->
            <div id="userModal" style="display:none; position:fixed; inset:0; z-index:20000; background:rgba(0,0,0,0.6); backdrop-filter:blur(32px); align-items:center; justify-content:center; padding:24px;">
                <div style="width:520px; max-width:96vw; padding:36px; border-radius:32px; border:1px solid rgba(255,255,255,0.15); box-shadow:0 64px 128px rgba(0,0,0,0.9); background:rgba(22,22,28,0.95); backdrop-filter:blur(64px); animation:popIn 0.4s cubic-bezier(0.19, 1, 0.22, 1);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:28px;">
                        <div style="display:flex; align-items:center; gap:14px;">
                            <div style="width:44px; height:44px; border-radius:14px; background:rgba(10,132,255,0.12); border:1px solid rgba(10,132,255,0.25); display:flex; align-items:center; justify-content:center;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0a84ff" stroke-width="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                            </div>
                            <div>
                                <h3 id="userModalTitle" style="font-size:1.1rem; font-weight:800; color:#fff;">Add New User</h3>
                                <p style="font-size:0.72rem; color:rgba(255,255,255,0.35);">Configure account credentials and role.</p>
                            </div>
                        </div>
                        <button onclick="window.UsersView.closeUserModal()" style="width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; color:#fff; border:1px solid rgba(255,255,255,0.15); font-size:1.3rem; font-weight:800; line-height:1;">&times;</button>
                    </div>

                    <input type="hidden" id="editUserId" value="">

                    <div style="display:flex; flex-direction:column; gap:16px;">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
                            <div>
                                <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; display:block;">Username</label>
                                <input type="text" id="userFormUsername" placeholder="Enter username" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:13px; color:#fff; font-size:0.9rem; outline:none;">
                            </div>
                            <div>
                                <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; display:block;">Full Name</label>
                                <input type="text" id="userFormFullName" placeholder="Enter full name" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:13px; color:#fff; font-size:0.9rem; outline:none;">
                            </div>
                        </div>
                        <div id="userFormPasswordRow">
                            <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; display:block;">Password</label>
                            <input type="password" id="userFormPassword" placeholder="Set password" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:13px; color:#fff; font-size:0.9rem; outline:none;">
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
                            <div>
                                <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; display:block;">Position</label>
                                <input type="text" id="userFormPosition" placeholder="e.g. Marketing Lead" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:13px; color:#fff; font-size:0.9rem; outline:none;">
                            </div>
                            <div>
                                <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; display:block;">Company</label>
                                <input type="text" id="userFormCompany" placeholder="e.g. BrandSync" style="width:100%; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:13px; color:#fff; font-size:0.9rem; outline:none;">
                            </div>
                        </div>
                        <div>
                            <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:8px; display:block;">Role Assignment</label>
                            <div id="roleSelector" style="display:flex; gap:10px;"></div>
                        </div>
                    </div>

                    <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:28px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.07);">
                        <button onclick="window.UsersView.closeUserModal()" style="padding:0 24px; height:44px; background:rgba(255,255,255,0.06); border:none; border-radius:14px; color:#fff; font-weight:600; cursor:pointer;">Cancel</button>
                        <button onclick="window.UsersView.saveUser()" style="padding:0 28px; height:44px; background:#0a84ff; border:none; border-radius:14px; color:#fff; font-weight:800; cursor:pointer; box-shadow:0 8px 20px rgba(10,132,255,0.3);">Save Account</button>
                    </div>
                </div>
            </div>
        `;

        // Portal modal to body
        const modal = document.getElementById('userModal');
        if (modal) document.body.appendChild(modal);

        this.renderList();
        this.renderAuditLog();
    },

    renderList() {
        const users = window.AuthService.getAllUsers();
        const currentUser = window.AuthService.getCurrentUser();
        const currentRole = window.AuthService.getRole();
        const q = this.searchQuery.toLowerCase();

        // Filter tabs
        const tabsEl = document.getElementById('userFilterTabs');
        if (tabsEl) {
            const counts = {
                all: users.length,
                superadmin: users.filter(u => u.role === 'superadmin').length,
                manager: users.filter(u => u.role === 'manager').length,
                user: users.filter(u => u.role === 'user').length
            };
            const tabs = [
                { key: 'all', label: 'All', count: counts.all },
                { key: 'superadmin', label: 'Super Admin', count: counts.superadmin },
                { key: 'manager', label: 'Manager', count: counts.manager },
                { key: 'user', label: 'User', count: counts.user }
            ];
            tabsEl.innerHTML = tabs.map(t => {
                const active = this.activeFilter === t.key;
                const rc = t.key !== 'all' ? window.RBAC.roleColor(t.key) : { color: '#fff', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.15)' };
                return `<div onclick="window.UsersView.activeFilter='${t.key}'; window.UsersView.renderList();" style="cursor:pointer; padding:8px 16px; border-radius:12px; font-size:0.8rem; font-weight:700; transition:0.3s; border:1px solid ${active ? rc.border : 'rgba(255,255,255,0.08)'}; background:${active ? rc.bg : 'rgba(255,255,255,0.03)'}; color:${active ? rc.color : 'rgba(255,255,255,0.5)'};">${t.label} <span style="opacity:0.6; margin-left:4px;">${t.count}</span></div>`;
            }).join('');
        }

        let filtered = users;
        if (this.activeFilter !== 'all') filtered = filtered.filter(u => u.role === this.activeFilter);
        if (q) filtered = filtered.filter(u => (u.fullName || '').toLowerCase().includes(q) || (u.username || '').toLowerCase().includes(q));

        const grid = document.getElementById('usersGrid');
        if (!grid) return;

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1; padding:60px; text-align:center; color:rgba(255,255,255,0.2);">No users found.</div>`;
            return;
        }

        grid.innerHTML = filtered.map(u => {
            const rc = window.RBAC.roleColor(u.role);
            const isSelf = currentUser?.id === u.id;
            const isSuperAdmin = u.role === 'superadmin';
            const canEdit = isSelf || (currentRole === 'superadmin') || (currentRole === 'manager' && u.role === 'user');
            const canDelete = !isSuperAdmin && !isSelf && (currentRole === 'superadmin' || (currentRole === 'manager' && u.role === 'user'));
            const initials = (u.fullName || u.username || '??').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
            const lastLogin = u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : 'Never';

            return `
                <div class="card" style="padding:24px; border-radius:24px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02); transition:0.3s; position:relative; overflow:visible;" onmouseover="this.style.borderColor='${rc.border}'; this.style.boxShadow='0 8px 30px rgba(0,0,0,0.3)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.boxShadow=''">
                    ${isSelf ? '<div style="position:absolute; top:12px; right:12px; font-size:0.6rem; color:rgba(255,255,255,0.3); font-weight:700; text-transform:uppercase; letter-spacing:0.05em; background:rgba(255,255,255,0.06); padding:3px 8px; border-radius:6px;">You</div>' : ''}
                    <div style="display:flex; align-items:center; gap:14px; margin-bottom:18px;">
                        <div style="width:48px; height:48px; border-radius:16px; background:${rc.bg}; border:1px solid ${rc.border}; display:flex; align-items:center; justify-content:center; color:${rc.color}; font-weight:900; font-size:0.9rem; flex-shrink:0;">${initials}</div>
                        <div style="flex:1; min-width:0;">
                            <div style="font-size:1rem; font-weight:700; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${u.fullName || u.username}</div>
                            <div style="font-size:0.78rem; color:rgba(255,255,255,0.35); font-family:monospace;">@${u.username}</div>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px;">
                        <span style="padding:4px 10px; border-radius:8px; font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.04em; background:${rc.bg}; color:${rc.color}; border:1px solid ${rc.border};">${window.RBAC.roleLabel(u.role)}</span>
                        ${u.position ? `<span style="font-size:0.75rem; color:rgba(255,255,255,0.3);">· ${u.position}</span>` : ''}
                    </div>
                    <div style="display:flex; gap:16px; font-size:0.72rem; color:rgba(255,255,255,0.3); margin-bottom:18px;">
                        <span>Last login: ${lastLogin}</span>
                    </div>
                    <div style="display:flex; gap:8px; border-top:1px solid rgba(255,255,255,0.06); padding-top:14px;">
                        ${canEdit ? `<button onclick="window.UsersView.openUserModal(window.AuthService.getAllUsers().find(u=>u.id==='${u.id}'))" style="flex:1; height:34px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:10px; color:#fff; font-weight:600; cursor:pointer; font-size:0.75rem; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'">Edit</button>` : ''}
                        ${canDelete ? `<button onclick="window.UsersView.confirmDeleteUser('${u.id}','${(u.fullName||u.username).replace(/'/g,"\\'")}')" style="flex:1; height:34px; background:rgba(255,69,58,0.1); border:1px solid rgba(255,69,58,0.2); border-radius:10px; color:#ff453a; font-weight:600; cursor:pointer; font-size:0.75rem; transition:0.2s;" onmouseover="this.style.background='rgba(255,69,58,0.2)'" onmouseout="this.style.background='rgba(255,69,58,0.1)'">Delete</button>` : ''}
                        ${!canEdit && !canDelete ? '<span style="font-size:0.72rem; color:rgba(255,255,255,0.2); font-style:italic;">Protected account</span>' : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    renderAuditLog() {
        const el = document.getElementById('auditLogList');
        if (!el) return;
        const logs = window.AuditLog.getAll().slice(0, 50);

        if (logs.length === 0) {
            el.innerHTML = '<div style="padding:40px; text-align:center; color:rgba(255,255,255,0.2); font-size:0.85rem;">No activity recorded yet.</div>';
            return;
        }

        el.innerHTML = logs.map(l => {
            const color = window.AuditLog.actionColor(l.action);
            return `
                <div style="padding:12px 20px; border-bottom:1px solid rgba(255,255,255,0.04); display:flex; align-items:center; gap:14px; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background=''">
                    <div style="width:8px; height:8px; border-radius:50%; background:${color}; flex-shrink:0; box-shadow:0 0 8px ${color};"></div>
                    <div style="flex:1; min-width:0;">
                        <div style="font-size:0.82rem; color:#fff; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${window.AuditLog.actionLabel(l.action)} <span style="color:rgba(255,255,255,0.3); font-weight:400;">— ${l.details}</span></div>
                    </div>
                    <div style="text-align:right; flex-shrink:0;">
                        <div style="font-size:0.72rem; color:rgba(255,255,255,0.4);">@${l.username}</div>
                        <div style="font-size:0.65rem; color:rgba(255,255,255,0.25);">${window.AuditLog.formatTime(l.timestamp)}</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    openUserModal(existingUser) {
        const isEdit = !!existingUser;
        document.getElementById('userModalTitle').innerText = isEdit ? 'Edit Account' : 'Add New User';
        document.getElementById('editUserId').value = isEdit ? existingUser.id : '';
        document.getElementById('userFormUsername').value = isEdit ? existingUser.username : '';
        document.getElementById('userFormUsername').disabled = isEdit;
        document.getElementById('userFormFullName').value = isEdit ? (existingUser.fullName || '') : '';
        document.getElementById('userFormPosition').value = isEdit ? (existingUser.position || '') : '';
        document.getElementById('userFormCompany').value = isEdit ? (existingUser.company || '') : '';

        // Password row: show for new, hide for edit
        const pwRow = document.getElementById('userFormPasswordRow');
        if (pwRow) pwRow.style.display = isEdit ? 'none' : 'block';
        if (!isEdit) document.getElementById('userFormPassword').value = '';

        const roles = [
            { key: 'user', label: 'User', desc: 'Basic SMS operations' },
            { key: 'manager', label: 'Manager', desc: 'Full operations + user mgmt' },
            { key: 'superadmin', label: 'Super Admin', desc: 'Unrestricted system access' }
        ];

        const selectedRole = isEdit ? existingUser.role : 'user';
        const currentRole = window.AuthService.getRole();
        const roleEl = document.getElementById('roleSelector');

        if (!document.getElementById('user-modal-styles')) {
            const st = document.createElement('style');
            st.id = 'user-modal-styles';
            st.innerHTML = `
                .role-opt { flex:1; padding:12px; border-radius:14px; text-align:center; transition:0.3s; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.03); cursor:pointer; }
                .role-opt:hover { background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.15); }
                .role-opt.active-role.role-user { background: rgba(50, 215, 75, 0.12); border-color: rgba(50, 215, 75, 0.4); box-shadow: 0 4px 15px rgba(50, 215, 75, 0.2); }
                .role-opt.active-role.role-manager { background: rgba(255, 159, 10, 0.12); border-color: rgba(255, 159, 10, 0.4); box-shadow: 0 4px 15px rgba(255, 159, 10, 0.2); }
                .role-opt.active-role.role-superadmin { background: rgba(10, 132, 255, 0.12); border-color: rgba(10, 132, 255, 0.4); box-shadow: 0 4px 15px rgba(10, 132, 255, 0.2); }
                
                .role-opt.active-role.role-user div:first-child { color: #32d74b !important; }
                .role-opt.active-role.role-manager div:first-child { color: #ff9f0a !important; }
                .role-opt.active-role.role-superadmin div:first-child { color: #0a84ff !important; }
            `;
            document.head.appendChild(st);
        }

        roleEl.innerHTML = roles.map(r => {
            const disabled = (currentRole === 'manager' && r.key !== 'user');
            const active = r.key === selectedRole;
            return `
                <div class="role-opt role-${r.key} ${active ? 'active-role' : ''}" 
                     data-role="${r.key}" 
                     onclick="${disabled ? 'event.stopPropagation()' : `window.UsersView.selectRole('${r.key}', this)`}" 
                     style="opacity:${disabled ? '0.35' : '1'}; cursor:${disabled ? 'not-allowed' : 'pointer'};">
                    <div style="font-size:0.8rem; font-weight:800; color:#fff; margin-bottom:4px;">${r.label}</div>
                    <div style="font-size:0.6rem; color:rgba(255,255,255,0.3);">${r.desc}</div>
                </div>
            `;
        }).join('');

        document.getElementById('userModal').style.display = 'flex';
    },

    selectRole(roleKey, el) {
        document.querySelectorAll('.role-opt').forEach(opt => opt.classList.remove('active-role'));
        el.classList.add('active-role');
    },

    closeUserModal() {
        document.getElementById('userModal').style.display = 'none';
    },

    saveUser() {
        const id = document.getElementById('editUserId').value;
        const username = document.getElementById('userFormUsername').value.trim();
        const fullName = document.getElementById('userFormFullName').value.trim();
        const password = document.getElementById('userFormPassword')?.value;
        const position = document.getElementById('userFormPosition').value.trim();
        const company = document.getElementById('userFormCompany').value.trim();
        const activeRoleEl = document.querySelector('.role-opt.active-role');
        const role = activeRoleEl ? activeRoleEl.dataset.role : 'user';

        if (!username) { window.showToast('Username is required.', 'error'); return; }

        if (id) {
            // Edit existing user
            const result = window.AuthService.updateUser(id, { fullName, position, company, role });
            if (!result.success) { window.showToast(result.error, 'error'); return; }
            window.showToast('Account updated successfully.', 'success');
        } else {
            // Create new user
            if (!password || password.length < 4) { window.showToast('Password must be at least 4 characters.', 'error'); return; }
            const result = window.AuthService.createUser({ username, password, fullName, position, company, role });
            if (!result.success) { window.showToast(result.error, 'error'); return; }
            window.showToast('Account created successfully.', 'success');
        }

        this.closeUserModal();
        this.renderList();
        this.renderAuditLog();
    },

    confirmDeleteUser(id, name) {
        if (!window.BrandSyncAppInstance) return;
        window.BrandSyncAppInstance.confirmAction(
            'Delete Account',
            `Are you sure you want to permanently delete "${name}"? This action cannot be undone.`,
            '#ff453a',
            () => {
                const result = window.AuthService.deleteUser(id);
                if (!result.success) { window.showToast(result.error, 'error'); return; }
                window.showToast('Account deleted.', 'success');
                this.renderList();
                this.renderAuditLog();
            }
        );
    }
};

// Register route
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.app) window.app.views['users'] = () => window.UsersView.render(window.app.contentArea);
    }, 100);
});
