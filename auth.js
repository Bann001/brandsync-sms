// BrandSync Auth Service — Role-Based Account System
// Manages users, sessions, login/logout, and password changes.
// Uses md5 (loaded via CDN) for password hashing.

window.AuthService = {
    STORAGE_KEYS: {
        USERS: 'brandsync_users',
        SESSION: 'brandsync_session'
    },

    ROLES: {
        SUPER_ADMIN: 'superadmin',
        MANAGER: 'manager',
        USER: 'user'
    },

    // ─── Bootstrap ────────────────────────────────────────
    init() {
        const users = this._getUsers();
        if (users.length === 0) {
            // Seed default Super Admin on first boot
            const defaultAdmin = {
                id: 'usr_' + Date.now(),
                username: 'admin',
                passwordHash: this._hash('dadasafa'),
                fullName: 'System Administrator',
                position: 'Platform Owner',
                company: 'BrandSync',
                role: this.ROLES.SUPER_ADMIN,
                createdAt: new Date().toISOString(),
                createdBy: null,
                lastLogin: null,
                isActive: true
            };
            this._setUsers([defaultAdmin]);
            console.log('[Auth] Default Super Admin seeded (admin / dadasafa)');
        } else {
            // Security Recovery: Ensure 'admin' username always has SUPER_ADMIN privileges
            // (fixes accidental lockouts if the root account is downgraded)
            const adminUser = users.find(u => u.username.toLowerCase() === 'admin');
            if (adminUser && adminUser.role !== this.ROLES.SUPER_ADMIN) {
                adminUser.role = this.ROLES.SUPER_ADMIN;
                this._setUsers(users);
                console.warn('[Auth Security] Restored administrative privileges for root account: admin');
            }
        }
    },

    // ─── Hashing ──────────────────────────────────────────
    _hash(str) {
        if (window.md5) return window.md5(str);
        // Fallback: simple hash (insecure, but md5 CDN should always be loaded)
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + c;
            hash |= 0;
        }
        return 'fallback_' + Math.abs(hash).toString(36);
    },

    // ─── Storage Helpers ──────────────────────────────────
    _getUsers() {
        try { return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.USERS) || '[]'); }
        catch { return []; }
    },
    _setUsers(users) {
        localStorage.setItem(this.STORAGE_KEYS.USERS, JSON.stringify(users));
        // Trigger cloud sync
        if (window.BrandSyncAPI && window.BrandSyncAPI._set) {
            window.BrandSyncAPI._set(this.STORAGE_KEYS.USERS, users);
        }
    },
    _getSession() {
        try { return JSON.parse(sessionStorage.getItem(this.STORAGE_KEYS.SESSION) || 'null'); }
        catch { return null; }
    },
    _setSession(session) {
        if (session) sessionStorage.setItem(this.STORAGE_KEYS.SESSION, JSON.stringify(session));
        else sessionStorage.removeItem(this.STORAGE_KEYS.SESSION);
    },

    // ─── Login / Logout ───────────────────────────────────
    login(username, password) {
        const users = this._getUsers();
        const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.isActive);
        if (!user) return { success: false, error: 'Account not found or inactive.' };

        const hash = this._hash(password);
        if (user.passwordHash !== hash) return { success: false, error: 'Invalid password.' };

        // Update last login
        user.lastLogin = new Date().toISOString();
        this._setUsers(users);

        // Create session
        const session = {
            userId: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            loginAt: new Date().toISOString()
        };
        this._setSession(session);

        // Audit
        if (window.AuditLog) window.AuditLog.log('login', `Signed in as ${user.role}`);

        return { success: true, user: { ...user, passwordHash: undefined } };
    },

    logout() {
        if (window.AuditLog) window.AuditLog.log('logout', 'Signed out');
        this._setSession(null);
    },

    // ─── Session Queries ──────────────────────────────────
    isLoggedIn() {
        return !!this._getSession();
    },

    getCurrentUser() {
        const session = this._getSession();
        if (!session) return null;
        const users = this._getUsers();
        const user = users.find(u => u.id === session.userId);
        if (!user) { this._setSession(null); return null; }
        return { ...user, passwordHash: undefined };
    },

    getRole() {
        const session = this._getSession();
        return session ? session.role : null;
    },

    getSession() {
        return this._getSession();
    },

    // ─── User CRUD ────────────────────────────────────────
    getAllUsers() {
        return this._getUsers().map(u => ({ ...u, passwordHash: undefined }));
    },

    createUser(data) {
        const currentRole = this.getRole();

        // Permission check: only superadmin and manager can create users
        if (!currentRole || currentRole === this.ROLES.USER) {
            return { success: false, error: 'Insufficient permissions.' };
        }
        // Managers cannot create superadmins or managers
        if (currentRole === this.ROLES.MANAGER && data.role !== this.ROLES.USER) {
            return { success: false, error: 'Managers can only create User accounts.' };
        }

        const users = this._getUsers();

        // Check duplicate username
        if (users.find(u => u.username.toLowerCase() === data.username.toLowerCase())) {
            return { success: false, error: 'Username already exists.' };
        }

        const newUser = {
            id: 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
            username: data.username,
            passwordHash: this._hash(data.password),
            fullName: data.fullName || data.username,
            position: data.position || '',
            company: data.company || '',
            role: data.role || this.ROLES.USER,
            createdAt: new Date().toISOString(),
            createdBy: this.getSession()?.userId || null,
            lastLogin: null,
            isActive: true
        };

        users.push(newUser);
        this._setUsers(users);

        if (window.AuditLog) window.AuditLog.log('create_user', `Created ${newUser.role} account: ${newUser.username}`);
        return { success: true, user: { ...newUser, passwordHash: undefined } };
    },

    updateUser(id, changes) {
        const currentRole = this.getRole();
        const currentUser = this.getCurrentUser();
        const users = this._getUsers();
        const idx = users.findIndex(u => u.id === id);
        if (idx === -1) return { success: false, error: 'User not found.' };

        const target = users[idx];
        const isRootAdmin = target.username.toLowerCase() === 'admin';

        // Protection: Managers cannot modify Super Admins. Super Admins can modify each other.
        if (target.role === this.ROLES.SUPER_ADMIN && currentRole !== this.ROLES.SUPER_ADMIN && currentUser?.id !== target.id) {
            return { success: false, error: 'Insufficient permissions to modify Super Admin.' };
        }

        // Managers cannot elevate roles
        if (currentRole === this.ROLES.MANAGER && changes.role && changes.role !== this.ROLES.USER) {
            return { success: false, error: 'Managers can only assign User role.' };
        }

        // Apply changes (never overwrite passwordHash directly through this method)
        const allowed = ['fullName', 'position', 'company', 'role', 'isActive'];
        allowed.forEach(key => {
            if (changes[key] !== undefined) target[key] = changes[key];
        });

        this._setUsers(users);

        // Update session if editing own profile
        if (currentUser?.id === id) {
            const session = this._getSession();
            if (session) {
                session.fullName = target.fullName;
                session.role = target.role;
                this._setSession(session);
            }
        }

        if (window.AuditLog) window.AuditLog.log('update_user', `Updated account: ${target.username}`);
        return { success: true };
    },

    deleteUser(id) {
        const currentRole = this.getRole();
        const users = this._getUsers();
        const target = users.find(u => u.id === id);
        if (!target) return { success: false, error: 'User not found.' };

        // NEVER delete the root 'admin'
        if (target.username.toLowerCase() === 'admin') {
            return { success: false, error: 'The Master Admin account cannot be deleted.' };
        }
        
        // Ensure we don't delete the last Super Admin
        if (target.role === this.ROLES.SUPER_ADMIN) {
            const admins = users.filter(u => u.role === this.ROLES.SUPER_ADMIN && u.isActive);
            if (admins.length <= 1) {
                return { success: false, error: 'Cannot delete the last active Super Admin.' };
            }
        }

        // Managers can only delete Users
        if (currentRole === this.ROLES.MANAGER && target.role !== this.ROLES.USER) {
            return { success: false, error: 'Managers can only delete User accounts.' };
        }

        // Users cannot delete anyone
        if (currentRole === this.ROLES.USER) {
            return { success: false, error: 'Insufficient permissions.' };
        }

        const filtered = users.filter(u => u.id !== id);
        this._setUsers(filtered);

        if (window.AuditLog) window.AuditLog.log('delete_user', `Deleted account: ${target.username} (${target.role})`);
        return { success: true };
    },

    changePassword(userId, oldPassword, newPassword) {
        const users = this._getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return { success: false, error: 'User not found.' };

        const currentUser = this.getCurrentUser();
        // Users can only change their own password
        if (currentUser?.id !== userId && currentUser?.role === this.ROLES.USER) {
            return { success: false, error: 'Cannot change another user\'s password.' };
        }

        // Verify old password (required for own password change)
        if (currentUser?.id === userId) {
            if (user.passwordHash !== this._hash(oldPassword)) {
                return { success: false, error: 'Current password is incorrect.' };
            }
        }

        user.passwordHash = this._hash(newPassword);
        this._setUsers(users);

        if (window.AuditLog) window.AuditLog.log('change_password', `Password changed for: ${user.username}`);
        return { success: true };
    },

    // Admin reset password (no old password needed)
    resetPassword(userId, newPassword) {
        const currentRole = this.getRole();
        if (currentRole !== this.ROLES.SUPER_ADMIN && currentRole !== this.ROLES.MANAGER) {
            return { success: false, error: 'Insufficient permissions.' };
        }

        const users = this._getUsers();
        const user = users.find(u => u.id === userId);
        if (!user) return { success: false, error: 'User not found.' };

        // Managers cannot reset Super Admin password
        if (currentRole === this.ROLES.MANAGER && user.role === this.ROLES.SUPER_ADMIN) {
            return { success: false, error: 'Cannot reset Super Admin password.' };
        }

        user.passwordHash = this._hash(newPassword);
        this._setUsers(users);

        if (window.AuditLog) window.AuditLog.log('reset_password', `Password reset for: ${user.username}`);
        return { success: true };
    }
};
