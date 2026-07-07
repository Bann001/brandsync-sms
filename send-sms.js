// Send SMS View Component
window.SendSMSView = {
    render(container) {
        container.innerHTML = `
            <div class="view-container active" style="display: block; position: relative; inset: 0; padding: 0; margin: 0; min-height: 100%;">
                
                <!-- Center Column: Composer (Fully Scrollable) -->
                <div style="padding: 24px; padding-right: 420px; box-sizing: border-box; scroll-behavior: smooth;">
                    <div class="card fade-in" style="display:flex; flex-direction: column; gap: 20px; min-height: min-content; margin-bottom: 24px;">
                        <h3 style="font-size: 1.1rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px;">Compose Message</h3>
                    
                    <div style="display:flex; flex-direction:column; gap: 8px;">
                        <label style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Sender ID</label>
                        <select class="glass-input-select" id="senderId">
                            <option value="">-- Loading... --</option>
                        </select>
                    </div>

                    <div style="display:flex; flex-direction:column; gap: 8px;">
                        <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; display:flex; justify-content: space-between; align-items:center; margin-bottom: 8px;">
                            <span style="display:flex; align-items:center;">Recipients <span style="font-weight: normal; font-size: 0.75rem; margin-left: 4px; color: var(--text-muted); opacity: 0.8;">(Comma separated)</span> <span id="recipientCountBadge" style="margin-left: 10px; padding: 2px 8px; background: rgba(255,255,255,0.05); border-radius: 12px; font-size: 0.75rem; color: var(--text-primary); transition: 0.2s;">0 Contacts</span></span>
                            <div style="display:flex; gap: 8px;">
                                <button id="btnAttachFile" class="btn" style="height: 36px; padding: 0 16px; font-size: 0.75rem; background: rgba(50, 215, 75, 0.15); border: 1px solid rgba(50, 215, 75, 0.3); color: var(--success-color); border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: inline-flex; align-items: center; justify-content: center; gap: 6px; line-height: 1;" title="Attach Excel/CSV"><i class="icon-lucide-file-spreadsheet" style="font-size: 0.9rem;"></i> <span style="display:inline-block; vertical-align: middle; margin-top: 1px;">Excel / CSV</span></button>
                                <input type="file" id="fileImportInput" style="display:none;" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
                                <div style="position:relative;">
                                    <button id="btnContactsDropdown" class="btn" style="height: 36px; padding: 0 16px; font-size: 0.75rem; background: rgba(10, 132, 255, 0.15); border: 1px solid rgba(10, 132, 255, 0.3); color: var(--accent-color); border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: inline-flex; align-items: center; justify-content: center; gap: 6px; line-height: 1;" title="Import Contacts"><i class="icon-lucide-plus-circle" style="font-size: 0.9rem;"></i> <span style="display:inline-block; vertical-align: middle; margin-top: 1px;">Contacts</span></button>
                                    <div id="contactsDropdownMenu" class="apple-dropdown-menu">
                                        <div style="font-size:0.75rem; color:var(--text-muted); padding:12px; text-align:center;">Loading contacts...</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <textarea class="glass-input-textarea" id="recipientsArea" rows="2" placeholder="639171234567, 639189876543" style="resize: vertical; max-width: 100%;"></textarea>
                    </div>

                    <div style="display:flex; flex-direction:column; gap: 8px; flex: 1;">
                        <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600; display:flex; justify-content: space-between; align-items:center; margin-bottom: 8px;">
                            <span>Message Content</span>
                            <div style="display:flex; gap: 8px; align-items:center;">
                                <div style="position:relative;">
                                    <button id="btnTemplatesDropdown" class="btn" style="height: 32px; padding: 0 14px; font-size: 0.75rem; background: rgba(191, 90, 242, 0.15); color: var(--credit-color); border-radius: 10px; border: 1px solid rgba(191, 90, 242, 0.3); box-shadow: 0 2px 8px rgba(0,0,0,0.2); display: inline-flex; align-items: center; justify-content: center; gap: 6px; line-height: 1;"><i class="icon-lucide-file-text" style="font-size:0.9rem;"></i> <span style="display:inline-block; vertical-align: middle; margin-top: 1px;">Templates</span></button>
                                    <div id="templatesDropdownMenu" style="display:none; position:absolute; right:0; top:100%; margin-top:8px; background: rgba(45, 45, 50, 0.95); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:8px; width:260px; z-index:100; max-height:240px; overflow-y:auto; text-align: left; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
                                        <div style="font-size:0.75rem; color:var(--text-muted); padding:4px;">Loading templates...</div>
                                    </div>
                                </div>
                                <button id="btnSpintax" class="btn" style="height: 32px; padding: 0 14px; font-size: 0.75rem; background: rgba(255, 159, 10, 0.15); color: var(--warning-color); border-radius: 10px; border: 1px solid rgba(255, 159, 10, 0.3); display: inline-flex; align-items: center; justify-content: center; gap: 6px; line-height: 1;"><i class="icon-lucide-wand-2" style="font-size:0.9rem;"></i> <span style="display:inline-block; vertical-align: middle; margin-top: 1px;">Auto Spintax</span></button>
                            </div>
                        </div>
                        
                        <!-- GSM Warning Action Bar -->
                        <div id="gsmWarningBar" style="display: none; justify-content: space-between; align-items: center; background: rgba(255, 159, 10, 0.15); border: 1px solid rgba(255, 159, 10, 0.4); border-radius: 8px; padding: 10px 14px; margin-bottom: 2px; animation: pulseGlow 2s infinite;">
                            <span style="font-size: 0.8rem; color: var(--warning-color); font-weight: 500; display:flex; align-items:center; gap:6px;">
                                <i class="icon-lucide-alert-triangle" style="font-size:0.9rem;"></i> Non-GSM detected (Max 70 chars per segment)
                            </span>
                            <div style="display:flex; gap: 8px;">
                                <button id="btnIgnoreGsm" class="btn" style="padding: 4px 10px; font-size: 0.75rem; color: var(--text-muted); background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px;">Ignore</button>
                                <button id="btnFixGsm" class="btn primary-btn" style="padding: 4px 12px; font-size: 0.8rem; background: var(--warning-color); color: #000; font-weight: 700; border-radius: 6px; box-shadow: 0 0 10px rgba(255,159,10,0.5);">Auto Convert GSM-7</button>
                            </div>
                        </div>

                        <div style="position: relative; display: flex; flex-direction: column; flex: 1; min-height: 150px; background: var(--surface-glass); border: 1px solid var(--border-glass); border-radius: var(--radius-md); overflow: hidden;">
                            <div id="backdrop" style="position: absolute; top:0; left:0; width: 100%; height: 100%; padding: 10px 14px; font-family: inherit; font-size: 0.95rem; line-height: 1.5; color: transparent; pointer-events: none; white-space: pre-wrap; word-wrap: break-word; overflow-y: hidden; z-index: 1;"></div>
                            <textarea class="glass-input-textarea" style="position: relative; z-index: 2; background: transparent; flex: 1; resize: none; font-family: inherit; font-size: 0.95rem; line-height: 1.5; border: none !important; box-shadow: none !important; outline: none !important; height: 100%;" id="messageArea" placeholder="Type your message here... use {name} for variable insertion."></textarea>
                        </div>
                        
                        <!-- Unified Bottom Action Dock -->
                        <div style="background: rgba(0,0,0,0.25); border-radius: 16px; border: 1px solid var(--border-glass); display: flex; flex-direction: column; margin-top: 8px; flex-shrink: 0;">
                            
                            <!-- Top Half: Message Stats -->
                            <div style="display:flex; justify-content: space-between; align-items: center; padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); border-top-left-radius: 16px; border-top-right-radius: 16px;">
                                <div style="display:flex; gap: 20px; flex-wrap: wrap;">
                                    <div>
                                        <span style="font-size: 0.75rem; color: var(--text-muted); display:block; font-weight: 500;">Characters</span>
                                        <span style="font-size: 1.15rem; font-weight: 600;" id="charCount">0</span>
                                    </div>
                                    <div style="width: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;"></div>
                                    <div>
                                        <span style="font-size: 0.75rem; color: var(--text-muted); display:block; font-weight: 500;">Segments</span>
                                        <span style="font-size: 1.15rem; font-weight: 600; color: var(--credit-color);" id="segmentCount">1</span>
                                    </div>
                                    <div style="width: 1px; background: rgba(255,255,255,0.1); margin: 4px 0;"></div>
                                    <div>
                                        <span style="font-size: 0.75rem; color: var(--text-muted); display:block; font-weight: 500;">Encoding</span>
                                        <span style="font-size: 0.95rem; font-weight: 600; margin-top:3px; display:block;" id="encodingType">GSM-7</span>
                                    </div>
                                </div>
                                <div class="cost-tooltip-container" style="text-align: right; background: rgba(0,0,0,0.3); padding: 8px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); position: relative;">
                                    <span style="font-size: 0.7rem; color: var(--text-muted); display:flex; align-items:center; justify-content: flex-end; gap: 6px; text-transform:uppercase; font-weight: 600; letter-spacing:0.5px;">
                                        Total Cost <i class="icon-lucide-info" style="font-size: 0.8rem; color: var(--text-secondary); cursor:help;"></i>
                                    </span>
                                    <span style="font-size: 1.05rem; font-weight: 600; color: var(--credit-color);"><span id="creditCost">0</span> Credit(s)</span>
                                    
                                    <!-- Embedded Hover Tooltip -->
                                    <div id="costTooltip" style="position: absolute; bottom: 100%; right: 0; margin-bottom: 8px; background: rgba(28,28,30,0.95); padding: 12px; border-radius: 12px; width: 220px; font-size: 0.8rem; color: #fff; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px); z-index: 1000; text-transform: none; text-align: left; line-height: 1.5; display: none; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                                        Start typing numbers to calculate total cost.
                                    </div>
                                </div>
                            </div>

                            <!-- Bottom Half: Call to Actions -->
                            <div style="display:flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(0,0,0,0.15); border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;">
                                <div style="display:flex; align-items:center; gap: 12px;">
                                    <button class="btn" id="scheduleToggleBtn" style="background: var(--surface-glass); border: 1px solid var(--border-glass); color: var(--text-primary); border-radius: 10px; padding: 8px 16px; font-weight: 500; font-size: 0.9rem; transition: background 0.2s;">
                                        <i class="icon-lucide-calendar-clock" id="scheduleIcon"></i> <span>Send Later</span>
                                    </button>
                                    <input type="datetime-local" id="scheduleTime" class="glass-input-select" style="display: none; padding: 9px 12px; border-radius: 10px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: rgba(0,0,0,0.3); border: 1px solid var(--border-glass); cursor: pointer; color-scheme: dark; font-size: 0.9rem; text-transform: uppercase;">
                                </div>
                                <button class="btn primary-btn" id="sendBtn" style="height: 44px; border-radius: 12px; padding: 0 32px; font-weight: 600; font-size: 0.95rem; box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3); display: inline-flex; align-items: center; justify-content: center; gap: 8px; line-height: 1;"><i class="icon-lucide-send" style="font-size: 1.1rem;"></i> <span style="display:inline-block; vertical-align: middle; margin-top: 1px;">Send Now</span></button>
                            </div>
                        </div>
                    </div>
                </div>

                    </div>
                </div>
            </div>
        `;
        
        // GLOBAL PORTAL: Inject the Phone Preview directly into the Body to escape the 'fade-in' transform lock
        const oldPreview = document.getElementById('global-phone-preview');
        if(oldPreview) oldPreview.remove();
        
        const phonePortal = document.createElement('div');
        phonePortal.id = 'global-phone-preview';
        phonePortal.style.cssText = 'position: fixed; top: 80px; right: 0; bottom: 0; width: 380px; display:flex; align-items:center; justify-content:center; padding: 20px; box-sizing: border-box; background: rgba(0,0,0,0.1); border-left: 1px solid var(--border-glass); z-index: 9990; backdrop-filter: blur(10px); pointer-events: none;';
        
        phonePortal.innerHTML = `
            <div class="iphone-mockup" style="position: relative; width: 280px; height: 580px; max-height: 90vh; border-radius: 40px; border: 8px solid #2a2a2f; background: #000; box-shadow: inset 0 0 20px rgba(0,0,0,1), 0 30px 60px rgba(0,0,0,0.8); overflow: hidden; display:flex; flex-direction:column; pointer-events: auto;">
                <!-- Notch -->
                <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 120px; height: 25px; background: #2a2a2f; border-bottom-left-radius: 16px; border-bottom-right-radius: 16px; z-index: 10;"></div>
                
                <!-- Header -->
                <div style="padding: 40px 16px 12px; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(30,30,30,0.8); backdrop-filter: blur(10px); display:flex; flex-direction: column; align-items: center;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: #555; display:flex; align-items:center; justify-content:center; margin-bottom: 4px;">
                        <i class="icon-lucide-user" style="color:#aaa;"></i>
                    </div>
                    <span style="font-size: 0.85rem; font-weight: 500;" id="previewSender">Sender ID</span>
                    <span style="font-size: 0.7rem; color: #aaa;">Text Message</span>
                </div>

                <!-- Chat Body -->
                <div style="flex: 1; padding: 16px; display:flex; flex-direction:column; background: #000; overflow-y: auto;" id="iphoneChatBody">
                    <div style="margin-top: auto; display: flex; flex-direction: column; padding-top: 20px;">
                        <div style="background: #262628; padding: 10px 14px; border-radius: 18px; border-bottom-left-radius: 4px; max-width: 85%; align-self: flex-start; margin-bottom: 16px;">
                            <p style="font-size: 0.9rem; line-height: 1.4; word-break: break-word; white-space: pre-wrap; color: #fff;" id="previewText">Your message preview will appear here.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(phonePortal);

        // Auto-cleanup on view change
        const observer = new MutationObserver(() => {
            if (!document.getElementById('messageArea')) {
                const p = document.getElementById('global-phone-preview');
                if (p) p.remove();
                observer.disconnect();
            }
        });
        observer.observe(document.getElementById('app-content'), { childList: true });
        
        // Styles
        if(!document.getElementById('sendsms-css')) {
            const style = document.createElement('style');
            style.id = 'sendsms-css';
            style.innerHTML = `
                .glass-input-select, .glass-input-textarea {
                    background-color: rgba(30, 30, 35, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    color: var(--text-primary);
                    padding: 12px 16px;
                    border-radius: 12px;
                    outline: none;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 0.95rem;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif;
                    -webkit-appearance: none;
                    appearance: none;
                    backdrop-filter: blur(12px);
                }
                .glass-input-select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 14px center;
                    padding-right: 40px;
                    cursor: pointer;
                }
                .glass-input-select:hover {
                    background-color: rgba(40, 40, 48, 0.85);
                    border-color: rgba(255, 255, 255, 0.2);
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
                }
                .glass-input-select:focus, .glass-input-textarea:focus {
                    border-color: rgba(10, 132, 255, 0.6);
                    background-color: rgba(35, 35, 42, 0.9);
                    box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.15), 0 4px 16px rgba(0, 0, 0, 0.3);
                }
                .glass-input-select option {
                    background: #1c1c1e;
                    color: #f5f5f7;
                    padding: 10px;
                    font-size: 0.95rem;
                }
                .cost-tooltip-container:hover #costTooltip { display: block !important; }
                .bad-char { background-color: rgba(255, 69, 58, 0.4); border-radius: 4px; border-bottom: 2px solid var(--danger-color); }

                /* Apple-style Confirm Modal */
                @keyframes modalSlideIn {
                    from { opacity: 0; transform: scale(0.92) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes modalBackdropIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .apple-modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0, 0, 0, 0.55);
                    backdrop-filter: blur(20px) saturate(180%);
                    -webkit-backdrop-filter: blur(20px) saturate(180%);
                    z-index: 99999; display: flex; align-items: center; justify-content: center;
                    animation: modalBackdropIn 0.2s ease-out;
                }
                .apple-modal-card {
                    background: rgba(44, 44, 48, 0.92);
                    backdrop-filter: blur(40px) saturate(150%);
                    -webkit-backdrop-filter: blur(40px) saturate(150%);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 20px;
                    padding: 0;
                    width: 380px;
                    text-align: center;
                    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6), 0 0 0 0.5px rgba(255,255,255,0.08) inset;
                    animation: modalSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                    overflow: hidden;
                }
                .apple-modal-card .modal-body {
                    padding: 28px 28px 20px;
                }
                .apple-modal-card .modal-icon {
                    width: 56px; height: 56px; border-radius: 16px;
                    background: linear-gradient(135deg, rgba(10,132,255,0.25), rgba(94,92,230,0.25));
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 16px; font-size: 1.6rem;
                    box-shadow: 0 4px 16px rgba(10,132,255,0.15);
                    border: 1px solid rgba(10,132,255,0.2);
                }
                .apple-modal-card h3 {
                    font-size: 1.15rem; font-weight: 700; color: #f5f5f7;
                    letter-spacing: -0.02em; margin: 0 0 8px;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
                }
                .apple-modal-card .modal-desc {
                    font-size: 0.85rem; color: rgba(255,255,255,0.55);
                    line-height: 1.45; margin: 0 0 20px;
                }
                .apple-modal-card .modal-stats {
                    display: flex; gap: 1px; background: rgba(255,255,255,0.06);
                    border-radius: 12px; overflow: hidden; margin-bottom: 4px;
                }
                .apple-modal-card .modal-stat {
                    flex: 1; padding: 12px 8px;
                    background: rgba(0,0,0,0.2);
                    display: flex; flex-direction: column; align-items: center; gap: 4px;
                }
                .apple-modal-card .modal-stat .stat-value {
                    font-size: 1.1rem; font-weight: 700; color: #f5f5f7;
                }
                .apple-modal-card .modal-stat .stat-label {
                    font-size: 0.7rem; color: rgba(255,255,255,0.4);
                    text-transform: uppercase; letter-spacing: 0.04em; font-weight: 600;
                }
                .apple-modal-card .modal-actions {
                    display: flex; border-top: 1px solid rgba(255,255,255,0.08);
                }
                .apple-modal-card .modal-actions button {
                    flex: 1; padding: 16px; border: none; cursor: pointer;
                    font-size: 0.95rem; font-weight: 500;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
                    transition: all 0.15s ease;
                    background: transparent;
                }
                .apple-modal-card .modal-actions button:first-child {
                    color: rgba(255,255,255,0.6);
                    border-right: 1px solid rgba(255,255,255,0.08);
                }
                .apple-modal-card .modal-actions button:first-child:hover {
                    background: rgba(255,255,255,0.05);
                }
                .apple-modal-card .modal-actions button:last-child {
                    color: #0a84ff; font-weight: 600;
                }
                .apple-modal-card .modal-actions button:last-child:hover {
                    background: rgba(10, 132, 255, 0.1);
                }
                .apple-modal-card .modal-actions button:active {
                    transform: scale(0.97);
                }
                .modal-preview-box {
                    background: rgba(0, 0, 0, 0.25);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 12px;
                    margin: 16px 0;
                    text-align: left;
                    max-height: 120px;
                    overflow-y: auto;
                    font-size: 0.85rem;
                    line-height: 1.5;
                    color: rgba(255, 255, 255, 0.85);
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                .modal-preview-label {
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    color: rgba(255, 255, 255, 0.4);
                    font-weight: 700;
                    margin-bottom: 6px;
                    letter-spacing: 0.05em;
                }
                .btn-loading {
                    pointer-events: none;
                    opacity: 0.7;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spinner-icon {
                    animation: spin 1s linear infinite;
                    display: inline-block;
                }

                /* Apple-style Dropdown */
                .apple-dropdown-menu {
                    display:none; position:absolute; right:0; top:100%; margin-top:8px; 
                    background: rgba(45, 45, 50, 0.95); backdrop-filter:blur(30px) saturate(150%); -webkit-backdrop-filter:blur(30px) saturate(150%);
                    border:1px solid rgba(255,255,255,0.15); border-radius:14px; width:280px; z-index:100;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.1) inset;
                    overflow: hidden; animation: modalSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                    text-align: left;
                }
                .apple-dropdown-search-container {
                    padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.1);
                }
                .apple-dropdown-search {
                    width: 100%; padding: 8px 12px 8px 32px; background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; color: #fff; font-size: 0.85rem;
                    outline: none; transition: 0.2s; box-sizing: border-box;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'%3E%3C/line%3E%3C/svg%3E");
                    background-repeat: no-repeat; background-position: 10px center;
                }
                .apple-dropdown-search:focus {
                    background-color: rgba(255,255,255,0.12); border-color: rgba(10, 132, 255, 0.5);
                }
                .apple-dropdown-scroll {
                    max-height: 250px; overflow-y: auto; padding: 6px;
                }
                .apple-dropdown-scroll::-webkit-scrollbar { width: 6px; }
                .apple-dropdown-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
                .apple-dropdown-item {
                    padding: 10px; cursor: pointer; border-radius: 8px; transition: background 0.15s; margin-bottom: 2px;
                }
                .apple-dropdown-item:hover { background: rgba(255,255,255,0.1); }
            `;
            document.head.appendChild(style);
        }

        this.bindEvents();
    },

    addContactNumbers: async function(element, type, idOrPhone) {
        try {
            let numbersToAdd = [];
            const menu = document.getElementById('contactsDropdownMenu');
            
            if (type === 'contact') {
                numbersToAdd = [idOrPhone];
            } else if (type === 'group') {
                element.innerHTML = '<span style="font-size: 0.75rem; color: var(--text-muted);">Loading group...</span>';
                const contacts = await window.BrandSyncAPI.getContacts();
                numbersToAdd = contacts.filter(c => c.groupIds && c.groupIds.includes(Number(idOrPhone))).map(c => c.phone);
            }
            
            if (numbersToAdd.length > 0) {
                const recipientsArea = document.getElementById('recipientsArea');
                let existing = recipientsArea.value ? recipientsArea.value.split(',').map(s=>s.trim()).filter(Boolean) : [];
                recipientsArea.value = [...new Set([...existing, ...numbersToAdd])].join(', ');
                recipientsArea.dispatchEvent(new Event('input')); // Trigger metrics update
                window.showToast(`Added ${numbersToAdd.length} contact(s)`);
            } else {
                window.showToast('No contacts in this group', 'error');
            }
            
            if (menu) menu.style.display = 'none';
        } catch(e) {
            console.error(e);
            window.showToast('Error adding contacts', 'error');
        }
    },

    bindEvents() {
        const textInput = document.getElementById('messageArea');
        const charCount = document.getElementById('charCount');
        const segmentCount = document.getElementById('segmentCount');
        const creditCost = document.getElementById('creditCost');
        const encodingType = document.getElementById('encodingType');
        const previewText = document.getElementById('previewText');
        const senderId = document.getElementById('senderId');
        const previewSender = document.getElementById('previewSender');
        const sendBtn = document.getElementById('sendBtn');
        const recipientsArea = document.getElementById('recipientsArea');
        const scheduleToggleBtn = document.getElementById('scheduleToggleBtn');
        const scheduleTime = document.getElementById('scheduleTime');
        const btnSpintax = document.getElementById('btnSpintax');
        const gsmWarningBar = document.getElementById('gsmWarningBar');
        const btnIgnoreGsm = document.getElementById('btnIgnoreGsm');
        const btnFixGsm = document.getElementById('btnFixGsm');

        let userIgnoredGsmWarning = false;

        // Load Senders with Smart Session Caching
        const loadSenderIds = async () => {
            // Check session cache first for instant UI response
            if (window._cachedSenderIds && window._cachedSenderIds.length > 0) {
                renderSenderOptions(window._cachedSenderIds);
            }

            try {
                const ids = await window.BrandSyncAPI.getSenderIds();
                window._cachedSenderIds = ids; // Background sync the cache
                renderSenderOptions(ids);
            } catch (err) { 
                console.error("Sender load fail", err); 
                if (!window._cachedSenderIds) {
                    senderId.innerHTML = '<option value="PhilSMS">PhilSMS (Default)</option>';
                }
            }
        };

        const renderSenderOptions = (ids) => {
            const currentVal = senderId.value;
            senderId.innerHTML = '<option value="" disabled ' + (!currentVal ? 'selected' : '') + '>-- Select Sender ID --</option>';
            ids.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.id;
                opt.selected = (item.id === currentVal);
                opt.innerText = `${item.id} ${item.status === 'active' ? '(Active)' : '(Pending)'}`;
                senderId.appendChild(opt);
            });
        };

        loadSenderIds();

        const addFormattedNumbers = (rawNumbers) => {
            let valid = [];
            rawNumbers.forEach(n => {
                // Remove decimals if Excel exported as float (.0)
                let num = String(n).split('.')[0].replace(/[^\d]/g, '');
                
                // If it already starts with 639 and is the correct length, keep it
                if (num.startsWith('639') && num.length === 12) {
                    valid.push(num);
                    return;
                }

                if (num.startsWith('09') && num.length === 11) num = '63' + num.substring(1);
                else if (num.startsWith('9') && num.length === 10) num = '63' + num;
                
                if (/^639\d{9}$/.test(num)) valid.push(num);
            });
            let existing = recipientsArea.value ? recipientsArea.value.split(',').map(s=>s.trim()).filter(Boolean) : [];
            recipientsArea.value = [...new Set([...existing, ...valid])].join(', ');
            recipientsArea.dispatchEvent(new Event('input'));
        };

        // Fixed File Handler (Supports both CSV and Binary Excel)
        document.getElementById('btnAttachFile').onclick = () => document.getElementById('fileImportInput').click();
        document.getElementById('fileImportInput').onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            
            // Check if it's an Excel file or CSV
            const okExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');

            reader.onload = (event) => {
                let foundNumbers = [];

                if (okExcel) {
                    // Multi-Sheet Deep-Scan Engine (SheetJS)
                    const data = new Uint8Array(event.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // Iterate through ALL sheets in the workbook
                    workbook.SheetNames.forEach(sheetName => {
                        const worksheet = workbook.Sheets[sheetName];
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                        jsonData.forEach(row => {
                            if(!Array.isArray(row)) return;
                            row.forEach(cell => {
                                if (cell !== undefined && cell !== null) {
                                    // Robust extraction: remove spaces/dashes before regex
                                    let str = String(cell).trim().replace(/[\s\-]/g, '').split('.')[0]; 
                                    const matches = str.match(/(?:63|0)?9\d{9}/g);
                                    if (matches) foundNumbers = [...foundNumbers, ...matches];
                                }
                            });
                        });
                    });
                } else {
                    // Robust CSV / Text Parsing
                    const text = event.target.result;
                    // First scan for raw patterns
                    let matches = text.match(/(?:\+?63|0)?[\s\-]*9[\s\-]*\d[\s\-]*\d[\s\-]*\d[\s\-]*\d[\s\-]*\d[\s\-]*\d[\s\-]*\d[\s\-]*\d[\s\-]*/g);
                    if (matches) foundNumbers = matches;
                }

                if (foundNumbers.length > 0) {
                    addFormattedNumbers(foundNumbers);
                    window.showToast(`Imported ${new Set(foundNumbers).size} unique numbers from file.`);
                } else {
                    window.showToast("No valid phone numbers detected in file.", "error");
                }
                
                // Reset input so the same file can be selected again
                e.target.value = '';
            };

            if (okExcel) reader.readAsArrayBuffer(file);
            else reader.readAsText(file);
        };

        // Contacts Dropdown with Search
        document.getElementById('btnContactsDropdown').onclick = async (e) => {
            e.stopPropagation();
            const menu = document.getElementById('contactsDropdownMenu');
            if (menu.style.display === 'block') {
                menu.style.display = 'none';
                return;
            }
            menu.style.display = 'block';
            menu.innerHTML = '<div style="font-size:0.8rem; color:rgba(255,255,255,0.5); padding:20px; text-align:center;"><i class="icon-lucide-loader" style="animation: spin 1s linear infinite;"></i> Loading...</div>';
            
            try {
                const [groups, contacts] = await Promise.all([
                    window.BrandSyncAPI.getGroups(),
                    window.BrandSyncAPI.getContacts()
                ]);

                // Cache for fast local search
                window.SendSMSView._cachedGroups = groups;
                window.SendSMSView._cachedContacts = contacts;
                
                window.SendSMSView.renderContactDropdownItems();
                
            } catch (err) {
                menu.innerHTML = '<div style="font-size:0.8rem; color:var(--danger-color); padding:16px; text-align:center;">Error loading contacts.</div>';
            }
        };

        // Render helper for contact dropdown with search
        window.SendSMSView.renderContactDropdownItems = (searchTerm = '') => {
            const menu = document.getElementById('contactsDropdownMenu');
            if (!menu) return;
            
            const groups = window.SendSMSView._cachedGroups || [];
            const contacts = window.SendSMSView._cachedContacts || [];
            const term = searchTerm.toLowerCase();
            
            let html = `
                <div class="apple-dropdown-search-container">
                    <input type="text" id="contactSearchInput" class="apple-dropdown-search" placeholder="Search contacts or groups..." value="${searchTerm}" autocomplete="off">
                </div>
                <div class="apple-dropdown-scroll">
            `;
            
            let listHtml = '';
            
            // Filter Groups
            const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(term));
            if (filteredGroups.length > 0) {
                listHtml += `<div style="font-size: 0.65rem; text-transform: uppercase; color: rgba(255,255,255,0.4); font-weight: 700; padding: 8px 10px 4px; letter-spacing: 0.05em;">Groups</div>`;
                filteredGroups.forEach(g => {
                    const count = contacts.filter(c => c.groupIds && c.groupIds.includes(g.id)).length;
                    listHtml += `
                        <div class="apple-dropdown-item" style="display:flex; justify-content:space-between; align-items:center;" onclick="window.SendSMSView.addContactNumbers(this, 'group', ${g.id})">
                            <span style="font-size: 0.85rem; display:flex; align-items:center; gap: 8px; font-weight:500; color:#f5f5f7;">
                                <div style="width:12px; height:12px; border-radius:4px; background:${g.color}; box-shadow: 0 0 0 1px rgba(255,255,255,0.1)"></div> 
                                ${g.name}
                            </span>
                            <span style="font-size: 0.7rem; color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 10px; font-weight:600;">${count}</span>
                        </div>
                    `;
                });
            }
            
            // Filter Contacts
            const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(term) || c.phone.includes(term));
            if (filteredContacts.length > 0) {
                listHtml += `<div style="font-size: 0.65rem; text-transform: uppercase; color: rgba(255,255,255,0.4); font-weight: 700; padding: 12px 10px 4px; letter-spacing: 0.05em;">Individual Contacts</div>`;
                filteredContacts.forEach(c => {
                    listHtml += `
                        <div class="apple-dropdown-item" onclick="window.SendSMSView.addContactNumbers(this, 'contact', '${c.phone}')">
                            <div style="font-size: 0.85rem; font-weight: 600; color:#f5f5f7; margin-bottom:2px;">${c.name}</div>
                            <div style="font-size: 0.75rem; color: #0a84ff; font-family: monospace; opacity:0.9;">${c.phone}</div>
                        </div>
                    `;
                });
            }
            
            if (listHtml === '') listHtml = '<div style="font-size:0.8rem; color:rgba(255,255,255,0.4); padding:30px 10px; text-align:center;">No match found</div>';
            
            html += listHtml + `</div>`;
            menu.innerHTML = html;
            
            // Rebind search event & logic to retain focus
            const searchInput = document.getElementById('contactSearchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.setSelectionRange(searchTerm.length, searchTerm.length); // keep cursor at end
                searchInput.oninput = (e) => {
                    window.SendSMSView.renderContactDropdownItems(e.target.value);
                };
            }
        };

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const btn = document.getElementById('btnContactsDropdown');
            const menu = document.getElementById('contactsDropdownMenu');
            if (btn && menu && !btn.contains(e.target) && !menu.contains(e.target)) {
                menu.style.display = 'none';
            }
            
            const btnT = document.getElementById('btnTemplatesDropdown');
            const menuT = document.getElementById('templatesDropdownMenu');
            if (btnT && menuT && !btnT.contains(e.target) && !menuT.contains(e.target)) {
                menuT.style.display = 'none';
            }
        });

        // Templates Dropdown logic
        document.getElementById('btnTemplatesDropdown').onclick = async (e) => {
            e.stopPropagation();
            const menu = document.getElementById('templatesDropdownMenu');
            if (menu.style.display === 'block') {
                menu.style.display = 'none';
                return;
            }
            menu.style.display = 'block';
            menu.innerHTML = '<div style="font-size:0.8rem; color:rgba(255,255,255,0.5); padding:20px; text-align:center;"><i class="icon-lucide-loader" style="animation: spin 1s linear infinite;"></i> Loading...</div>';
            
            try {
                const templates = await window.BrandSyncAPI.getTemplates();
                menu.innerHTML = ''; // Clear loading
                
                if (templates.length > 0) {
                    templates.forEach(t => {
                        const item = document.createElement('div');
                        item.className = 'apple-dropdown-item';
                        item.style.display = 'flex';
                        item.style.flexDirection = 'column';
                        item.style.gap = '2px';
                        item.style.padding = '10px 12px';
                        
                        item.innerHTML = `
                            <span style="font-size: 0.85rem; font-weight: 600; color: ${t.color || '#0a84ff'};">${t.name}</span>
                            <span style="font-size: 0.75rem; color: rgba(255,255,255,0.5); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${t.content}</span>
                        `;
                        
                        item.onclick = (event) => {
                            event.stopPropagation();
                            window.SendSMSView.insertTemplate(item, t.content);
                        };
                        
                        menu.appendChild(item);
                    });
                } else {
                    menu.innerHTML = '<div style="font-size:0.75rem; color:var(--text-muted); padding:12px; text-align:center;">No templates found.</div>';
                }
            } catch (err) {
                console.error(err);
                menu.innerHTML = '<div style="font-size:0.75rem; color:var(--danger-color); padding:12px; text-align:center;">Error loading templates.</div>';
            }
        };

        // Inject helper for templates
        window.SendSMSView.insertTemplate = (el, content) => {
            const ta = document.getElementById('messageArea');
            ta.value = ta.value + (ta.value ? '\\n' : '') + content;
            ta.dispatchEvent(new Event('input'));
            document.getElementById('templatesDropdownMenu').style.display = 'none';
            window.showToast("Template inserted!");
        };

        // Auto Spintax logic
        document.getElementById('btnSpintax').onclick = () => {
            const ta = document.getElementById('messageArea');
            if (!ta.value) {
                ta.value = "{Hi|Hello|Hey} {there|friend|customer}, ";
                ta.dispatchEvent(new Event('input'));
                window.showToast("Spintax starter added!");
                return;
            }
            
            // Basic Auto-Spintax replacements
            let val = ta.value;
            val = val.replace(/\\b(Hi)\\b/gi, "{Hi|Hello|Hey}");
            val = val.replace(/\\b(Hello)\\b/gi, "{Hello|Hi|Greetings}");
            val = val.replace(/\\b(Offer)\\b/gi, "{Offer|Deal|Promo}");
            val = val.replace(/\\b(Buy)\\b/gi, "{Buy|Purchase|Get}");
            val = val.replace(/\\b(Thanks)\\b/gi, "{Thanks|Thank you|We appreciate you}");
            
            if (val !== ta.value) {
                ta.value = val;
                ta.dispatchEvent(new Event('input'));
                window.showToast("Auto-Spintax applied!");
            } else {
                window.showToast("No common words found to spin.", "info");
            }
        };

        // GSM Integrity Guardian
        const gsmRegex = /^[@£$¥èéùìòÇ\n\rΔ_ΦΓΛΩΠΨΣΘΞ !"#¤%&'()*+,\-./0-9:;<=>?¡A-ZÄÖÑÜ§¿a-zäöñüà€\{\}\[\]\|]*$/;
        const isGSM = (text) => gsmRegex.test(text);

        const updateMetrics = () => {
            const text = textInput.value;
            previewText.innerText = text || 'Your message preview will appear here.';
            
            // Highlight Non-GSM Characters in Backdrop
            let highlighted = '';
            for (let char of text) {
                if (!gsmRegex.test(char)) {
                    highlighted += `<span class="bad-char">${char === ' ' ? '&nbsp;' : char}</span>`;
                } else {
                    highlighted += char === '\n' ? '<br>' : (char === ' ' ? '&nbsp;' : char);
                }
            }
            document.getElementById('backdrop').innerHTML = highlighted + (text.endsWith('\n') ? '<br>' : '');

            const calc = window.calculateSMSLength(text);
            
            // Dynamic limit labels
            const limit = calc.segments > 1 
                ? (calc.encoding === 'GSM-7' ? 153 : 67) 
                : (calc.encoding === 'GSM-7' ? 160 : 70);
            
            charCount.innerText = `${calc.length}/${limit}`;
            segmentCount.innerText = calc.segments;
            encodingType.innerText = calc.encoding;
            
            const validRecipients = recipientsArea.value.split(',').map(r => r.trim()).filter(r => r.length >= 10);
            const totalCost = validRecipients.length * Math.max(1, calc.segments);
            creditCost.innerText = totalCost;
            document.getElementById('recipientCountBadge').innerText = validRecipients.length + ' Contacts';
            
            if(calc.encoding === 'UCS-2' && !userIgnoredGsmWarning) gsmWarningBar.style.display = 'flex';
            else gsmWarningBar.style.display = 'none';
        };

        textInput.oninput = updateMetrics;
        textInput.onscroll = () => {
            document.getElementById('backdrop').scrollTop = textInput.scrollTop;
        };

        btnIgnoreGsm.onclick = () => {
            userIgnoredGsmWarning = true;
            gsmWarningBar.style.display = 'none';
        };

        btnFixGsm.onclick = () => {
            let val = textInput.value;
            // Common replacements to salvage GSM segments
            val = val.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[—–]/g, '-').replace(/[…]/g, '...');
            
            // Strip any remaining non-GSM using a filter
            let filtered = '';
            for (let char of val) {
                if (gsmRegex.test(char)) filtered += char;
            }
            
            textInput.value = filtered;
            updateMetrics();
            window.showToast("Converted to standard GSM-7!");
        };

        recipientsArea.oninput = updateMetrics;
        senderId.onchange = () => previewSender.innerText = senderId.options[senderId.selectedIndex].text.split(' ')[0];

        scheduleToggleBtn.onclick = () => {
            if (scheduleTime.style.display === 'none') {
                scheduleTime.style.display = 'block';
                scheduleToggleBtn.querySelector('span').innerText = 'Cancel';
                sendBtn.innerHTML = '<i class="icon-lucide-calendar-check"></i> Schedule';
            } else {
                scheduleTime.style.display = 'none';
                scheduleToggleBtn.querySelector('span').innerText = 'Send Later';
                sendBtn.innerHTML = '<i class="icon-lucide-send"></i> Send Now';
            }
        };

        sendBtn.onclick = async () => {
            if(!senderId.value || !textInput.value || !recipientsArea.value) {
                window.showToast("Missing fields", 'error'); return;
            }
            const validRecipients = recipientsArea.value.split(',').map(r => r.trim()).filter(r => r.length >= 10);
            const calc = window.calculateSMSLength(textInput.value);
            const isSch = scheduleToggleBtn.querySelector('span').innerText === 'Cancel';
            const targetTime = isSch ? (scheduleTime.value ? new Date(scheduleTime.value) : new Date(Date.now() + 60000)) : null;
            if (isSch && !scheduleTime.value) scheduleTime.value = targetTime.toISOString().slice(0, 16);

            // Prevent multiple modals from overlapping
            const existingModal = document.getElementById('smsConfirmModal');
            if (existingModal) {
                if (existingModal._timer) clearInterval(existingModal._timer);
                existingModal.remove();
            }

            const totalCredits = validRecipients.length * calc.segments;
            
            let countdownHTML = '';
            if (isSch) {
                countdownHTML = `
                    <div style="margin: 16px 0; padding: 16px; background: rgba(10, 132, 255, 0.1); border: 1px dashed rgba(10, 132, 255, 0.3); border-radius: 14px; text-align: center;">
                        <div style="font-size: 0.65rem; text-transform: uppercase; color: #0a84ff; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 4px;">Scheduled For Delivery</div>
                        <div style="font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 8px;">${targetTime.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}</div>
                        <div id="modalCountdown" style="font-size: 1.2rem; font-weight: 800; color: #0a84ff; font-family: 'SF Mono', monospace;">--:--:--</div>
                    </div>
                `;
            }

            const modalHTML = `
                <div id="smsConfirmModal" class="apple-modal-overlay">
                    <div class="apple-modal-card" style="width: 440px;">
                        <div class="modal-body">
                            <div class="modal-icon">
                                <i class="${isSch ? 'icon-lucide-calendar-check' : 'icon-lucide-send'}" style="color: #0a84ff;"></i>
                            </div>
                            <h3>${isSch ? 'Confirm Schedule' : 'Review Message'}</h3>
                            <p class="modal-desc" style="margin-bottom: 12px;">Review your dispatch details before finalizing via <strong style="color:#0a84ff;">${senderId.value}</strong>.</p>
                            
                            ${countdownHTML}

                            <div class="modal-preview-label">Message Preview</div>
                            <div class="modal-preview-box">${textInput.value.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>

                            <div class="modal-stats">
                                <div class="modal-stat">
                                    <span class="stat-value" style="color:#0a84ff;">${validRecipients.length}</span>
                                    <span class="stat-label">Recipients</span>
                                </div>
                                <div class="modal-stat">
                                    <span class="stat-value" style="color:#bf5af2;">${calc.segments}</span>
                                    <span class="stat-label">Segments</span>
                                </div>
                                <div class="modal-stat">
                                    <span class="stat-value" style="color:#32d74b;">${totalCredits}</span>
                                    <span class="stat-label">Total Credits</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-actions">
                            <button id="cancelConfBtn">Cancel</button>
                            <button id="agreeConfBtn" style="min-width: 160px;">${isSch ? 'Confirm Schedule' : 'Send Now'}</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            const m = document.getElementById('smsConfirmModal');
            const cancelBtn = document.getElementById('cancelConfBtn');
            const confirmBtn = document.getElementById('agreeConfBtn');
            const countdownEl = document.getElementById('modalCountdown');
            
            // Countdown Timer Logic
            if (isSch && countdownEl) {
                const updateCountdown = () => {
                    const now = new Date();
                    const diff = targetTime - now;
                    if (diff <= 0) {
                        countdownEl.innerText = "00:00:00";
                        countdownEl.style.color = "#ff453a";
                        return;
                    }
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const secs = Math.floor((diff % (1000 * 60)) / 1000);
                    countdownEl.innerText = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
                };
                updateCountdown();
                m._timer = setInterval(updateCountdown, 1000);
            }

            cancelBtn.onclick = () => {
                if (m._timer) clearInterval(m._timer);
                m.remove();
            };
            
            let processing = false;
            confirmBtn.onclick = async () => {
                if(processing) return;
                processing = true;
                
                // Visual feedback
                confirmBtn.classList.add('btn-loading');
                confirmBtn.innerHTML = `<i class="icon-lucide-loader spinner-icon"></i> ${isSch ? 'Scheduling...' : 'Sending...'}`;
                cancelBtn.style.opacity = '0.5';
                cancelBtn.style.pointerEvents = 'none';
                
                try {
                    if (isSch) {
                        // LOCAL SCHEDULING: 
                        // Instead of calling the gateway immediately (which fires right away),
                        // we save to the local scheduler. The browser will fire it at the specific time.
                        await window.Scheduler.save({
                            message: textInput.value,
                            recipients: validRecipients,
                            senderId: senderId.value,
                            segments: calc.segments,
                            scheduleTime: scheduleTime.value,
                            remoteScheduled: false // Browser handles the timer
                        });
                        window.showToast("Message scheduled! Keep this tab open.", 'success');
                    } else {
                        // Immediate dispatch
                        await window.BrandSyncAPI.sendSMS({
                            message: textInput.value,
                            recipients: validRecipients,
                            senderId: senderId.value,
                            segments: calc.segments
                        });
                        window.showToast("Message sent successfully!", 'success');
                    }
                    
                    // Cleanup inputs only on success
                    textInput.value = ''; 
                    recipientsArea.value = ''; 
                    updateMetrics();
                    
                    if (m._timer) clearInterval(m._timer);
                    m.remove();
                } catch(e) { 
                    window.showToast("Error: " + (e.message || e), 'error');
                    // Re-enable on error
                    processing = false;
                    confirmBtn.classList.remove('btn-loading');
                    confirmBtn.innerHTML = isSch ? 'Confirm Schedule' : 'Send Now';
                    cancelBtn.style.opacity = '1';
                    cancelBtn.style.pointerEvents = 'auto';
                } finally { 
                    if(window.BrandSyncAPI.runHealth) window.BrandSyncAPI.runHealth(); 
                }
            };
        };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if(window.app) window.app.views['send-sms'] = () => window.SendSMSView.render(window.app.contentArea);
    }, 100);
});
