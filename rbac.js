// BrandSync RBAC (Role-Based Access Control) Middleware
// Enforces permissions at the UI layer based on the current user's role.

window.RBAC = {
    // ─── Permission Matrix ────────────────────────────────
    // Each key is an action, each value maps roles to booleans.
    PERMISSIONS: {
        // SMS Operations
        send_sms:           { superadmin: true, manager: true, user: true },
        schedule_sms:       { superadmin: true, manager: true, user: true },
        delete_scheduled:   { superadmin: true, manager: true, user: true },

        // Templates
        create_template:    { superadmin: true, manager: true, user: true },
        edit_template:      { superadmin: true, manager: true, user: true },
        delete_template:    { superadmin: true, manager: true, user: true },
        create_folder:      { superadmin: true, manager: true, user: true },
        delete_folder:      { superadmin: true, manager: true, user: true },

        // Contacts
        add_contact:        { superadmin: true, manager: true, user: true },
        edit_contact:       { superadmin: true, manager: true, user: true },
        delete_contact:     { superadmin: true, manager: true, user: true },
        import_contacts:    { superadmin: true, manager: true, user: true },
        delete_group:       { superadmin: true, manager: true, user: true },

        // Dashboard
        view_dashboard:     { superadmin: true, manager: true, user: true },

        // User Management
        manage_users:       { superadmin: true, manager: true, user: false },
        create_manager:     { superadmin: true, manager: false, user: false },
        delete_user:        { superadmin: true, manager: true, user: false },

        // System
        access_api:         { superadmin: true, manager: true, user: true },
        view_audit:         { superadmin: true, manager: true, user: false },
        export_data:        { superadmin: true, manager: true, user: true },
        import_data:        { superadmin: true, manager: true, user: false },

        // Navigation visibility
        nav_users:          { superadmin: true, manager: true, user: false },
        nav_api:            { superadmin: true, manager: true, user: true },
        nav_automation:     { superadmin: true, manager: true, user: true },
        nav_blacklist:      { superadmin: true, manager: true, user: true },
        nav_campaigns:      { superadmin: true, manager: true, user: true },
        nav_inbox:          { superadmin: true, manager: true, user: true },
    },

    // ─── Core Methods ─────────────────────────────────────

    /**
     * Check if the current user can perform a given action.
     * @param {string} action - Action key from PERMISSIONS matrix
     * @returns {boolean}
     */
    can(action) {
        const role = window.AuthService?.getRole();
        if (!role) return false;
        const perm = this.PERMISSIONS[action];
        if (!perm) {
            console.warn(`[RBAC] Unknown action: ${action}`);
            return role === 'superadmin'; // Super Admin fallback
        }
        return !!perm[role];
    },

    /**
     * Enforce a permission check. If denied, show a toast and return false.
     * @param {string} action - Action key
     * @param {string} [customMsg] - Optional custom denial message
     * @returns {boolean} true if allowed
     */
    enforce(action, customMsg) {
        if (this.can(action)) return true;
        const msg = customMsg || `Access Denied: You don't have permission for "${action.replace(/_/g, ' ')}".`;
        if (window.showToast) window.showToast(msg, 'error');
        return false;
    },

    /**
     * Gate a callback behind a permission check.
     * @param {string} action - Action key
     * @param {Function} callback - Runs only if permitted
     * @param {string} [customMsg] - Optional deny message
     */
    gate(action, callback, customMsg) {
        if (this.enforce(action, customMsg)) {
            callback();
        }
    },

    /**
     * Returns the role display label with proper casing.
     * @param {string} role 
     * @returns {string}
     */
    roleLabel(role) {
        const labels = {
            superadmin: 'Super Admin',
            manager: 'Manager',
            user: 'User'
        };
        return labels[role] || role;
    },

    /**
     * Returns CSS color for a role badge.
     * @param {string} role
     * @returns {{bg: string, color: string, border: string}}
     */
    roleColor(role) {
        const colors = {
            superadmin: { bg: 'rgba(255,69,58,0.15)', color: '#ff453a', border: 'rgba(255,69,58,0.4)' },
            manager:    { bg: 'rgba(10,132,255,0.15)', color: '#0a84ff', border: 'rgba(10,132,255,0.4)' },
            user:       { bg: 'rgba(50,215,75,0.15)', color: '#32d74b', border: 'rgba(50,215,75,0.4)' }
        };
        return colors[role] || colors.user;
    },

    /**
     * Apply visibility rules to navigation items.
     * Call this after login or on route change.
     */
    applyNavVisibility() {
        const navMap = {
            'nav-users':     'nav_users',
            'nav_api_link':  'nav_api',
        };

        // Hide Users nav for non-admin roles
        const usersNav = document.querySelector('[data-path="users"]');
        if (usersNav) usersNav.style.display = this.can('nav_users') ? '' : 'none';

        // Hide API nav for users
        const apiNav = document.querySelector('[data-path="api"]');
        if (apiNav) apiNav.style.display = this.can('nav_api') ? '' : 'none';
    }
};
