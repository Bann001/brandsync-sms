// BrandSync AI Super-Agent Assistant
window.BrandSyncChatbot = {
    isOpen: false,
    lang: 'en',
    lastContext: '',
    
    // Core Centralized Knowledge Base (Structured & Numbered)
    KNOWLEDGE_BASE: {
        'contact': {
            en: `To manage or add a contact, follow these steps:<br><br>
                 1. Navigate to the <b>Contacts Module</b> on the left.<br>
                 2. To manually add a single person, click <b>Add Contact</b>.<br>
                 3. Fill in the data fields (Name, Phone, etc).<br>
                 4. Click <b>Save</b> to confirm.<br><br>
                 <i>Note: If you have a bulk list, click 'Heavy Import' instead.</i>`,
            tl: `Para mag-add ng contact, sundin ito:<br><br>
                 1. Pumunta sa <b>Contacts Module</b> sa kaliwa.<br>
                 2. I-click ang <b>Add Contact</b>.<br>
                 3. Ilagay ang detalye (Pangalan, Numero).<br>
                 4. I-click ang <b>Save</b>.<br><br>
                 <i>Note: Kapag marami, gamitin ang 'Heavy Import'.</i>`,
            actionName: "Guide me (Add Contact)",
            actionId: "add_contact"
        },
        'send': {
            en: `To dispatch an SMS campaign, follow these steps:<br><br>
                 1. Go to the <b>Send SMS</b> module.<br>
                 2. Construct your payload in the main editor. <i>(You can use Spintax like {Hi|Hello})</i><br>
                 3. Specify targets by clicking <b>Choose Contacts</b> or typing raw numbers.<br>
                 4. Verify your network payload size.<br>
                 5. Hit the blue <b>Send SMS</b> button to finalize.`,
            tl: `Para magpadala ng SMS:<br><br>
                 1. Pumunta sa <b>Send SMS</b>.<br>
                 2. I-type ang mensahe mo. <i>(Pwede ang Spintax: {Hi|Hello})</i><br>
                 3. Pumili ng contacts via <b>Choose Contacts</b>.<br>
                 4. I-check ang network payload.<br>
                 5. I-click ang <b>Send SMS</b>.`,
            actionName: "Start Sending Tour",
            actionId: "send_sms"
        },
        'schedule': {
            en: `To schedule an automated campaign:<br><br>
                 1. Navigate to <b>Send SMS</b>.<br>
                 2. Formulate your targets and message body normally.<br>
                 3. Instead of sending, click the <b>Clock Icon</b> next to the Send button.<br>
                 4. Define the exact Date and Time.<br>
                 5. Click <b>Confirm Schedule</b>. It will queue in the background.`,
            tl: `Para mag-schedule ng text:<br><br>
                 1. Pumunta sa <b>Send SMS</b>.<br>
                 2. Ihanda ang message at numbers.<br>
                 3. I-click ang <b>Clock Icon</b> sa tabi ng Send button.<br>
                 4. Piliin ang petsa at oras.<br>
                 5. I-click ang <b>Confirm Schedule</b>.`,
            actionName: "View Automations",
            actionNavigate: "scheduled"
        },
        'template': {
            en: `To use templates and avoid re-typing:<br><br>
                 1. Navigate to the <b>Templates</b> panel.<br>
                 2. Name your template for easy categorization.<br>
                 3. Input your dynamic text payload.<br>
                 4. Hit <b>Commit / Save</b>. You can now insert this from the Send SMS view.`,
            tl: `Para gumamit ng templates:<br><br>
                 1. Pumunta sa <b>Templates</b>.<br>
                 2. Bigyan ito ng title.<br>
                 3. I-type ang mensahe.<br>
                 4. I-click ang <b>Save</b>. Pwede mo na itong magamit ulit sa pagse-send.`
        },
        'import': {
            en: `To bulk import thousands of contacts:<br><br>
                 1. Open the <b>Contacts Module</b>.<br>
                 2. Locate the <b>Heavy Import</b> button in the top right.<br>
                 3. Select an MS Excel (.xlsx) or CSV file.<br>
                 4. The system will automatically map the columns and sync the cloud.`,
            tl: `Para mag-import nang maramihan:<br><br>
                 1. Buksan ang <b>Contacts Module</b>.<br>
                 2. Hanapin ang <b>Heavy Import</b> sa itaas.<br>
                 3. Pumili ng Excel o CSV file.<br>
                 4. Kusa na itong mailalagay sa database.`,
            actionName: "Show me where",
            actionId: "heavy_import"
        },
        'github': {
            en: "We use a sophisticated GitHub Sync Engine to persist your data locally in the browser, yet securely sync it globally across devices for your entire team. Look at the Heart Pulse on the top right!",
            tl: "Gumagamit kami ng GitHub Sync Engine para ma-save ang data sa browser at ma-sync globally para sa team mo. Tiyaking berde ang Heart Pulse!"
        },
        'unsure': {
            en: "I'm currently unsure, and I don't want to provide inaccurate instructions. Would you like me to scan the system again, or try asking about 'Contacts', 'Send SMS', or 'Scheduling'?",
            tl: "Hindi ako sigurado at ayokong magbigay ng maling impormasyon. Gusto mo bang i-refresh ko ang kaalaman ko, o magtanong ka tungkol sa 'Contacts', 'Send SMS', o 'Scheduling'?"
        }
    },
    
    PAGE_CONTEXT: {
        'contacts': {
            en: "You are inside the Database root. Notice the global search bar—you can simultaneously search matching Names natively alongside applying active group filters.",
            tl: "Nasa Database root ka ngayon. Gamitin ang global search bar para sabay makapag-search ng pangalan at mag-apply ng group filters."
        },
        'send-sms': {
            en: "System alert: To maximize credit efficiency on this page, strictly monitor the Network Payload UI beneath the text editor. A single standard SMS supports 160 GSM characters.",
            tl: "System alert: Para ma-maximize ang credits dito, palaging bantayan ang Network Payload limit sa ibaba ng text space. 160 GSM characters ang limit."
        },
        'scheduled': {
            en: "Automation engine loaded. All pending dispatches here exist universally across your synced cloud instance.",
            tl: "Automation engine loaded. Lahat ng pending messages dito ay universal na naka-sync sa cloud system ninyo."
        }
    },

    init() {
        this.injectHTML();
        this.addEventListeners();
        this.scanSystem(); // Execute initial Deep Scan
        
        // Expose to window for global access
        window.BrandSyncChatbot = this;

        // Monitor hash changes for context
        window.addEventListener('hashchange', () => {
            if (this.isOpen) this.evaluateContext();
        });
    },

    // Controlled Deep Scan Mechanism (Building internal knowledge)
    scanSystem(force = false) {
        if (!force && localStorage.getItem('BrandSync_AILearning')) {
             try {
                 this.discoveredFeatures = JSON.parse(localStorage.getItem('BrandSync_AILearning'));
                 console.log("[AI Super-Agent] Loaded System Schema from Memory Map.");
                 return;
             } catch(e) { /* fallback to re-scanning */ }
        }

        console.log("[AI Super-Agent] Deep Scan Initiated. Crawling Application Surface...");
        this.discoveredFeatures = [];
        
        // Scan structured navigation
        document.querySelectorAll('#mainNav li').forEach(el => {
            const txt = el.innerText.trim();
            if (txt) this.discoveredFeatures.push({ type: 'module', name: txt.toLowerCase() });
        });

        // Scan operational workflows and UI nodes
        document.querySelectorAll('button').forEach(btn => {
            if (btn.innerText && btn.innerText.length < 25 && !btn.innerText.includes('<')) {
                this.discoveredFeatures.push({
                    type: 'action',
                    name: btn.innerText.trim().toLowerCase(),
                    onclick: btn.getAttribute('onclick') || null
                });
            }
        });

        // Save acquired intelligence to local memory
        localStorage.setItem('BrandSync_AILearning', JSON.stringify(this.discoveredFeatures));
        console.log(`[AI Super-Agent] Learning Complete. Abstracted ${this.discoveredFeatures.length} endpoints to memory constraint.`);
    },

    forceSyncKnowledge() {
        this.addThinkingIndicator();
        setTimeout(() => {
            this.scanSystem(true);
            this.removeThinkingIndicator();
            this.addBotMessage(this.lang === 'en' ? 
                "✅ Knowledge Base successfully refreshed. I have re-indexed the DOM schema, modules, and workflows to ensure maximum accuracy." : 
                "✅ Na-update na ang aking kaalaman. Nakita ko na ang mga bagong buttons at features sa system.");
        }, 1200);
    },

    injectHTML() {
        if(document.getElementById('brandSyncChatbotWrapper')) return;
        
        const wrapper = document.createElement('div');
        wrapper.id = 'brandSyncChatbotWrapper';
        wrapper.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999999;
            font-family: 'Inter', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            pointer-events: none;
        `;
        
        wrapper.innerHTML = `
            <!-- Main Chat Window -->
            <div id="aiChatWindow" style="
                display: none;
                pointer-events: auto;
                width: 360px;
                height: 520px;
                background: rgba(25, 25, 30, 0.95);
                backdrop-filter: blur(40px) saturate(200%);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 24px;
                box-shadow: 0 30px 60px rgba(0,0,0,0.6), 0 0 100px rgba(10,132,255,0.1) inset;
                margin-bottom: 20px;
                flex-direction: column;
                overflow: hidden;
                transform-origin: bottom right;
                animation: chatPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.25);
            ">
                <!-- Header -->
                <div style="padding: 16px 20px; background: rgba(0,0,0,0.25); border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #0a84ff, #bf5af2); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(10,132,255,0.4);">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2c-.11.66.69 1.15 1.14.65l.5-.5a2 2 0 0 1 2.82 2.82l-.5.5c-.5.45-.01 1.25.65 1.14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2c-.66-.11-1.15.69-.65 1.14l.5.5a2 2 0 0 1-2.82 2.82l-.5-.5c-.45-.5-1.25-.01-1.14.65a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2c.11-.66-.69-1.15-1.14-.65l-.5.5a2 2 0 0 1-2.82-2.82l.5-.5c.5-.45.01-1.25-.65-1.14a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2c.66.11 1.15-.69.65-1.14l-.5-.5a2 2 0 0 1 2.82-2.82l.5.5c.45.5 1.25.01 1.14-.65a2 2 0 0 1-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </div>
                        <div>
                            <span style="font-weight: 800; color: #fff; font-size: 0.95rem; display: flex; align-items: center; gap:6px;">BrandSync Core <div style="width:6px; height:6px; border-radius:50%; background:#32d74b; box-shadow:0 0 8px #32d74b;"></div></span>
                            <span style="font-size: 0.65rem; color: rgba(255,255,255,0.5); font-weight: 700; text-transform: uppercase;">Agent Interface</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button id="aiLangBtn" onclick="window.BrandSyncChatbot.toggleLanguage()" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #fff; border-radius: 6px; padding: 2px 8px; font-size: 0.65rem; font-weight: 800; cursor: pointer; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">EN</button>
                        <button onclick="window.BrandSyncChatbot.toggle()" style="background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; padding: 0; transition:0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='rgba(255,255,255,0.5)'">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </div>

                <!-- Chat Body -->
                <div id="aiChatBody" style="flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; scroll-behavior: smooth;">
                    <!-- Messages render here -->
                </div>

                <!-- Smart Suggestions -->
                <div id="aiChatSuggestions" style="padding: 0 16px 12px; display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none;">
                    <button class="ai-chip" onclick="window.BrandSyncChatbot.submitPredefined('Find David')" style="white-space:nowrap; background: rgba(10,132,255,0.1); border: 1px solid rgba(10,132,255,0.3); color: #0a84ff; border-radius: 12px; padding: 6px 12px; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: 0.2s;">🔍 Locate Person</button>
                    <button class="ai-chip" onclick="window.BrandSyncChatbot.submitPredefined('How to add a contact?')" style="white-space:nowrap; background: rgba(10,132,255,0.1); border: 1px solid rgba(10,132,255,0.3); color: #0a84ff; border-radius: 12px; padding: 6px 12px; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: 0.2s;">🎯 Guide: Contacts</button>
                    <button class="ai-chip" onclick="window.BrandSyncChatbot.submitPredefined('How do I send scheduled?')" style="white-space:nowrap; background: rgba(50,215,75,0.1); border: 1px solid rgba(50,215,75,0.3); color: #32d74b; border-radius: 12px; padding: 6px 12px; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: 0.2s;">⏱️ Automations</button>
                    <button class="ai-chip" onclick="window.BrandSyncChatbot.submitPredefined('/update')" style="white-space:nowrap; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 12px; padding: 6px 12px; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: 0.2s;">🔄 Force Refresh</button>
                </div>

                <!-- Input Context -->
                <div style="padding: 16px; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 10px; align-items:center;">
                    <div style="flex: 1; position:relative;">
                        <input type="text" id="aiChatInput" placeholder="Interrogate the core system..." autocomplete="off" style="width:100%; height:44px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); border-radius: 14px; padding: 0 16px; color: #fff; font-size: 0.85rem; outline: none; transition: 0.2s;">
                    </div>
                    <button onclick="window.BrandSyncChatbot.submit()" style="width: 44px; height: 44px; background: linear-gradient(135deg, #0a84ff, #005bb5); border: none; border-radius: 14px; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 15px rgba(10,132,255,0.3);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>

            <!-- Floating Toggle Button -->
            <button onclick="window.BrandSyncChatbot.toggle()" style="
                pointer-events: auto;
                width: 65px; height: 65px; 
                background: linear-gradient(135deg, #1c1c1e, #2c2c30); 
                border: 2px solid rgba(255,255,255,0.2); 
                border-radius: 50%; 
                display: flex; align-items: center; justify-content: center; 
                cursor: pointer; 
                box-shadow: 0 15px 40px rgba(0,0,0,0.8);
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
            " onmouseover="this.style.transform='scale(1.1)'; this.style.borderColor='rgba(10,132,255,0.6)'" onmouseout="this.style.transform='scale(1)'; this.style.borderColor='rgba(255,255,255,0.2)'">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <div id="aiToggleBadge" style="position: absolute; top: -2px; right: -2px; width: 22px; height: 22px; background: #0a84ff; color: #fff; border-radius: 50%; font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; justify-content: center; border: 2px solid #1c1c1e; box-shadow: 0 4px 10px rgba(10,132,255,0.5);">1</div>
            </button>
        `;
        
        document.body.appendChild(wrapper);
    },

    addEventListeners() {
        const input = document.getElementById('aiChatInput');
        if(input) {
            input.addEventListener('keypress', (e) => {
                if(e.key === 'Enter') this.submit();
            });
        }
    },

    toggle() {
        this.isOpen = !this.isOpen;
        const windowEl = document.getElementById('aiChatWindow');
        const badge = document.getElementById('aiToggleBadge');
        
        if(this.isOpen) {
            windowEl.style.display = 'flex';
            if(badge) badge.style.display = 'none'; // Unread status clear
            this.evaluateContext();
            setTimeout(() => document.getElementById('aiChatInput')?.focus(), 100);
            
            if(this.isFirstOpen === undefined) {
                this.isFirstOpen = false;
                const txt = this.lang === 'en' ? "System Core initialized. I am deeply integrated with BrandSync modules. How may I accelerate your workflow today?" : "System Core activated. Konektado ako sa lahat ng modules ng BrandSync. Paano ko mapapabilis ang trabaho mo ngayon?";
                this.addBotMessage(txt);
            }
        } else {
            windowEl.style.display = 'none';
        }
    },

    toggleLanguage() {
        this.lang = this.lang === 'en' ? 'tl' : 'en';
        document.getElementById('aiLangBtn').innerText = this.lang.toUpperCase();
        this.addBotMessage(this.lang === 'en' ? "Language switched to English. Knowledge base re-indexing complete." : "Pinalitan ang wika sa Tagalog. Handang tumulong muli.");
    },

    evaluateContext() {
        const hash = (window.location.hash || '').replace('#', '');
        
        // Don't repeat identical context tips to prevent spam
        if(this.PAGE_CONTEXT[hash] && this.lastContext !== hash) {
            this.lastContext = hash;
            
            // Artificial delay to simulate scanning current view
            setTimeout(() => {
                this.addBotMessage(`👁️ <b>Context Scan:</b> ${this.PAGE_CONTEXT[hash][this.lang]}`);
            }, 500);
        }
    },

    submitPredefined(text) {
        document.getElementById('aiChatInput').value = text;
        this.submit();
    },

    async submit() {
        const input = document.getElementById('aiChatInput');
        const text = input.value.trim();
        if(!text) return;

        this.addUserMessage(text);
        input.value = '';

        // NLP Cognitive Engine Processing
        const lower = text.toLowerCase();
        
        // INTERCEPT COMMANDS: Deep Admin Refresh
        if (lower === '/update' || lower === '/refresh' || lower.includes('refresh your knowledge') || lower.includes('update system')) {
             this.forceSyncKnowledge();
             return;
        }

        // INTERCEPT COMMANDS: Natural Language Contact Lookup
        const isSearchTrigger = lower.startsWith('find ') || lower.startsWith('where is ') || lower.startsWith('search for ') || lower.includes('exist in my contacts');
        if (isSearchTrigger) {
             const queryQueryStr = text.replace(/find |where is |search for |do i have /gi, '').replace(/\?/g, '').trim();
             this.addThinkingIndicator();
             await this.searchContactNatively(queryQueryStr);
             return;
        }

        let intentKey = 'unsure';

        // Deep Analysis matching
        if(lower.includes('contact') || lower.includes('add') || lower.includes('people') || lower.includes('how to put') || lower.includes('database')) intentKey = 'contact';
        else if(lower.includes('send') || lower.includes('dispatch') || lower.includes('blast') || lower.includes('how to text')) intentKey = 'send';
        else if(lower.includes('schedule') || lower.includes('automate') || lower.includes('later') || lower.includes('how to automate')) intentKey = 'schedule';
        else if(lower.includes('template') || lower.includes('spintax') || lower.includes('reuse') || lower.includes('save time')) intentKey = 'template';
        else if(lower.includes('import') || lower.includes('csv') || lower.includes('excel') || lower.includes('mass add')) intentKey = 'import';
        else if(lower.includes('sync') || lower.includes('github') || lower.includes('cloud') || lower.includes('save') || lower.includes('heart')) intentKey = 'github';

        // Render response artificially later
        setTimeout(() => {
            const kbItem = this.KNOWLEDGE_BASE[intentKey];
            
            // Generate interactive HTML buttons if actions exist in Knowledge Base definition
            let actionHtml = '';
            if (kbItem.actionNavigate) {
                 actionHtml = `<div style="margin-top:10px;"><button onclick="window.location.hash='${kbItem.actionNavigate}'; window.BrandSyncChatbot.toggle()" style="background:var(--accent-color); border:none; padding:6px 14px; border-radius:8px; color:#fff; font-size:0.75rem; font-weight:800; cursor:pointer; box-shadow:0 4px 10px rgba(10,132,255,0.3);">${kbItem.actionName}</button></div>`;
            } else if (kbItem.actionId) {
                 actionHtml = `<div style="margin-top:10px;"><button onclick="window.BrandSyncChatbot.runOnScreenWalkthrough('${kbItem.actionId}')" style="background:#bf5af2; border:none; padding:6px 14px; border-radius:8px; color:#fff; font-size:0.75rem; font-weight:800; cursor:pointer; box-shadow:0 4px 10px rgba(191,90,242,0.3);"><i class="icon-lucide-navigation"></i> ${kbItem.actionName}</button></div>`;
            }

            this.addBotMessage(kbItem[this.lang] + actionHtml);
        }, 500 + Math.random() * 500); // Compute cycle delay
    },

    // AUTONOMOUS DB AGENT: Native Contact Mapping Engine
    async searchContactNatively(query) {
        if (!query || query.length < 2) {
             this.removeThinkingIndicator();
             this.addBotMessage(this.lang === 'en' ? "Please provide a more specific name to scan your database." : "Magbigay ng tiyak na pangalan para mahanap sa database.");
             return;
        }

        const contacts = await window.BrandSyncAPI.getContacts();
        const groups = await window.BrandSyncAPI.getGroups();
        const grpMap = groups.reduce((acc, g) => { acc[g.id] = g; return acc; }, {});
        
        const q = query.toLowerCase();
        const matches = contacts.filter(c => {
            const groupNames = (c.groupIds || []).map(gid => grpMap[gid]?.name).join(' ').toLowerCase();
            const searchable = [window.ContactsView.parseName(c.name).full, c.phone, c.company, (c.tags || []).join(' '), groupNames].join(' ').toLowerCase();
            return searchable.includes(q);
        });

        setTimeout(() => { // simulate API processing calculation latency
            this.removeThinkingIndicator();

            if (matches.length === 0) {
                this.addBotMessage(
                    this.lang === 'en' ? 
                    `I couldn't locate any record matching "<b>${query}</b>" in your database.<br><br>Would you like to manually create a new contact?
                    <div style="margin-top:10px;"><button onclick="window.BrandSyncChatbot.runOnScreenWalkthrough('add_contact')" style="background:#bf5af2; border:none; padding:6px 14px; border-radius:8px; color:#fff; font-size:0.75rem; font-weight:800; cursor:pointer;"><i class="icon-lucide-navigation"></i> Guide Me</button></div>` 
                    : 
                    `Wala akong nahanap na record para sa "<b>${query}</b>" sa database.<br><br>Gusto mo bang gumawa ng bagong contact?`
                );
                return;
            }

            if (matches.length === 1) {
                const c = matches[0];
                const cleanName = window.ContactsView.parseName(c.name).full;
                const addedDate = new Date(c.added);
                const formatter = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
                const addedDisplay = formatter.format(addedDate);
                const gNames = (c.groupIds || []).map(gid => `<span style="background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px;">${grpMap[gid]?.name}</span>`).join(' ') || '—';
                
                this.addBotMessage(
                    this.lang === 'en' ? 
                    `Record Located!<br><b>${cleanName}</b> is currently registered in your Active Contacts.<br><br>
                     <div style="font-size:0.75rem; color:rgba(255,255,255,0.8); background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1); padding:10px; border-radius:8px; display:flex; flex-direction:column; gap:6px;">
                         <div><span style="opacity:0.5;">Phone:</span> <span style="font-family:monospace;">+${c.phone}</span></div>
                         <div><span style="opacity:0.5;">Company:</span> ${c.company || '—'}</div>
                         <div><span style="opacity:0.5;">Groups:</span> ${gNames}</div>
                         <div style="margin-top:4px; font-size:0.65rem; opacity:0.5;">Added on ${addedDisplay}</div>
                     </div><br>
                     Do you want me to navigate you directly to their file so you can edit the geometry?
                     <div style="margin-top:10px;"><button onclick="window.BrandSyncChatbot.triggerModalOverride('${c.id}')" style="background:#0a84ff; border:none; padding:6px 14px; border-radius:8px; color:#fff; font-size:0.75rem; font-weight:800; cursor:pointer; box-shadow:0 4px 10px rgba(10,132,255,0.3);">Open Contact Details</button></div>` 
                     : 
                    `Nahanap ko na!<br>Ang record para kay <b>${cleanName}</b> ay nasa database...`
                );
                return;
            }

            if (matches.length > 1) {
                let listHtml = matches.slice(0, 4).map(m => `• <b>${window.ContactsView.parseName(m.name).full}</b> <span style="opacity:0.5; font-size:0.7rem;">(+${m.phone})</span>`).join('<br>');
                if (matches.length > 4) listHtml += `<br><i>...and ${matches.length - 4} more.</i>`;

                this.addBotMessage(
                    this.lang === 'en' ?
                    `I encountered <b>${matches.length} matches</b> in the database for "${query}". Which explicit user do you mean?<br>
                     <div style="margin-top:8px; font-size:0.75rem; color:rgba(255,255,255,0.9); background:rgba(0,0,0,0.2); padding:12px; border:radius:8px; border:1px solid rgba(255,255,255,0.05); line-height:1.6;">${listHtml}</div>
                     <br>Please refine your search request. Provide their exact surname, company, or international phone number for isolation.`
                     :
                    `May nahanap akong <b>${matches.length} contacts</b> para sa "${query}". Alin dito ang tinutukoy mo?<br>Maaari kang magbigay ng karagdagang impormasyon tulad ng apelyido, kumpanya, o numero ng telepono.`
                );
            }

        }, 800 + Math.random() * 500);
    },

    // OVERRIDE: Programmatically jumps to the Contacts view and pops open the Edit Modal.
    async triggerModalOverride(contactId) {
        this.toggle(); // Hide Chat
        window.location.hash = 'contacts';
        window.showToast("Rerouting to requested contact object...", "info");

        // Give the DOM architectural time to remount
        setTimeout(async () => {
            const contacts = await window.BrandSyncAPI.getContacts();
            const target = contacts.find(x => String(x.id) === String(contactId));
            if (target) {
                // Pre-clear any searches to ensure stability
                if(document.getElementById('contactSearch')) document.getElementById('contactSearch').value = '';
                await window.ContactsView.loadData();
                window.ContactsView.openEditModal(target);
            }
        }, 500);
    },

    // ON-SCREEN INTERACTIVE TUTORIAL ENGINE
    // Physically hooks onto DOM elements and guides the user via pulsing halos
    runOnScreenWalkthrough(flowId) {
        this.toggle(); // Hide chat
        
        let steps = [];
        // Walkthrough Definitions Registry
        if (flowId === 'add_contact') {
            window.location.hash = 'contacts';
            steps = [
                { jsAction: () => true, selector: "button[onclick*='openEditModal']", msg: "Step 1: Click this primary button to invoke the secure Contact Entry modal." },
                { jsAction: () => window.ContactsView.openEditModal(), awaitSelector: "#contactModal", msg: "Step 2: You've penetrated the modal. Fill in the parameters (Name, Phone, etc). Notice we have validation." },
                { jsAction: () => true, selector: "button[onclick*='saveContact']", msg: "Step 3: Finally, hit Save to commit to the local indexedDB and globally sync to GitHub." }
            ];
        } else if (flowId === 'heavy_import') {
            window.location.hash = 'contacts';
            steps = [
                { jsAction: () => true, selector: "button[onclick*='importContacts']", msg: "Look here. This button bridges your raw Excel sheets directly into our structured database." }
            ];
        } else if (flowId === 'send_sms') {
            window.location.hash = 'send-sms';
            steps = [
                { jsAction: () => true, selector: "#btnContactsDropdown", msg: "Step 1: Extract target identities from your synced database." },
                { jsAction: () => true, selector: "#messageArea", msg: "Step 2: Formulate your Spintax payload in the syntax editor." },
                { jsAction: () => true, selector: "#sendBtn", msg: "Step 3: Establish connection and blast to the PhilSMS remote gateway." }
            ];
        } else if (flowId === 'schedule_sms') {
            window.location.hash = 'send-sms';
            steps = [
                { jsAction: () => true, selector: "#scheduleToggleBtn", msg: "Step 1: Click the Send Later toggle to unlock temporal scheduling." },
                { jsAction: () => true, selector: "#scheduleTime", msg: "Step 2: Select the precise Date and Time your campaign should execute." },
                { jsAction: () => true, selector: "#sendBtn", msg: "Step 3: Commit the scheduled campaign payload to the server." }
            ];
        } else if (flowId === 'create_template') {
            window.location.hash = 'templates';
            steps = [
                { jsAction: () => true, selector: "button[onclick*='openModal']", msg: "Step 1: Initiate a new blank resource matrix by clicking Create Resource." },
                { jsAction: () => window.TemplatesView.openModal(), awaitSelector: "#edit_templateName", msg: "Step 2: Assign a memorable signature and construct your spintax data body." },
                { jsAction: () => true, selector: "button[onclick*='saveTemplate']", msg: "Step 3: Finalize and sync the template back to the global GitHub server." }
            ];
        } else {
             window.showToast("Walkthrough parameters missing or misconfigured.", "error"); return;
        }

        // Delay to allow hash navigation mounting
        setTimeout(() => this._orchestrateSteps(steps, 0), 400); 
    },

    _orchestrateSteps(steps, index) {
        if (index >= steps.length) {
            this._clearWalkthrough();
            window.showToast("Walkthrough simulation terminated successfully.", "success");
            return;
        }
        
        this._clearWalkthrough(); // clear previous
        const step = steps[index];

        // Execute JS requirement if defined (e.g., opening a modal)
        if (step.jsAction) step.jsAction();

        let attempts = 0;
        const domPoller = setInterval(() => {
            const target = document.querySelector(step.awaitSelector || step.selector);
            
            if (target) {
                clearInterval(domPoller);
                this._renderWalkthroughHalo(target, step, steps, index);
            } else {
                attempts++;
                if (attempts > 40) { // 40 * 100ms = 4 seconds max threshold
                    clearInterval(domPoller);
                    console.warn("[AI Guide] Target Node Missing:", step.selector);
                    window.showToast("Walkthrough terminated: Awaited UI component failed to mount.", "error");
                }
            }
        }, 100);
    },

    _renderWalkthroughHalo(target, step, steps, index) {
        // Create Visual Halo
        const halo = document.createElement('div');
        halo.id = 'aiWalkthroughHalo';
        const rect = target.getBoundingClientRect();
        
        halo.style.cssText = `
            position: fixed;
            top: ${rect.top - 6}px;
            left: ${rect.left - 6}px;
            width: ${rect.width + 12}px;
            height: ${rect.height + 12}px;
            border: 3px solid #bf5af2;
            border-radius: ${window.getComputedStyle(target).borderRadius || '12px'};
            box-shadow: 0 0 0 9999px rgba(0,0,0,0.6), 0 0 30px #bf5af2 inset;
            z-index: 100000;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: pulseHalo 2s infinite;
        `;

        // Create Instruction Dialog
        const dialog = document.createElement('div');
        dialog.id = 'aiWalkthroughDialog';

        // Smart Positioning Logic (Prevents Viewport Overflow)
        const dialogWidth = 320;
        const dialogHeight = 220; // Estimated max height
        
        let dLeft = Math.max(20, Math.min(rect.left + (rect.width/2) - (dialogWidth/2), window.innerWidth - dialogWidth - 20));
        let dTop = rect.bottom + 20;
        
        // If bottom space is insufficient, flip to top
        if (dTop + dialogHeight > window.innerHeight) {
            dTop = rect.top - dialogHeight - 20;
        }
        
        // Final safety clamp for vertical
        dTop = Math.max(20, Math.min(dTop, window.innerHeight - dialogHeight - 20));

        dialog.style.cssText = `
            position: fixed;
            top: ${dTop}px;
            left: ${dLeft}px;
            width: ${dialogWidth}px;
            max-width: calc(100vw - 40px);
            background: rgba(30,30,35,0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(191,90,242,0.4);
            border-radius: 16px;
            padding: 20px;
            color: #fff;
            z-index: 100001;
            box-shadow: 0 30px 60px rgba(0,0,0,0.6);
            animation: fadeIn 0.3s ease-out;
        `;

        dialog.innerHTML = `
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
                <div style="width:20px;height:20px;border-radius:50%;background:#bf5af2;display:flex;align-items:center;justify-content:center;"><i class="icon-lucide-bot" style="font-size:10px;"></i></div>
                <span style="font-weight:800; font-size:0.8rem; text-transform:uppercase; color:#bf5af2;">BrandSync Guide</span>
            </div>
            <p style="font-size:0.85rem; line-height:1.5; margin:0 0 16px 0; color:rgba(255,255,255,0.8);">${step.msg}</p>
            <div style="display:flex; justify-content:space-between;">
                <button id="aiWalkCancelBtn" style="background:transparent; border:none; color:rgba(255,255,255,0.4); font-size:0.75rem; font-weight:700; cursor:pointer;">Exit Protocol</button>
                <button id="aiWalkNextBtn" style="background:#bf5af2; border:none; padding:8px 16px; border-radius:8px; color:#fff; font-size:0.8rem; font-weight:800; cursor:pointer;box-shadow:0 6px 15px rgba(191,90,242,0.3); transition:0.2s;">${index === steps.length - 1 ? 'Finish' : 'Next Step'}</button>
            </div>
        `;

        document.body.appendChild(halo);
        document.body.appendChild(dialog);

        let advanced = false;
        const advanceStep = () => {
            if (advanced) return;
            advanced = true;
            if (index < steps.length - 1) {
                setTimeout(() => this._orchestrateSteps(steps, index + 1), 500);
            } else {
                this._clearWalkthrough();
                window.showToast("Walkthrough successfully completed.", "success");
            }
        };

        // Bridge native click interactions to auto-advance
        if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'input' || target.tagName.toLowerCase() === 'a') {
            target.addEventListener('click', advanceStep, { once: true });
        }

        document.getElementById('aiWalkNextBtn').onclick = () => advanceStep();
        document.getElementById('aiWalkCancelBtn').onclick = () => this._clearWalkthrough();
    },

    _clearWalkthrough() {
        const h = document.getElementById('aiWalkthroughHalo');
        const d = document.getElementById('aiWalkthroughDialog');
        if(h) document.body.removeChild(h);
        if(d) document.body.removeChild(d);
    },

    // Render generic visual indicator prior to response completion
    addThinkingIndicator() {
        const body = document.getElementById('aiChatBody');
        const wrapper = document.createElement('div');
        wrapper.id = 'aiThinkingBubble';
        wrapper.style.cssText = `
            display: flex;
            align-items: flex-end;
            gap: 8px;
            max-width: 85%;
            animation: fadeIn 0.3s ease-out;
        `;

        wrapper.innerHTML = `
            <div style="flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #0a84ff, #bf5af2); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2c-.11.66.69 1.15 1.14.65l.5-.5a2 2 0 0 1 2.82 2.82l-.5.5c-.5.45-.01 1.25.65 1.14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2c-.66-.11-1.15.69-.65 1.14l.5.5a2 2 0 0 1-2.82 2.82l-.5-.5c-.45-.5-1.25-.01-1.14.65a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2c.11-.66-.69-1.15-1.14-.65l-.5.5a2 2 0 0 1-2.82-2.82l.5-.5c.5-.45.01-1.25-.65-1.14a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2c.66.11 1.15-.69.65-1.14l-.5-.5a2 2 0 0 1 2.82-2.82l.5.5c.45.5 1.25.01 1.14-.65a2 2 0 0 1-2-2z"></path></svg>
            </div>
            <div style="
                background: rgba(255,255,255,0.06);
                border: 1px solid rgba(255,255,255,0.05);
                color: #fff;
                padding: 12px 16px;
                border-radius: 18px;
                border-bottom-left-radius: 4px;
                font-size: 0.85rem;
                display: flex;
                align-items: center;
                gap: 4px;
            ">
                <span style="width:4px; height:4px; border-radius:50%; background:#fff; animation: aiDotBounce 1.4s infinite ease-in-out both;"></span>
                <span style="width:4px; height:4px; border-radius:50%; background:#fff; animation: aiDotBounce 1.4s infinite ease-in-out both 0.16s;"></span>
                <span style="width:4px; height:4px; border-radius:50%; background:#fff; animation: aiDotBounce 1.4s infinite ease-in-out both 0.32s;"></span>
            </div>
        `;
        body.appendChild(wrapper);
        this.scrollToBottom();
    },

    removeThinkingIndicator() {
         const t = document.getElementById('aiThinkingBubble');
         if(t) t.remove();
    },

    addUserMessage(text) {
        const body = document.getElementById('aiChatBody');
        const msg = document.createElement('div');
        msg.style.cssText = `
            align-self: flex-end;
            background: linear-gradient(135deg, #0a84ff, #005bb5);
            color: #fff;
            padding: 10px 14px;
            border-radius: 18px;
            border-bottom-right-radius: 4px;
            max-width: 80%;
            font-size: 0.85rem;
            line-height: 1.4;
            box-shadow: 0 4px 10px rgba(10,132,255,0.2);
            animation: fadeIn 0.2s ease-out;
            word-wrap: break-word;
        `;
        msg.innerText = text;
        body.appendChild(msg);
        this.scrollToBottom();
    },

    addBotMessage(html) {
        const body = document.getElementById('aiChatBody');
        const wrapper = document.createElement('div');
        wrapper.style.cssText = `
            display: flex;
            align-items: flex-end;
            gap: 8px;
            max-width: 85%;
            animation: fadeIn 0.3s ease-out;
        `;

        wrapper.innerHTML = `
            <div style="flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #0a84ff, #bf5af2); display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.5);">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a2 2 0 0 1 2 2c-.11.66.69 1.15 1.14.65l.5-.5a2 2 0 0 1 2.82 2.82l-.5.5c-.5.45-.01 1.25.65 1.14a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2c-.66-.11-1.15.69-.65 1.14l.5.5a2 2 0 0 1-2.82 2.82l-.5-.5c-.45-.5-1.25-.01-1.14.65a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2c.11-.66-.69-1.15-1.14-.65l-.5.5a2 2 0 0 1-2.82-2.82l.5-.5c.5-.45.01-1.25-.65-1.14a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2c.66.11 1.15-.69.65-1.14l-.5-.5a2 2 0 0 1 2.82-2.82l.5.5c.45.5 1.25.01 1.14-.65a2 2 0 0 1-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </div>
            <div style="
                background: rgba(255,255,255,0.06);
                border: 1px solid rgba(255,255,255,0.05);
                color: #fff;
                padding: 12px 16px;
                border-radius: 18px;
                border-bottom-left-radius: 4px;
                font-size: 0.85rem;
                line-height: 1.5;
                box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            ">
                ${html}
            </div>
        `;
        body.appendChild(wrapper);
        this.scrollToBottom();
    },

    scrollToBottom() {
        const body = document.getElementById('aiChatBody');
        if(body) body.scrollTop = body.scrollHeight;
    }
};

// CSS Injection
(function() {
    if(!document.getElementById('aiSuperAgentStyles')) {
        const style = document.createElement('style');
        style.id = 'aiSuperAgentStyles';
        style.innerHTML = `
            @keyframes chatPop { 0% { opacity: 0; transform: scale(0.9) translateY(20px); filter:blur(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); filter:blur(0);} }
            @keyframes pulseHalo { 0% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.6), 0 0 0 0 rgba(191,90,242,0.8) inset; } 50% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.6), 0 0 30px rgba(191,90,242,1) inset; } 100% { box-shadow: 0 0 0 9999px rgba(0,0,0,0.6), 0 0 0 0 rgba(191,90,242,0.8) inset; } }
            @keyframes aiDotBounce { 0%, 80%, 100% { transform: scale(0); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }
            .ai-chip:hover { background: rgba(255,255,255,0.1) !important; transform: translateY(-2px); }
        `;
        document.head.appendChild(style);
    }
})();

document.addEventListener('DOMContentLoaded', () => setTimeout(() => window.BrandSyncChatbot.init(), 1000));
