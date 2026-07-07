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
                                    <div id="contactsDropdownMenu" style="display:none; position:absolute; right:0; top:100%; margin-top:8px; background: rgba(45, 45, 50, 0.95); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:8px; width:240px; z-index:100; max-height:280px; overflow-y:auto; text-align: left; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
                                        <div style="font-size:0.75rem; color:var(--text-muted); padding:4px;">Loading contacts...</div>
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
                    background-color: var(--surface-glass);
                    border: 1px solid var(--border-glass);
                    color: var(--text-primary);
                    padding: 10px 14px;
                    border-radius: var(--radius-md);
                    outline: none;
                    transition: var(--transition);
                }
                .glass-input-select:focus, .glass-input-textarea:focus { border-color: var(--accent-color); background: var(--surface-glass-hover); }
                .cost-tooltip-container:hover #costTooltip { display: block !important; }
                .bad-char { background-color: rgba(255, 69, 58, 0.4); border-radius: 4px; border-bottom: 2px solid var(--danger-color); }
            `;
            document.head.appendChild(style);
        }

        this.bindEvents();
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

        // Load Senders
        const loadSenderIds = async () => {
            try {
                const ids = await window.BrandSyncAPI.getSenderIds();
                senderId.innerHTML = '<option value="" disabled selected>-- Select Sender ID --</option>';
                ids.forEach(item => {
                    const opt = document.createElement('option');
                    opt.value = item.id;
                    opt.innerText = `${item.id} ${item.status === 'active' ? '(Active)' : '(Pending)'}`;
                    senderId.appendChild(opt);
                });
            } catch (err) { console.error("Sender load fail", err); }
        };
        loadSenderIds();

        const addFormattedNumbers = (rawNumbers) => {
            let valid = [];
            rawNumbers.forEach(n => {
                let num = String(n).replace(/[^\d]/g, '');
                if (num.startsWith('09') && num.length === 11) num = '63' + num.substring(1);
                else if (num.startsWith('9') && num.length === 10) num = '63' + num;
                if (/^639\d{9}$/.test(num)) valid.push(num);
            });
            let existing = recipientsArea.value ? recipientsArea.value.split(',').map(s=>s.trim()).filter(Boolean) : [];
            recipientsArea.value = [...new Set([...existing, ...valid])].join(', ');
            recipientsArea.dispatchEvent(new Event('input'));
        };

        // File Handler
        document.getElementById('btnAttachFile').onclick = () => document.getElementById('fileImportInput').click();
        document.getElementById('fileImportInput').onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const matches = text.match(/(?:\+?63|0)?[\s\-]*9[\s\-]*\d[\s\-]*\d[\s\-]*\d[\s\-]*\d[\s\-]*\d[\s\-]*\d[\s\-]*\d[\s\-]*\d[\s\-]*/g);
                if (matches) addFormattedNumbers(matches);
            };
            reader.readAsText(file);
        };

        // Contacts Dropdown
        document.getElementById('btnContactsDropdown').onclick = () => {
            const menu = document.getElementById('contactsDropdownMenu');
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        };

        // GSM Check
        const isCharGSM = (c) => /^[@£$¥èéùìòÇ\n\rΔ_ΦΓΛΩΠΨΣΘΞ !"#¤%&'()*+,\-./0-9:;<=>?¡A-ZÄÖÑÜ§¿a-zäöñüà€\{\}\[\]\|]*$/.test(c);

        const updateMetrics = () => {
            const text = textInput.value;
            previewText.innerText = text || 'Your message preview will appear here.';
            const calc = window.calculateSMSLength(text);
            charCount.innerText = calc.length;
            segmentCount.innerText = calc.segments;
            encodingType.innerText = calc.encoding;
            const validRecipients = recipientsArea.value.split(',').map(r => r.trim()).filter(r => r.length >= 10);
            const totalCost = validRecipients.length * calc.segments;
            creditCost.innerText = totalCost;
            document.getElementById('recipientCountBadge').innerText = validRecipients.length + ' Contacts';
            
            if(calc.encoding === 'UCS-2' && !userIgnoredGsmWarning) gsmWarningBar.style.display = 'flex';
            else gsmWarningBar.style.display = 'none';
        };

        textInput.oninput = updateMetrics;
        recipientsArea.oninput = updateMetrics;
        senderId.onchange = () => previewSender.innerText = senderId.value;

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
            const isSch = scheduleTime.style.display !== 'none' && scheduleTime.value;

            const modalHTML = `
                <div id="confirmModal" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 9999; display:flex; align-items:center; justify-content:center;">
                    <div style="background: var(--surface-glass); border: 1px solid var(--border-glass); border-radius: 16px; padding: 24px; width: 400px; text-align:center;">
                        <h3>Confirm Dispatch</h3>
                        <p style="margin: 20px 0;">Send to ${validRecipients.length} recipients?</p>
                        <div style="display:flex; justify-content:center; gap: 12px;">
                            <button id="cancelConfBtn" class="btn">Cancel</button>
                            <button id="agreeConfBtn" class="btn primary-btn">Yes, Dispatch</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            const m = document.getElementById('confirmModal');
            document.getElementById('cancelConfBtn').onclick = () => m.remove();
            
            let processing = false;
            document.getElementById('agreeConfBtn').onclick = async () => {
                if(processing) return;
                processing = true;
                document.getElementById('agreeConfBtn').disabled = true;
                
                try {
                    if (isSch) {
                        window.Scheduler.save({
                            message: textInput.value,
                            recipients: validRecipients,
                            senderId: senderId.value,
                            segments: calc.segments,
                            scheduleTime: scheduleTime.value
                        });
                        window.showToast("Scheduled!", 'success');
                    } else {
                        const res = await window.BrandSyncAPI.sendSMS({
                            message: textInput.value,
                            recipients: validRecipients,
                            senderId: senderId.value,
                            segments: calc.segments
                        });
                        window.showToast("Sent!", 'success');
                    }
                    textInput.value = ''; recipientsArea.value = ''; updateMetrics();
                } catch(e) { window.showToast("Error: " + e, 'error'); }
                finally { m.remove(); if(window.BrandSyncAPI.runHealth) window.BrandSyncAPI.runHealth(); }
            };
        };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if(window.app) window.app.views['send-sms'] = () => window.SendSMSView.render(window.app.contentArea);
    }, 100);
});
