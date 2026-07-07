// API View Component
window.ApiView = {
    render(container) {
        const isLocked = !sessionStorage.getItem('BS_API_UNLOCKED');
        
        container.innerHTML = `
            <div class="view-container active fade-in" id="apiViewRoot">
                ${isLocked ? this._getLockedHTML() : this._getHTML()}
            </div>
        `;
        
        if(!isLocked) setTimeout(() => this.updateSyncUI(), 50);
    },

    _getLockedHTML() {
        return `
            <div style="height: 60vh; display:flex; flex-direction:column; align-items:center; justify-content:center; gap: 24px; text-align:center;">
                <div style="width: 80px; height: 80px; background: rgba(255, 69, 58, 0.1); border-radius: 50%; display:flex; align-items:center; justify-content:center; color: #ff453a; border: 1px solid rgba(255, 69, 58, 0.2);">
                    <i class="icon-lucide-lock" style="font-size: 2rem;"></i>
                </div>
                <div>
                    <h2 style="font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 8px;">Sensitive Access Required</h2>
                    <p style="color: var(--text-muted); font-size: 1rem; max-width: 320px;">The API & Integrations portal is restricted. Provide your master key to proceed.</p>
                </div>
                <div style="width: 100%; max-width: 300px; display:flex; flex-direction:column; gap: 12px;">
                    <input type="password" id="apiUnlockKey" placeholder="Enter Administrative Key" class="glass-input-textarea" style="text-align:center; padding: 14px; font-size: 1.1rem; letter-spacing: 0.15em;" onkeydown="if(event.key==='Enter') window.ApiView.attemptApiUnlock()">
                    <button class="btn primary-btn" style="width: 100%; padding: 14px;" onclick="window.ApiView.attemptApiUnlock()">
                        <i class="icon-lucide-unlock"></i> Verify Access
                    </button>
                </div>
            </div>
        `;
    },

    attemptApiUnlock() {
        const key = document.getElementById('apiUnlockKey').value.trim();
        if (key === 'dadasafa') {
            sessionStorage.setItem('BS_API_UNLOCKED', 'true');
            window.showToast('Administrative Access Granted', 'success');
            // Re-render
            const container = document.getElementById('app-content');
            this.render(container);
        } else {
            window.showToast('Invalid Access Key', 'error');
        }
    },

    _getHTML() {
        return `
            <div class="view-container active fade-in">
                
                <div style="display:flex; justify-content: space-between; align-items:center;">
                    <div>
                        <h2 style="font-size: 1.25rem; font-weight: 600;">API & Integrations</h2>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Connect your systems directly via PhilSMS OAuth protocols.</p>
                    </div>
                    <button class="btn primary-btn"><i class="icon-lucide-save"></i> Save Configuration</button>
                </div>

                <div class="grid-2">
                    <div style="display:flex; flex-direction:column; gap: 24px;">
                        
                        <!-- GitHub Gist Cloud Repository (Professional Sync) -->
                        <div class="card" style="border: 1px solid #ffffff; background: rgba(255, 255, 255, 0.03);">
                            <div style="display:flex; gap: 12px; align-items: center; margin-bottom: 16px;">
                                <div style="width: 36px; height: 36px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; display:flex; align-items:center; justify-content:center; color: #fff;">
                                    <i class="icon-lucide-github"></i>
                                </div>
                                <h3 style="font-size: 1.1rem;">GitHub Gist Cloud Repository</h3>
                                <div id="syncStatusBadge" style="margin-left:auto; font-size:0.65rem; padding:4px 10px; border-radius:100px; background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.4); text-transform:uppercase; font-weight:800; letter-spacing:0.05em;">NO REPO CONNECTED</div>
                            </div>
                            
                            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px;">Utilize your GitHub account as a secure, persistent database. Your contacts and schedules will be stored in a private Gist.</p>
                            
                            <div style="display:flex; flex-direction:column; gap: 14px; margin-bottom: 20px;">
                                <div style="display:flex; flex-direction:column; gap:6px;">
                                    <label style="font-size: 0.75rem; color: var(--text-muted); font-weight:700;">GitHub Personal Access Token (Classic)</label>
                                    <input type="password" id="ghToken" placeholder="ghp_xxxxxxxxxxxx" class="glass-input-textarea" style="width:100%;">
                                </div>
                                <div style="display:flex; flex-direction:column; gap:6px;">
                                    <label style="font-size: 0.75rem; color: var(--text-muted); font-weight:700;">Gist ID (The database file identifier)</label>
                                    <input type="text" id="ghGistId" placeholder="e.g. 5a1b2c3d4e5f..." class="glass-input-textarea" style="width:100%;">
                                </div>
                            </div>
                            
                            <div style="display:flex; gap:10px;">
                                <button class="btn primary-btn" style="flex:1;" onclick="window.ApiView.pushToGH()">
                                    <i class="icon-lucide-upload-cloud"></i> Push to GitHub
                                </button>
                                <button class="btn" style="background:#fff; color:#000; flex:1;" onclick="window.ApiView.pullFromGH()">
                                    <i class="icon-lucide-download-cloud"></i> Pull from GitHub
                                </button>
                            </div>
                            <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 14px; text-align: center;">Note: The Gist must contain a file named <code>brandsync_db.json</code>.</p>
                        </div>

                        <!-- PhilSMS Auth -->
                        <div class="card">
                            <div style="display:flex; gap: 12px; align-items: center; margin-bottom: 16px;">
                                <div style="width: 36px; height: 36px; background: rgba(10, 132, 255, 0.1); border-radius: 8px; display:flex; align-items:center; justify-content:center; color: var(--accent-color);">
                                    <i class="icon-lucide-key"></i>
                                </div>
                                <h3 style="font-size: 1.1rem;">PhilSMS API Key</h3>
                            </div>
                            
                            <div style="display:flex; flex-direction:column; gap: 8px; margin-bottom: 16px;">
                                <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Bearer Token (OAuth 2.0)</label>
                                <div style="display:flex; gap: 8px;">
                                    <input type="password" value="2077|nX83VCD41UBmAM0MKi3099gAYo437c0siG4eLZVC67e9d0bd" class="glass-input-textarea" style="flex: 1; font-family: monospace;" readonly id="apiKeyInput">
                                    <button class="btn icon-btn" onclick="const x=document.getElementById('apiKeyInput'); x.type=x.type==='password'?'text':'password'"><i class="icon-lucide-eye"></i></button>
                                </div>
                                <p style="font-size: 0.75rem; color: var(--text-muted);">Endpoint: <code>https://dashboard.philsms.com/api/v3/</code></p>
                            </div>

                            <button class="btn" style="background: var(--surface-glass); border: 1px solid var(--border-glass); color: white; width: fit-content;"><i class="icon-lucide-refresh-cw"></i> Regenerate Token</button>
                        </div>

                        <!-- Webhook -->
                        <div class="card">
                            <div style="display:flex; gap: 12px; align-items: center; margin-bottom: 16px;">
                                <div style="width: 36px; height: 36px; background: rgba(191, 90, 242, 0.1); border-radius: 8px; display:flex; align-items:center; justify-content:center; color: var(--credit-color);">
                                    <i class="icon-lucide-webhook"></i>
                                </div>
                                <h3 style="font-size: 1.1rem;">Incoming Automation Webhook</h3>
                            </div>
                            
                            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">Use this URL for your PhilSMS automation callbacks. Send POST requests here to trigger automated workflows.</p>
                            
                            <div style="display:flex; gap: 8px;">
                                <input type="text" value="https://purple1414.github.io/brandsyncsms/#automation" class="glass-input-textarea" style="flex: 1; font-family: monospace;" readonly id="webhookUrlInput">
                                <button class="btn icon-btn" onclick="const x=document.getElementById('webhookUrlInput'); navigator.clipboard.writeText(x.value); window.showToast('Project Webhook Copied')"><i class="icon-lucide-copy"></i></button>
                            </div>
                        </div>

                        <!-- Lead Syndication (External Render Sync) -->
                        <div class="card" style="border: 1px solid rgba(255, 159, 10, 0.3); background: rgba(255, 159, 10, 0.05);">
                            <div style="display:flex; gap: 12px; align-items: center; margin-bottom: 16px;">
                                <div style="width: 36px; height: 36px; background: rgba(255, 159, 10, 0.1); border-radius: 8px; display:flex; align-items:center; justify-content:center; color: #ff9f0a;">
                                    <i class="icon-lucide-share-2"></i>
                                </div>
                                <h3 style="font-size: 1.1rem;">Cloud Lead Syndication</h3>
                                <div id="sync-status" style="margin-left:auto; font-size:0.65rem; padding:4px 10px; border-radius:100px; background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.4); text-transform:uppercase; font-weight:800; letter-spacing:0.05em;">READY TO SYNC</div>
                            </div>
                            
                            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 20px;">Pull synchronized leads directly from your hosted BrandSync engine on Render. This bridge establishes a real-time data tunnel for your identities.</p>
                            
                            <button onclick="pullLeadsFromBrandSync()" id="pull-leads-btn" class="btn" style="width:100%; height:46px; background:#ff9f0a; color:#000; font-weight:800; border-radius:14px; border:none; display:flex; align-items:center; justify-content:center; gap:8px;">
                                <i class="icon-lucide-refresh-cw"></i> Pull Identities from Cloud
                            </button>

                            <div id="contacts" style="margin-top: 20px; max-height: 200px; overflow-y: auto; display:flex; flex-direction:column; gap:8px; border-radius:12px;">
                                <!-- Synced leads will appear here -->
                            </div>
                        </div>

                        <!-- Database Management (The 'Real' Database) -->
                        <div class="card" style="border: 1px dashed rgba(50, 215, 75, 0.3); background: rgba(50, 215, 75, 0.05);">
                            <div style="display:flex; gap: 12px; align-items: center; margin-bottom: 16px;">
                                <div style="width: 36px; height: 36px; background: rgba(50, 215, 75, 0.1); border-radius: 8px; display:flex; align-items:center; justify-content:center; color: #32d74b;">
                                    <i class="icon-lucide-database"></i>
                                </div>
                                <h3 style="font-size: 1.1rem;">Administrative Data Vault</h3>
                            </div>
                            
                            <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">This application uses your browser's persistent storage as its primary database. To prevent data loss when uploading new files, use these backup tools.</p>
                            
                            <div style="flex:1.2; display:flex; flex-direction:column; gap: 10px;">
                                <button class="btn primary-btn" style="width: 100%;" onclick="window.BrandSyncAPI.exportData()">
                                    <i class="icon-lucide-download"></i> Export JSON Database
                                </button>
                                <label class="btn" style="width: 100%; background: var(--surface-glass); border: 1px solid var(--border-glass); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;">
                                    <i class="icon-lucide-upload"></i> Restore from Backup
                                    <input type="file" style="display: none;" onchange="window.BrandSyncAPI.importData(this.files[0])">
                                </label>
                            </div>
                        </div>

                    </div>

                    <!-- Right Column: Logs -->
                    <div class="card" style="padding: 0; display:flex; flex-direction: column;">
                        <div style="padding: 20px; border-bottom: 1px solid var(--border-glass);">
                            <h3 style="font-size: 1.1rem;">API Request Logs</h3>
                        </div>
                        <div style="flex: 1; min-height: 300px; background: #08080c; font-family: monospace; font-size: 0.8rem; padding: 16px; color: var(--text-secondary); overflow-y: auto; display:flex; flex-direction:column; gap: 8px; border-bottom-left-radius: var(--radius-lg); border-bottom-right-radius: var(--radius-lg);">
                            <div style="display:flex; gap: 12px;"><span style="color: var(--success-color);">[200 OK]</span><span style="color: #666;">10:42:01</span><span>POST /api/v3/contacts/{group_id}/store</span></div>
                            <div style="display:flex; gap: 12px;"><span style="color: var(--success-color);">[200 OK]</span><span style="color: #666;">09:15:22</span><span>GET /api/v3/dashboard/stats</span></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    updateSyncUI() {
        const config = JSON.parse(localStorage.getItem('BS_GH_CONFIG') || '{}');
        
        // RECONCILIATION: Always prioritize the Master Default over stale local storage
        const defaultToken = window.BrandSyncConfig ? window.BrandSyncConfig.DEFAULT_GITHUB_TOKEN : '';
        const defaultGistId = window.BrandSyncConfig ? window.BrandSyncConfig.DEFAULT_GIST_ID : '';
        
        const tokenVal = defaultToken || config.token; 
        const gistVal = defaultGistId || config.gistId;

        const tokenField = document.getElementById('ghToken');
        const gistIdField = document.getElementById('ghGistId');
        const status = document.getElementById('syncStatusBadge');
        
        if(tokenField) tokenField.value = tokenVal || '';
        if(gistIdField) gistIdField.value = gistVal || '';
        
        if (tokenVal && gistVal) {
            status.innerText = 'GLOBAL CLOUD SYSTEM ACTIVE';
            status.style.background = 'rgba(50, 215, 75, 0.1)';
            status.style.color = '#32d74b';
        }
    },

    async pushToGH() {
        const token = document.getElementById('ghToken').value;
        const gistId = document.getElementById('ghGistId').value;
        
        if(!token || !gistId) return window.showToast('Token and Gist ID required', 'error');
        
        localStorage.setItem('BS_GH_CONFIG', JSON.stringify({ token, gistId }));
        window.showToast('Broadcasting Identity to GitHub...');
        
        if (window.BrandSyncAPI && window.BrandSyncAPI.githubPush) {
            const result = await window.BrandSyncAPI.githubPush(token, gistId);
            if (result.success) {
                window.showToast('GitHub Cloud Broadcast Success', 'success');
                this.updateSyncUI();
            } else {
                let msg = `Push Failed (HTTP ${result.status})`;
                if(result.status === 401) msg = "Access Denied: Token missing 'gist' permission.";
                if(result.status === 404) msg = "Not Found: Gist ID is incorrect.";
                window.showToast(msg, 'error');
            }
        }
    },

    async pullFromGH() {
        const token = document.getElementById('ghToken').value;
        const gistId = document.getElementById('ghGistId').value;
        
        if(!token || !gistId) return window.showToast('Token and Gist ID required', 'error');
        
        localStorage.setItem('BS_GH_CONFIG', JSON.stringify({ token, gistId }));
        window.showToast('Syncing from GitHub Vault...');
        
        if (window.BrandSyncAPI && window.BrandSyncAPI.githubPull) {
            const result = await window.BrandSyncAPI.githubPull(token, gistId);
            if (result.success) {
                window.showToast('Cloud Data Synced. Reloading...', 'success');
                setTimeout(() => window.location.reload(), 1500);
            } else {
                let msg = `Sync Failed (HTTP ${result.status})`;
                if(result.status === 401) msg = "Access Denied: Token missing 'gist' permission.";
                if(result.status === 404) msg = "Not Found: Gist ID is incorrect.";
                if(result.status === 204) msg = "Gist is Empty: Click 'Push' to initialize.";
                window.showToast(msg, 'error');
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if(window.app) window.app.views['api'] = () => window.ApiView.render(window.app.contentArea);
    }, 100);
});
