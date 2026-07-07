// Contacts Management View Component (Apple Glass / visionOS Edition)
window.ContactsView = {
    async render(container) {
        container.innerHTML = `
            <div class="view-container active fade-in" style="display: flex; flex-direction: column; gap: 20px; min-height: 100%; padding: 24px; background: transparent; user-select: none;">
                
                <!-- Apple Glass Group Cards (Ultra-Smooth Spatial Scroll) -->
                <div style="display: flex; flex-direction: column; gap: 12px; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                        <div>
                            <h2 style="font-size: 1.35rem; font-weight: 800; color: #fff; letter-spacing: -0.03em;">Identity Collections</h2>
                            <p style="color: rgba(255,255,255,0.4); font-size: 0.8rem; font-weight: 500;">Glide through your secure identity pool.</p>
                        </div>
                        <button onclick="window.ContactsView.openGroupModal()" class="btn" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 6px 14px; border-radius: 10px; font-weight: 700; display: flex; align-items: center; gap: 6px; backdrop-filter: blur(10px); font-size: 0.8rem;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            New Group
                        </button>
                    </div>
                    
                    <div id="groupsList" class="premium-carousel spatial-kinetic-scroll" style="display: flex; gap: 12px; overflow-x: auto; padding: 25px 4px 35px; -ms-overflow-style: none; scrollbar-width: none; min-height: 140px; cursor: grab; transition: transform 0.2s; -webkit-overflow-scrolling: touch; perspective: 1000px;"></div>
                </div>

                <!-- Main Floating Table Card -->
                <div class="glass-panel" style="flex: 1; border-radius: 28px; overflow: hidden; display: flex; flex-direction: column; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
                    <div style="padding: 20px 28px; background: rgba(0,0,0,0.2); border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 16px;">
                        
                        <!-- Top Row: Title & Primary Actions -->
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <h2 id="viewTitle" style="font-size: 1.25rem; font-weight: 800; color: #fff; white-space: nowrap; margin: 0;">All Contacts</h2>
                            
                            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap; justify-content: flex-end;">
                                <button onclick="window.ContactsView.openPendingModal()" class="btn" style="background: rgba(255, 159, 10, 0.12); color: #ff9f0a; font-weight: 700; border: 1px solid rgba(255, 159, 10, 0.2); height: 40px; border-radius: 12px; padding: 0 16px; font-size: 0.85rem; display:flex; align-items:center; gap:8px; box-shadow: 0 4px 15px rgba(255, 159, 10, 0.1);">
                                    <i class="icon-lucide-clock" style="font-size:1rem;"></i>
                                    <span id="pendingBadgeCount" style="background:#ff9f0a; color:#000; padding:1px 6px; border-radius:8px; font-size:0.7rem; font-weight:900; display:none;">0</span>
                                    Pending Review
                                </button>
                                <input type="file" id="heavyImportInput" accept=".csv,.xlsx,.xls,.ods,.pdf" style="display:none;">
                                <button onclick="window.ContactsView.importContacts()" class="btn" style="background: rgba(50, 215, 75, 0.12); color: var(--success-color); font-weight: 700; border: 1px solid rgba(50, 215, 75, 0.2); height: 40px; border-radius: 12px; padding: 0 16px; font-size: 0.85rem; display:flex; align-items:center; gap:8px; box-shadow: 0 4px 15px rgba(50, 215, 75, 0.1);">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                    Heavy Import
                                </button>
                                <button onclick="window.ContactsView.openEditModal()" class="btn primary-btn" style="height: 40px; border-radius: 12px; padding: 0 20px; font-weight: 700; font-size: 0.85rem; display:flex; align-items:center; gap:8px;">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    Add Contact
                                </button>
                            </div>
                        </div>
                        
                        <!-- Bottom Row: Search, Filters, Bulk Actions -->
                        <div style="min-height: 44px; display: flex;">
                            
                            <!-- Default State (Search & Filters) -->
                            <div id="defaultActionControls" style="display: flex; gap:12px; align-items: center; justify-content: space-between; width:100%;">
                                <div style="flex: 1; max-width: 400px; position: relative; display: flex; align-items: center;">
                                    <svg style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3);" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                    <input type="text" id="contactSearch" placeholder="Search identities, tags, companies..." style="width: 100%; height: 44px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 0 40px; color: #fff; font-size: 0.9rem; outline: none; transition: 0.2s;" oninput="window.ContactsView.loadData()">
                                    <button id="clearSearchBtn" onclick="document.getElementById('contactSearch').value=''; window.ContactsView.loadData();" style="display:none; position:absolute; right:12px; top: 50%; transform: translateY(-50%); background:rgba(255,255,255,0.15); border:none; width:18px; height:18px; border-radius:50%; color:#fff; cursor:pointer; align-items:center; justify-content:center; font-size:0.6rem; font-weight:900; opacity:0.6; transition:0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'">✕</button>
                                </div>
                                <div style="display: flex; gap:12px; align-items: center;">
                                    <button id="advFilterToggleBtn" onclick="window.ContactsView.toggleAdvancedFilters()" style="height: 44px; border-radius: 12px; padding: 0 16px; background: rgba(255,255,255,0.05); color:#fff; border: 1px solid rgba(255,255,255,0.1); font-weight:700; font-size:0.85rem; align-items:center; gap:8px; display:flex;" title="Advanced Filter Options">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                                        Filter<span id="advFilterCounter" style="display:none; background:#0a84ff; color:#fff; border-radius:10px; padding:2px 6px; font-size:0.65rem; font-weight:800; margin-left:2px;"></span>
                                    </button>
                                    <button id="recentFilterBtn" onclick="window.ContactsView.toggleRecentFilter()" style="height: 44px; border-radius: 12px; padding: 0 16px; background: rgba(10,132,255,0.1); color:#0a84ff; border: 1px solid rgba(10,132,255,0.3); font-weight:700; font-size:0.85rem; align-items:center; gap:8px; display:flex;" title="Show only contacts from the last 7 days">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                        Recent
                                    </button>
                                </div>
                            </div>

                            <!-- Contextual Bulk State (Actions) -->
                            <div id="bulkActionControls" style="display: none; gap:12px; align-items: center; justify-content: space-between; width:100%; background: linear-gradient(90deg, rgba(30,20,35,0.8), rgba(10,10,20,0.9)); border-radius: 12px; padding: 0 16px; border: 1px solid rgba(191,90,242,0.3); box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <div style="width:28px; height:28px; border-radius:50%; background:var(--accent-color); color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:800; box-shadow: 0 4px 10px rgba(10,132,255,0.4);" id="contextualSelectedCount">0</div>
                                    <span style="font-size:0.9rem; color:#fff; font-weight:800;">Selected</span>
                                </div>
                                <div style="display:flex; gap:12px; align-items:center;">
                                    <button id="groupFromSelectionBtn" onclick="window.ContactsView.createGroupFromSelection()" style="height: 34px; border-radius: 8px; padding: 0 16px; background: rgba(191,90,242,0.18); color:#bf5af2; border: 1px solid rgba(191,90,242,0.4); font-weight:800; font-size:0.8rem; align-items:center; gap:8px; display:flex; white-space:nowrap;" title="Create a new group with these selected contacts">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                                        Create Group
                                    </button>
                                    <div id="addToGroupContainer" style="position:relative;">
                                        <button id="addToGroupBtn" onclick="window.ContactsView.toggleAddToGroupMenu()" style="height: 34px; border-radius: 8px; padding: 0 16px; background: rgba(50,215,75,0.15); color:var(--success-color); border: 1px solid rgba(50,215,75,0.3); font-weight:800; font-size:0.8rem; align-items:center; gap:8px; display:flex; white-space:nowrap;" title="Add selected to an existing group">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
                                            Add To...
                                        </button>
                                        <div id="addToGroupMenu" style="display:none; position:absolute; top:calc(100% + 8px); right:0; width:240px; background:rgba(30,30,35,0.98); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:12px; box-shadow:0 10px 40px rgba(0,0,0,0.8); z-index:100; backdrop-filter:blur(24px); max-height: 280px; overflow-y: auto;">
                                            <div style="font-size:0.7rem; color:rgba(255,255,255,0.4); font-weight:700; text-transform:uppercase; padding:4px 8px; margin-bottom:4px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:8px;">Select Group</div>
                                            <div id="addToGroupList"></div>
                                        </div>
                                    </div>
                                    <div style="width:1px; height:24px; background:rgba(255,255,255,0.2); margin:0 4px;"></div>
                                    <button id="bulkDeleteBtn" onclick="window.ContactsView.bulkDelete()" style="height: 34px; border-radius: 8px; padding: 0 16px; background: rgba(255,69,58,0.2); color:#ff453a; border: 1px solid rgba(255,69,58,0.4); font-weight:800; font-size:0.8rem; align-items:center; gap:8px; display:flex; white-space:nowrap;">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6L19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path></svg>
                                        Purge
                                    </button>
                                    <button onclick="window.ContactsView.toggleAll(false)" style="height: 34px; border-radius: 8px; padding: 0 16px; background: rgba(255,255,255,0.05); color:#fff; border: 1px solid rgba(255,255,255,0.1); font-weight:800; font-size:0.8rem; align-items:center; display:flex; cursor:pointer;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- ADVANCED FILTERS PANEL (Hidden by Default) -->
                    <div id="advancedFiltersPanel" style="display:none; padding: 16px 28px; background: rgba(0,0,0,0.15); border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <div style="display:flex; gap:16px; align-items:flex-end; flex-wrap:wrap;">
                            <div>
                                <label style="display:block; font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; margin-bottom:6px;">Date Added (From)</label>
                                <input type="date" id="filterDateFrom" onchange="window.ContactsView.loadData()" style="height:36px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:0 12px; color:#fff; font-size:0.8rem; outline:none; color-scheme:dark;">
                            </div>
                            <div>
                                <label style="display:block; font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; margin-bottom:6px;">Date Added (To)</label>
                                <input type="date" id="filterDateTo" onchange="window.ContactsView.loadData()" style="height:36px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:0 12px; color:#fff; font-size:0.8rem; outline:none; color-scheme:dark;">
                            </div>
                            <div>
                                <label style="display:block; font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; margin-bottom:6px;">Global Tag / Group Search</label>
                                <input type="text" id="filterTag" placeholder="E.g., VIP, Expo..." oninput="window.ContactsView.loadData()" style="width:160px; height:36px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:0 12px; color:#fff; font-size:0.8rem; outline:none;">
                            </div>
                            <div>
                                <label style="display:block; font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; margin-bottom:6px;">Unified Category Filter</label>
                                <select id="filterUnifiedSelector" onchange="window.ContactsView.loadData()" style="width:240px; height:36px; background:rgba(30,30,35,0.6); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:0 12px; color:#fff; font-size:0.8rem; outline:none; cursor:pointer;">
                                    <option value="">All Categories</option>
                                </select>
                            </div>
                            <div style="flex:1;"></div>
                            <button onclick="window.ContactsView.clearAdvancedFilters()" style="height: 36px; border-radius: 10px; padding: 0 16px; background: rgba(255,69,58,0.1); color:#ff453a; border: none; font-weight:700; font-size:0.8rem; cursor:pointer; align-self: flex-end;">
                                Clear All Filters
                            </button>
                        </div>
                        <div id="filterChipsContainer" style="display:flex; gap:8px; margin-top:16px; flex-wrap:wrap;"></div>
                    </div>
                    
                    <div style="flex: 1; overflow-x: auto; min-width: 100%; scrollbar-width: thin; scrollbar-color: rgba(255,159,10,0.3) transparent;">
                        <table style="width: 1150px; border-collapse: collapse; text-align: left; table-layout: fixed;">
                            <thead style="position: sticky; top: 0; background: rgba(30,30,35,0.8); backdrop-filter: blur(20px); z-index: 10;">
                                <tr>
                                    <th style="padding: 14px 24px; width: 45px;"><input type="checkbox" id="selectAllCheckbox" onchange="window.ContactsView.toggleAll(this.checked)" style="width: 17px; height: 17px; accent-color: var(--accent-color); cursor:pointer;"></th>
                                    <th style="padding: 14px 12px; font-weight: 700; font-size: 0.65rem; color: rgba(255,255,255,0.3); text-transform: uppercase; width: 220px;">Names</th>
                                    <th style="padding: 14px 12px; font-weight: 700; font-size: 0.65rem; color: rgba(255,255,255,0.3); text-transform: uppercase; width: 140px;">Phone</th>
                                    <th style="padding: 14px 12px; font-weight: 700; font-size: 0.65rem; color: rgba(255,255,255,0.3); text-transform: uppercase; width: 130px;">Company</th>
                                    <th style="padding: 14px 12px; font-weight: 700; font-size: 0.65rem; color: rgba(255,255,255,0.3); text-transform: uppercase; width: 110px;">Event</th>
                                    <th style="padding: 14px 12px; font-weight: 700; font-size: 0.65rem; color: rgba(255,255,255,0.3); text-transform: uppercase; width: 160px;">Interest</th>
                                    <th style="padding: 14px 12px; font-weight: 700; font-size: 0.65rem; color: rgba(255,255,255,0.3); text-transform: uppercase; width: 110px;">Position</th>
                                    <th style="padding: 14px 12px; font-weight: 700; font-size: 0.65rem; color: rgba(255,255,255,0.3); text-transform: uppercase; width: 125px;">Groups / Tags</th>
                                    <th style="padding: 14px 12px; text-align: right; font-weight: 700; font-size: 0.65rem; color: rgba(255,255,255,0.3); text-transform: uppercase; width: 110px;">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="contactsTableBody"></tbody>
                        </table>
                    </div>
                </div>

            </div>
        `;

        this._injectModals();
        this._renderPickers();
        this.loadGroups();
        this.loadData();
        this.updatePendingCounter();
        this.setupHeavyImport();
        setTimeout(() => this._initUltraSpatialScroll(), 200);
    },

    _injectModals() {
        // Remove old modal instances to avoid duplicates on re-render
        ['authModal', 'contactModal', 'groupModal'].forEach(id => {
            const old = document.getElementById(id);
            if (old) old.remove();
        });

        // Inject modals directly into body so position:fixed is viewport-relative
        const modalHTML = `
            <!-- Authorization Modal -->
            <div id="authModal" style="display:none; position:fixed; inset:0; z-index:40000; background:rgba(0,0,0,0.6); backdrop-filter:blur(40px) saturate(250%); align-items:center; justify-content:center; padding:20px;">
                <div class="glass-panel" style="width:340px; padding:32px; border-radius:32px; border:1px solid rgba(255,69,58,0.3); background:rgba(30,10,10,0.85); text-align:center;">
                    <h3 style="font-size:1.2rem; font-weight:800; color:#fff; margin-bottom:10px;">Security Override</h3>
                    <p style="font-size:0.8rem; color:rgba(255,255,255,0.5); margin-bottom:24px;">Enter authorization password to permanently purge this group.</p>
                    <input id="auth_password" type="password" placeholder="••••••••" style="width:100%; height:48px; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1); border-radius:14px; text-align:center; color:#fff; font-size:1.2rem; letter-spacing:0.3em; outline:none; margin-bottom:20px;">
                    <div style="display:flex; gap:10px;">
                        <button onclick="document.getElementById('authModal').style.display='none'" style="flex:1; height:48px; background:rgba(255,255,255,0.05); border-radius:14px; color:#fff; font-weight:700;">Cancel</button>
                        <button id="auth_confirmBtn" style="flex:1.5; height:48px; background:#ff453a; border-radius:14px; color:#fff; font-weight:800;">EXECUTE</button>
                    </div>
                </div>
            </div>

            <div id="contactModal" style="display:none; position:fixed; inset:0; z-index:20000; background:rgba(0,0,0,0.4); backdrop-filter:blur(30px) saturate(200%); align-items:center; justify-content:center; padding:20px;">
                <div class="glass-panel" style="width:100%; max-width:520px; max-height:90vh; overflow-y:auto; padding:32px; border-radius:36px; border:1px solid rgba(255,255,255,0.15); background:rgba(40,40,45,0.95); position: relative; animation: slideUp 0.4s cubic-bezier(0.1, 0.9, 0.2, 1); box-shadow: 0 40px 100px rgba(0,0,0,0.6);">
                    <button onclick="window.ContactsView.closeEditModal()" style="position: absolute; top: 20px; right: 20px; width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; cursor:pointer; color:#fff; border:1px solid rgba(255,255,255,0.1); font-size:1.2rem; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <h3 id="contactModalTitle" style="font-size:1.35rem; font-weight:800; color:#fff; margin-bottom:4px;">Identity Profile</h3>
                    <p id="contactAddedLabel" style="font-size:0.75rem; color:rgba(255,255,255,0.4); margin-bottom:24px;">Added: Unknown</p>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
                        <input type="hidden" id="edit_contactId">
                        <div style="grid-column: span 2; display: grid; grid-template-columns: 2fr 0.6fr 2fr; gap: 12px;">
                            <div>
                                <label style="font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; display:block; margin-bottom:6px; margin-left:4px;">First Name</label>
                                <input id="edit_contactFirstName" type="text" placeholder="John" style="width:100%; height:44px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:0 16px; color:#fff; font-size:0.95rem; outline:none;">
                            </div>
                            <div>
                                <label style="font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; display:block; margin-bottom:6px; margin-left:4px;">M.I.</label>
                                <input id="edit_contactMI" type="text" placeholder="D." maxlength="2" style="width:100%; height:44px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:0 8px; color:#fff; font-size:0.95rem; outline:none; text-align:center;">
                            </div>
                            <div>
                                <label style="font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; display:block; margin-bottom:6px; margin-left:4px;">Last Name</label>
                                <input id="edit_contactLastName" type="text" placeholder="Doe" style="width:100%; height:44px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:0 16px; color:#fff; font-size:0.95rem; outline:none;">
                            </div>
                        </div>
                        <div>
                            <label style="font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; display:block; margin-bottom:6px; margin-left:4px;">Mobile Number</label>
                            <input id="edit_contactPhone" type="text" placeholder="63917..." style="width:100%; height:44px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:0 16px; color:#fff; font-size:0.95rem; outline:none;">
                        </div>
                        <div>
                            <label style="font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; display:block; margin-bottom:6px; margin-left:4px;">Event</label>
                            <input id="edit_contactEvent" type="text" placeholder="Convention 2024" style="width:100%; height:44px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:0 16px; color:#fff; font-size:0.95rem; outline:none;">
                        </div>
                        <div>
                            <label style="font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; display:block; margin-bottom:6px; margin-left:4px;">Brand Interest</label>
                            <input id="edit_contactInterest" type="text" placeholder="SaaS, Mobile" style="width:100%; height:44px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:0 16px; color:#fff; font-size:0.95rem; outline:none;">
                        </div>
                        <div>
                            <label style="font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; display:block; margin-bottom:6px; margin-left:4px;">Awareness</label>
                            <input id="edit_contactAwareness" type="text" placeholder="Social Media" style="width:100%; height:44px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:0 16px; color:#fff; font-size:0.95rem; outline:none;">
                        </div>
                        <div>
                            <label style="font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; display:block; margin-bottom:6px; margin-left:4px;">Position</label>
                            <input id="edit_contactPosition" type="text" placeholder="CEO / Manager" style="width:100%; height:44px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:0 16px; color:#fff; font-size:0.95rem; outline:none;">
                        </div>
                        <div>
                            <label style="font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; display:block; margin-bottom:6px; margin-left:4px;">Sales Person</label>
                            <input id="edit_contactSales" type="text" placeholder="Agent 007" style="width:100%; height:44px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:0 16px; color:#fff; font-size:0.95rem; outline:none;">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; display:block; margin-bottom:6px; margin-left:4px;">Company</label>
                            <input id="edit_contactCompany" type="text" placeholder="Acme Corp" style="width:100%; height:44px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:0 16px; color:#fff; font-size:0.95rem; outline:none;">
                        </div>
                        <div style="grid-column: span 2;">
                            <label style="font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; display:block; margin-bottom:6px; margin-left:4px;">Tags / Groups</label>
                            <div id="groupCheckboxes" style="display: flex; flex-direction: column; gap: 6px; background: rgba(0,0,0,0.25); padding: 12px; border-radius: 16px; max-height: 120px; overflow-y: auto; border: 1px solid rgba(255,255,255,0.08);"></div>
                        </div>
                    </div>
                    <div style="display:flex; gap:10px; margin-top:32px;">
                        <button onclick="window.ContactsView.closeEditModal()" style="flex:1; height:48px; background:rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius:14px; color:#fff; font-weight:700;">Cancel</button>
                        <button onclick="window.ContactsView.saveContact()" style="flex:1.8; height:48px; background:var(--accent-color); border:none; border-radius:14px; color:#fff; font-weight:800;">Sync Profile</button>
                    </div>
                </div>
            </div>

            <!-- Group Modal -->
            <div id="groupModal" style="display:none; position:fixed; inset:0; z-index:20000; background:rgba(0,0,0,0.6); backdrop-filter:blur(40px) saturate(200%); align-items:center; justify-content:center; padding:20px;">
                <div class="glass-panel" style="width:100%; max-width:720px; max-height:90vh; overflow-y:auto; padding:32px; border-radius:36px; border:1px solid rgba(255,255,255,0.15); background:rgba(40,40,45,0.95); position: relative; animation: slideUp 0.4s cubic-bezier(0.1, 0.9, 0.2, 1); box-shadow: 0 40px 100px rgba(0,0,0,0.6);">
                    <button onclick="document.getElementById('groupModal').style.display='none'" style="position: absolute; top: 20px; right: 20px; width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; cursor:pointer; color:#fff; border:1px solid rgba(255,255,255,0.1); font-size:1.2rem; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <input type="hidden" id="edit_groupId">
                    <h3 id="groupModalTitle" style="font-size:1.4rem; font-weight:800; color:#fff; margin-bottom:24px;">Customize Group</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:32px;">
                        <div style="display:flex; flex-direction:column; gap:20px;">
                            <div><label style="display:block; font-size:0.65rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-weight:800; margin-bottom:10px;">Group Identity</label><input id="newGroupName" type="text" placeholder="Group Name" style="width:100%; height:48px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:0 16px; color:#fff; font-size:1rem; outline:none; font-weight:700;"></div>
                            <div><label style="display:block; font-size:0.65rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-weight:800; margin-bottom:10px;">Description</label><textarea id="newGroupDesc" placeholder="Optional description..." style="width:100%; height:60px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:16px; padding:12px 16px; color:#fff; font-size:0.9rem; outline:none; resize:none;"></textarea></div>
                            <div><label style="display:block; font-size:0.65rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-weight:800; margin-bottom:12px;">Brand Palette</label><div id="colorPicker" style="display:flex; flex-wrap:wrap; gap:10px;"></div></div>
                            <div><label style="display:block; font-size:0.65rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-weight:800; margin-bottom:12px;">Symbol Glyph</label><div id="iconPicker" style="display:flex; flex-wrap:wrap; gap:8px; background:rgba(0,0,0,0.2); padding:12px; border-radius:20px;"></div></div>
                        </div>
                        <div style="display:flex; flex-direction:column; background: rgba(0,0,0,0.15); border-radius: 20px; padding: 20px; border: 1px solid rgba(255,255,255,0.05);">
                            <label style="display:block; font-size:0.65rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-weight:800; margin-bottom:10px;">Add Numbers from Global Pool</label>
                            <div style="position: relative; margin-bottom: 12px;">
                                <svg style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3);" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input type="text" id="groupPoolFilter" oninput="window.ContactsView.filterGroupPool()" placeholder="Filter global pool..." style="width:100%; height:40px; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:0 36px; color:#fff; font-size:0.85rem; outline:none;">
                            </div>
                            <div id="groupPoolList" style="flex:1; max-height: 240px; overflow-y: auto; display:flex; flex-direction:column; gap:6px; padding-right: 4px;"></div>
                        </div>
                    </div>
                    <div style="display:flex; gap:12px; margin-top:32px;">
                        <button onclick="document.getElementById('groupModal').style.display='none'" style="flex:1; height:48px; background:rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius:14px; color:#fff; font-weight:700;">Cancel</button>
                        <button onclick="window.ContactsView.saveGroup()" style="flex:1.8; height:48px; background:var(--accent-color); border:none; border-radius:14px; color:#fff; font-weight:800;">Apply Changes</button>
                    </div>
                </div>
            </div>

            <!-- Pending Approval Modal -->
            <div id="pendingModal" style="display:none; position:fixed; inset:0; z-index:30000; background:rgba(0,0,0,0.5); backdrop-filter:blur(50px) saturate(220%); align-items:center; justify-content:center; padding:20px;">
                <div class="glass-panel" style="width:1100px; max-width: 95vw; max-height:90vh; overflow-y:auto; padding:32px; border-radius:40px; border:1px solid rgba(255,159,10,0.25); background:rgba(30,22,15,0.92); position: relative; animation: slideUp 0.5s cubic-bezier(0.1, 0.9, 0.25, 1); box-shadow: 0 50px 120px rgba(0,0,0,0.7); display:flex; flex-direction:column; gap:28px;">
                    
                    <!-- AI Scanner Overlay -->
                    <div id="pendingLoadingOverlay" class="ai-scanner-overlay">
                        <div class="scanner-aura"></div>
                        <div class="scanner-beam"></div>
                        <div class="scanner-content">
                            <div class="scanner-logo"><i class="icon-lucide-scan-face"></i></div>
                            <div class="scanner-text">Optimizing BrandSync Nodes...</div>
                        </div>
                    </div>

                    <button onclick="window.ContactsView.closePendingModal()" style="position: absolute; top: 24px; right: 24px; width:40px; height:40px; border-radius:50%; background:rgba(255,159,10,0.1); border:1px solid rgba(255,159,10,0.3); color:#ff9f0a; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 10;" onmouseover="this.style.background='rgba(255,159,10,0.25)'; this.style.transform='rotate(90deg) scale(1.1)'" onmouseout="this.style.background='rgba(255,159,10,0.1)'; this.style.transform='rotate(0deg) scale(1)'">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h3 style="font-size:1.4rem; font-weight:800; color:#ff9f0a; margin-bottom:4px;">Pending Contacts Review</h3>
                            <p style="font-size:0.8rem; color:rgba(255,159,10,0.5);">Review and approve contacts from Brand-Sync Lead Syndication.</p>
                        </div>
                        <div style="display:flex; gap:16px; align-items:center; margin-right: 50px;">
                            <input type="text" id="pendingFilter" placeholder="Live Filter..." oninput="window.ContactsView.loadPendingData()" class="glass-input" style="background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:14px; color:#fff; padding:10px 16px; font-size:0.85rem; outline:none; max-width:200px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.3);">
                            <span id="sync-status" style="font-size:0.75rem; color:rgba(255,159,10,0.8); font-weight:700; text-transform: uppercase; letter-spacing: 0.05em;">Status: Ready</span>
                            <button id="pull-leads-btn" class="btn" style="background:linear-gradient(135deg, rgba(255,159,10,0.25), rgba(255,159,10,0.1)); border:1px solid rgba(255,159,10,0.5); color:#ff9f0a; padding:12px 24px; border-radius:16px; font-weight:800; font-size: 0.85rem; display:flex; align-items:center; gap:10px; box-shadow: 0 4px 20px rgba(255,159,10,0.2); transition: 0.3s; cursor: pointer;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 25px rgba(255,159,10,0.3)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(255,159,10,0.2)'">
                                <i class="icon-lucide-list-restart" style="font-size:1.1rem;"></i> Sync BrandSync Data
                            </button>
                        </div>
                    </div>

                    <div id="pendingBulkActions" style="display:none; padding:12px 20px; background:rgba(255,159,10,0.1); border:1px solid rgba(255,159,10,0.2); border-radius:18px; align-items:center; gap:16px;">
                        <span style="font-size:0.85rem; color:#fff; font-weight:700;"><span id="pendingSelectCount">0</span> selected for action</span>
                        
                        <div style="display:flex; align-items:center; gap:8px; margin-left:16px;">
                            <span style="font-size:0.75rem; color:rgba(255,255,255,0.6); font-weight:700;">Assign to:</span>
                            <select id="pendingBulkGroupSelect" onchange="if(this.value==='new') { document.getElementById('pendingBulkNewGroup').style.display='block'; } else { document.getElementById('pendingBulkNewGroup').style.display='none'; }" style="background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.2); border-radius:12px; color:#fff; padding:6px 10px; font-size:0.75rem; outline:none; max-width: 140px; cursor:pointer;">
                                <option value="">None</option>
                                <option value="new">Create New Group...</option>
                            </select>
                            <input type="text" id="pendingBulkNewGroup" placeholder="New Group Name" style="display:none; background:rgba(0,0,0,0.5); border:1px solid rgba(255,159,10,0.5); border-radius:12px; color:#fff; padding:6px 12px; font-size:0.75rem; outline:none; max-width: 140px;">
                        </div>

                        <div style="flex:1;"></div>
                        <button onclick="window.ContactsView.bulkDeletePending()" class="btn" style="background:rgba(255,69,58,0.15); border:1px solid rgba(255,69,58,0.3); color:#ff453a; padding:8px 16px; border-radius:12px; font-weight:700; font-size:0.8rem;">Delete Selected</button>
                        <button onclick="window.ContactsView.bulkApprovePending()" class="btn" style="background:rgba(50,215,75,0.15); border:1px solid rgba(50,215,75,0.3); color:#32d74b; padding:8px 20px; border-radius:12px; font-weight:800; font-size:0.85rem;">Approve Selected</button>
                    </div>

                    <div id="contacts" style="background:rgba(0,0,0,0.2); border-radius:24px; border:1px solid rgba(255,255,255,0.05); overflow:hidden; display:flex; flex-direction:column; max-height: 400px;">
                        <div style="flex:1; overflow-y:auto; overflow-x:hidden;">
                            <table style="width:100%; border-collapse:collapse;">
                                <thead style="background:rgba(255,255,255,0.05); position:sticky; top:0; z-index:10; backdrop-filter:blur(20px); border-bottom: 2px solid rgba(255,159,10,0.3);">
                                    <tr>
                                        <th style="padding:16px 20px; text-align:left; width:45px;"><input type="checkbox" id="selectAllPending" onchange="window.ContactsView.toggleAllPending(this.checked)" style="width:17px; height:17px; accent-color:#ff9f0a; cursor:pointer;"></th>
                                        <th style="padding:16px 12px; text-align:left; font-size:0.65rem; color:rgba(255,255,255,0.3); text-transform:uppercase;">Contact Info</th>
                                        <th style="padding:16px 12px; text-align:left; font-size:0.65rem; color:rgba(255,255,255,0.3); text-transform:uppercase;">Phone Number</th>
                                        <th style="padding:16px 12px; text-align:left; font-size:0.65rem; color:rgba(255,255,255,0.3); text-transform:uppercase;">Company</th>
                                        <th style="padding:16px 12px; text-align:left; font-size:0.65rem; color:rgba(255,255,255,0.3); text-transform:uppercase;">Event</th>
                                        <th style="padding:16px 12px; text-align:left; font-size:0.65rem; color:rgba(255,255,255,0.3); text-transform:uppercase;">Interest</th>
                                        <th style="padding:16px 20px; text-align:right; font-size:0.65rem; color:rgba(255,255,255,0.3); text-transform:uppercase;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="pendingTableBody"></tbody>
                            </table>
                        </div>
                        <div id="pendingEmptyState" style="display:none; padding:80px 20px; text-align:center; color:rgba(255,255,255,0.2);">
                            <i class="icon-lucide-users" style="font-size:3rem; margin-bottom:16px; display:block; opacity:0.3;"></i>
                            <p style="font-weight:600;">No pending contacts to review.</p>
                            <p style="font-size:0.8rem; margin-top:4px;">Click 'Get Data From BrandSync Leads Collection' to fetch latest data.</p>
                        </div>
                    </div>
                </div>
            </div>`;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = modalHTML;
        while (wrapper.firstChild) document.body.appendChild(wrapper.firstChild);
    },

    activeGroupId: null, selectedColor: '#0a84ff', selectedIcon: 'Users', cachedGroups: [], activePoolContacts: [], selectedPoolContacts: new Set(),
    GROUP_ICONS: {
        'Users': '<circle cx="12" cy="7" r="4"></circle><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>',
        'Tag': '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>',
        'Briefcase': '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>',
        'Star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>',
        'Heart': '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
        'Shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>',
        'Award': '<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>',
        'Mail': '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>',
        'Zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>'
    },
    GROUP_COLORS: ['#0a84ff', '#32d74b', '#5e5ce6', '#ff9f0a', '#ff375f', '#bf5af2', '#ff453a', '#64d2ff', '#ffd60a'],

    _renderPickers() {
        const cp = document.getElementById('colorPicker'); const ip = document.getElementById('iconPicker');
        if (!cp) return;
        cp.innerHTML = this.GROUP_COLORS.map(c => `<div onclick="window.ContactsView.selectColor('${c}')" class="color-dot" style="width:28px; height:28px; border-radius:50%; background:${c}; cursor:pointer; border:3px solid transparent; transition:0.2s;" data-color="${c}"></div>`).join('');
        const activeColor = this.selectedColor;
        ip.innerHTML = Object.keys(this.GROUP_ICONS).map(name => {
            const isActive = name === this.selectedIcon;
            return `<div onclick="window.ContactsView.selectIcon('${name}')" class="icon-dot" style="width:40px; height:40px; border-radius:12px; display:flex; align-items:center; justify-content:center; background:${isActive ? activeColor + '33' : 'rgba(255,255,255,0.05)'}; color:${activeColor}; cursor:pointer; transition:0.2s; border:1px solid ${isActive ? activeColor + '88' : 'transparent'};" data-icon="${name}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${this.GROUP_ICONS[name]}</svg></div>`;
        }).join('');
    },

    selectColor(c) {
        this.selectedColor = c;
        document.querySelectorAll('.color-dot').forEach(el => el.classList.toggle('active', el.dataset.color === c));
        // Update all icon dots to use the new color
        document.querySelectorAll('.icon-dot').forEach(el => {
            const isActive = el.dataset.icon === this.selectedIcon;
            el.style.color = c;
            el.style.background = isActive ? c + '33' : 'rgba(255,255,255,0.05)';
            el.style.borderColor = isActive ? c + '88' : 'transparent';
        });
    },
    selectIcon(name) {
        this.selectedIcon = name;
        const c = this.selectedColor;
        document.querySelectorAll('.icon-dot').forEach(el => {
            const isActive = el.dataset.icon === name;
            el.style.background = isActive ? c + '33' : 'rgba(255,255,255,0.05)';
            el.style.borderColor = isActive ? c + '88' : 'transparent';
            el.classList.toggle('active', isActive);
        });
    },

    async loadGroups() {
        const slider = document.getElementById('groupsList'); if (!slider) return;
        const groups = await window.BrandSyncAPI.getGroups(); this.cachedGroups = groups;
        const contacts = await window.BrandSyncAPI.getContacts(); const counts = groups.reduce((acc, g) => { acc[g.id] = contacts.filter(c => (c.groupIds || []).some(gid => String(gid) === String(g.id))).length; return acc; }, {});
        const gc = document.getElementById('groupCheckboxes'); if (gc) gc.innerHTML = groups.map(g => `<label style="display:flex; align-items:center; gap:10px; padding:8px 12px; border-radius:10px; background:rgba(255,255,255,0.03); cursor:pointer;"><input type="checkbox" class="group-select-check" value="${g.id}" style="width:16px; height:16px; accent-color:${g.color};"><span style="color:#fff; font-size:0.85rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${g.name}</span></label>`).join('');

        let html = `<div onclick="window.ContactsView.setGroup(null)" class="glass-card pool-card ${this.activeGroupId === null ? 'active' : ''}" style="flex: 0 0 150px; height: 110px; padding: 18px; border-radius: 24px; background: ${this.activeGroupId === null ? 'rgba(10,132,255,0.18)' : 'rgba(255,255,255,0.04)'}; border: 1px solid ${this.activeGroupId === null ? 'rgba(10,132,255,0.35)' : 'rgba(255,255,255,0.1)'}; backdrop-filter: blur(25px); cursor: pointer; transition: transform 0.3s, background 0.3s; position: relative; display:flex; flex-direction:column; justify-content: space-between; scroll-snap-align: center; transform-origin: center;">
            <div style="display:flex; justify-content: space-between; align-items: flex-start;">
                <div style="width: 38px; height: 38px; border-radius: 12px; background: rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; color: #fff;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${this.GROUP_ICONS['Users']}</svg></div>
            </div>
            <div><h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 2px;">Global Pool</h4><p style="font-size: 0.65rem; color: rgba(255,255,255,0.35);">${contacts.length} Records</p></div></div>`;

        groups.forEach((g, idx) => {
            const isActive = this.activeGroupId === g.id; const color = g.color || '#32d74b'; const iconSvg = this.GROUP_ICONS[g.icon || 'Users'];
            const displayRank = idx + 1;
            html += `<div onclick="window.ContactsView.setGroup(${g.id})" class="glass-card group-card ${isActive ? 'active' : ''}" style="flex: 0 0 150px; height: 110px; padding: 18px; border-radius: 24px; background: ${isActive ? color + '22' : 'rgba(255,255,255,0.04)'}; border: 1px solid ${isActive ? color + '66' : 'rgba(255,255,255,0.1)'}; backdrop-filter: blur(25px); cursor: pointer; transition: transform 0.3s, background 0.3s; position: relative; display:flex; flex-direction:column; justify-content: space-between; scroll-snap-align: center; transform-origin: center;">
                <div style="display:flex; justify-content: space-between; align-items: flex-start;">
                    <div style="width: 38px; height: 38px; border-radius: 12px; background: ${color + '1a'}; display:flex; align-items:center; justify-content:center; color: ${color};"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${iconSvg}</svg></div>
                    <div class="card-ops" style="display:flex; gap: 8px;"><button onclick="event.stopPropagation(); window.ContactsView.openGroupModal(${JSON.stringify(g).replace(/"/g, '&quot;')})" class="op-btn edit" style="background:none; border:none; padding:0; cursor:pointer; color:#32d74b; opacity:0.35; transition:0.2s;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path></svg></button><button onclick="event.stopPropagation(); window.ContactsView.tripleDeleteGroup(${g.id}, '${g.name.replace(/'/g, "\\'")}')" class="op-btn delete" style="background:none; border:none; padding:0; cursor:pointer; color:#ff453a; opacity:0.35; transition:0.2s;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6L19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path></svg></button></div></div>
                <div style="display:flex; justify-content: space-between; align-items: flex-end;">
                    <div style="flex:1; overflow:hidden;" title="${g.description || ''}"><h4 style="font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${g.name}</h4><p style="font-size: 0.65rem; color: rgba(255,255,255,0.35);">${counts[g.id]} Records</p></div>
                    <div class="rank-badge" style="position: relative;">
                        <input type="number" value="${displayRank}" onchange="window.ContactsView.updateRank(${idx}, this.value)" onclick="event.stopPropagation()" style="width: 26px; height: 26px; border-radius: 6px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); text-align: center; font-weight: 800; font-size: 0.65rem; outline: none; transition: 0.2s;">
                        <div style="position: absolute; bottom: -12px; right: 0; font-size: 0.4rem; color: rgba(255,255,255,0.15); font-weight: 900; text-transform: uppercase;">ID</div>
                    </div></div></div>`;
        });
        slider.innerHTML = html;

        if (!document.getElementById('manual-refinement-css')) {
            const st = document.createElement('style'); st.id = 'manual-refinement-css';
            st.innerHTML = `
                .op-btn:hover { opacity: 1 !important; transform: scale(1.25); } 
                .rank-badge input:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.3); color: #fff; }
                .rank-badge input:focus { border-color: var(--accent-color) !important; background: rgba(10,132,255,0.1) !important; box-shadow: 0 0 10px rgba(10,132,255,0.2); color: #fff; }
                input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
                .glass-card:active { transform: scale(0.95) !important; }
                .glass-card { backface-visibility: hidden; transform-style: preserve-3d; will-change: transform; transition: transform 0.2s cubic-bezier(0.2, 1, 0.2, 1); }
            `;
            document.head.appendChild(st);
        }
    },

    _initUltraSpatialScroll() {
        const slider = document.getElementById('groupsList'); if (!slider) return;
        let isDown = false, startX, scrollLeft, velocity = 0, lastX = 0, momentumID;
        const cleanup = () => { isDown = false; slider.style.cursor = 'grab'; cancelAnimationFrame(momentumID); momentum(); };
        const momentum = () => { if (Math.abs(velocity) < 0.1) return; slider.scrollLeft -= velocity; velocity *= 0.94; const tilt = Math.max(-8, Math.min(8, velocity * 0.8)); Array.from(slider.children).forEach(card => card.style.transform = `rotateY(${tilt}deg) scale(${1 - Math.abs(velocity) * 0.002})`); if (!isDown) momentumID = requestAnimationFrame(momentum); else resetTilt(); };
        const resetTilt = () => Array.from(slider.children).forEach(card => card.style.transform = 'rotateY(0) scale(1)');
        slider.addEventListener('mousedown', (e) => { isDown = true; slider.style.cursor = 'grabbing'; startX = e.pageX - slider.offsetLeft; scrollLeft = slider.scrollLeft; cancelAnimationFrame(momentumID); velocity = 0; });
        slider.addEventListener('mousemove', (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - slider.offsetLeft; const walk = (x - startX) * 1.5; velocity = x - lastX; lastX = x; slider.scrollLeft = scrollLeft - walk; const tilt = Math.max(-12, Math.min(12, velocity * 1.2)); Array.from(slider.children).forEach(card => card.style.transform = `rotateY(${tilt}deg) scale(0.98)`); });
        window.addEventListener('mouseup', () => { if (isDown) cleanup(); });
        slider.addEventListener('mouseleave', () => { if (isDown) cleanup(); });
    },

    async updateRank(currentIdx, newValue) {
        let newRank = parseInt(newValue); if (isNaN(newRank)) return;
        let targetIdx = Math.max(0, Math.min(this.cachedGroups.length - 1, newRank - 1));
        if (targetIdx === currentIdx) { this.loadGroups(); return; }
        const newGroups = [...this.cachedGroups]; const [removed] = newGroups.splice(currentIdx, 1); newGroups.splice(targetIdx, 0, removed);
        this.cachedGroups = newGroups; await window.BrandSyncAPI.updateGroupsOrder(this.cachedGroups); window.showToast(`Relocating: Rank ${newRank}`, "info"); this.loadGroups();
    },

    setGroup(id) {
        this.activeGroupId = id; this.loadGroups(); this.loadData();
        const title = document.getElementById('viewTitle'); if (title) title.innerText = id ? (this.cachedGroups.find(x => x.id === id)?.name || "Group") : "All Contacts";
    },

    toggleAll(checked) {
        const cbs = document.querySelectorAll('.contact-checkbox');
        cbs.forEach(cb => cb.checked = checked);
        this.updateBulkUI();
    },

    updateBulkUI() {
        const count = document.querySelectorAll('.contact-checkbox:checked').length;

        const defaultCtrl = document.getElementById('defaultActionControls');
        const bulkCtrl = document.getElementById('bulkActionControls');
        const countBadge = document.getElementById('contextualSelectedCount');

        if (count > 0) {
            if (defaultCtrl) defaultCtrl.style.display = 'none';
            if (bulkCtrl) bulkCtrl.style.display = 'flex';
            if (countBadge) countBadge.innerText = count;
        } else {
            if (defaultCtrl) defaultCtrl.style.display = 'flex';
            if (bulkCtrl) bulkCtrl.style.display = 'none';
            const menu = document.getElementById('addToGroupMenu');
            if (menu) menu.style.display = 'none';
        }
    },

    async createGroupFromSelection() {
        // Gather selected contact IDs from visible checkboxes
        const checkedIds = Array.from(document.querySelectorAll('.contact-checkbox:checked')).map(cb => String(cb.value));
        if (checkedIds.length === 0) return;

        // Load all contacts to pre-fill the pool
        this.activePoolContacts = await window.BrandSyncAPI.getContacts();
        // Pre-select only the chosen ones
        this.selectedPoolContacts = new Set(checkedIds);

        // Reset group form fields
        const modal = document.getElementById('groupModal');
        const nameInp = document.getElementById('newGroupName');
        const descInp = document.getElementById('newGroupDesc');
        document.getElementById('groupModalTitle').innerText = 'New Group from Selection';
        nameInp.value = '';
        descInp.value = '';
        document.getElementById('edit_groupId').value = '';
        this.selectColor('#0a84ff');
        this.selectIcon('Users');

        // Render the pool list with pre-selected contacts at top
        document.getElementById('groupPoolFilter').value = '';
        this.filterGroupPool();

        // Show modal
        modal.style.display = 'flex';

        // Flash a hint toast
        window.showToast(`${checkedIds.length} contacts pre-selected. Name your group and save!`, 'info');
    },

    toggleAddToGroupMenu() {
        const menu = document.getElementById('addToGroupMenu');
        const list = document.getElementById('addToGroupList');
        if (!menu || !list) return;

        if (menu.style.display === 'block') {
            menu.style.display = 'none';
            return;
        }

        // Show spinner while fetching groups
        list.innerHTML = `<div style="padding:10px; color:#fff; text-align:center;"><svg class="spin" style="width:16px;height:16px;opacity:0.3;" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='12' y1='2' x2='12' y2='6'/><path d='M12 18v4'/><path d='M4.93 4.93l2.83 2.83'/><path d='M16.24 16.24l2.83 2.83'/><path d='M2 12h4'/><path d='M18 12h4'/><path d='M4.93 19.07l2.83-2.83'/><path d='M16.24 7.76l2.83-2.83'/></svg></div>`;
        menu.style.display = 'block';

        window.BrandSyncAPI.getGroups().then(groups => {
            if (!groups || groups.length === 0) {
                list.innerHTML = `<div style="padding:10px; color:#888; font-size:0.8rem; text-align:center;">No existing groups.</div>`;
                return;
            }
            list.innerHTML = groups.map(g => `
                <div style="padding:8px 10px; cursor:pointer; font-size:0.85rem; border-radius:8px; transition:0.2s; color:#fff; display:flex; align-items:center; gap:8px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background=''" onclick="window.ContactsView.confirmAddToGroup(${g.id}, '${g.name.replace(/'/g, "\\'")}')">
                    <div style="width:12px; height:12px; border-radius:50%; background:${g.color || '#fff'};"></div>
                    <div style="flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:600;">${g.name}</div>
                </div>
            `).join('');
        });

        // Auto close handler
        const closeHandler = (e) => {
            const btn = document.getElementById('addToGroupBtn');
            if (btn && !btn.contains(e.target) && !menu.contains(e.target)) {
                menu.style.display = 'none';
                document.removeEventListener('click', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('click', closeHandler), 10);
    },

    async confirmAddToGroup(groupId, groupName) {
        const checkedInputs = Array.from(document.querySelectorAll('.contact-checkbox:checked'));
        const idsToAdd = checkedInputs.map(cb => String(cb.value));
        if (idsToAdd.length === 0) return;

        document.getElementById('addToGroupMenu').style.display = 'none';
        window.showToast("Appending contacts to group...", "info");

        const allContacts = await window.BrandSyncAPI.getContacts();
        let addedCount = 0;

        for (const c of allContacts) {
            if (idsToAdd.includes(String(c.id))) {
                let currentGids = c.groupIds || [];
                if (!currentGids.includes(groupId)) {
                    currentGids.push(groupId);
                    c.groupIds = currentGids;
                    await window.BrandSyncAPI.saveContact(c);
                    addedCount++;
                }
            }
        }

        if (addedCount > 0) {
            window.showToast(`Successfully added ${addedCount} new contacts to "${groupName}".`, "success");
        } else {
            window.showToast(`Selected contacts are already in "${groupName}".`, "info");
        }

        const selectAll = document.getElementById('selectAllCheckbox');
        if (selectAll) selectAll.checked = false;

        this.loadGroups();
        this.loadData();
    },

    async bulkDelete() {
        const checkedInputs = Array.from(document.querySelectorAll('.contact-checkbox:checked'));
        const idsToDelete = checkedInputs.map(cb => cb.value); // Capture IDs immediately
        if (idsToDelete.length === 0) return;

        window.BrandSyncAppInstance.confirmAction(`Purge ${idsToDelete.length} Identities?`, "This will permanently terminate the selected records from the database.", "#ff453a", async () => {
            // Use the captured idsToDelete array instead of re-querying or using global state
            for (const id of idsToDelete) {
                await window.BrandSyncAPI.deleteContact(id);
            }
            window.showToast(`${idsToDelete.length} Identities purged successfully.`, "success");

            const selectAll = document.getElementById('selectAllCheckbox');
            if (selectAll) selectAll.checked = false;

            this.loadData();
        });
    },

    async deleteIndividual(id, name) {
        // SURGICAL DELETE: Only ever deletes the ID passed directly to it.
        const actualId = id;
        window.BrandSyncAppInstance.confirmAction("Confirm Purge", `Terminate record "${name}"?`, "#ff453a", async () => {
            console.log("[Delete] Individually purging ID:", actualId);
            await window.BrandSyncAPI.deleteContact(actualId);
            window.showToast("Record terminated.", "success");
            this.loadData();
        });
    },

    isRecentFilterActive: false,

    toggleRecentFilter() {
        this.isRecentFilterActive = !this.isRecentFilterActive;
        const btn = document.getElementById('recentFilterBtn');
        if (btn) {
            if (this.isRecentFilterActive) {
                btn.style.background = 'rgba(10,132,255,0.3)';
                btn.style.borderColor = 'rgba(10,132,255,0.6)';
            } else {
                btn.style.background = 'rgba(10,132,255,0.1)';
                btn.style.borderColor = 'rgba(10,132,255,0.3)';
            }
        }
        this.loadData();
    },

    toggleAdvancedFilters() {
        const panel = document.getElementById('advancedFiltersPanel');
        const btn = document.getElementById('advFilterToggleBtn');
        if (!panel) return;

        if (panel.style.display === 'none') {
            panel.style.display = 'block';
            if (btn) btn.style.background = 'rgba(255,255,255,0.15)';
        } else {
            panel.style.display = 'none';
            if (btn) btn.style.background = 'rgba(255,255,255,0.05)';
        }
    },

    clearAdvancedFilters() {
        if (document.getElementById('filterDateFrom')) document.getElementById('filterDateFrom').value = '';
        if (document.getElementById('filterDateTo')) document.getElementById('filterDateTo').value = '';
        if (document.getElementById('filterTag')) document.getElementById('filterTag').value = '';
        if (document.getElementById('filterUnifiedSelector')) document.getElementById('filterUnifiedSelector').value = '';

        if (this.isRecentFilterActive) {
            this.toggleRecentFilter(); // This natively re-renders loadData
        } else {
            this.loadData();
        }
    },

    async loadData() {
        const tbody = document.getElementById('contactsTableBody');

        const searchInput = document.getElementById('contactSearch');
        const clearBtn = document.getElementById('clearSearchBtn');
        const searchQuery = (searchInput?.value || '').trim();

        if (clearBtn) clearBtn.style.display = searchQuery ? 'flex' : 'none';

        const dateFrom = document.getElementById('filterDateFrom')?.value;
        const dateTo = document.getElementById('filterDateTo')?.value;
        const filterTag = (document.getElementById('filterTag')?.value || '').toLowerCase();
        const dropUnified = (document.getElementById('filterUnifiedSelector')?.value || ''); // e.g. "company:Google"

        if (!tbody) return;

        let contacts = await window.BrandSyncAPI.getContacts();
        const groups = await window.BrandSyncAPI.getGroups();
        const grpMap = groups.reduce((acc, g) => { acc[g.id] = g; return acc; }, {});

        // UNIFIED DROPDOWN POPULATION logic
        const populateUnified = (id, data, currentValue) => {
            const select = document.getElementById(id);
            if (!select) return;

            // If already populated with something more than just "All", we might not need to re-parse unless contacts changed
            // But for simplicity and to handle dynamic data, we'll re-render if count is small or on first load
            if (select.options.length > 1 && !this._forceRefreshDropdowns) {
                // Optimization: only re-populate if we really need to
            } else {
                const html = [`<option value="">All Categories</option>`];

                const addGroup = (label, items, prefix) => {
                    if (items.size === 0) return;
                    html.push(`<optgroup label="${label}">`);
                    Array.from(items).sort().forEach(item => {
                        html.push(`<option value="${prefix}:${item.toLowerCase()}">${item}</option>`);
                    });
                    html.push(`</optgroup>`);
                };

                addGroup('COMPANIES', data.companies, 'company');
                addGroup('EVENTS', data.events, 'event');
                addGroup('POSITIONS', data.positions, 'position');
                addGroup('INTERESTS', data.interests, 'interest');

                select.innerHTML = html.join('');
            }
            if (currentValue) select.value = currentValue.toLowerCase();
        };

        const _extractStrings = (input) => {
            if (!input) return "";
            if (typeof input === "string") {
                if (input.startsWith("[") && input.endsWith("]")) {
                    try {
                        const parsed = JSON.parse(input.replace(/'/g, '"'));
                        return Array.isArray(parsed) ? parsed.join(", ") : input;
                    } catch (e) { return input; }
                }
                return input;
            }
            if (Array.isArray(input)) return input.join(", ");
            return String(input);
        };

        const uniqueData = {
            companies: new Set(),
            events: new Set(),
            positions: new Set(),
            interests: new Set()
        };

        const corporateSuffixes = new Set(['inc', 'inc.', 'llc', 'llc.', 'corp', 'corp.', 'ltd', 'ltd.', 'co', 'co.', 'corporation', 'company', 'incorporated']);

        contacts.forEach(c => {
            if (c.company) uniqueData.companies.add(c.company.trim());
            if (c.event) uniqueData.events.add(c.event.trim());
            if (c.position) uniqueData.positions.add(c.position.trim());

            const rawInt = c.interest || c.selected_topic || '';
            const intStr = _extractStrings(rawInt);
            if (intStr) {
                intStr.split(',').forEach(part => {
                    const p = part.trim();
                    const pLower = p.toLowerCase();
                    if (p && p !== 'N/A' && p !== 'Object Object' && !corporateSuffixes.has(pLower)) {
                        uniqueData.interests.add(p);
                    }
                });
            }
        });

        populateUnified('filterUnifiedSelector', uniqueData, dropUnified);

        const now = Date.now();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

        let activeFilterCount = 0;

        // Multi-keyword tokenization for Global Search AND logic
        const keywords = searchQuery ? searchQuery.toLowerCase().split(/\s+/).filter(k => k.length > 0) : [];

        // Multi-dimensional constraint rendering
        contacts = contacts.filter(c => {
            // Global Keyword Matching (Tolerant & Scope-Expanded)
            let passGeneral = true;
            if (keywords.length > 0) {
                const gNames = (c.groupIds || []).map(gid => grpMap[gid]?.name).join(' ');
                const rawInt = c.interest || c.selected_topic || '';
                const intStr = Array.isArray(rawInt) ? rawInt.join(', ') : String(rawInt).replace(/[;\/\|]/g, ', ').replace(/\s*,\s*/g, ', ');

                const searchablePool = [
                    c.name,
                    c.phone,
                    c.company,
                    c.position,
                    c.event,
                    intStr,
                    c.awareness,
                    c.salesPerson,
                    (c.tags || []).join(' '),
                    gNames,
                    c.added
                ].join(' ').toLowerCase();

                // Every typed word must be found SOMEWHERE in the contact object
                passGeneral = keywords.every(kw => searchablePool.includes(kw));
            }
            if (!passGeneral) return false;

            // Spatial/Temporal Checks
            const addDateMs = new Date(c.added).getTime();
            if (this.isRecentFilterActive) {
                if (!addDateMs || (now - addDateMs) > sevenDaysMs) return false;
            }
            if (dateFrom) {
                const fromMs = new Date(dateFrom).getTime();
                if (!addDateMs || addDateMs < fromMs) return false;
            }
            if (dateTo) {
                // To-date includes the entire end day mathematically
                const toMs = new Date(dateTo).getTime() + (24 * 60 * 60 * 1000) - 1;
                if (!addDateMs || addDateMs > toMs) return false;
            }

            // Unified Smart Filter Dropdown
            if (dropUnified) {
                const firstColon = dropUnified.indexOf(':');
                const category = dropUnified.substring(0, firstColon);
                const val = dropUnified.substring(firstColon + 1);

                if (category === 'company') {
                    if ((c.company || '').toLowerCase() !== val) return false;
                } else if (category === 'event') {
                    if ((c.event || '').toLowerCase() !== val) return false;
                } else if (category === 'position') {
                    if ((c.position || '').toLowerCase() !== val) return false;
                } else if (category === 'interest') {
                    const rawInt = c.interest || c.selected_topic || '';
                    const intStr = _extractStrings(rawInt).toLowerCase();
                    if (!intStr.includes(val)) return false;
                }
            }

            // Categorical Checks (Tag Search)
            if (filterTag) {
                const gNames = (c.groupIds || []).map(gid => grpMap[gid]?.name).join(' ').toLowerCase();
                const rawInt = c.interest || c.selected_topic || '';
                const intStr = _extractStrings(rawInt).toLowerCase();

                const passTag = (c.event || '').toLowerCase().includes(filterTag) ||
                    intStr.includes(filterTag) ||
                    (c.tags || []).join(' ').toLowerCase().includes(filterTag) ||
                    gNames.includes(filterTag);
                if (!passTag) return false;
            }

            return true;
        });

        // Active Filter Counting & UI Chips rendering
        if (this.isRecentFilterActive) activeFilterCount++;
        if (dateFrom) activeFilterCount++;
        if (dateTo) activeFilterCount++;
        if (filterTag) activeFilterCount++;
        if (dropUnified) activeFilterCount++;

        const counterSpan = document.getElementById('advFilterCounter');
        if (counterSpan) {
            counterSpan.style.display = activeFilterCount > 0 ? 'inline-block' : 'none';
            counterSpan.innerText = activeFilterCount;
        }

        const chipsContainer = document.getElementById('filterChipsContainer');
        if (chipsContainer) {
            let chipsHtml = '';
            const chipStyle = `padding: 4px 12px; background: rgba(10,132,255,0.15); border: 1px solid rgba(10,132,255,0.3); border-radius: 8px; font-size: 0.7rem; color: #0a84ff; font-weight: 700; display:flex; align-items:center; gap:6px;`;

            if (this.isRecentFilterActive) chipsHtml += `<div style="${chipStyle}"><span>🚀</span> Recently Added</div>`;
            if (dateFrom) chipsHtml += `<div style="${chipStyle}"><span>📅</span> From: ${dateFrom}</div>`;
            if (dateTo) chipsHtml += `<div style="${chipStyle}"><span>📅</span> To: ${dateTo}</div>`;
            if (filterTag) chipsHtml += `<div style="${chipStyle}"><span>🏷️</span> Tag: ${filterTag}</div>`;
            if (dropUnified) {
                const select = document.getElementById('filterUnifiedSelector');
                const selectedOption = select.options[select.selectedIndex];
                const catLabel = selectedOption.parentElement.label || 'Filter';
                const valLabel = selectedOption.text;
                chipsHtml += `<div style="${chipStyle}"><span>🔍</span> ${catLabel}: ${valLabel}</div>`;
            }

            chipsContainer.innerHTML = chipsHtml;
            chipsContainer.style.display = chipsHtml ? 'flex' : 'none';
        }

        this.updatePendingCounter();
        if (this.activeGroupId !== null) contacts = contacts.filter(c => c.groupIds && c.groupIds.some(gid => String(gid) === String(this.activeGroupId)));
        // Reorder results slightly: Exact match on name goes to the absolute top
        if (keywords.length > 0) {
            const rawSearch = keywords.join(' ');
            contacts.sort((a, b) => {
                const aName = (a.name || '').toLowerCase();
                const bName = (b.name || '').toLowerCase();
                if (aName.startsWith(rawSearch) && !bName.startsWith(rawSearch)) return -1;
                if (!aName.startsWith(rawSearch) && bName.startsWith(rawSearch)) return 1;
                return 0;
            });
        }

        // Intelligent HTML highlighting function
        const _highlight = (str) => {
            if (!str) return '—';
            let res = String(str);
            if (keywords.length === 0) return res;

            let htmlForm = res;
            keywords.forEach(kw => {
                const escKw = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(${escKw})`, 'gi');
                htmlForm = htmlForm.replace(regex, `<span style="background:rgba(255,215,0,0.4); color:#fff; border-radius:3px; padding:0 2px;">$1</span>`);
            });
            return htmlForm;
        };

        // Generative HTML Table Body
        if (contacts.length > 0) {
            tbody.innerHTML = contacts.map(c => {
                const grps = (c.groupIds || []).map(gid => grpMap[gid]).filter(Boolean);
                const contactJson = JSON.stringify(c).replace(/"/g, '&quot;');

                const _toTitleCase = (str) => {
                    if (!str) return '';
                    return String(str).trim().toLowerCase().replace(/(^|[ \-\/,])([a-z0-9])/g, m => m.toUpperCase());
                };

                const rawDisplayName = window.ContactsView.parseName(c.name || 'Unknown').full;
                const safeNameForDelete = rawDisplayName.replace(/'/g, "\\'");

                // Construct strings with Title Case, then apply smart highlighting
                const displayName = _highlight(rawDisplayName);
                const displayPhone = _highlight(`+${c.phone}`);
                const displayCompany = c.company ? _highlight(_toTitleCase(c.company)) : '<span style="color:rgba(255,255,255,0.1);">—</span>';
                const displayEvent = c.event ? _highlight(_toTitleCase(c.event)) : '<span style="color:rgba(255,255,255,0.1);">—</span>';

                let rawInterest = c.interest || c.selected_topic || '';
                if (typeof rawInterest === 'string' && rawInterest.trim().startsWith('[') && rawInterest.trim().endsWith(']')) {
                    try { rawInterest = JSON.parse(rawInterest.replace(/'/g, '"')); } catch (e) { }
                }

                let extractedInterest = _extractStrings(rawInterest);
                let cleanInterest = String(extractedInterest).replace(/[\[\]"'{}]/g, '').replace(/[;\/\|]/g, ', ').replace(/\s*,\s*/g, ', ').replace(/(^,+)|(,$)/g, '').trim();
                const displayInterest = cleanInterest && cleanInterest !== 'N/A' && cleanInterest !== 'Object Object' ? _highlight(_toTitleCase(cleanInterest)) : '<span style="color:rgba(255,255,255,0.1);">—</span>';

                const displayPosition = c.position ? _highlight(_toTitleCase(c.position)) : '<span style="color:rgba(255,255,255,0.1);">—</span>';

                const cellStyle = "padding: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem;";

                // Logic for "Recently Added" Tag and formatted string
                const addDate = new Date(c.added).getTime();
                const isRecent = addDate && (now - addDate) <= sevenDaysMs;
                const recentBadge = isRecent ? `<span title="Added within the last 7 days" style="background:rgba(255,159,10,0.15); color:#ff9f0a; border:1px solid rgba(255,159,10,0.3); padding: 2px 8px; border-radius: 6px; font-size: 0.6rem; font-weight:800; white-space:nowrap; margin-right:4px;">NEW</span>` : '';

                // Generate formatted timestamp string nicely
                let addDisplay = c.added || '';
                if (addDate) {
                    const dObj = new Date(c.added);
                    const hours = dObj.getHours();
                    const mins = String(dObj.getMinutes()).padStart(2, '0');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const fmtTime = `${hours % 12 || 12}:${mins} ${ampm}`;
                    addDisplay = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, '0')}-${String(dObj.getDate()).padStart(2, '0')} ${c.added.includes(':') ? fmtTime : ''}`.trim();
                }

                return `<tr style="border-bottom: 1px solid rgba(255,255,255,0.03); transition: 0.1s;" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
                    <td style="padding: 12px 24px;"><input type="checkbox" class="contact-checkbox" value="${c.id}" onchange="window.ContactsView.updateBulkUI()" style="width:16px; height:16px; accent-color: var(--accent-color); cursor:pointer;"></td>
                    <td style="${cellStyle} font-weight: 700; color: #fff;" title="${rawDisplayName}">
                        <div style="display:flex; flex-direction:column;">
                            <span style="margin-bottom:2px; display:flex; align-items:center;">${recentBadge} ${displayName}</span>
                            ${addDisplay ? `<span style="font-size:0.6rem; color:rgba(255,255,255,0.3); font-weight:600; font-family:monospace;">${_highlight(addDisplay)}</span>` : ''}
                        </div>
                    </td>
                    <td style="${cellStyle} color: var(--success-color); font-weight: 800; font-family: monospace;">${displayPhone}</td>
                    <td style="${cellStyle} color: rgba(255,255,255,0.55);" title="${c.company || ''}">${displayCompany}</td>
                    <td style="${cellStyle} color: rgba(255,255,255,0.55);" title="${c.event || ''}">${displayEvent}</td>
                    <td style="padding: 12px; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem; color: rgba(255,255,255,0.55);" title="${c.interest || c.selected_topic || ''}">${displayInterest}</td>
                    <td style="${cellStyle} color: rgba(255,255,255,0.55);" title="${c.position || ''}">${displayPosition}</td>
                    <td style="padding: 12px;"><div style="display:flex; gap: 4px; flex-wrap: nowrap; overflow: hidden;">${grps.length > 0 ? grps.map(g => `<span title="${g.name}" style="background:${(g.color || '#fff') + '1a'}; color: ${g.color || '#fff'}; border:1px solid ${(g.color || '#fff') + '33'}; padding: 2px 8px; border-radius: 6px; font-size: 0.6rem; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:80px;">${_highlight(g.name)}</span>`).join('') : `<span style="color:rgba(255,255,255,0.1);">—</span>`}</div></td>
                    <td style="padding: 12px 12px; text-align: right;"><div style="display:flex; justify-content:flex-end; gap:6px;">
                        <button onclick="event.stopPropagation(); window.ContactsView.openEditModal(${contactJson})" style="width:30px; height:30px; border-radius:8px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.04); color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path></svg></button>
                        <button onclick="event.stopPropagation(); window.ContactsView.deleteIndividual('${c.id}', '${safeNameForDelete}')" style="width:30px; height:30px; border-radius:8px; border:1px solid rgba(255,69,58,0.15); background:rgba(255,69,58,0.05); color:#ff453a; display:flex; align-items:center; justify-content:center; cursor:pointer;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6L19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path></svg></button>
                    </div></td>
                </tr>`;
            }).join('');
        } else {
            // Null Results Helpful UI
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="padding:100px 20px; text-align:center;">
                        <div style="display:flex; flex-direction:column; align-items:center; opacity:0.6; animation: fadeIn 0.4s;">
                            <div style="width:64px; height:64px; border-radius:18px; background:rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:center; margin-bottom:20px; border:1px solid rgba(255,255,255,0.1);">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                            <h3 style="color:#fff; font-size:1.15rem; margin:0 0 12px 0; font-weight:800; letter-spacing:-0.02em;">No exact records found</h3>
                            <p style="color:rgba(255,255,255,0.7); font-size:0.85rem; max-width:400px; line-height:1.5;">We couldn't locate any contacts matching your query. Try adjusting your spelling or reducing the number of active filters to broaden your search.</p>
                            ${(keywords.length > 0 || activeFilterCount > 0) ? `<button onclick="document.getElementById('contactSearch').value=''; window.ContactsView.clearAdvancedFilters();" style="margin-top:24px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#fff; border-radius:10px; padding:10px 20px; font-weight:700; font-size:0.8rem; cursor:pointer; transition:0.2s; display:flex; gap:8px; align-items:center;" onmouseover="this.style.background='rgba(255,255,255,0.15)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">Clear Search Engine</button>` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }

        document.getElementById('selectAllCheckbox').checked = false;
        this.updateBulkUI();
    },

    async openGroupModal(group = null) {
        const modal = document.getElementById('groupModal'); const nameInp = document.getElementById('newGroupName'); const descInp = document.getElementById('newGroupDesc');
        this.selectedPoolContacts = new Set();
        this.activePoolContacts = await window.BrandSyncAPI.getContacts();

        if (group) {
            document.getElementById('groupModalTitle').innerText = "Edit Group Identity";
            nameInp.value = group.name;
            descInp.value = group.description || "";
            document.getElementById('edit_groupId').value = group.id;
            this.selectColor(group.color || '#0a84ff');
            this.selectIcon(group.icon || 'Users');

            this.activePoolContacts.forEach(c => {
                if (c.groupIds && c.groupIds.includes(group.id)) this.selectedPoolContacts.add(String(c.id));
            });
        }
        else {
            document.getElementById('groupModalTitle').innerText = "Define New Group";
            nameInp.value = ""; descInp.value = ""; document.getElementById('edit_groupId').value = "";
            this.selectColor('#0a84ff'); this.selectIcon('Users');
        }

        document.getElementById('groupPoolFilter').value = "";
        this.filterGroupPool();
        modal.style.display = 'flex';
    },

    filterGroupPool() {
        const query = (document.getElementById('groupPoolFilter').value || '').toLowerCase();
        const list = document.getElementById('groupPoolList');

        let filtered = this.activePoolContacts.filter(c => {
            return (c.name || '').toLowerCase().includes(query) || (c.phone || '').includes(query);
        });

        // Sort: pre-selected contacts float to the top
        filtered.sort((a, b) => {
            const aChecked = this.selectedPoolContacts.has(String(a.id)) ? 0 : 1;
            const bChecked = this.selectedPoolContacts.has(String(b.id)) ? 0 : 1;
            return aChecked - bChecked;
        });

        const selectedCount = this.selectedPoolContacts.size;
        const countBadge = selectedCount > 0
            ? `<div style="font-size:0.65rem; color:#bf5af2; font-weight:800; text-transform:uppercase; letter-spacing:0.05em; padding: 6px 10px 4px; display:flex; align-items:center; gap:6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                ${selectedCount} Selected for Group
               </div>`
            : '';

        list.innerHTML = countBadge + filtered.map(c => {
            const isChecked = this.selectedPoolContacts.has(String(c.id));
            return `<label style="display:flex; align-items:center; gap:12px; padding:10px; border-radius:12px; background:${isChecked ? 'rgba(191,90,242,0.08)' : 'rgba(255,255,255,0.03)'}; cursor:pointer; transition:0.2s; border:1px solid ${isChecked ? 'rgba(191,90,242,0.35)' : 'transparent'}; margin-bottom:2px;">
                <input type="checkbox" onchange="window.ContactsView.togglePoolContact('${c.id}')" ${isChecked ? 'checked' : ''} style="width:16px; height:16px; accent-color:#bf5af2;">
                <div style="flex:1;">
                    <div style="color:#fff; font-size:0.85rem; font-weight:700;">${c.name || 'Unknown'}</div>
                    <div style="color:${isChecked ? '#bf5af2' : 'rgba(255,255,255,0.5)'}; font-size:0.75rem; font-family:monospace;">+${c.phone}</div>
                </div>
                ${isChecked ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bf5af2" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>` : ''}
            </label>`;
        }).join('');
    },

    togglePoolContact(id) {
        if (this.selectedPoolContacts.has(id)) this.selectedPoolContacts.delete(id);
        else this.selectedPoolContacts.add(id);
        this.filterGroupPool(); // refresh UI colors
    },

    async saveGroup() {
        const name = document.getElementById('newGroupName').value.trim(); if (!name) return;
        const description = document.getElementById('newGroupDesc').value.trim();
        const groupIdRaw = document.getElementById('edit_groupId').value;
        const res = await window.BrandSyncAPI.saveGroup({
            id: groupIdRaw ? parseInt(groupIdRaw) : null,
            name, description, color: this.selectedColor, icon: this.selectedIcon
        });

        const gId = res.group.id;

        for (let c of this.activePoolContacts) {
            let hasGroup = (c.groupIds || []).includes(gId);
            let shouldHave = this.selectedPoolContacts.has(c.id);
            if (hasGroup !== shouldHave) {
                let newGid = [...(c.groupIds || [])];
                if (shouldHave) newGid.push(gId);
                else newGid = newGid.filter(id => id !== gId);
                c.groupIds = newGid;
                await window.BrandSyncAPI.saveContact({ ...c });
            }
        }

        window.showToast("Group secured.", "success"); document.getElementById('groupModal').style.display = 'none'; this.loadGroups(); this.loadData();
    },

    tripleDeleteGroup(id, name) {
        window.BrandSyncAppInstance.confirmAction("Confirm Initial Purge?", `Initiating deletion of "${name}". Proceed?`, "#ff9f0a", () => {
            setTimeout(() => {
                window.BrandSyncAppInstance.confirmAction("Critical Identity Warning", `Final confirmation required to terminate group "${name}". PRESS CONFIRM TO ACCESS SECURITY OVERRIDE.`, "#ff453a", () => {
                    setTimeout(() => {
                        const am = document.getElementById('authModal'); const passInp = document.getElementById('auth_password'); const confirmBtn = document.getElementById('auth_confirmBtn');
                        passInp.value = ""; am.style.display = 'flex';
                        confirmBtn.onclick = async () => {
                            if (passInp.value === "dadasafa") {
                                await window.BrandSyncAPI.deleteGroup(id); window.showToast(`Object "${name}" has been terminated.`, "success"); am.style.display = 'none';
                                if (this.activeGroupId === id) this.setGroup(null);
                                this.loadGroups(); this.loadData();
                            } else { window.showToast("ACCESS_DENIED", "error"); passInp.style.boxShadow = "0 0 20px rgba(255,69,58,0.5)"; setTimeout(() => passInp.style.boxShadow = "none", 1000); }
                        }
                    }, 300);
                });
            }, 300);
        });
    },

    openEditModal(contact = null) {
        const modal = document.getElementById('contactModal'); const checkboxes = document.querySelectorAll('.group-select-check');
        const ids = ['_contactId', '_contactFirstName', '_contactMI', '_contactLastName', '_contactPhone', '_contactEvent', '_contactInterest', '_contactAwareness', '_contactPosition', '_contactSales', '_contactCompany'];
        if (contact) {
            document.getElementById('edit_contactId').value = contact.id;

            // Re-split name if we only saved full name previously
            const nameParts = (contact.name || "").split(" ");
            let first = contact.firstName || "";
            let mi = contact.mi || "";
            let last = contact.lastName || "";

            if (!first && !last && nameParts.length > 0) {
                first = nameParts[0];
                if (nameParts.length === 3) { mi = nameParts[1]; last = nameParts[2]; }
                else if (nameParts.length === 2) { last = nameParts[1]; }
            }

            const addDate = new Date(contact.added).getTime();
            const isRecent = addDate && (Date.now() - addDate) <= (7 * 24 * 60 * 60 * 1000);
            const addedLabel = document.getElementById('contactAddedLabel');
            if (addedLabel) {
                addedLabel.innerHTML = `Added: <span style="font-family:monospace; color:#fff; font-weight:700;">${contact.added || 'Unknown'}</span> ${isRecent ? '<span style="color:#ff9f0a; font-weight:800; margin-left:8px; padding:2px 6px; border:1px solid rgba(255,159,10,0.3); background:rgba(255,159,10,0.1); border-radius:4px;">NEW</span>' : ''}`;
            }

            document.getElementById('edit_contactFirstName').value = first;
            document.getElementById('edit_contactMI').value = mi;
            document.getElementById('edit_contactLastName').value = last;
            document.getElementById('edit_contactPhone').value = contact.phone || "";
            document.getElementById('edit_contactCompany').value = contact.company || "";
            document.getElementById('edit_contactEvent').value = contact.event || "";
            document.getElementById('edit_contactInterest').value = contact.interest || contact.selected_topic || "";
            document.getElementById('edit_contactAwareness').value = contact.awareness || "";
            document.getElementById('edit_contactPosition').value = contact.position || "";
            document.getElementById('edit_contactSales').value = contact.salesPerson || contact.salesperson || "";

            // TYPE-AGNOSTIC GROUP SELECTION
            checkboxes.forEach(cb => {
                const isAssigned = (contact.groupIds || []).some(gid => String(gid) === String(cb.value));
                cb.checked = isAssigned;
            });
        } else {
            document.getElementById('edit_contactId').value = "";
            ids.forEach(id => { const el = document.getElementById('edit' + id); if (el) el.value = ""; });
            checkboxes.forEach(cb => cb.checked = false);

            const addedLabel = document.getElementById('contactAddedLabel');
            if (addedLabel) addedLabel.innerHTML = `Added: <span style="color:rgba(255,255,255,0.2); font-style:italic;">Pending Save...</span>`;
        }
        modal.style.display = 'flex';
    },


    closeEditModal() { document.getElementById('contactModal').style.display = 'none'; },

    async saveContact() {
        // Enforce Standard Titling Format
        const _toTitleCase = (str) => {
            if (!str) return '';
            return String(str).trim().toLowerCase().replace(/(^|[ \-\/])([a-z0-9])/g, m => m.toUpperCase());
        };
        const _toMI = (str) => {
            let s = str.trim().toUpperCase().replace(/\./g, '');
            if (!s) return '';
            const arr = s.split(/\s+/).map(x => x.charAt(0) + '.').filter(x => x !== '.');
            return arr[0] || '';
        };

        const first = _toTitleCase(document.getElementById('edit_contactFirstName').value);
        const mi = _toMI(document.getElementById('edit_contactMI').value);
        const last = _toTitleCase(document.getElementById('edit_contactLastName').value);
        const company = _toTitleCase(document.getElementById('edit_contactCompany').value);
        const eventVal = _toTitleCase(document.getElementById('edit_contactEvent').value);

        const phone = document.getElementById('edit_contactPhone').value.replace(/[^\d]/g, '');

        if (!first || !last || !phone) { window.showToast("Core identity (First, Last, Phone) incomplete.", "warning"); return; }

        // Composite name for display and backwards compatibility (e.g. "John D. Doe")
        const fullName = `${first} ${mi ? mi + ' ' : ''}${last}`.trim().replace(/\s+/g, ' ');

        const gids = Array.from(document.querySelectorAll('.group-select-check:checked')).map(cb => parseInt(cb.value));
        const contactData = {
            id: document.getElementById('edit_contactId').value,
            name: fullName,
            firstName: first,
            mi: mi,
            lastName: last,
            phone,
            company: company,
            event: eventVal,
            interest: document.getElementById('edit_contactInterest').value,
            awareness: document.getElementById('edit_contactAwareness').value,
            position: document.getElementById('edit_contactPosition').value,
            salesPerson: document.getElementById('edit_contactSales').value,
            groupIds: gids
        };
        await window.BrandSyncAPI.saveContact(contactData);
        window.showToast("Identity Profile synced.", "success"); this.closeEditModal(); this.loadData();
    },

    setupHeavyImport() {
        const input = document.getElementById('heavyImportInput'); if (!input) return;
        input.onchange = async (e) => {
            const file = e.target.files[0]; if (!file) return;
            window.showToast("🔬 DEEP SCAN INITIALIZING...", "info");
            const reader = new FileReader();
            reader.onload = async (ev) => {
                try {
                    let parsedRows = [];

                    if (file.name.match(/\.(xlsx|xls|ods)$/i) && window.XLSX) {
                        const data = new Uint8Array(ev.target.result);
                        const wb = window.XLSX.read(data, { type: 'array' });
                        wb.SheetNames.forEach(sn => {
                            // raw:false forces all cells to strings (prevents numeric phone loss)
                            const rows = window.XLSX.utils.sheet_to_json(wb.Sheets[sn], { defval: '', raw: false });
                            parsedRows = parsedRows.concat(rows);
                        });
                    } else if (file.name.match(/\.csv$/i)) {
                        const text = ev.target.result;
                        // Robust CSV parser — handles quoted fields that contain commas
                        const parseCSVLine = (line) => {
                            const result = []; let cur = ''; let inQuote = false;
                            for (let i = 0; i < line.length; i++) {
                                const ch = line[i];
                                if (ch === '"') { inQuote = !inQuote; }
                                else if (ch === ',' && !inQuote) { result.push(cur.trim()); cur = ''; }
                                else { cur += ch; }
                            }
                            result.push(cur.trim());
                            return result;
                        };
                        const lines = text.split(/\r?\n/).filter(l => l.trim());
                        if (lines.length > 1) {
                            const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim());
                            for (let i = 1; i < lines.length; i++) {
                                const vals = parseCSVLine(lines[i]).map(v => v.replace(/^"|"$/g, '').trim());
                                const row = {};
                                headers.forEach((h, idx) => row[h] = vals[idx] !== undefined ? vals[idx] : '');
                                parsedRows.push(row);
                            }
                        }
                    } else if (file.name.match(/\.pdf$/i)) {
                        window.showToast("📄 PDF CORE INITIALIZING...", "info");
                        // Set worker source for pdf.js
                        if (window.pdfjsLib) {
                            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                        }
                        const data = new Uint8Array(ev.target.result);
                        const pdf = await pdfjsLib.getDocument({ data }).promise;
                        let fullText = "";
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const content = await page.getTextContent();
                            fullText += content.items.map(item => item.str).join(" ") + "\n";
                        }

                        // Treat PDF as unstructured text scan
                        window.showToast("📡 Analyzing PDF text layers...", "info");
                        const phoneRegex = /(?:\+?63|0)?[\s\-\–\(\)]*9[\s\-\–\(\)]*(?:\d[\s\-\–\(\)]*){9}/g;
                        const phoneMatches = fullText.match(phoneRegex) || [];
                        const seen = new Set();
                        const contacts = [];

                        // Strategy: Find line containing the phone, assume name is nearby
                        const lines = fullText.split('\n');
                        for (const line of lines) {
                            const match = line.match(phoneRegex);
                            if (match) {
                                const phone = this.normalizePhone(match[0]);
                                if (phone && !seen.has(phone)) {
                                    seen.add(phone);
                                    // Try to grab name from the same line (everything before the phone)
                                    let name = line.split(match[0])[0].trim().replace(/[,:]+$/, '').trim();
                                    if (name.length < 2 || name.length > 60) name = "PDF_Lead";
                                    contacts.push({ name, phone, groupIds: this.activeGroupId ? [this.activeGroupId] : [] });
                                }
                            }
                        }

                        if (contacts.length === 0) { window.showToast("⚠️ PDF SCAN FAILED — No contacts found.", "error"); return; }
                        this._showImportPreview(contacts, async (confirmed) => {
                            if (!confirmed) return;
                            for (const c of confirmed) await window.BrandSyncAPI.saveContact(c);
                            window.showToast(`✅ SYNCED ${confirmed.length} RECORDS.`, "success");
                            this.loadData(); this.loadGroups();
                        });
                        return; // Exit early as PDF is handled specially
                    }

                    // --- SMART FIELD MAPPER ---
                    // Priority order: compound/specific patterns first to avoid stealing
                    const SPECIFIC_ALIASES = [
                        ['name', /\bfull.?name\b/i, /\bcontact.?name\b/i, /\bfirst.?name\b/i, /\bclient.?name\b/i, /\bperson.?name\b/i, /^name$/i, /\bfname\b/i, /\bclient\b/i, /\bcustomer\b/i],
                        ['phone', /\bphone.?no\b/i, /\bcontact.?no\b/i, /\bmobile.?no\b/i, /\bcell.?no\b/i, /\bphone.?number\b/i, /\bcellphone\b/i, /^phone$/i, /\bmobile\b/i, /\bcell\b/i, /\btel\b/i, /\bcp\b/i, /\bnum\b/i, /\bnumber\b/i, /\bno\.?\b/i],
                        ['company', /\bcompany.?name\b/i, /\borganization\b/i, /\borganisation\b/i, /\bbusiness.?name\b/i, /\bcompany\b/i, /\bfirm\b/i, /\bbusiness\b/i, /\bestablishment\b/i],
                        ['interest', /\bbrand.?interest\b/i, /\bproduct.?interest\b/i, /\binterest\b/i, /\binterests\b/i, /\bniche\b/i],
                        ['awareness', /\bbrand.?awareness\b/i, /\bhow.?did\b/i, /\bawareness\b/i, /\breferral\b/i, /\bchannel\b/i, /\bmedium\b/i],
                        ['event', /\bevent.?name\b/i, /\bsource.?event\b/i, /\bevent\b/i, /\boccasion\b/i, /\bvenue\b/i],
                        ['position', /\bjob.?title\b/i, /\bposition\b/i, /\bdesignation\b/i, /\btitle\b/i, /\brole\b/i, /\bjob\b/i, /\bdept\b/i],
                        ['salesPerson', /\bsales.?person\b/i, /\bassigned.?to\b/i, /\bsales\b/i, /\bagent\b/i, /\bhandler\b/i, /\brep\b/i],
                        ['tags', /\btags?\b/i, /\blabels?\b/i, /\bcategory\b/i, /\bsegment\b/i],
                    ];

                    const buildMap = (headers) => {
                        const claimed = new Set(); // tracks which headers are already taken
                        const map = {};
                        for (const [field, ...patterns] of SPECIFIC_ALIASES) {
                            for (const pattern of patterns) {
                                const found = headers.find(h => !claimed.has(h) && pattern.test(h.trim()));
                                if (found) { map[field] = found; claimed.add(found); break; }
                            }
                        }
                        return map;
                    };

                    const normalizePhone = (raw) => {
                        if (raw === null || raw === undefined) return null;
                        let num = String(raw).replace(/[^\d]/g, '');
                        if (!num || num.length < 10) return null;
                        if (num.startsWith('6309') && num.length === 13) num = '63' + num.substring(3);
                        else if (num.startsWith('09') && num.length === 11) num = '63' + num.substring(1);
                        else if (num.startsWith('9') && num.length === 10) num = '63' + num;
                        return /^639\d{9}$/.test(num) ? num : null;
                    };

                    if (parsedRows.length > 0) {
                        const headers = Object.keys(parsedRows[0]);
                        const autoMap = buildMap(headers);
                        // Show column mapper so user can confirm / correct mappings
                        this._showColumnMapper(headers, autoMap, parsedRows, normalizePhone);
                    } else {
                        // Fallback regex scan
                        window.showToast("📡 No structured columns — running phone regex scan...", "info");
                        const rawText = typeof ev.target.result === 'string' ? ev.target.result : new TextDecoder().decode(new Uint8Array(ev.target.result));
                        const regex = /(?:\+?63|0)?[\s\-\–\(\)]*9[\s\-\–\(\)]*(?:\d[\s\-\–\(\)]*){9}/g;
                        const seen = new Set(); const contacts = [];
                        for (const m of (rawText.match(regex) || [])) {
                            const phone = normalizePhone(m);
                            if (phone && !seen.has(phone)) { seen.add(phone); contacts.push({ name: 'Auto_Import', phone, groupIds: this.activeGroupId ? [this.activeGroupId] : [] }); }
                        }
                        if (contacts.length === 0) { window.showToast("⚠️ IMPORT FAILED — No valid records found.", "error"); return; }
                        this._showImportPreview(contacts, async (confirmed) => {
                            if (!confirmed) return;
                            for (const c of confirmed) await window.BrandSyncAPI.saveContact(c);
                            window.showToast(`✅ SYNCED ${confirmed.length} RECORDS.`, "success");
                            this.loadData(); this.loadGroups();
                        });
                    }

                } catch (err) { console.error(err); window.showToast("⚠️ ENGINE_FAILURE: " + err.message, "error"); }
                e.target.value = '';
            };
            if (file.name.match(/\.(xlsx|xls|ods)$/i)) reader.readAsArrayBuffer(file);
            else if (file.name.match(/\.pdf$/i)) reader.readAsArrayBuffer(file);
            else reader.readAsText(file);
        };
    },

    _showColumnMapper(headers, autoMap, parsedRows, normalizePhone) {
        const existing = document.getElementById('colMapModal');
        if (existing) existing.remove();

        const FIELDS = [
            { key: 'name', label: '👤 Name' },
            { key: 'phone', label: '📞 Phone Number' },
            { key: 'company', label: '🏢 Company' },
            { key: 'event', label: '🗓 Event' },
            { key: 'interest', label: '💡 Brand Interest' },
            { key: 'awareness', label: '📡 Awareness' },
            { key: 'position', label: '🏷 Position' },
            { key: 'salesPerson', label: '🤝 Sales Person' },
            { key: 'tags', label: '🔖 Tags' },
        ];

        const optionsList = ['— Skip —', ...headers].map(h => `<option value="${h === '— Skip —' ? '' : h}">${h}</option>`).join('');

        const rows = FIELDS.map(f => {
            const pre = autoMap[f.key] || '';
            const opts = ['— Skip —', ...headers].map(h => {
                const val = h === '— Skip —' ? '' : h;
                return `<option value="${val}" ${val === pre ? 'selected' : ''}>${h}</option>`;
            }).join('');
            return `<div style="display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                <div style="width:140px;font-size:0.8rem;font-weight:700;color:rgba(255,255,255,0.7);">${f.label}</div>
                <select id="cm_${f.key}" style="flex:1;height:38px;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.12);border-radius:10px;padding:0 12px;color:#fff;font-size:0.85rem;outline:none;cursor:pointer;">${opts}</select>
                ${pre ? `<div style="font-size:0.7rem;color:#32d74b;white-space:nowrap;">✓ auto</div>` : `<div style="font-size:0.7rem;color:rgba(255,255,255,0.2);">manual</div>`}
            </div>`;
        }).join('');

        const modal = document.createElement('div');
        modal.id = 'colMapModal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:31000;background:rgba(0,0,0,0.75);backdrop-filter:blur(40px);display:flex;align-items:center;justify-content:center;padding:20px;';
        modal.innerHTML = `
            <div class="glass-panel" style="width:580px;max-height:90vh;border-radius:32px;border:1px solid rgba(255,255,255,0.15);background:rgba(25,25,30,0.95);box-shadow:0 40px 100px rgba(0,0,0,0.8);display:flex;flex-direction:column;overflow:hidden;">
                <div style="padding:28px 32px 16px;border-bottom:1px solid rgba(255,255,255,0.07);">
                    <h3 style="font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:6px;">🗺 Column Mapper</h3>
                    <p style="font-size:0.78rem;color:rgba(255,255,255,0.4);">Found <strong style="color:#0a84ff">${headers.length}</strong> columns, <strong style="color:#32d74b">${parsedRows.length}</strong> rows. Assign each field to the right column.</p>
                </div>
                <div style="flex:1;overflow-y:auto;padding:8px 32px 8px;">
                    <div style="margin-bottom:10px;padding:10px 14px;background:rgba(255,165,0,0.08);border:1px solid rgba(255,165,0,0.2);border-radius:12px;font-size:0.75rem;color:rgba(255,200,100,0.85);">
                        💡 Columns auto-detected. Correct any wrong assignments below.
                    </div>
                    ${rows}
                </div>
                <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.07);display:flex;gap:12px;">
                    <button id="cmCancelBtn" style="flex:1;height:46px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:13px;color:#fff;font-weight:700;cursor:pointer;">Cancel</button>
                    <button id="cmBuildBtn" style="flex:2;height:46px;background:var(--accent-color);border:none;border-radius:13px;color:#fff;font-weight:800;cursor:pointer;">Build Preview →</button>
                </div>
            </div>`;

        document.body.appendChild(modal);

        document.getElementById('cmCancelBtn').onclick = () => modal.remove();
        document.getElementById('cmBuildBtn').onclick = () => {
            const map = {};
            FIELDS.forEach(f => {
                const val = document.getElementById(`cm_${f.key}`)?.value;
                if (val) map[f.key] = val;
            });

            if (!map.phone) { window.showToast("⚠️ Please assign a Phone column.", "warning"); return; }

            const seen = new Set();
            const contacts = [];

            // MASTER RE-FORMATTING ENGINE
            const _toTitleCase = (str) => {
                if (!str) return '';
                return String(str).trim().toLowerCase().replace(/(^|[ \-\/])([a-z0-9])/g, m => m.toUpperCase());
            };

            for (const row of parsedRows) {
                let phone = normalizePhone(row[map.phone]);
                if (!phone) {
                    for (const val of Object.values(row)) { const p = normalizePhone(val); if (p) { phone = p; break; } }
                }
                if (!phone || seen.has(phone)) continue;
                seen.add(phone);

                let rawName = map.name ? String(row[map.name] || '').trim() : '';
                if (!rawName) {
                    for (const val of Object.values(row)) {
                        const s = String(val || '').trim();
                        if (s && s.length > 1 && s.length < 80 && /[a-zA-Z]/.test(s) && !normalizePhone(s)) { rawName = s; break; }
                    }
                }

                const nameData = window.ContactsView.parseName(rawName);

                contacts.push({
                    name: nameData.full,
                    firstName: nameData.first,
                    mi: nameData.mi,
                    lastName: nameData.last,
                    phone: phone,
                    company: map.company ? _toTitleCase(row[map.company]) : '',
                    event: map.event ? _toTitleCase(row[map.event]) : '',
                    interest: map.interest ? _toTitleCase(row[map.interest]) : '',
                    awareness: map.awareness ? String(row[map.awareness] || '').trim() : '',
                    position: map.position ? _toTitleCase(row[map.position]) : '',
                    salesPerson: map.salesPerson ? _toTitleCase(row[map.salesPerson]) : '',
                    tags: map.tags ? String(row[map.tags] || '').split(/[,;|]/).map(t => t.trim()).filter(Boolean) : [],
                    groupIds: this.activeGroupId ? [this.activeGroupId] : []
                });
            }

            modal.remove();
            if (contacts.length === 0) { window.showToast("⚠️ No valid phone numbers found in selected column.", "error"); return; }

            this._showImportPreview(contacts, async (confirmed) => {
                if (!confirmed) return;
                for (const c of confirmed) await window.BrandSyncAPI.saveContact(c);
                window.showToast(`✅ SYNCED ${confirmed.length} RECORDS.`, "success");
                this.loadData(); this.loadGroups();
            });
        };
    },

    parseName(raw) {
        let s = String(raw || '').trim();
        if (!s) return { first: '', mi: '', last: '', full: 'Unknown' };

        // Handle "Last Name, Full Name M." format
        if (s.includes(',')) {
            const parts = s.split(',').map(p => p.trim());
            if (parts.length >= 2) {
                const lastName = parts[0];
                const firstNamePart = parts.slice(1).join(' ');
                s = `${firstNamePart} ${lastName}`;
            }
        }

        // Basic Title Case
        s = s.toLowerCase().replace(/(^|[ \-\/])([a-z0-9])/g, m => m.toUpperCase());
        const parts = s.split(/\s+/).filter(Boolean);

        if (parts.length === 1) return { first: parts[0], mi: '', last: '', full: parts[0] };

        // PH SURNAMES DETECTION: common multi-word surnames
        const surnamePrefixes = ['Dela', 'Delos', 'De', 'La', 'Santa', 'Santo', 'San', 'Van', 'Von', 'Du'];

        let first = '', mi = '', last = '';

        // Search for Middle Initial (single character word)
        let miIndex = -1;
        // Search from BACK to handle "First M. Last" OR "Last First M."
        for (let i = parts.length - 1; i >= 1; i--) {
            const part = parts[i].replace(/\./g, '');
            if (part.length === 1) {
                miIndex = i;
                break;
            }
        }

        if (miIndex !== -1) {
            // SPECIAL CASE: "Last First M." (Luna Dharryll Joy M.)
            // If the MI is at the VERY end and there are at least 3 parts...
            if (miIndex === parts.length - 1 && parts.length >= 3) {
                last = parts[0];
                first = parts.slice(1, -1).join(' ');
                mi = parts[miIndex].charAt(0).toUpperCase() + '.';
            } else {
                // STANDARD: "First M. Last"
                first = parts.slice(0, miIndex).join(' ');
                mi = parts[miIndex].charAt(0).toUpperCase() + '.';
                last = parts.slice(miIndex + 1).join(' ');
            }
        } else {
            // Check if the penultimate word is a surname prefix (e.g. "Juan Dela Cruz")
            const penultimate = parts[parts.length - 2];
            if (surnamePrefixes.includes(penultimate) && parts.length >= 3) {
                last = parts.slice(parts.length - 2).join(' ');
                first = parts.slice(0, parts.length - 2).join(' ');
            } else {
                last = parts[parts.length - 1];
                first = parts.slice(0, parts.length - 1).join(' ');
            }
        }

        const full = `${first} ${mi ? mi + ' ' : ''}${last}`.trim().replace(/\s+/g, ' ');
        return { first, mi, last, full };
    },

    _showImportPreview(contacts, callback) {
        this.previewBuffer = contacts;
        this.previewCallback = callback;

        const existing = document.getElementById('importPreviewModal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'importPreviewModal';
        modal.style.cssText = 'position:fixed;inset:0;z-index:30000;background:rgba(0,0,0,0.7);backdrop-filter:blur(40px);display:flex;align-items:center;justify-content:center;padding:20px;';
        modal.innerHTML = `
            <div class="glass-panel" style="width:1150px;max-width:95vw;max-height:85vh;border-radius:32px;border:1px solid rgba(255,255,255,0.15);background:rgba(30,30,35,0.92);box-shadow:0 40px 100px rgba(0,0,0,0.7);display:flex;flex-direction:column;overflow:hidden;">
                <div style="padding:28px 32px 20px;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <h3 style="font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:6px;">🔬 Interactive Import Sandbox</h3>
                        <p style="font-size:0.8rem;color:rgba(255,255,255,0.45);">Validating <strong id="previewTotalCount" style="color:#32d74b">${contacts.length}</strong> records. <strong>Click any text to edit inline</strong> or remove before syncing.</p>
                    </div>
                </div>
                <div style="flex:1;overflow-y:auto;padding:20px 32px;">
                    <table style="width:100%;border-collapse:collapse;font-size:0.8rem;table-layout:fixed;">
                        <thead><tr style="color:rgba(255,255,255,0.35);text-transform:uppercase;font-size:0.6rem;font-weight:800;">
                            <th style="padding:8px 10px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.06);width:40px;">#</th>
                            <th style="padding:8px 10px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.06);width:160px;">Identity</th>
                            <th style="padding:8px 10px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.06);width:110px;">Phone</th>
                            <th style="padding:8px 10px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.06);">Company</th>
                            <th style="padding:8px 10px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.06);">Event</th>
                            <th style="padding:8px 10px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.06);">Interest</th>
                            <th style="padding:8px 10px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.06);">Position</th>
                            <th style="padding:8px 10px;text-align:right;border-bottom:1px solid rgba(255,255,255,0.06);width:60px;">Action</th>
                        </tr></thead>
                        <tbody id="previewTableBody"></tbody>
                    </table>
                </div>
                <div style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.07);display:flex;gap:12px;">
                    <button onclick="document.getElementById('importPreviewModal').remove(); window.ContactsView.previewCallback(null);" style="flex:1;height:48px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:14px;color:#fff;font-weight:700;cursor:pointer;">Cancel Operation</button>
                    <button id="importConfirmBtn" style="flex:2;height:48px;background:var(--accent-color);border:none;border-radius:14px;color:#fff;font-weight:800;cursor:pointer;">Sync ${contacts.length} Records →</button>
                </div>
            </div>`;
        document.body.appendChild(modal);

        document.getElementById('importConfirmBtn').onclick = () => { modal.remove(); this.previewCallback(this.previewBuffer); };

        this.renderPreviewTable();
    },

    renderPreviewTable() {
        const tbody = document.getElementById('previewTableBody');
        if (!tbody) return;
        const total = this.previewBuffer.length;
        document.getElementById('previewTotalCount').innerText = total;
        document.getElementById('importConfirmBtn').innerText = total === 0 ? "Empty Buffer (Nothing to Sync)" : `Sync ${total} Final Records →`;

        const renderLimit = Math.min(this.previewBuffer.length, 100); // 100 to keep UI extremely fast and responsive. They edit the first 100 page.

        let html = '';
        for (let i = 0; i < renderLimit; i++) {
            let c = this.previewBuffer[i];
            const dName = this.parseName(c.name).full;

            // Inline inputs with transparent styling
            const inpStyle = "width:100%; background:transparent; border:1px solid transparent; border-radius:6px; color:#fff; font-size:0.8rem; font-weight:700; outline:none; padding:4px 8px; transition:0.2s; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";
            const secStyle = "width:100%; background:transparent; border:1px solid transparent; border-radius:6px; color:rgba(255,255,255,0.55); font-size:0.75rem; font-weight:500; outline:none; padding:4px 8px; transition:0.2s; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;";

            html += `<tr style="border-bottom:1px solid rgba(255,255,255,0.03);" id="prev_row_${i}" onmouseover="this.style.background='rgba(255,255,255,0.03)'" onmouseout="this.style.background='transparent'">
                <td style="padding:10px;color:rgba(255,255,255,0.25);font-weight:700;">${i + 1}</td>
                <td style="padding:10px;">
                    <input type="text" value="${dName}" title="${dName}" style="${inpStyle}" onchange="window.ContactsView.updatePreviewContact(${i}, 'name', this.value)" onfocus="this.style.background='rgba(0,0,0,0.4)'; this.style.border='1px solid var(--accent-color)';" onblur="this.style.background='transparent'; this.style.border='1px solid transparent';">
                </td>
                <td style="padding:10px;">
                    <input type="text" value="+${c.phone}" title="+${c.phone}" style="${inpStyle} color:#32d74b; font-family:monospace;" onchange="window.ContactsView.updatePreviewContact(${i}, 'phone', this.value)" onfocus="this.style.background='rgba(0,0,0,0.4)'; this.style.border='1px solid var(--accent-color)';" onblur="this.style.background='transparent'; this.style.border='1px solid transparent';">
                </td>
                <td style="padding:10px;">
                    <input type="text" value="${c.company || ''}" title="${c.company || ''}" placeholder="—" style="${secStyle}" onchange="window.ContactsView.updatePreviewContact(${i}, 'company', this.value)" onfocus="this.style.background='rgba(0,0,0,0.4)'; this.style.border='1px solid var(--accent-color)';" onblur="this.style.background='transparent'; this.style.border='1px solid transparent';">
                </td>
                <td style="padding:10px;">
                    <input type="text" value="${c.event || ''}" title="${c.event || ''}" placeholder="—" style="${secStyle}" onchange="window.ContactsView.updatePreviewContact(${i}, 'event', this.value)" onfocus="this.style.background='rgba(0,0,0,0.4)'; this.style.border='1px solid var(--accent-color)';" onblur="this.style.background='transparent'; this.style.border='1px solid transparent';">
                </td>
                <td style="padding:10px;">
                    <input type="text" value="${c.interest || ''}" title="${c.interest || ''}" placeholder="—" style="${secStyle}" onchange="window.ContactsView.updatePreviewContact(${i}, 'interest', this.value)" onfocus="this.style.background='rgba(0,0,0,0.4)'; this.style.border='1px solid var(--accent-color)';" onblur="this.style.background='transparent'; this.style.border='1px solid transparent';">
                </td>
                <td style="padding:10px;">
                    <input type="text" value="${c.position || ''}" title="${c.position || ''}" placeholder="—" style="${secStyle}" onchange="window.ContactsView.updatePreviewContact(${i}, 'position', this.value)" onfocus="this.style.background='rgba(0,0,0,0.4)'; this.style.border='1px solid var(--accent-color)';" onblur="this.style.background='transparent'; this.style.border='1px solid transparent';">
                </td>
                <td style="padding:10px;text-align:right;">
                    <button onclick="window.ContactsView.removePreviewContact(${i})" style="width:28px; height:28px; border-radius:8px; border:1px solid rgba(255,69,58,0.2); background:rgba(255,69,58,0.05); color:#ff453a; display:inline-flex; align-items:center; justify-content:center; cursor:pointer;" title="Delete Record"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </td>
            </tr>`;
        }

        if (total > renderLimit) {
            html += `<tr><td colspan="8" style="padding:30px 10px;text-align:center;color:rgba(255,255,255,0.25);font-style:italic;">...and <strong style="color:var(--accent-color)">${total - renderLimit}</strong> more records efficiently hidden from preview. They will still securely sync.</td></tr>`;
        }

        tbody.innerHTML = html;
    },

    updatePreviewContact(index, field, val) {
        if (!this.previewBuffer[index]) return;
        if (field === 'phone') {
            const clean = val.replace(/[^\d]/g, '');
            this.previewBuffer[index].phone = clean;
        } else if (field === 'name') {
            const dt = this.parseName(val);
            this.previewBuffer[index].name = dt.full;
            this.previewBuffer[index].firstName = dt.first;
            this.previewBuffer[index].mi = dt.mi;
            this.previewBuffer[index].lastName = dt.last;
            // visually update input box immediately with parsed form
            this.renderPreviewTable();
        } else {
            this.previewBuffer[index][field] = String(val).trim();
        }
    },

    removePreviewContact(index) {
        this.previewBuffer.splice(index, 1);
        this.renderPreviewTable();
    },

    importContacts() {
        let input = document.getElementById('heavyImportInput');
        if (!input) {
            input = document.createElement('input');
            input.type = 'file'; input.id = 'heavyImportInput';
            input.accept = '.csv,.xlsx,.xls,.ods'; input.style.display = 'none';
            document.body.appendChild(input);
            this.setupHeavyImport();
        }
        input.click();
    },
    exportContacts() { window.showToast("EXPORTING...", "info"); setTimeout(() => window.showToast("EXPORT COMPLETE.", "success"), 1500); },

    // --- Pending Review Flow ---
    openPendingModal() {
        document.getElementById('pendingModal').style.display = 'flex';
        this.loadPendingData();
    },

    closePendingModal() {
        document.getElementById('pendingModal').style.display = 'none';
        this.loadData(); // Refresh main view to show newly approved contacts
    },

    async pullCentralized() {
        window.showToast("Fetching records from Brand-Sync...", "info");
        const res = await window.BrandSyncAPI.fetchBrandSyncLeads();
        if (res.success) {
            window.showToast(`Imported ${res.count} new pending contacts. Total: ${res.totalPending}`, "success");
            this.loadPendingData();
        } else {
            window.showToast(`Pull failed: ${res.message}`, "error");
        }
    },

    async loadPendingData() {
        const tbody = document.getElementById('pendingTableBody');
        const empty = document.getElementById('pendingEmptyState');
        if (!tbody) return;

        let pendingRaw = window.BrandSyncAPI.getPendingContacts();
        this.updatePendingCounter(pendingRaw.length);

        let pending = pendingRaw;
        const filterEl = document.getElementById('pendingFilter');
        if (filterEl && filterEl.value) {
            const f = filterEl.value.toLowerCase();
            pending = pending.filter(p =>
                (p.company || p.organization || '').toLowerCase().includes(f) ||
                (p.position || p.role || '').toLowerCase().includes(f) ||
                (p.name || '').toLowerCase().includes(f) ||
                (p.salesPerson || '').toLowerCase().includes(f) ||
                (p.interest || p.selected_topic || '').toLowerCase().includes(f) ||
                (p.event || '').toLowerCase().includes(f) ||
                (p.phone || '').toLowerCase().includes(f) ||
                (p.added || '').toLowerCase().includes(f)
            );
        }

        // Populate the `<select id="pendingBulkGroupSelect">` on load
        const sel = document.getElementById('pendingBulkGroupSelect');
        if (sel) {
            const groups = window.BrandSyncAPI._get(window.BS_STORAGE_KEYS ? window.BS_STORAGE_KEYS.GROUPS : 'brandsync_groups');
            const existVal = sel.value;
            sel.innerHTML = `<option value="">None</option><option value="new">Create New Group...</option>` + groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
            if (sel.querySelector(`option[value="${existVal}"]`)) sel.value = existVal;
            else sel.value = "";
        }

        if (pending.length === 0) {
            tbody.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';

        const _toTitleCase = (str) => {
            if (!str) return '';
            return String(str).trim().toLowerCase().replace(/(^|[ \-\/,])([a-z0-9])/g, m => m.toUpperCase());
        };

        tbody.innerHTML = pending.map(p => {
            // Auto Format Name
            const parsedName = window.ContactsView.parseName(p.name);
            const formattedName = parsedName.full;
            if (formattedName !== p.name && p.id) {
                // Background update if changed
                setTimeout(() => window.ContactsView.updatePendingField(p.id, 'name', formattedName), 10);
                p.name = formattedName;
            }

            // Auto Format Position
            const formattedPosition = _toTitleCase(p.position || p.role || '');
            if (formattedPosition !== (p.position || p.role) && p.id) {
                setTimeout(() => window.ContactsView.updatePendingField(p.id, 'position', formattedPosition), 10);
                p.position = formattedPosition;
            }

            const _extractStrings = (val) => {
                if (!val) return '';
                if (typeof val === 'string') return val.trim();
                if (Array.isArray(val)) return val.map(_extractStrings).filter(Boolean).join(', ');
                if (typeof val === 'object') return val.name || val.title || val.label || val.value || val.text || val.topic || JSON.stringify(val);
                return String(val);
            };

            // Format Interest as Comma Separated safely deep diving objects
            let rawInterest = p.interest || p.selected_topic || '';
            if (typeof rawInterest === 'string' && rawInterest.trim().startsWith('[') && rawInterest.trim().endsWith(']')) {
                try { rawInterest = JSON.parse(rawInterest.replace(/'/g, '"')); } catch (e) { }
            }

            let extractedInterest = _extractStrings(rawInterest);
            let cleanPendingInterest = String(extractedInterest).replace(/[\[\]"'{}]/g, '').replace(/[;\/\|]/g, ', ').replace(/\s*,\s*/g, ', ').replace(/(^,+)|(,$)/g, '').trim();
            const formattedInterest = cleanPendingInterest === 'Object Object' ? '' : _toTitleCase(cleanPendingInterest);

            // Auto Format Phone (Starts with 63)
            let formattedPhone = String(p.phone || '').replace(/[^\d]/g, '');
            if (formattedPhone.startsWith('6309') && formattedPhone.length === 13) formattedPhone = '63' + formattedPhone.substring(3);
            else if (formattedPhone.startsWith('09') && formattedPhone.length === 11) formattedPhone = '63' + formattedPhone.substring(1);
            else if (formattedPhone.startsWith('9') && formattedPhone.length === 10) formattedPhone = '63' + formattedPhone;

            if (formattedPhone !== p.phone && p.id) {
                // Background update if changed
                setTimeout(() => window.ContactsView.updatePendingField(p.id, 'phone', formattedPhone), 10);
                p.phone = formattedPhone;
            }

            const inputStyle = "background:transparent; border:none; color:rgba(255,255,255,0.8); font-weight: 600; outline:none; font-size:0.85rem; width:100%; border-radius:4px; border:1px solid transparent; padding:4px;";

            return `
            <tr style="border-bottom:1px solid rgba(255,255,255,0.04); transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'; this.querySelector('.pending-actions').style.opacity='1'" onmouseout="this.style.background=''; this.querySelector('.pending-actions').style.opacity='0'">
                <td style="padding:16px 20px; width:45px;"><input type="checkbox" class="pending-checkbox" value="${p.id}" onchange="window.ContactsView.updatePendingBulkUI()" style="width:16px; height:16px; accent-color:#ff9f0a; cursor:pointer;"></td>
                <td style="padding:16px 12px; color:#fff; font-weight:600; max-width:200px;">
                    <div style="display:flex; flex-direction:column; gap:2px;">
                        <input type="text" value="${p.name}" title="${p.name}" onchange="window.ContactsView.updatePendingField('${p.id}', 'name', this.value)" style="background:transparent; border:none; color:#fff; font-weight:800; outline:none; font-size:0.95rem; padding:2px 4px; border-radius:4px; width:100%; border:1px solid transparent; text-overflow:ellipsis; white-space:nowrap; overflow:hidden;" onfocus="this.style.background='rgba(255,255,255,0.1)'; this.style.borderColor='rgba(255,159,10,0.5)'" onblur="this.style.background='transparent'; this.style.borderColor='transparent'">
                        <input type="text" value="${formattedPosition}" placeholder="Position" title="${formattedPosition || 'No Position'}" onchange="window.ContactsView.updatePendingField('${p.id}', 'position', this.value)" style="background:transparent; border:none; color:var(--accent-color); font-weight:700; outline:none; font-size:0.75rem; padding:2px 4px; border-radius:4px; width:100%; border:1px solid transparent; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; margin-top:-4px;" onfocus="this.style.background='rgba(255,159,10,0.1)'; this.style.borderColor='rgba(255,159,10,0.5)'" onblur="this.style.background='transparent'; this.style.borderColor='transparent'">
                        <span style="font-size:0.65rem; color:rgba(255,255,255,0.3); font-weight:700; margin-left:4px; margin-top:2px;" title="Imported Timestamp"><i class="icon-lucide-clock" style="font-size:0.6rem;"></i> ${p.added || 'Unknown Time'}</span>
                    </div>
                </td>
                <td style="padding:16px 12px; font-family:monospace; color:#32d74b; font-weight:800; max-width:140px;">
                    <input type="text" value="${p.phone}" title="${p.phone}" onchange="window.ContactsView.updatePendingField('${p.id}', 'phone', this.value)" style="background:transparent; border:none; color:#32d74b; font-weight:800; outline:none; font-family:monospace; font-size:0.9rem; padding:2px 4px; border-radius:4px; width:100%; border:1px solid transparent; text-overflow:ellipsis; white-space:nowrap; overflow:hidden;" onfocus="this.style.background='rgba(50,215,75,0.1)'; this.style.borderColor='rgba(255,159,10,0.5)'" onblur="this.style.background='transparent'; this.style.borderColor='transparent'">
                </td>
                <td style="padding:16px 12px; vertical-align: middle; max-width:180px;">
                    <input type="text" value="${p.company || p.organization || ''}" placeholder="Company" title="${p.company || p.organization || ''}" onchange="window.ContactsView.updatePendingField('${p.id}', 'company', this.value)" style="${inputStyle}" onfocus="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,159,10,0.5)'" onblur="this.style.background='transparent'; this.style.borderColor='transparent'">
                </td>
                <td style="padding:16px 12px; vertical-align: middle; max-width:150px;">
                    <input type="text" value="${p.event || ''}" placeholder="Event" title="${p.event || ''}" onchange="window.ContactsView.updatePendingField('${p.id}', 'event', this.value)" style="${inputStyle}" onfocus="this.style.background='rgba(10,132,255,0.1)'; this.style.borderColor='rgba(10,132,255,0.5)'" onblur="this.style.background='transparent'; this.style.borderColor='transparent'">
                </td>
                <td style="padding:16px 12px; vertical-align: middle; max-width:280px;">
                    <textarea rows="2" placeholder="Interests..." onchange="window.ContactsView.updatePendingField('${p.id}', 'interest', this.value)" style="${inputStyle} resize:none; line-height:1.4; display:block; height:44px;" onfocus="this.style.background='rgba(255,159,10,0.15)'; this.style.borderColor='rgba(255,159,10,0.5)'" onblur="this.style.background='transparent'; this.style.borderColor='transparent'">${formattedInterest}</textarea>
                </td>
                <td style="padding:16px 20px; text-align:right;">
                    <div class="pending-actions" style="display:flex; justify-content:flex-end; gap:8px; opacity: 0; transition: opacity 0.2s ease;">
                        <button onclick="window.ContactsView.approvePending('${p.id}')" style="background:#32d74b; color:#000; border:none; height:32px; padding:0 12px; border-radius:8px; font-size:0.75rem; font-weight:800; cursor:pointer;" title="Approve & Finalize Identity">Approve</button>
                        <button onclick="window.ContactsView.deletePending('${p.id}')" style="background:rgba(255,69,58,0.1); color:#ff453a; border:1px solid rgba(255,69,58,0.2); width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer;" title="Discard Record"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6V6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path></svg></button>
                    </div>
                </td>
            </tr>
            `;
        }).join('');
        this.updatePendingBulkUI();
    },

    updatePendingCounter(count = null) {
        if (count === null) count = window.BrandSyncAPI.getPendingContacts().length;
        const badge = document.getElementById('pendingBadgeCount');
        if (badge) {
            badge.innerText = count;
            badge.style.display = count > 0 ? 'inline-block' : 'none';
        }
        if (window.BrandSyncAppInstance) window.BrandSyncAppInstance.refreshGatewayStatus();
    },

    setPendingLoading(active, text = "Optimizing BrandSync Nodes...") {
        const overlay = document.getElementById('pendingLoadingOverlay');
        if (!overlay) return;
        
        const textEl = overlay.querySelector('.scanner-text');
        if (textEl) textEl.innerText = text;

        if (active) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    },

    async updatePendingField(id, field, value) {
        const pending = window.BrandSyncAPI.getPendingContacts();
        const contact = pending.find(p => p.id === id);
        if (contact) {
            contact[field] = value;
            await window.BrandSyncAPI.updatePendingContact(contact);
        }
    },

    toggleAllPending(checked) {
        document.querySelectorAll('.pending-checkbox').forEach(cb => cb.checked = checked);
        this.updatePendingBulkUI();
    },

    updatePendingBulkUI() {
        const checked = document.querySelectorAll('.pending-checkbox:checked');
        const bulk = document.getElementById('pendingBulkActions');
        const count = document.getElementById('pendingSelectCount');

        if (bulk && count) {
            if (checked.length > 0) {
                bulk.style.display = 'flex';
                count.innerText = checked.length;
            } else {
                bulk.style.display = 'none';
                if (document.getElementById('selectAllPending')) document.getElementById('selectAllPending').checked = false;
            }
        }
    },

    async approvePending(id) {
        let targetGrpId = null;
        const res = await window.BrandSyncAPI.approvePendingContacts([id], targetGrpId);
        if (res.success) {
            window.showToast("Identity Approved!", "success");
            this.loadData();
            this.loadGroups();
            this.loadPendingData();
        }
    },

    async bulkApprovePending() {
        const ids = Array.from(document.querySelectorAll('.pending-checkbox:checked')).map(cb => cb.value);
        if (ids.length === 0) return;

        const sel = document.getElementById('pendingBulkGroupSelect');
        const newGrpInput = document.getElementById('pendingBulkNewGroup');
        let targetGroupId = sel ? sel.value : null;

        if (targetGroupId === 'new') {
            const grpName = newGrpInput.value.trim();
            if (!grpName) return window.showToast('Please provide a name for the new group.', 'error');
            const newId = Date.now() + Math.random();
            const groupsKey = window.BS_STORAGE_KEYS ? window.BS_STORAGE_KEYS.GROUPS : 'brandsync_groups';
            const groups = window.BrandSyncAPI._get(groupsKey);
            groups.push({ id: newId, name: grpName, color: '#ff9f0a', icon: 'Star' });
            window.BrandSyncAPI._set(groupsKey, groups);
            targetGroupId = newId;
        }

        window.BrandSyncAppInstance.confirmAction(`Approve ${ids.length} Identities?`, `This will promote these ${ids.length} records to the main database and assign them to the selected group.`, "#32d74b", async () => {
            console.log(`[UI] Approving ${ids.length} leads...`);
            const res = await window.BrandSyncAPI.approvePendingContacts(ids, targetGroupId);
            console.log(`[UI] API response:`, res);
            if (res.success) {
                // FORCE COMPLETE UI RESET TO SHOW NEW DATA
                const searchInp = document.getElementById('contactSearch');
                if (searchInp) searchInp.value = '';

                // Clear Advanced Filters
                const filters = ['filterDateFrom', 'filterDateTo', 'filterTag', 'filterCompany'];
                filters.forEach(fid => { const el = document.getElementById(fid); if (el) el.value = ''; });

                this.isRecentFilterActive = false;
                this.activeGroupId = null; // Switch to All Contacts view so they are visible

                window.showToast(`${ids.length} Records Promoted to Global Pool!`, "success");

                this.loadData();
                this.loadGroups();
                this.loadPendingData();
                if (document.getElementById('selectAllPending')) document.getElementById('selectAllPending').checked = false;
            } else {
                window.showToast("Approval failed. Check cloud connection.", "error");
            }
        });
    },

    async deletePending(id) {
        await window.BrandSyncAPI.deletePendingContacts([id]);
        window.showToast("Pending record discarded.", "info");
        this.loadData();
        this.loadPendingData();
    },

    async bulkDeletePending() {
        const ids = Array.from(document.querySelectorAll('.pending-checkbox:checked')).map(cb => cb.value);
        if (ids.length === 0) return;

        window.BrandSyncAppInstance.confirmAction(`Discard ${ids.length} Records?`, "This will remove them from the review queue PERMANENTLY.", "#ff453a", async () => {
            await window.BrandSyncAPI.deletePendingContacts(ids);
            window.showToast(`${ids.length} Records discarded.`, "success");
            this.loadData();
            this.loadPendingData();
            if (document.getElementById('selectAllPending')) document.getElementById('selectAllPending').checked = false;
        });
    }
};

document.addEventListener('DOMContentLoaded', () => { setTimeout(() => { if (window.app) window.app.views['contacts'] = () => window.ContactsView.render(window.app.contentArea); }, 1000); });
