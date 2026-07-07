// BrandSync Audit Logger
// Tracks all significant user actions for accountability and compliance.

window.AuditLog = {
    STORAGE_KEY: 'brandsync_audit_logs',
    MAX_ENTRIES: 500,

    /**
     * Log an audit event.
     * @param {string} action - Machine-readable action key (e.g. 'send_sms', 'delete_contact')
     * @param {string} details - Human-readable description of the action
     */
    log(action, details) {
        const session = window.AuthService?.getSession();
        const entry = {
            id: 'log_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
            userId: session?.userId || 'system',
            username: session?.username || 'system',
            role: session?.role || 'unknown',
            action: action,
            details: details || '',
            timestamp: new Date().toISOString()
        };

        const logs = this.getAll();
        logs.unshift(entry);

        // Auto-trim to keep max entries
        if (logs.length > this.MAX_ENTRIES) logs.length = this.MAX_ENTRIES;

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));

        // Cloud sync (debounced via _set)
        if (window.BrandSyncAPI && window.BrandSyncAPI._set) {
            window.BrandSyncAPI._set(this.STORAGE_KEY, logs);
        }
    },

    /**
     * Get all audit log entries.
     * @returns {Array}
     */
    getAll() {
        try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]'); }
        catch { return []; }
    },

    /**
     * Get logs filtered by userId.
     * @param {string} userId
     * @param {number} [limit=20]
     * @returns {Array}
     */
    getByUser(userId, limit = 20) {
        return this.getAll().filter(l => l.userId === userId).slice(0, limit);
    },

    /**
     * Get logs filtered by action type.
     * @param {string} action
     * @param {number} [limit=50]
     * @returns {Array}
     */
    getByAction(action, limit = 50) {
        return this.getAll().filter(l => l.action === action).slice(0, limit);
    },

    /**
     * Clear all audit logs (Super Admin only).
     */
    clear() {
        if (window.RBAC && !window.RBAC.can('import_data')) {
            if (window.showToast) window.showToast('Only Super Admin can clear audit logs.', 'error');
            return false;
        }
        localStorage.setItem(this.STORAGE_KEY, '[]');
        this.log('clear_audit', 'Audit log history was cleared.');
        return true;
    },

    /**
     * Format a timestamp for display.
     * @param {string} iso
     * @returns {string}
     */
    formatTime(iso) {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleString('en-US', {
            month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
        });
    },

    /**
     * Get a human-friendly action label.
     * @param {string} action 
     * @returns {string}
     */
    actionLabel(action) {
        const labels = {
            login: '🔑 Login',
            logout: '🔒 Logout',
            send_sms: '📤 Send SMS',
            schedule_sms: '📅 Schedule SMS',
            delete_scheduled: '🗑️ Delete Scheduled',
            create_template: '📝 Create Template',
            edit_template: '✏️ Edit Template',
            delete_template: '🗑️ Delete Template',
            add_contact: '👤 Add Contact',
            edit_contact: '✏️ Edit Contact',
            delete_contact: '🗑️ Delete Contact',
            create_user: '👤 Create User',
            update_user: '✏️ Update User',
            delete_user: '🗑️ Delete User',
            change_password: '🔐 Change Password',
            reset_password: '🔐 Reset Password',
            clear_audit: '🧹 Clear Audit Log',
            export_data: '💾 Export Data',
            import_data: '📥 Import Data',
            delete_group: '🗑️ Delete Group',
            create_folder: '📁 Create Folder',
            delete_folder: '🗑️ Delete Folder'
        };
        return labels[action] || action.replace(/_/g, ' ');
    },

    /**
     * Get the color for an action badge.
     * @param {string} action
     * @returns {string}
     */
    actionColor(action) {
        if (action.startsWith('delete') || action === 'clear_audit') return '#ff453a';
        if (action.startsWith('create') || action === 'add_contact') return '#32d74b';
        if (action === 'login' || action === 'logout') return '#0a84ff';
        if (action.startsWith('send') || action.startsWith('schedule')) return '#bf5af2';
        if (action.startsWith('edit') || action.startsWith('update') || action.startsWith('change') || action.startsWith('reset')) return '#ff9f0a';
        return '#8e8e93';
    }
};
