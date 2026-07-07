// Inbox View Component - BrandSync Ultra Spatial (Apple Messages Edition)
window.InboxView = {
    activeContactId: null,
    searchQuery: '',
    isSidebarOpen: false,

    render(container) {
        container.innerHTML = `
            <div class="view-container active fade-in" style="flex-direction: row; height: calc(100vh - 75px); padding: 0; gap: 0; overflow: hidden; background: rgba(0,0,0,0.4); backdrop-filter: blur(50px) saturate(250%);">
                
                <!-- Chat List Sidebar (VisionOS Style) -->
                <div style="width: 360px; height: 100%; border-right: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; background: rgba(255,255,255,0.03);">
                    <div style="padding: 32px 24px 20px; display:flex; justify-content: space-between; align-items:center;">
                        <h2 style="font-size: 1.8rem; font-weight: 900; color: #fff; letter-spacing: -0.05em;">Messages</h2>
                        <button onclick="window.InboxView.showCompose()" class="btn spatial-btn" style="width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.08); color:#fff; display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.12);">
                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                    </div>

                    <div style="padding: 0 24px 24px;">
                        <div class="glass-panel" style="display:flex; align-items:center; padding: 0 16px; height: 44px; border-radius: 12px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08);">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="color: rgba(255,255,255,0.2); margin-right: 12px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input type="text" id="inboxSearch" oninput="window.InboxView.handleSearch(this.value)" placeholder="Search identity..." style="flex:1; background:transparent; border:none; color:#fff; font-size:0.9rem; outline:none; font-weight:600;">
                        </div>
                    </div>
                    
                    <div id="conversationList" style="flex: 1; overflow-y: auto; padding: 0 12px 24px;">
                        <!-- Conversations injected dynamically -->
                    </div>
                </div>

                <!-- Chat Body (Spacious Canvas) -->
                <div style="flex: 1; display:flex; flex-direction: column; position: relative; background: rgba(0,0,0,0.1);">
                    <div id="chatPlaceholder" style="position: absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:20px; color:rgba(255,255,255,0.15); z-index:5;">
                         <div style="width: 120px; height: 120px; border-radius: 40px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; box-shadow: 0 20px 60px rgba(0,0,0,0.2);">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                         </div>
                         <h3 style="font-weight: 800; font-size: 1.2rem; color: rgba(255,255,255,0.3);">No Selected Thread</h3>
                    </div>

                    <div id="activeChat" style="height:100%; display:none; flex-direction:column; overflow: hidden;">
                        <!-- Chat Header -->
                        <div style="height: 80px; border-bottom: 1px solid rgba(255,255,255,0.06); display:flex; align-items:center; justify-content: space-between; padding: 0 32px; background: rgba(255,255,255,0.02); flex-shrink:0;">
                            <div style="display:flex; align-items:center; gap: 14px;">
                                <div id="chatAvatar" style="width: 44px; height: 44px; border-radius: 14px; background: #0a84ff; display:flex; align-items:center; justify-content:center; font-weight: 800; color: #fff; font-size: 1rem;">?</div>
                                <div>
                                    <h3 id="chatName" style="font-size: 1.1rem; font-weight: 800; color: #fff; letter-spacing: -0.02em;">---</h3>
                                    <p id="chatPhone" style="font-size: 0.75rem; color: rgba(255,255,255,0.3); font-weight: 700; font-family: monospace;">+00 000 0000</p>
                                </div>
                            </div>
                            <div style="display:flex; gap: 12px;">
                                <button onclick="window.InboxView.toggleInfo()" class="btn spatial-btn" style="width:40px; height:40px; border-radius:50%; background:rgba(255,255,255,0.05); color:rgba(255,255,255,0.7); display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,255,255,0.1);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></button>
                            </div>
                        </div>

                        <!-- Chat Feed -->
                        <div id="messagesFeed" style="flex: 1; min-height: 0; overflow-y: auto; padding: 40px; display:flex; flex-direction: column; gap: 4px; background: linear-gradient(to bottom, rgba(255,255,255,0.01), transparent);">
                            <!-- Dynamic Messages -->
                        </div>

                        <!-- Chat Bar -->
                        <div style="padding: 20px 110px 32px 32px; flex-shrink: 0;">
                            <div class="glass-panel" style="padding: 8px 8px 8px 20px; border-radius: 24px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.12); display:flex; align-items: center; gap: 14px; box-shadow: 0 15px 40px rgba(0,0,0,0.3);">
                                <input id="replyInp" style="flex: 1; background:transparent; border:none; color:#fff; font-size:1rem; outline:none; padding: 10px 0; font-weight:500;" placeholder="iMessage...">
                                <button onclick="window.InboxView.handleSend()" style="width: 32px; height: 32px; border-radius: 50%; background: #007aff; color:#fff; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="transform: rotate(90deg);"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg></button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Info Sidebar (Right Panel) -->
                <div id="infoSidebar" style="width: 0; overflow: hidden; height: 100%; border-left: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); transition: 0.4s cubic-bezier(0.1, 0.9, 0.2, 1); display:flex; flex-direction:column;">
                    <div id="infoContent" style="width:320px; padding:48px 32px; opacity:0; transition: 0.3s; display:flex; flex-direction:column; align-items:center; gap:32px;">
                         <div id="infoAvatar" style="width:100px; height:100px; border-radius:35px; background:linear-gradient(135deg, #0a84ff, #5e5ce6); display:flex; align-items:center; justify-content:center; color:#fff; font-size:2.8rem; font-weight:900; box-shadow: 0 20px 40px rgba(10,132,255,0.3);">?</div>
                         <div style="text-align:center;">
                            <h2 id="infoName" style="font-size:1.6rem; font-weight:900; color:#fff; margin-bottom:8px; letter-spacing:-0.03em;">---</h2>
                            <p id="infoPhone" style="font-size:1rem; color:rgba(255,255,255,0.4); font-weight:700; font-family:monospace;">+00 0000 000</p>
                         </div>
                         <div style="width:100%; display:flex; flex-direction:column; gap:12px;">
                            <div class="glass-panel" style="padding:16px; border-radius:20px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);">
                                <label style="display:block; font-size:0.65rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:900; margin-bottom:6px;">Last Engagement</label>
                                <div id="infoLast" style="color:#fff; font-weight:700; font-size:0.9rem;">-- ago</div>
                            </div>
                            <div class="glass-panel" style="padding:16px; border-radius:20px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);">
                                <label style="display:block; font-size:0.65rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:900; margin-bottom:6px;">System ID</label>
                                <div id="infoId" style="color:rgba(255,255,255,0.6); font-family:monospace; font-size:0.8rem;">BS-XXXXX</div>
                            </div>
                         </div>
                         <button onclick="window.InboxView.toggleInfo()" style="width:100%; height:48px; border-radius:16px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1); color:#fff; font-weight:800; margin-top:auto;">Done</button>
                    </div>
                </div>

            </div>

            <!-- Compose Modal Overlay -->
            <div id="composeModal" style="display:none; position:fixed; inset:0; z-index:30000; background:rgba(0,0,0,0.6); backdrop-filter:blur(30px); align-items:center; justify-content:center;">
                <div class="glass-panel" style="width:480px; padding:40px; border-radius:40px; background:rgba(30,30,35,0.9); border:1px solid rgba(255,255,255,0.15); box-shadow: 0 40px 100px rgba(0,0,0,0.5);">
                    <h2 style="font-size:1.6rem; font-weight:900; color:#fff; margin-bottom:24px; letter-spacing:-0.03em;">New iMessage</h2>
                    <input id="composeSearch" oninput="window.InboxView.filterCompose(this.value)" type="text" placeholder="Add contact name or number..." style="width:100%; height:50px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:0 20px; color:#fff; font-size:1rem; outline:none; font-weight:600; margin-bottom:12px;">
                    <div id="composeList" style="max-height: 240px; overflow-y: auto; display:flex; flex-direction:column; gap:8px;"></div>
                    <button onclick="document.getElementById('composeModal').style.display='none'" style="width:100%; height:50px; background:rgba(255,255,255,0.08); border:none; border-radius:16px; color:#fff; font-weight:800; margin-top:24px;">Dismiss</button>
                </div>
            </div>

            <style>
                #conversationList::-webkit-scrollbar, #composeList::-webkit-scrollbar { display: none; }
                #messagesFeed::-webkit-scrollbar { width: 4px; }
                #messagesFeed::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
                
                .conv-item { transition: 0.15s; border-radius: 20px; margin: 0 8px 4px; border: 1px solid transparent; }
                .conv-item:hover { background: rgba(255,255,255,0.05); }
                .conv-item.active { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.1); }
                
                .bubble { max-width: 70%; padding: 14px 18px; line-height: 1.4; position: relative; font-size: 1.05rem; }
                .bubble.incoming { background: rgba(255,255,255,0.1); border-radius: 22px; border-bottom-left-radius: 4px; color: #fff; align-self: flex-start; margin-bottom: 2px; }
                .bubble.outgoing { background: #007aff; border-radius: 22px; border-bottom-right-radius: 4px; color: #fff; align-self: flex-end; margin-bottom: 2px; }
                
                .bubble-group { display: flex; flex-direction: column; margin-bottom: 12px; }
                .date-divider { align-self: center; font-size: 0.65rem; color: rgba(255,255,255,0.25); font-weight: 800; text-transform: uppercase; margin: 24px 0 16px; letter-spacing: 0.08em; }
                
                @keyframes spatialPop {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .bubble { animation: spatialPop 0.3s cubic-bezier(0.1, 0.9, 0.2, 1); }
            </style>
        `;

        this.init();
    },

    async init() {
        await this.loadConversations();
        const tx = document.getElementById('replyInp');
        if(tx) tx.addEventListener('keydown', (e) => (e.key === 'Enter') && this.handleSend());
    },

    handleSearch(val) {
        this.searchQuery = val.toLowerCase();
        this.loadConversations();
    },

    async loadConversations() {
        const list = document.getElementById('conversationList');
        if(!list) return;

        const messages = await window.BrandSyncAPI.getMessages();
        const contacts = await window.BrandSyncAPI.getContacts();

        const groups = messages.reduce((acc, m) => {
            if(!acc[m.contactId]) acc[m.contactId] = [];
            acc[m.contactId].push(m);
            return acc;
        }, {});

        const sortedContactIds = Object.keys(groups).sort((a,b) => {
            const lastA = groups[a][groups[a].length - 1].timestamp;
            const lastB = groups[b][groups[b].length - 1].timestamp;
            return new Date(lastB) - new Date(lastA);
        });

        list.innerHTML = sortedContactIds.map(cid => {
            const contact = contacts.find(c => String(c.id) === String(cid)) || { name: 'Unknown', phone: cid };
            const history = groups[cid];
            const lastMsg = history[history.length - 1];
            const isActive = String(this.activeContactId) === String(cid);

            if(this.searchQuery && !contact.name.toLowerCase().includes(this.searchQuery) && !String(contact.phone).includes(this.searchQuery)) return '';

            const init = (contact.name || '?').split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
            const timeStr = this.formatTimeRelative(lastMsg.timestamp);

            return `
                <div onclick="window.InboxView.selectChat('${cid}')" class="conv-item ${isActive ? 'active' : ''}" style="padding: 14px 16px; cursor: pointer;">
                    <div style="display:flex; gap: 14px; align-items: flex-start;">
                        <div style="width: 52px; height: 52px; border-radius: 16px; background: rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; color: #fff; font-weight: 800; font-size: 1.1rem; flex-shrink:0;">${init}</div>
                        <div style="flex:1; overflow:hidden;">
                            <div style="display:flex; justify-content: space-between; margin-bottom: 2px;">
                                <span style="font-weight: 800; color: #fff; font-size: 0.98rem; letter-spacing: -0.01em;">${contact.name}</span>
                                <span style="font-size: 0.7rem; color: rgba(255,255,255,0.25); font-weight: 800;">${timeStr}</span>
                            </div>
                            <p style="font-size: 0.9rem; color: ${isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.35)'}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin:0; line-height: 1.3;">
                                ${lastMsg.text}
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    async selectChat(cid) {
        this.activeContactId = cid;
        
        // Mark as Read in DB & Update Global Notification Badge
        if (window.BrandSyncAPI && window.BrandSyncAPI.markAsRead) {
            await window.BrandSyncAPI.markAsRead(cid);
            if (window.BrandSyncAppInstance && window.BrandSyncAppInstance.refreshGatewayStatus) {
                window.BrandSyncAppInstance.refreshGatewayStatus();
            }
        }

        this.loadConversations();
        document.getElementById('chatPlaceholder').style.display = 'none';
        document.getElementById('activeChat').style.display = 'flex';

        const contacts = await window.BrandSyncAPI.getContacts();
        const contact = contacts.find(c => String(c.id) === String(cid)) || { name: 'Unknown', phone: cid };
        document.getElementById('chatName').innerText = contact.name;
        document.getElementById('chatPhone').innerText = '+' + contact.phone;
        const initials = (contact.name || '?').split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
        document.getElementById('chatAvatar').innerText = initials;

        if (this.isSidebarOpen) this.updateInfoPanel(contact);
        this.loadMessages();
    },

    async loadMessages() {
        const feed = document.getElementById('messagesFeed');
        if(!feed || !this.activeContactId) return;

        const messages = (await window.BrandSyncAPI.getMessages())
            .filter(m => String(m.contactId) === String(this.activeContactId));

        let html = '';
        let lastDate = '';

        messages.forEach(m => {
            const d = new Date(m.timestamp).toLocaleDateString([], { weekday: 'long', hour: '2-digit', minute:'2-digit' });
            if (d !== lastDate) {
                html += `<div class="date-divider">${d}</div>`;
                lastDate = d;
            }
            html += `<div class="bubble ${m.sender === 'user' ? 'outgoing' : 'incoming'}">${m.text}</div>`;
        });

        feed.innerHTML = html;
        feed.scrollTop = feed.scrollHeight;
    },

    async handleSend() {
        const inp = document.getElementById('replyInp');
        const text = inp.value.trim();
        if(!text || !this.activeContactId) return;

        await window.BrandSyncAPI.saveMessage({ contactId: this.activeContactId, text, sender: 'user' });
        inp.value = '';
        this.loadMessages();
        this.loadConversations();
    },

    async simulateBotReply(contactId, userText, senderNum) {
        const lower = userText.toLowerCase();
        let replyText = '';
        
        if (lower.includes('hello') || lower.includes('hi')) {
            replyText = "Hello! This is an automated response from BrandSync. How can we help you today?";
        } else if (lower.includes('discount') || lower.includes('promo')) {
            replyText = "Exciting news! We currently have a 20% discount on all premium upgrades. Reply 'YES' to claim.";
        } else if (lower.includes('help') || lower.includes('support')) {
            replyText = "Our human agents are offline right now, but your request is logged. We'll get back to you within 24 hours.";
        } else if (lower.includes('status')) {
            replyText = "All node connections are green. Systems operating at 100% capacity.";
        } else if (lower.includes('appointment') || lower.includes('schedule')) {
            replyText = "Checking availability... We have open slots tomorrow at 10:00 AM or 2:00 PM. Reply with your choice!";
        } else {
            replyText = "Message safely received. Since I am an automated bot, a human agent will review your text shortly.";
        }

        setTimeout(async () => {
            // ACTUALLY Dispatch the SMS via PhilSMS API to their real phone number!
            let phoneTarget = senderNum;
            if (!phoneTarget || typeof phoneTarget === 'undefined') {
                 // Fallback: get phone from database if not explicitly parsed
                 const contacts = await window.BrandSyncAPI.getContacts();
                 const user = contacts.find(c => String(c.id) === String(contactId));
                 if (user) phoneTarget = user.phone;
            }

            if (phoneTarget) {
                 await window.BrandSyncAPI.sendSMS({
                     recipients: [phoneTarget],
                     message: replyText,
                     senderId: 'PhilSMS' // Or active sender ID
                 });
            }

            // Log the bots outbound reply natively
            await window.BrandSyncAPI.saveMessage({ contactId: contactId, text: replyText, sender: 'user' });
            
            // If the user hasn't switched chats, update the feed
            if (String(this.activeContactId) === String(contactId)) {
                this.loadMessages();
            }
            this.loadConversations();
            
            // Visual notification trigger
            if (window.showToast) {
                window.showToast("Bot dispatched automatic reply via PhilSMS!", "success");
            }
            if (window.BrandSyncAppInstance && window.BrandSyncAppInstance.refreshGatewayStatus) {
                window.BrandSyncAppInstance.refreshGatewayStatus();
            }
        }, 1500 + Math.random() * 1500);
    },

    toggleInfo() {
        const side = document.getElementById('infoSidebar');
        const content = document.getElementById('infoContent');
        this.isSidebarOpen = !this.isSidebarOpen;
        side.style.width = this.isSidebarOpen ? '320px' : '0';
        content.style.opacity = this.isSidebarOpen ? '1' : '0';
        if (this.isSidebarOpen) this.selectChat(this.activeContactId); // forces identity sync
    },

    async updateInfoPanel(contact) {
        document.getElementById('infoName').innerText = contact.name;
        document.getElementById('infoPhone').innerText = '+' + contact.phone;
        document.getElementById('infoId').innerText = 'INTENT-' + contact.id.toString().split('_')[0].substring(0,8).toUpperCase();
        const init = (contact.name || '?').split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
        document.getElementById('infoAvatar').innerText = init;
        document.getElementById('infoLast').innerText = '23 minutes ago'; // mock live status
    },

    async showCompose() {
        const modal = document.getElementById('composeModal');
        modal.style.display = 'flex';
        this.filterCompose('');
    },

    async filterCompose(query) {
        const contacts = await window.BrandSyncAPI.getContacts();
        const list = document.getElementById('composeList');
        const filtered = contacts.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.phone.includes(query));
        
        list.innerHTML = filtered.map(c => `
            <div onclick="window.InboxView.startChat('${c.id}')" style="padding:14px; background:rgba(255,255,255,0.03); border-radius:14px; cursor:pointer; display:flex; align-items:center; gap:12px;" onmouseover="this.style.background='rgba(255,255,255,0.06)'" onmouseout="this.style.background='rgba(255,255,255,0.03)'">
                <div style="width:40px; height:40px; border-radius:10px; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:0.8rem;">${(c.name||'?')[0]}</div>
                <div>
                    <div style="color:#fff; font-weight:700; font-size:0.9rem;">${c.name}</div>
                    <div style="color:rgba(255,255,255,0.35); font-size:0.75rem;">+${c.phone}</div>
                </div>
            </div>
        `).join('');
    },

    startChat(cid) {
        document.getElementById('composeModal').style.display = 'none';
        this.selectChat(cid);
    },

    formatTimeRelative(ts) {
        const diff = Date.now() - new Date(ts).getTime();
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        if(mins < 1) return 'now';
        if(mins < 60) return mins + 'm';
        if(hours < 24) return hours + 'h';
        return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { if(window.app) window.app.views['inbox'] = () => window.InboxView.render(window.app.contentArea); }, 100);
});
