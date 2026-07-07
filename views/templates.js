// Templates View Component (Apple spatial UI edition)
window.TemplatesView = {
    activeFolderId: null,
    selectedColor: '#0a84ff',
    selectedIcon: 'Folder',

    FOLDER_ICONS: {
        'Folder': '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>',
        'Tag': '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>',
        'Layers': '<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>',
        'Zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>',
        'FileText': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>',
        'Star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>',
        'Award': '<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>',
        'Heart': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
        'Mail': '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1-2 2-2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>'
    },
    FOLDER_COLORS: ['#0a84ff', '#32d74b', '#5e5ce6', '#ff9f0a', '#ff375f', '#bf5af2', '#ff453a', '#64d2ff', '#ffd60a'],

    render(container) {
        container.innerHTML = `
            <div id="templatesRoot" class="view-container active fade-in" style="display: flex; flex-direction: column; gap: 24px; min-height: 100%; padding: 24px; background: transparent; overflow-y: auto; user-select: none;">
                
                <!-- Apple Spatial Identity Collections (Horizontal Spacing) -->
                <div style="display: flex; flex-direction: column; gap: 14px; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 0 4px;">
                        <div>
                            <h2 style="font-size: 1.5rem; font-weight: 800; color: #fff; letter-spacing: -0.04em;">Template Collections</h2>
                            <p style="color: rgba(255,255,255,0.45); font-size: 0.85rem; font-weight: 500;">Direct your communication streams into organized identities.</p>
                        </div>
                        <button onclick="window.TemplatesView.openFolderModal()" class="btn spatial-btn" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; padding: 8px 18px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; gap: 8px; backdrop-filter: blur(14px); font-size: 0.85rem; transition: 0.2s;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            New Identity
                        </button>
                    </div>
                    
                    <div id="foldersList" class="premium-carousel spatial-kinetic-scroll" style="display: flex; gap: 14px; overflow-x: auto; padding: 20px 4px 30px; -ms-overflow-style: none; scrollbar-width: none; min-height: 140px; cursor: grab; transition: transform 0.2s; perspective: 1200px;"></div>
                </div>

                <!-- Main Resources Dashboard (Glass Card Layout) -->
                <div class="glass-panel" style="flex: 1; border-radius: 32px; overflow: hidden; display: flex; flex-direction: column; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 30px 60px rgba(0,0,0,0.4);">
                    <div style="padding: 24px 32px; background: rgba(0,0,0,0.22); border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center; gap: 24px;">
                        <h2 id="viewTitle" style="font-size: 1.25rem; font-weight: 800; color: #fff; letter-spacing: -0.02em;">All Templates</h2>
                        
                        <div style="flex: 1; max-width: 520px; display: flex; gap:14px; align-items: center;">
                            <div style="flex: 1; position: relative;">
                                <svg style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.35);" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input type="text" id="templateSearch" placeholder="Filter identities..." style="width: 100%; height: 46px; background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 0 46px; color: #fff; font-size: 0.95rem; outline: none; transition: 0.3s; focus: border-color: var(--accent-color);" oninput="window.TemplatesView.loadTemplates()">
                            </div>
                        </div>

                        <button class="btn primary-btn" onclick="window.TemplatesView.openModal()" style="height: 46px; border-radius: 14px; padding: 0 24px; font-weight: 700; font-size: 0.9rem; box-shadow: 0 8px 16px rgba(10,132,255,0.2);">Create Resource</button>
                    </div>

                    <div id="templatesGrid" class="grid-3" style="padding: 32px; max-height: 65vh; overflow-y: auto; scroll-behavior: smooth;">
                        <!-- Templates Auto-Injected -->
                    </div>
                </div>

                <div id="templateModal" style="display:none; position:fixed; inset:0; z-index:30000; background:rgba(0,0,0,0.65); backdrop-filter:blur(50px) saturate(250%); align-items:center; justify-content:center; padding:20px;">
                    <div class="glass-panel spatial-modal" style="width:880px; border-radius:42px; border:1px solid rgba(255,255,255,0.18); background:rgba(30,30,35,0.8); position: relative; animation: springScale 0.45s cubic-bezier(0.1, 0.9, 0.2, 1.15); box-shadow: 0 50px 150px rgba(0,0,0,0.8); display: flex; flex-direction: column; overflow: hidden; max-height: 92vh;">
                        
                        <!-- Header with Progress/Visual Color Indicator -->
                        <div id="modalAccentBar" style="height: 6px; width: 100%; background: #0a84ff; transition: 0.4s;"></div>
                        
                        <div style="padding: 36px 40px 0; display:flex; justify-content: space-between; align-items: flex-start;">
                            <div>
                                <h3 id="templateModalTitle" style="font-size:1.75rem; font-weight:900; color:#fff; letter-spacing: -0.04em; margin-bottom: 4px;">Dynamic Resource</h3>
                                <p style="font-size:0.9rem; color:rgba(255,255,255,0.4); font-weight:500;">Craft a secure identity payload for transmission.</p>
                            </div>
                            <button onclick="window.TemplatesView.closeModal()" style="width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; color:#fff; border:1px solid rgba(255,255,255,0.12); font-size:1.4rem; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">&times;</button>
                        </div>
                        
                        <div style="padding: 32px 48px 40px; display:flex; flex-direction:column; gap:28px; overflow-y: auto;">
                            <input type="hidden" id="edit_templateId">
                            
                            <!-- Wide iOS Style Settings Grid -->
                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
                                <div style="grid-column: span 1;">
                                    <label style="display:block; font-size:0.75rem; color:rgba(255,255,255,0.35); text-transform:uppercase; font-weight:800; margin-bottom:12px; letter-spacing:0.04em; margin-left: 2px;">Primary Identifier</label>
                                    <input id="edit_templateName" type="text" placeholder="e.g. VIP Onboarding Alpha" style="width:100%; height:54px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:18px; padding:0 20px; color:#fff; font-size:1.1rem; outline:none; font-weight:700; transition: 0.2s;" onfocus="this.style.borderColor='#0a84ff'">
                                </div>

                                <div class="ios-control-group" style="grid-column: span 1; background:rgba(0,0,0,0.3); padding:18px; border-radius:24px; border:1px solid rgba(255,255,255,0.06);">
                                    <label style="display:block; font-size:0.65rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; margin-bottom:14px;">Collection Assignment</label>
                                    <select id="edit_templateFolder" style="width:100%; height:46px; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:0 14px; color:#fff; font-size:0.95rem; outline:none; cursor:pointer;"></select>
                                </div>
                            </div>
                            
                            <!-- Payload Editor -->
                            <div style="display:flex; flex-direction:column; gap:12px;">
                                <div style="display:flex; justify-content: space-between; align-items: center; padding: 0 4px;">
                                    <label style="font-size:0.75rem; color:rgba(255,255,255,0.35); text-transform:uppercase; font-weight:800; letter-spacing:0.04em;">Communication Payload</label>
                                    <div style="display: flex; gap: 10px;">
                                        <button class="pill-btn" onclick="window.TemplatesView.insertTag('{name}')" style="background:rgba(255,255,255,0.06); color:#fff; border-radius:10px; padding:4px 12px; font-size:0.75rem; font-weight:700; border:1px solid rgba(255,255,255,0.12); cursor:pointer;">{name}</button>
                                        <button class="pill-btn" onclick="window.TemplatesView.applySpintax()" style="background:rgba(255,159,10,0.12); color:#ff9f0a; border-radius:10px; padding:4px 12px; font-size:0.75rem; font-weight:700; border:1px solid rgba(255,159,10,0.25); cursor:pointer;">Auto Spintax</button>
                                    </div>
                                </div>

                                <div id="gsmWarningBar" style="display: none; justify-content: space-between; align-items: center; background: rgba(255, 159, 10, 0.15); border: 1px solid rgba(255, 159, 10, 0.3); border-radius: 16px; padding: 12px 18px; animation: slideDownSpring 0.4s ease;">
                                    <span style="font-size: 0.85rem; color: #ff9f0a; font-weight: 700; display:flex; align-items:center; gap:8px;">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                        Non-GSM Warning
                                    </span>
                                    <button onclick="window.TemplatesView.fixGsm()" class="btn" style="padding: 6px 14px; font-size: 0.8rem; background: #ff9f0a; color: #000; font-weight: 800; border-radius: 10px;">Scrub Encoding</button>
                                </div>

                                <div style="position: relative; min-height: 200px; background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.08); border-radius: 28px; overflow: hidden; transition: 0.3s;" id="textFocusWrapper">
                                    <div id="edit_backdrop" style="position: absolute; top:0; left:0; width: 100%; height: 100%; padding: 20px; font-family: inherit; font-size: 1.05rem; line-height: 1.6; color: transparent; pointer-events: none; white-space: pre-wrap; word-wrap: break-word; overflow-y: hidden; z-index: 1;"></div>
                                    <textarea id="edit_templateContent" placeholder="Construct your dynamic identity payload..." style="position: relative; z-index: 2; width:100%; height:200px; background:transparent; border:none; padding:20px; color:#fff; font-size:1.05rem; outline:none; font-family: inherit; resize: none; line-height: 1.6;"></textarea>
                                </div>
                            </div>

                            <!-- iOS Control Pill (Metric Center) -->
                            <div style="background: rgba(255,255,255,0.04); border-radius: 28px; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; padding: 20px 24px; justify-content: space-between; backdrop-filter: blur(10px);">
                                <div style="display:flex; gap: 32px;">
                                    <div class="metric-block" style="text-align:center;">
                                        <span class="metric-label">Chars</span>
                                        <span class="metric-value" id="charCount">0</span>
                                    </div>
                                    <div class="metric-block" style="text-align:center;">
                                        <span class="metric-label">Segments</span>
                                        <span class="metric-value" id="segmentCount" style="color: #32d74b;">1</span>
                                    </div>
                                    <div class="metric-block" style="text-align:center;">
                                        <span class="metric-label">Type</span>
                                        <span class="metric-value" id="encodingType" style="font-size: 0.9rem;">GSM-7</span>
                                    </div>
                                </div>
                                <div style="width: 2px; height: 36px; background: rgba(255,255,255,0.06);"></div>
                                <div style="text-align: right;">
                                    <span class="metric-label">Credit Impact</span>
                                    <span id="creditCost" style="font-size: 1.4rem; font-weight: 900; color: #fff; letter-spacing: -0.02em;">0.00</span>
                                </div>
                            </div>
                            
                            <div style="display:flex; gap:14px; margin-top: 8px;">
                                <button onclick="window.TemplatesView.closeModal()" style="flex:1; height:60px; background:rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius:24px; color:#fff; font-weight:700; font-size:1rem; transition: 0.2s;">Dismiss</button>
                                <button onclick="window.TemplatesView.saveTemplate()" style="flex:1.8; height:60px; background:var(--accent-color); border:none; border-radius:24px; color:#fff; font-weight:800; font-size:1.1rem; box-shadow: 0 14px 30px rgba(10,132,255,0.3); transition: 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">Commit Resource</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Collection Modal (iOS Style Bottom Sheet Inspired) -->
                <div id="folderModal" style="display:none; position:fixed; inset:0; z-index:35000; background:rgba(0,0,0,0.7); backdrop-filter:blur(40px) saturate(200%); align-items:center; justify-content:center; padding:20px;">
                    <div class="glass-panel spatial-modal" style="width:620px; padding:40px; border-radius:44px; border:1px solid rgba(255,255,255,0.18); background:rgba(35,35,40,0.85); position: relative; animation: springScale 0.45s cubic-bezier(0.1, 0.9, 0.2, 1.15); box-shadow: 0 40px 120px rgba(0,0,0,0.8); max-height: 90vh; overflow-y: auto;">
                        <button onclick="window.TemplatesView.closeFolderModal()" style="position: absolute; top: 24px; right: 24px; width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; color:#fff; font-size:1.3rem; border:1px solid rgba(255,255,255,0.12);">&times;</button>
                        <h3 id="folderModalTitle" style="font-size:1.6rem; font-weight:900; color:#fff; margin-bottom:32px; letter-spacing: -0.04em;">Initialize Collection</h3>
                        <input type="hidden" id="edit_folderId">
                        
                        <div style="display:flex; flex-direction:column; gap:32px;">
                            <div>
                                <label style="display:block; font-size:0.75rem; color:rgba(255,255,255,0.35); text-transform:uppercase; font-weight:800; margin-bottom:14px; letter-spacing:0.04em; margin-left: 2px;">Identity Label</label>
                                <input id="edit_folderName" type="text" placeholder="e.g. VIP Campaigns" style="width:100%; height:56px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.12); border-radius:20px; padding:0 22px; color:#fff; font-size:1.1rem; outline:none; font-weight:800; transition: 0.3s;">
                            </div>
                            <div class="ios-control-group" style="background:rgba(0,0,0,0.25); padding:24px; border-radius:32px; border:1px solid rgba(255,255,255,0.05);">
                                <label style="display:block; font-size:0.75rem; color:rgba(255,255,255,0.35); text-transform:uppercase; font-weight:800; margin-bottom:18px; letter-spacing:0.04em;">Aesthetic Blueprint</label>
                                <div id="folderColorPicker" style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:28px;"></div>
                                <label style="display:block; font-size:0.75rem; color:rgba(255,255,255,0.35); text-transform:uppercase; font-weight:800; margin-bottom:18px; letter-spacing:0.04em;">Symbol Glyph</label>
                                <div id="folderIconPicker" style="display:flex; flex-wrap:wrap; gap:10px; background:rgba(255,255,255,0.03); padding:16px; border-radius:24px; border:1px solid rgba(255,255,255,0.06);"></div>
                            </div>
                        </div>

                        <div style="display:flex; gap:16px; margin-top:40px;">
                            <button onclick="window.TemplatesView.closeFolderModal()" style="flex:1; height:60px; background:rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius:24px; color:#fff; font-weight:700; font-size:1rem;">Cancel</button>
                            <button onclick="window.TemplatesView.saveFolder()" style="flex:1.8; height:60px; background:var(--accent-color); border:none; border-radius:24px; color:#fff; font-weight:800; font-size:1.1rem; box-shadow: 0 14px 30px rgba(10,132,255,0.3);">Secure Identity</button>
                        </div>
                    </div>
                </div>

            </div>
        `;

        // Portal Modals
        const tModal = document.getElementById('templateModal');
        const fModal = document.getElementById('folderModal');
        if(tModal) document.body.appendChild(tModal);
        if(fModal) document.body.appendChild(fModal);

        this._renderPickers();
        this.loadFolders();
        this.loadTemplates();
        
        if(!document.getElementById('template-spatial-v2-css')) {
            const st = document.createElement('style');
            st.id = 'template-spatial-v2-css';
            st.innerHTML = `
                @keyframes springScale {
                    0% { opacity: 0; transform: scale(0.9) translateY(20px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes slideDownSpring {
                    0% { transform: translateY(-20px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                .glass-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px rgba(0,0,0,0.35); }
                .glass-card:active { transform: scale(0.96); }
                .spatial-btn:hover { background: rgba(255,255,255,0.12) !important; transform: translateY(-1px); }
                .spatial-btn:active { transform: translateY(1px) scale(0.98); }
                .metric-label { font-size: 0.65rem; color: rgba(255,255,255,0.4); display:block; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 2px; }
                .metric-value { font-size: 1.25rem; font-weight: 900; color: #fff; letter-spacing: -0.01em; }
                #edit_templateContent::placeholder { color: rgba(255,255,255,0.15); }
                #edit_templateName:focus { background: rgba(0,0,0,0.55) !important; border-color: var(--accent-color) !important; box-shadow: 0 0 15px rgba(10,132,255,0.2); }
                #edit_templateFolder:focus { border-color: var(--accent-color) !important; }
                select option { background: #1c1c1e; color: #fff; padding: 12px; }
                .bad-char { background: rgba(255, 69, 58, 0.4); border-radius: 4px; box-shadow: 0 0 10px rgba(255, 69, 58, 0.3); border: 1px solid rgba(255,69,58,0.5); }
                .premium-carousel::-webkit-scrollbar { display: none; }
                .pill-btn:hover { background: rgba(255,255,255,0.15) !important; border-color: rgba(255,255,255,0.25) !important; }
                .pill-btn:active { transform: scale(0.94); }
            `;
            document.head.appendChild(st);
        }

        this.bindModalEvents();
        setTimeout(() => this._initUltraSpatialScroll(), 200);
    },

    bindModalEvents() {
        const textInp = document.getElementById('edit_templateContent');
        const backdrop = document.getElementById('edit_backdrop');
        const wrapper = document.getElementById('textFocusWrapper');
        if(!textInp) return;

        textInp.onfocus = () => { wrapper.style.borderColor = window.TemplatesView.selectedColor; wrapper.style.background = 'rgba(0,0,0,0.55)'; };
        textInp.onblur = () => { wrapper.style.borderColor = 'rgba(255,255,255,0.08)'; wrapper.style.background = 'rgba(0,0,0,0.45)'; };

        const isCharGSM = (c) => /^[@£$¥èéùìòÇ\n\rΔ_ΦΓΛΩΠΨΣΘΞ !"#¤%&'()*+,\-./0-9:;<=>?¡A-ZÄÖÑÜ§¿a-zäöñüà€\{\}\[\]\|]*$/.test(c);

        const updateMetrics = () => {
             const text = textInp.value;
             if(backdrop) {
                 let html = '';
                 for(let i=0; i<text.length; i++) {
                     if(text[i] === '\n') html += '\n';
                     else if(isCharGSM(text[i])) html += text[i];
                     else html += `<mark class="bad-char">${text[i]}</mark>`;
                 }
                 if(text.endsWith('\n')) html += ' ';
                 backdrop.innerHTML = html;
             }
             const calc = window.calculateSMSLength(text);
             document.getElementById('charCount').innerText = calc.length;
             document.getElementById('segmentCount').innerText = calc.segments;
             document.getElementById('encodingType').innerText = calc.encoding;
             document.getElementById('creditCost').innerText = calc.segments.toFixed(2);
             const warning = document.getElementById('gsmWarningBar');
             if(calc.encoding === 'UCS-2' && text.length > 0) {
                 warning.style.display = 'flex';
                 document.getElementById('encodingType').style.color = '#ff9f0a';
             } else {
                 warning.style.display = 'none';
                 document.getElementById('encodingType').style.color = '#fff';
             }
        };

        textInp.addEventListener('input', updateMetrics);
        textInp.addEventListener('scroll', () => {
             backdrop.scrollTop = textInp.scrollTop;
             backdrop.scrollLeft = textInp.scrollLeft;
        });
        
        window.TemplatesView.fixGsm = () => {
            let msg = textInp.value;
            const map = { '“': '"', '”': '"', "‘": "'", "’": "'", '`': "'", '´': "'", '–': '-', '—': '-', '…': '...', '«': '"', '»': '"', '™': 'TM', '©': '(c)', '®': '(r)' };
            let replaced = '';
            for(let i=0; i<msg.length; i++) {
                let c = msg[i]; replaced += map[c] || (isCharGSM(c) ? c : c);
            }
            textInp.value = replaced; updateMetrics(); window.showToast("Encoding logic scrubbed.", "info");
        };
    },

    _renderPickers() {
        const cp = document.getElementById('folderColorPicker'); 
        const ip = document.getElementById('folderIconPicker');
        if(!cp || !ip) return;
        
        cp.innerHTML = this.FOLDER_COLORS.map(c => `<div onclick="window.TemplatesView.selectColor('${c}')" class="color-dot" style="width:34px; height:34px; border-radius:50%; background:${c}; cursor:pointer; border:4px solid ${c.toLowerCase() === this.selectedColor.toLowerCase() ? 'rgba(255,255,255,0.8)' : 'transparent'}; transition:0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.2);" data-color="${c}"></div>`).join('');
        
        ip.innerHTML = Object.keys(this.FOLDER_ICONS).map(name => {
            const isActive = name === this.selectedIcon;
            return `<div onclick="window.TemplatesView.selectIcon('${name}')" class="icon-dot-t" style="width:48px; height:48px; border-radius:16px; display:flex; align-items:center; justify-content:center; background:${isActive ? this.selectedColor+'33' : 'rgba(255,255,255,0.05)'}; color:${isActive ? this.selectedColor : 'rgba(255,255,255,0.3)'}; cursor:pointer; transition:0.3s; border:1px solid ${isActive ? this.selectedColor+'88' : 'rgba(255,255,255,0.08)'};" data-icon="${name}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${this.FOLDER_ICONS[name]}</svg></div>`;
        }).join('');
    },

    selectColor(c) { this.selectedColor = c; this._renderPickers(); },
    selectIcon(name) { this.selectedIcon = name; this._renderPickers(); },

    async loadFolders() {
        const slider = document.getElementById('foldersList'); if (!slider) return;
        const folders = await window.BrandSyncAPI.getTemplateFolders();
        const templates = await window.BrandSyncAPI.getTemplates();
        const counts = folders.reduce((acc, f) => { acc[f.id] = templates.filter(t => t.folderId == f.id).length; return acc; }, {});

        let html = `<div onclick="window.TemplatesView.setFolder(null)" class="glass-card pool-card ${this.activeFolderId === null ? 'active' : ''}" style="flex: 0 0 160px; height: 120px; padding: 22px; border-radius: 28px; background: ${this.activeFolderId === null ? 'rgba(10,132,255,0.22)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${this.activeFolderId === null ? 'rgba(10,132,255,0.4)' : 'rgba(255,255,255,0.12)'}; backdrop-filter: blur(20px); cursor: pointer; transition: 0.3s; display:flex; flex-direction:column; justify-content: space-between; scroll-snap-align: center;">
            <div style="display:flex; justify-content: space-between; align-items: flex-start;">
                <div style="width: 42px; height: 42px; border-radius: 14px; background: rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; color: #fff;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${this.FOLDER_ICONS['Layers']}</svg></div>
            </div>
            <div><h4 style="font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 2px;">All Templates</h4><p style="font-size: 0.7rem; color: rgba(255,255,255,0.4); font-weight:700; text-transform:uppercase; letter-spacing:0.02em;">${templates.length} Identities</p></div></div>`;

        folders.forEach(f => {
            const isActive = String(this.activeFolderId) === String(f.id);
            const color = f.color || '#0a84ff';
            const iconSvg = this.FOLDER_ICONS[f.icon || 'Folder'];
            
            html += `<div onclick="window.TemplatesView.setFolder(${f.id})" class="glass-card group-card ${isActive ? 'active' : ''}" style="flex: 0 0 160px; height: 120px; padding: 22px; border-radius: 28px; background: ${isActive ? color+'2a' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${isActive ? color+'77' : 'rgba(255,255,255,0.12)'}; backdrop-filter: blur(20px); cursor: pointer; transition: 0.3s; display:flex; flex-direction:column; justify-content: space-between; scroll-snap-align: center;">
                <div style="display:flex; justify-content: space-between; align-items: flex-start;">
                    <div style="width: 42px; height: 42px; border-radius: 14px; background: ${color+'22'}; display:flex; align-items:center; justify-content:center; color: ${color};"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${iconSvg}</svg></div>
                    <div class="card-ops" style="display:flex; gap: 8px; transition: 0.2s;">
                        <button onclick="event.stopPropagation(); window.TemplatesView.openFolderModal(${JSON.stringify(f).replace(/"/g, '&quot;')})" style="background:none; border:none; padding:0; cursor:pointer; color:#fff; opacity:0.8; transition:0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path></svg></button>
                        <button onclick="event.stopPropagation(); window.TemplatesView.deleteFolder(${f.id}, '${f.name.replace(/'/g, "\\'")}')" style="background:none; border:none; padding:0; cursor:pointer; color:#ff453a; opacity:0.8; transition:0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6L19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path></svg></button>
                    </div>
                </div>
                <div>
                    <h4 style="font-size: 1rem; font-weight: 800; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;">${f.name}</h4>
                    <p style="font-size: 0.7rem; color: rgba(255,255,255,0.4); font-weight:700; text-transform:uppercase; letter-spacing:0.02em;">${counts[f.id] || 0} Identities</p>
                </div>
            </div>`;
        });
        slider.innerHTML = html;

        const folderSelect = document.getElementById('edit_templateFolder');
        if(folderSelect) folderSelect.innerHTML = '<option value="">Ungrouped</option>' + folders.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
    },

    setFolder(id) {
        this.activeFolderId = id; this.loadFolders(); this.loadTemplates();
        const title = document.getElementById('viewTitle');
        if(title) {
            if(id === null) title.innerText = "All Templates";
            else { window.BrandSyncAPI.getTemplateFolders().then(fs => { const f = fs.find(x => String(x.id) === String(id)); title.innerText = f ? f.name : "Identities"; }); }
        }
    },

    async loadTemplates() {
        const grid = document.getElementById('templatesGrid'); const search = (document.getElementById('templateSearch')?.value || '').toLowerCase(); if(!grid) return;
        try {
            let templates = await window.BrandSyncAPI.getTemplates();
            const folders = await window.BrandSyncAPI.getTemplateFolders();
            if(this.activeFolderId !== null) templates = templates.filter(t => String(t.folderId) === String(this.activeFolderId));
            if(search) templates = templates.filter(t => t.name.toLowerCase().includes(search) || t.content.toLowerCase().includes(search));

            if(templates.length === 0) { grid.innerHTML = `<div style="grid-column: span 3; padding: 80px; text-align: center; color: rgba(255,255,255,0.15); font-size:1.1rem; font-weight:700;">No Resources Found.</div>`; return; }

            grid.innerHTML = templates.map((t, idx) => {
                const folder = folders.find(f => String(f.id) === String(t.folderId));
                // STRATEGY: Folder color takes precedence for strict visual grouping
                const color = folder ? folder.color : (t.color || '#0a84ff');
                const rank = String(idx + 1).padStart(2, '0');
                return `
                    <div class="card glass-panel glass-card" style="display:flex; flex-direction:column; padding:28px; border-radius:32px; border-top: 5px solid ${color}; transition:0.35s; position: relative; background:rgba(255,255,255,0.02);">
                        <div style="display:flex; justify-content: space-between; align-items: center; margin-bottom:20px;">
                            <span style="font-size:0.65rem; font-weight:900; color:${color}; text-transform:uppercase; background:${color}15; padding:5px 10px; border-radius:8px; letter-spacing:0.04em; border:1px solid ${color}33;">${folder ? folder.name : 'UNGROUPED'}</span>
                            <div style="display:flex; gap:10px;">
                                <button class="btn icon-btn" onclick="window.TemplatesView.openModal(${JSON.stringify(t).replace(/"/g, '&quot;')})" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:10px; width:34px; height:34px; color:#fff; display:flex; align-items:center; justify-content:center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path></svg></button>
                                <button class="btn icon-btn" style="color:#ff453a; background:rgba(255,69,58,0.1); border:1px solid rgba(255,69,58,0.2); border-radius:10px; width:34px; height:34px; display:flex; align-items:center; justify-content:center;" onclick="window.TemplatesView.deleteTemplate('${t.id}', '${t.name.replace(/'/g, "\\'")}')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6L19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path></svg></button>
                            </div>
                        </div>
                        <h3 style="font-size:1.2rem; font-weight:900; color:#fff; margin:0 0 12px; letter-spacing:-0.02em;">${t.name}</h3>
                        <p style="font-size:0.9rem; color:rgba(255,255,255,0.45); line-height:1.6; flex:1; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; margin-bottom:24px;">${t.content}</p>
                        <div style="border-top:1px solid rgba(255,255,255,0.06); padding-top:18px; display:flex; justify-content: space-between; align-items: center;">
                            <span style="font-size:0.75rem; color:rgba(255,255,255,0.3); font-weight:800; text-transform:uppercase; letter-spacing:0.04em;">Credits: ${window.calculateSMSLength(t.content).segments}.00</span>
                            <div style="display:flex; align-items:center; gap:12px;">
                                <button class="btn spatial-btn" style="padding: 6px 14px; font-size: 0.75rem; background: rgba(10,132,255,0.1); color:#0a84ff; font-weight:800; border-radius:10px; border:1px solid rgba(10,132,255,0.2);" onclick="window.TemplatesView.copyToClipboard('${t.content.replace(/'/g, "\\'")}')">Capture</button>
                                <span style="font-size: 0.85rem; font-weight: 900; color: rgba(255,255,255,0.08); font-family: monospace; letter-spacing: 1px;">#${rank}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (e) { grid.innerHTML = `<div style="padding:60px; text-align:center; color:#ff453a;">Engine Data Failure.</div>`; }
    },

    _initUltraSpatialScroll() {
        const slider = document.getElementById('foldersList'); if (!slider) return;
        let isDown = false, startX, scrollLeft, velocity = 0, lastX = 0, momentumID;
        const cleanup = () => { isDown = false; slider.style.cursor = 'grab'; cancelAnimationFrame(momentumID); momentum(); };
        const momentum = () => { if (Math.abs(velocity) < 0.1) return; slider.scrollLeft -= velocity; velocity *= 0.94; if (!isDown) momentumID = requestAnimationFrame(momentum); };
        slider.addEventListener('mousedown', (e) => { isDown = true; slider.style.cursor = 'grabbing'; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; cancelAnimationFrame(momentumID); velocity = 0; });
        slider.addEventListener('mousemove', (e) => { if (!isDown) return; const x = e.pageX - slider.offsetLeft; const walk = (x - startX) * 1.5; velocity = x - lastX; lastX = x; slider.scrollLeft = scrollLeft - walk; });
        window.addEventListener('mouseup', () => { if(isDown) cleanup(); }); slider.addEventListener('mouseleave', () => { if(isDown) cleanup(); });
    },

    openModal(template = null) {
        const modal = document.getElementById('templateModal');
        const nameInp = document.getElementById('edit_templateName');
        const contentInp = document.getElementById('edit_templateContent');
        const folderInp = document.getElementById('edit_templateFolder');
        
        // Dynamic Sync Helper (Inherits from Collection)
        const syncColor = async (fid) => {
            let color = '#0a84ff';
            if(fid) {
                const fs = await window.BrandSyncAPI.getTemplateFolders();
                const f = fs.find(x => String(x.id) === String(fid));
                if(f && f.color) color = f.color;
            }
            document.getElementById('modalAccentBar').style.background = color;
            this.selectedColor = color;
            // Update focus color variable globally for this instance
            const nameInp = document.getElementById('edit_templateName');
            const folderInp = document.getElementById('edit_templateFolder');
            if(nameInp) nameInp.onfocus = () => { 
                nameInp.style.borderColor = color; 
                nameInp.style.background = 'rgba(0,0,0,0.55)';
                nameInp.style.boxShadow = `0 0 15px ${color}33`;
            };
            if(folderInp) folderInp.style.borderColor = fid ? color+'44' : 'rgba(255,255,255,0.1)';
        };

        if(template) {
            document.getElementById('templateModalTitle').innerText = "Update Resource";
            document.getElementById('edit_templateId').value = template.id; nameInp.value = template.name; contentInp.value = template.content;
            folderInp.value = template.folderId || ""; 
            if(template.folderId) syncColor(template.folderId);
        } else {
            document.getElementById('templateModalTitle').innerText = "New Identity Payload";
            document.getElementById('edit_templateId').value = ""; nameInp.value = ""; contentInp.value = "";
            folderInp.value = this.activeFolderId || ""; 
            if(this.activeFolderId) syncColor(this.activeFolderId);
        }

        folderInp.onchange = (e) => syncColor(e.target.value);
        modal.style.display = 'flex';
        document.querySelector('.view-container').style.filter = 'blur(30px) saturate(220%) scale(0.98)';
        contentInp.dispatchEvent(new Event('input')); 
    },

    closeModal() { document.getElementById('templateModal').style.display = 'none'; document.querySelector('.view-container').style.filter = ''; },

    insertTag(tag) { const txt = document.getElementById('edit_templateContent'); const start = txt.selectionStart; txt.value = txt.value.substring(0, start) + tag + txt.value.substring(txt.selectionEnd); txt.focus(); txt.dispatchEvent(new Event('input')); },

    applySpintax() {
        const txt = document.getElementById('edit_templateContent'); if(!txt) return;
        let msg = txt.value || "Payload segment {name}";
        msg = msg.replace(/hello|hi|hey/gi, '{Hello|Hi|Hey}'); msg = msg.replace(/check out|buy|get/gi, '{check out|review|see}');
        txt.value = msg; txt.dispatchEvent(new Event('input')); window.showToast("Apple-standard logic applied.", "success");
    },

    async saveTemplate() {
        const id = document.getElementById('edit_templateId').value; const name = document.getElementById('edit_templateName').value.trim(); const content = document.getElementById('edit_templateContent').value.trim(); const folderId = document.getElementById('edit_templateFolder').value;
        if(!name || !content) { window.showToast("Incomplete Identity Specifications.", "warning"); return; }
        await window.BrandSyncAPI.saveTemplate({ id: id || null, name, content, folderId });
        window.showToast("Resource Optimized & Committed.", "success"); this.closeModal(); this.loadTemplates(); this.loadFolders();
    },

    openFolderModal(folder = null) {
        const modal = document.getElementById('folderModal');
        if(folder) {
            document.getElementById('folderModalTitle').innerText = "Modify Collection";
            document.getElementById('edit_folderId').value = folder.id; document.getElementById('edit_folderName').value = folder.name;
            this.selectColor(folder.color || '#0a84ff'); this.selectIcon(folder.icon || 'Folder');
        } else {
            document.getElementById('folderModalTitle').innerText = "New Identity Collection";
            document.getElementById('edit_folderId').value = ""; document.getElementById('edit_folderName').value = "";
            this.selectColor('#0a84ff'); this.selectIcon('Folder');
        }
        modal.style.display = 'flex';
        document.querySelector('.view-container').style.filter = 'blur(30px) saturate(220%) scale(0.98)';
    },

    closeFolderModal() { document.getElementById('folderModal').style.display = 'none'; document.querySelector('.view-container').style.filter = ''; },

    async saveFolder() {
        const id = document.getElementById('edit_folderId').value; const name = document.getElementById('edit_folderName').value.trim();
        if(!name) { window.showToast("Resource Identifier required.", "warning"); return; }
        await window.BrandSyncAPI.saveTemplateFolder({ id: id || null, name, color: this.selectedColor, icon: this.selectedIcon });
        window.showToast("Identity Collection Secured.", "success"); this.closeFolderModal(); this.loadFolders();
    },

    deleteTemplate(id, title) {
        window.BrandSyncAppInstance.confirmAction("Purge Resource?", `Permanently terminate "${title}"?`, "#ff453a", async () => {
            await window.BrandSyncAPI.deleteTemplate(id); window.showToast("Terminated.", "success"); this.loadTemplates(); this.loadFolders();
        });
    },

    deleteFolder(id, title) {
        window.BrandSyncAppInstance.confirmAction("Purge Collection?", `Dissolve identity pool "${title}"?`, "#ff453a", async () => {
            await window.BrandSyncAPI.deleteTemplateFolder(id); window.showToast("Dissolved.", "success");
            if(String(this.activeFolderId) === String(id)) this.activeFolderId = null;
            this.loadFolders(); this.loadTemplates();
        });
    },

    copyToClipboard(text) { navigator.clipboard.writeText(text).then(() => window.showToast("Captured.", "success")); }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { if(window.app) window.app.views['templates'] = () => window.TemplatesView.render(window.app.contentArea); }, 100);
});
