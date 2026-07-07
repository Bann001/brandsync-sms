// Scheduled Messages View Component
window.ScheduledView = {
    render(container) {
        container.innerHTML = `
            <div class="view-container active fade-in">
                <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:24px; gap:16px; flex-wrap:wrap;">
                    <div>
                        <h2 style="font-size:1.35rem; font-weight:700; color:#fff; letter-spacing:-0.03em;">Scheduled Messages</h2>
                        <p style="color:var(--text-muted); font-size:0.9rem;">Automated message queue and recurring dispatch manager.</p>
                    </div>
                    <div style="display:flex; align-items:center; gap:20px; flex:1;">
                        <div id="schedStatsContainer" style="display:flex; gap:8px;"></div>
                        <div style="display:flex; align-items:center; gap:12px; margin-left:auto;">
                            <div style="position:relative;">
                                <svg style="position:absolute; left:16px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,0.3);" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                <input type="text" id="schedSearch" oninput="clearTimeout(window.schedSearchT); window.schedSearchT = setTimeout(() => window.ScheduledView.renderList(), 300);" placeholder="Search content..." style="width:280px; height:48px; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.12); border-radius:14px; padding:0 14px 0 46px; color:#fff; font-size:0.95rem; outline:none; transition:0.3s;">
                            </div>
                            <button id="schedDynamicActionBtn" class="btn icon-btn" onclick="window.ScheduledView.renderList(true)" style="width:auto; min-width:48px; height:48px; background:rgba(255,255,255,0.05); border-radius:14px; border:1px solid rgba(255,255,255,0.1); transition:all 0.3s cubic-bezier(0.19, 1, 0.22, 1); padding:0 14px; display:inline-flex; align-items:center; justify-content:center; gap:8px;">
                                <span id="schedDynamicActionIcon" style="display:flex; transform:scale(1.1);"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg></span>
                                <span id="schedDynamicActionText" style="display:none; font-weight:800; font-size:0.9rem; margin-right:4px;">Delete 0</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card" style="padding:0; overflow:visible; border-radius:24px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02);">
                    <table style="width:100%; border-collapse:collapse; text-align:left;">
                        <thead style="position:relative; z-index:1;">
                            <tr style="background:rgba(255,255,255,0.03); border-bottom:1px solid rgba(255,255,255,0.06);">
                                <th style="padding:18px 20px; width:50px;"><input type="checkbox" id="schedSelectAll" onchange="window.ScheduledView.toggleAllRow(this.checked)" style="width:16px;height:16px;cursor:pointer;accent-color:#0a84ff;"></th>
                                <th style="padding:18px 20px; font-weight:600; font-size:0.75rem; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:0.08em;">Schedule Info</th>
                                <th style="padding:18px 20px; font-weight:600; font-size:0.75rem; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:0.08em;">Recipients</th>
                                <th style="padding:18px 20px; font-weight:600; font-size:0.75rem; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:0.08em;">Snapshot</th>
                                <th style="padding:18px 20px; font-weight:600; font-size:0.75rem; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:0.08em;">Cost</th>
                                <th style="padding:18px 20px; font-weight:600; font-size:0.75rem; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:0.08em;">Status</th>
                                <th style="padding:18px 20px; text-align:right; font-weight:600; font-size:0.75rem; color:rgba(255,255,255,0.3); text-transform:uppercase; letter-spacing:0.08em;">Management</th>
                            </tr>
                        </thead>
                        <tbody id="scheduled-list">
                            <tr><td colspan="7" style="padding:60px; text-align:center; color:rgba(255,255,255,0.15);"><svg class="spin" style="width:24px;height:24px;margin-bottom:12px;opacity:0.3;" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='12' y1='2' x2='12' y2='6'/><path d='M12 18v4'/><path d='M4.93 4.93l2.83 2.83'/><path d='M16.24 16.24l2.83 2.83'/><path d='M2 12h4'/><path d='M18 12h4'/><path d='M4.93 19.07l2.83-2.83'/><path d='M16.24 7.76l2.83-2.83'/></svg></td></tr>
                        </tbody>
                    </table>
                </div>

                <!-- OVERLAYS PORTALED TO BODY ON INITIALIZATION -->
                
                <!-- 1. EDIT MODAL -->
                <div id="schedEditOverlay" style="display:none; position:fixed; inset:0; z-index:20000; background:rgba(0,0,0,0.6); backdrop-filter:blur(32px) saturate(180%); -webkit-backdrop-filter:blur(32px) saturate(180%); align-items:center; justify-content:center; padding:24px; box-sizing:border-box;">
                    <div style="width:920px; max-width:96vw; max-height:90vh; overflow-y:auto; padding:40px; border-radius:36px; border:1px solid rgba(255,255,255,0.15); box-shadow:0 64px 128px -32px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.08); background:rgba(22,22,28,0.8); backdrop-filter:blur(64px) saturate(180%); animation:popIn 0.4s cubic-bezier(0.19, 1, 0.22, 1); box-sizing:border-box;">
                        
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px; padding-bottom:24px; border-bottom:1px solid rgba(255,255,255,0.08);">
                            <div style="display:flex; align-items:center; gap:16px;">
                                <div id="editModalIcon" style="width:48px; height:48px; border-radius:15px; background:rgba(10,132,255,0.1); border:1px solid rgba(10,132,255,0.2); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                                    <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#0a84ff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'/><path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'/></svg>
                                </div>
                                <div>
                                    <h3 id="editModalTitle" style="font-size:1.15rem; font-weight:800; color:#fff; letter-spacing:-0.01em;">Edit Scheduled Message</h3>
                                    <p id="editModalSub" style="font-size:0.75rem; color:rgba(255,255,255,0.4); margin-top:2px;">Dispatch parameters are updated instantly in the queue.</p>
                                </div>
                            </div>
                            <button onclick="window.ScheduledView.closeEdit()" style="width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; color:#fff; border:1px solid rgba(255,255,255,0.15); transition:0.2s; font-size:1.4rem; font-weight:800; line-height:1;" onmouseover="this.style.background='rgba(255,255,255,0.15)';this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.08)';this.style.transform='scale(1)'">&times;</button>
                        </div>

                        <input type="hidden" id="editMsgId">
                        <input type="hidden" id="editMode" value="edit">

                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:32px;">
                            <div style="display:flex; flex-direction:column; gap:20px;">
                                <div>
                                    <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:10px; display:block;">Target Recipients</label>
                                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
                                        <span id="edit_recipientBadge" style="padding:4px 12px; background:rgba(255,255,255,0.06); border-radius:24px; font-size:0.75rem; color:#fff; font-weight:600; border:1px solid rgba(255,255,255,0.1);">0 Contacts</span>
                                        <div style="display:flex; gap:8px;">
                                            <button onclick="document.getElementById('edit_fileInput').click()" style="height:32px; padding:0 14px; font-size:0.75rem; font-weight:700; background:rgba(50,215,75,0.15); border:1px solid rgba(50,215,75,0.3); color:var(--success-color); border-radius:10px; cursor:pointer;" class="btn">Excel / CSV</button>
                                            <input type="file" id="edit_fileInput" style="display:none;" accept=".csv,.xlsx,.xls">
                                            <div style="position:relative;">
                                                <button id="edit_btnContactsDrop" style="height:32px; padding:0 14px; font-size:0.75rem; font-weight:700; background:rgba(10,132,255,0.15); border:1px solid rgba(10,132,255,0.3); color:var(--accent-color); border-radius:10px; cursor:pointer;" class="btn">Contacts</button>
                                                <div id="edit_contactsMenu" style="display:none; position:absolute; right:0; top:100%; margin-top:8px; background:rgba(45,45,50,0.95); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:8px; width:240px; z-index:100; max-height:280px; overflow-y:auto; text-align:left; box-shadow:0 10px 40px rgba(0,0,0,0.5);">
                                                    <div style="font-size:0.75rem; color:var(--text-muted); padding:4px;">Loading...</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <textarea id="edit_recipients" placeholder="Enter mobile numbers..." style="width:100%; height:90px; background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.1); border-radius:18px; padding:14px; color:#fff; font-size:0.85rem; font-family:monospace; outline:none; resize:vertical;"></textarea>
                                </div>
                                <div>
                                    <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:10px; display:block;">Dispatch Time</label>
                                    <input id="edit_scheduleTime" type="datetime-local" style="width:100%; background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.1); border-radius:18px; padding:14px; color:#fff; outline:none; font-size:0.95rem; color-scheme:dark;">
                                </div>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:12px;">
                                <div style="display:flex; justify-content:space-between; align-items:center;">
                                    <label style="font-size:0.65rem; font-weight:700; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.08em;">Message Payload</label>
                                    <div style="display:flex; gap:8px;">
                                        <div style="position:relative;">
                                            <button id="edit_btnTemplatesDrop" style="height:28px; padding:0 12px; font-size:0.7rem; font-weight:700; background:rgba(191,90,242,0.15); border:1px solid rgba(191,90,242,0.3); color:#bf5af2; border-radius:8px; cursor:pointer;" class="btn">Templates</button>
                                            <div id="edit_templatesMenu" style="display:none; position:absolute; right:0; top:100%; margin-top:8px; background:rgba(45,45,50,0.95); backdrop-filter:blur(24px); border:1px solid rgba(255,255,255,0.15); border-radius:12px; padding:8px; width:260px; z-index:100; max-height:240px; overflow-y:auto; text-align:left; box-shadow:0 10px 40px rgba(0,0,0,0.5);">
                                                <div style="font-size:0.75rem; color:var(--text-muted); padding:4px;">Loading...</div>
                                            </div>
                                        </div>
                                        <button onclick="window.ScheduledView.applySpintax()" class="btn" style="height:28px; padding:0 12px; font-size:0.7rem; background:rgba(255,159,10,0.15); color:var(--warning-color); border:1px solid rgba(255,159,10,0.3); border-radius:8px; display:inline-flex; align-items:center; gap:6px; cursor:pointer;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 4V2M15 16v-2M8 9h2M20 9h2M17.8 11.8L19 13M10.2 6.2L9 5M17.8 6.2L19 5M10.2 11.8L9 13M3 21l9-9M12.2 9.4l2.4-2.4"/></svg> Auto Spintax</button>
                                    </div>
                                </div>
                                
                                <div id="edit_gsmWarningBar" style="display:none; justify-content:space-between; align-items:center; background:rgba(255,159,10,0.15); border:1px solid rgba(255,159,10,0.4); border-radius:12px; padding:12px 16px;">
                                    <span style="font-size:0.75rem; color:var(--warning-color); font-weight:600; display:flex; align-items:center; gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Non-GSM Detected! Max chars reduced to 70.</span>
                                    <div style="display:flex; gap:8px;">
                                        <button onclick="document.getElementById('edit_gsmWarningBar').style.display='none'" class="btn" style="padding:4px 10px; font-size:0.75rem; color:rgba(255,255,255,0.6); background:rgba(0,0,0,0.3); border-radius:6px; border:none; cursor:pointer;">Ignore</button>
                                        <button onclick="window.ScheduledView.fixGsm()" class="btn primary-btn" style="padding:4px 12px; font-size:0.75rem; background:#ff9f0a; color:#000; font-weight:800; border-radius:6px; border:none; cursor:pointer;">Auto Convert</button>
                                    </div>
                                </div>
                                <div id="edit_msgWrapper" style="position:relative; background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.1); border-radius:18px; overflow:hidden;">
                                    <div id="edit_backdrop" style="position:absolute; inset:0; padding:14px; font-size:0.85rem; line-height:1.6; color:transparent; pointer-events:none; white-space:pre-wrap; word-wrap:break-word; overflow:hidden; z-index:1;"></div>
                                    <textarea id="edit_message" style="position:relative; z-index:2; display:block; width:100%; height:260px; background:transparent; border:none; padding:14px; color:#fff; font-size:0.85rem; outline:none; font-family:inherit; resize:vertical; line-height:1.6;"></textarea>
                                </div>
                                <div style="display:grid; grid-template-columns:repeat(4,1fr); background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); border-radius:16px; padding:10px 0;">
                                    <div style="text-align:center; border-right:1px solid rgba(255,255,255,0.05);"><div style="font-size:0.55rem; color:rgba(255,255,255,0.3); font-weight:800;">CHARS</div><div id="edit_charCount" style="color:#fff; font-weight:700;">0</div></div>
                                    <div style="text-align:center; border-right:1px solid rgba(255,255,255,0.05);"><div style="font-size:0.55rem; color:rgba(255,255,255,0.3); font-weight:800;">SEGS</div><div id="edit_segCount" style="color:var(--credit-color); font-weight:700;">1</div></div>
                                    <div style="text-align:center; border-right:1px solid rgba(255,255,255,0.05);"><div style="font-size:0.55rem; color:rgba(255,255,255,0.3); font-weight:800;">ENCODING</div><div id="edit_encoding" style="color:#fff; font-size:0.7rem;">GSM</div></div>
                                    <div style="text-align:center;"><div style="font-size:0.55rem; color:rgba(255,255,255,0.3); font-weight:800;">COST</div><div style="color:var(--credit-color); font-weight:700;"><span id="edit_cost">0</span> Cr.</div></div>
                                </div>
                            </div>
                        </div>

                        <div style="border-top:1px solid rgba(255,255,255,0.07); margin:32px 0;"></div>
                        <div style="display:flex; gap:12px; justify-content:flex-end;">
                            <button onclick="window.ScheduledView.closeEdit()" class="btn" style="background:rgba(255,255,255,0.06); border:none; color:#fff;">Dismiss</button>
                            <button onclick="window.ScheduledView.saveEdit()" class="btn primary-btn" id="saveEditBtn" style="border-radius:18px; padding:0 32px; height:48px;">Apply Changes</button>
                        </div>
                    </div>
                </div>

                <!-- 2. RESCHEDULE CHOICE POPUP -->
                <div id="rescheduleChoiceOverlay" style="display:none; position:fixed; inset:0; z-index:25000; background:rgba(0,0,0,0.6); backdrop-filter:blur(32px); align-items:center; justify-content:center; padding:20px;">
                    <div style="width:400px; background:rgba(30,30,35,0.9); border:1px solid rgba(255,255,255,0.2); border-radius:32px; padding:32px; box-shadow:0 32px 128px rgba(0,0,0,0.9); animation:slideUp 0.35s cubic-bezier(0.1, 0.9, 0.2, 1); text-align:center;">
                        <div style="width:56px; height:56px; background:rgba(10,132,255,0.12); border-radius:20px; display:flex; align-items:center; justify-content:center; margin:0 auto 24px; color:#0a84ff; border:1px solid rgba(10,132,255,0.2);"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M3.06 15a9 9 0 1 0 .44-7"/></svg></div>
                        <h3 style="font-size:1.25rem; font-weight:800; color:#fff; margin-bottom:12px; letter-spacing:-0.01em;">Reschedule Message</h3>
                        <p style="font-size:0.9rem; color:rgba(255,255,255,0.4); line-height:1.6; margin-bottom:32px;">Pick a reschedule method for this payload.</p>
                        <div style="position: absolute; top: 20px; right: 20px;">
                            <button onclick="window.ScheduledView.closeReschedChoice()" style="width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; color:#fff; border:1px solid rgba(255,255,255,0.15); transition:0.2s; font-size:1.4rem; font-weight:800; line-height:1;" onmouseover="this.style.background='rgba(255,255,255,0.15)';this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.08)';this.style.transform='scale(1)'">&times;</button>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:12px;">
                            <button onclick="window.ScheduledView.openQuickResched()" style="width:100%; height:56px; background:rgba(10,132,255,0.15); border:1px solid rgba(10,132,255,0.3); border-radius:18px; color:#0a84ff; font-weight:800; cursor:pointer; font-size:0.95rem;">Quick Setup / Auto Recurring</button>
                            <button onclick="window.ScheduledView.openFullEditResched()" style="width:100%; height:56px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:18px; color:#fff; font-weight:800; cursor:pointer;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.06)'">Full Editor</button>
                            <button onclick="window.ScheduledView.closeReschedChoice()" style="margin-top:16px; font-size:0.9rem; color:rgba(255,255,255,0.3); background:none; border:none; cursor:pointer;">Dismiss</button>
                        </div>
                    </div>
                </div>

                <!-- 3. QUICK RESCHEDULE + ADVANCED AUTOMATION -->
                <div id="quickReschedOverlay" style="display:none; position:fixed; inset:0; z-index:26000; background:rgba(0,0,0,0.7); backdrop-filter:blur(24px); align-items:center; justify-content:center; padding:20px;">
                    <div style="width:420px; background:rgba(24,24,30,0.98); border:1px solid rgba(255,255,255,0.2); border-radius:36px; padding:36px; box-shadow:0 48px 160px rgba(0,0,0,1); animation:slideUp 0.3s cubic-bezier(0.1, 0.9, 0.2, 1); max-height:92vh; overflow-y:auto; position: relative;">
                        <div style="position: absolute; top: 24px; right: 24px;">
                            <button onclick="window.ScheduledView.closeQuickResched()" style="width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,0.08); display:flex; align-items:center; justify-content:center; cursor:pointer; color:#fff; border:1px solid rgba(255,255,255,0.15); transition:0.2s; font-size:1.4rem; font-weight:800; line-height:1;" onmouseover="this.style.background='rgba(255,255,255,0.15)';this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.08)';this.style.transform='scale(1)'">&times;</button>
                        </div>
                        <h3 style="font-size:1.2rem; font-weight:800; color:#fff; margin-bottom:24px; text-align:center; letter-spacing:-0.02em;">Automation Logic</h3>
                        
                        <div style="margin-bottom:24px;">
                            <label style="display:block; font-size:0.65rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-weight:800; margin-bottom:10px; letter-spacing:0.05em;">Start Date & Time</label>
                            <input id="quick_reschedTime" type="datetime-local" style="width:100%; background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.15); border-radius:16px; padding:15px; color:#fff; font-size:1rem; outline:none; cursor:pointer; color-scheme:dark;">
                        </div>

                        <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:24px; margin-bottom:28px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                                <div style="display:flex; align-items:center; gap:12px;">
                                    <div style="width:32px; height:32px; border-radius:10px; background:rgba(10,132,255,0.15); display:flex; align-items:center; justify-content:center; color:#0a84ff;">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                                    </div>
                                    <span style="font-size:1rem; font-weight:700; color:#fff;">Auto Recurring</span>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="quick_isRecurring" onchange="window.ScheduledView.toggleRecurringUI(this.checked)">
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>

                            <div id="recurringOptions" style="display:none; border-top:1px solid rgba(255,255,255,0.06); padding-top:20px; margin-top:5px;">
                                <div style="margin-bottom:20px;">
                                    <label style="display:block; font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; margin-bottom:8px;">Frequency Type</label>
                                    <select id="quick_freq" style="width:100%; background-color:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.15); border-radius:14px; padding:14px; padding-right:40px; color:#fff; font-size:0.9rem; outline:none; appearance:none; -webkit-appearance:none; background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E&quot;); background-repeat:no-repeat; background-position:right 16px center;" onchange="window.ScheduledView.onFreqChange(this.value)">
                                        <option value="daily">Daily Dispatches</option>
                                        <option value="weekly">Weekly Checklist</option>
                                        <option value="monthly">Monthly Cycle</option>
                                        <option value="yearly">Annual Routine</option>
                                    </select>
                                </div>

                                <!-- Weekday Selection -->
                                <div id="weekdayPicker" style="display:none; margin-bottom:20px;">
                                    <label style="display:block; font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; margin-bottom:10px;">Select Active Days</label>
                                    <div style="display:flex; justify-content:space-between; gap:4px;">
                                        ${['M','T','W','T','F','S','S'].map((d,i)=>`<button class="day-btn" data-day="${i+1}" onclick="this.classList.toggle('active')" style="flex:1; height:34px; border-radius:8px; border:1px solid rgba(255,255,255,0.1); background:rgba(0,0,0,0.3); color:#fff; font-size:0.75rem; font-weight:700; cursor:pointer;">${d}</button>`).join('')}
                                    </div>
                                    <style>
                                        .day-btn.active { background: #0a84ff !important; border-color: #0a84ff !important; box-shadow: 0 4px 12px rgba(10,132,255,0.4); }
                                    </style>
                                </div>

                                <div style="margin-bottom:20px;">
                                    <label style="display:block; font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; margin-bottom:8px;">Repetition Strategy</label>
                                    <select id="quick_timeMode" style="width:100%; background-color:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.15); border-radius:14px; padding:14px; padding-right:40px; color:#fff; font-size:0.9rem; outline:none; appearance:none; -webkit-appearance:none; background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E&quot;); background-repeat:no-repeat; background-position:right 16px center;" onchange="window.ScheduledView.onTimeModeChange(this.value)">
                                        <option value="same">Same time every trigger</option>
                                        <option value="custom">Pick custom anchor dates</option>
                                    </select>
                                </div>

                                <div id="customTimesArea" style="display:none;">
                                    <label style="display:block; font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; margin-bottom:10px;">Anchor Dates Picker</label>
                                    <div id="customDateList" style="display:flex; flex-direction:column; gap:10px;">
                                        <div style="display:flex; gap:8px;">
                                            <input type="datetime-local" class="custom-date-item" style="flex:1; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:10px; color:#fff; font-size:0.85rem; color-scheme:dark;" onchange="window.ScheduledView.updateRecurringPreview()">
                                            <button onclick="window.ScheduledView.addDateRow()" style="width:40px; height:40px; background:rgba(50,215,75,0.1); color:#32d74b; border:1px solid rgba(50,215,75,0.2); border-radius:12px; cursor:pointer; font-weight:800; font-size:1.2rem;">+</button>
                                        </div>
                                    </div>
                                </div>

                                <div id="endDateArea" style="margin-top:20px; border-top:1px dashed rgba(255,255,255,0.1); padding-top:20px;">
                                    <label style="display:block; font-size:0.6rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; margin-bottom:8px;">End Date (Optional Stop Limit)</label>
                                    <input id="quick_endDate" type="date" style="width:100%; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.15); border-radius:14px; padding:14px; color:#fff; font-size:0.9rem; outline:none; cursor:pointer; color-scheme:dark;" onchange="window.ScheduledView.updateRecurringPreview()">
                                </div>


                                <div style="margin-top:20px; padding:16px; background:rgba(0,0,0,0.2); border-radius:16px; border:1px solid rgba(255,255,255,0.05);">
                                    <div style="display:flex; justify-content:space-between; align-items:center;">
                                        <span style="font-size:0.8rem; color:rgba(255,255,255,0.4); font-weight:600;">Recurring Count</span>
                                        <span id="recurringPreview" style="font-size:0.9rem; font-weight:800; color:#fff;">Indefinite</span>
                                    </div>
                                    <p style="font-size:0.68rem; color:rgba(255,255,255,0.25); margin-top:8px; line-height:1.4;">Active until manual cancellation or credit exhaustion.</p>
                                </div>
                            </div>
                        </div>

                        <div style="display:flex; gap:12px;">
                            <button onclick="window.ScheduledView.closeQuickResched()" style="flex:1; height:56px; background:rgba(255,255,255,0.06); border:none; border-radius:20px; color:#fff; font-weight:700; cursor:pointer;">Dismiss</button>
                            <button onclick="window.ScheduledView.doQuickResched()" style="flex:1.5; height:56px; background:#0a84ff; border:none; border-radius:20px; color:#fff; font-weight:800; cursor:pointer; box-shadow:0 12px 32px rgba(10,132,255,0.4);">Set Automation</button>
                        </div>
                    </div>
                </div>

            </div>
        `;

        // Portal logic
        ['schedEditOverlay', 'rescheduleChoiceOverlay', 'quickReschedOverlay'].forEach(id => {
            const el = document.getElementById(id); if(el) document.body.appendChild(el);
        });

        // Pull from GitHub first so other users see latest scheduled data
        setTimeout(async () => {
            const config = JSON.parse(localStorage.getItem('BS_GH_CONFIG') || '{}');
            const token = (window.BrandSyncConfig && window.BrandSyncConfig.DEFAULT_GITHUB_TOKEN) || config.token;
            const gistId = (window.BrandSyncConfig && window.BrandSyncConfig.DEFAULT_GIST_ID) || config.gistId;
            if (token && gistId) {
                await window.BrandSyncAPI.githubPull(token, gistId);
            }
            this.renderList();
        }, 0);
    },

    toggleRecurringUI(on) {
        document.getElementById('recurringOptions').style.display = on ? 'block' : 'none';
        this.updateRecurringPreview();
    },
    onFreqChange(val) {
        document.getElementById('weekdayPicker').style.display = (val === 'weekly') ? 'block' : 'none';
        this.updateRecurringPreview();
    },
    onTimeModeChange(val) {
        document.getElementById('customTimesArea').style.display = (val === 'custom') ? 'block' : 'none';
        document.getElementById('endDateArea').style.display = (val === 'custom') ? 'none' : 'block';
        this.updateRecurringPreview();
    },
    updateRecurringPreview() {
        const preview = document.getElementById('recurringPreview');
        if(!document.getElementById('quick_isRecurring').checked) {
            preview.innerText = 'None'; return;
        }
        
        const mode = document.getElementById('quick_timeMode').value;
        if(mode === 'custom') {
            const count = Array.from(document.querySelectorAll('.custom-date-item')).filter(i => i.value).length;
            preview.innerText = count ? count + ' Custom Schedules' : '0 Schedules (Pick Dates)';
            return;
        }

        const startVal = document.getElementById('quick_reschedTime').value;
        const endVal = document.getElementById('quick_endDate').value;
        
        if(!startVal || !endVal) {
            preview.innerText = 'Indefinite (Credit Auto-Stop)';
            return;
        }

        const start = new Date(startVal);
        const end = new Date(endVal);
        end.setHours(23, 59, 59, 999); // include the entire end day

        if(end <= start) {
            preview.innerText = 'Invalid End Date';
            return;
        }

        const freq = document.getElementById('quick_freq').value;
        const diffMs = end - start;
        let count = 0;
        
        if(freq === 'daily') {
            count = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
        } else if(freq === 'weekly') {
            const daysCount = document.querySelectorAll('.day-btn.active').length || 5;
            count = Math.floor((diffMs / (1000 * 60 * 60 * 24 * 7)) * daysCount) + 1;
        } else if(freq === 'monthly') {
            count = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
        } else if(freq === 'yearly') {
            count = (end.getFullYear() - start.getFullYear()) + 1;
        }

        preview.innerText = Math.max(1, count) + ' Estimated Total';
    },

    addDateRow() {
        const list = document.getElementById('customDateList');
        const div = document.createElement('div');
        div.style.cssText = 'display:flex; gap:8px;';
        div.innerHTML = `
            <input type="datetime-local" class="custom-date-item" style="flex:1; background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:10px; color:#fff; font-size:0.85rem; color-scheme:dark;" onchange="window.ScheduledView.updateRecurringPreview()">
            <button onclick="this.parentElement.remove(); window.ScheduledView.updateRecurringPreview();" style="width:40px; height:40px; background:rgba(255,69,58,0.1); color:#ff453a; border:1px solid rgba(255,69,58,0.2); border-radius:12px; cursor:pointer; font-weight:800;">&times;</button>
        `;
        list.appendChild(div);
    },

    async renderList(forceLoader = false) {
        try {
            const tbody = document.getElementById('scheduled-list'); if(!tbody) return;

            if(forceLoader === true) {
                tbody.innerHTML = `<tr><td colspan="7" style="padding:60px; text-align:center; color:rgba(255,255,255,0.15);"><svg class="spin" style="width:24px;height:24px;margin-bottom:12px;opacity:0.3;" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='12' y1='2' x2='12' y2='6'/><path d='M12 18v4'/><path d='M4.93 4.93l2.83 2.83'/><path d='M16.24 16.24l2.83 2.83'/><path d='M2 12h4'/><path d='M18 12h4'/><path d='M4.93 19.07l2.83-2.83'/><path d='M16.24 7.76l2.83-2.83'/></svg></td></tr>`;
                await new Promise(r => setTimeout(r, 450));
            }

            const messages = window.Scheduler.getAll();
            
            // --- Sync Stats UI ---
            const total = messages.length;
            const pending = messages.filter(m => m.status === 'pending').length;
            const sent = messages.filter(m => m.status === 'sent').length;
            const failed = messages.filter(m => m.status === 'failed').length;

            const sideBadge = document.getElementById('sidebar_scheduled_count');
            if(sideBadge) sideBadge.innerText = pending;

            const searchQ = (document.getElementById('schedSearch')?.value || '').toLowerCase();
            const filterQ = window.ScheduledActiveFilter || 'all';

            const activeContacts = window.BrandSyncAPI && window.BrandSyncAPI.getContacts ? await window.BrandSyncAPI.getContacts() : [];
            const contactMap = activeContacts.reduce((acc, c) => { acc[c.phone] = c.name; return acc; }, {});

            const statsBox = document.getElementById('schedStatsContainer');
            if(statsBox) {
                const s = (f) => f === filterQ 
                    ? 'background:rgba(10,132,255,0.15); border:1px solid rgba(10,132,255,0.4); box-shadow:0 8px 20px rgba(10,132,255,0.15);' 
                    : 'background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06);';
                
                statsBox.innerHTML = `
                    <div onclick="window.ScheduledActiveFilter='all'; window.ScheduledView.renderList();" style="cursor:pointer; ${s('all')} height:48px; padding:0 16px; border-radius:14px; display:flex; align-items:center; gap:8px; transition:0.3s; box-sizing:border-box;">
                        <span style="font-size:0.75rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:800; letter-spacing:0.04em;">All</span>
                        <span style="font-size:1rem; font-weight:800; color:#fff;">${total}</span>
                    </div>
                    <div onclick="window.ScheduledActiveFilter='pending'; window.ScheduledView.renderList();" style="cursor:pointer; ${s('pending')} height:48px; padding:0 16px; border-radius:14px; display:flex; align-items:center; gap:8px; transition:0.3s; box-sizing:border-box;">
                        <span style="font-size:0.75rem; color:rgba(255,214,10,0.6); text-transform:uppercase; font-weight:800; letter-spacing:0.04em;">Pending</span>
                        <span style="font-size:1rem; font-weight:800; color:#ffd60a;">${pending}</span>
                    </div>
                    <div onclick="window.ScheduledActiveFilter='sent'; window.ScheduledView.renderList();" style="cursor:pointer; ${s('sent')} height:48px; padding:0 16px; border-radius:14px; display:flex; align-items:center; gap:8px; transition:0.3s; box-sizing:border-box;">
                        <span style="font-size:0.75rem; color:rgba(50,215,75,0.6); text-transform:uppercase; font-weight:800; letter-spacing:0.04em;">Sent</span>
                        <span style="font-size:1rem; font-weight:800; color:#32d74b;">${sent}</span>
                    </div>
                    <div onclick="window.ScheduledActiveFilter='failed'; window.ScheduledView.renderList();" style="cursor:pointer; ${s('failed')} height:48px; padding:0 16px; border-radius:14px; display:flex; align-items:center; gap:8px; transition:0.3s; box-sizing:border-box;">
                        <span style="font-size:0.75rem; color:rgba(255,69,58,0.6); text-transform:uppercase; font-weight:800; letter-spacing:0.04em;">Failed</span>
                        <span style="font-size:1rem; font-weight:800; color:#ff453a;">${failed}</span>
                    </div>
                `;
            }

            messages.sort((a, b) => {
                if(a.status === 'pending' && b.status !== 'pending') return -1;
                if(a.status !== 'pending' && b.status === 'pending') return 1;
                return new Date(b.scheduledAt || 0) - new Date(a.scheduledAt || 0);
            });

            const filteredMessages = messages.filter(m => {
                const passStatus = filterQ === 'all' || m.status === filterQ;
                let passText = (m.message||'').toLowerCase().includes(searchQ);
                if (!passText) {
                    const expandedSearchPool = (m.recipients||[]).map(num => `${num} ${contactMap[num] ? contactMap[num].toLowerCase() : ''}`).join(' ');
                    passText = expandedSearchPool.includes(searchQ);
                }
                return passStatus && passText;
            });

            if(filteredMessages.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="padding:80px; text-align:center; color:rgba(255,255,255,0.2); font-size:0.9rem;">No records found for "${filterQ}".</td></tr>`;
                const sa = document.getElementById('schedSelectAll'); if(sa) sa.checked = false;
                this.checkRows();
                return;
            }

            const fmt = (d) => d ? new Date(d).toLocaleString('en-US',{weekday:'short',month:'short',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true}) : '—';

            const editSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
            const reschedSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"></path><path d="M3.06 15a9 9 0 1 0 .44-7"></path></svg>`;
            const trashSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path></svg>`;

            tbody.innerHTML = filteredMessages.map(m => {
                const isPending = m.status === 'pending';
                const isSent = m.status === 'sent';
                let statusColor = isSent ? '#32d74b' : isPending ? '#ffd60a' : '#ff453a';
                let statusBg = isSent ? 'rgba(50,215,75,0.1)' : isPending ? 'rgba(255,214,10,0.1)' : 'rgba(255,69,58,0.1)';
                const recCount = m.recipients ? m.recipients.length : 0;
                const creditCost = (m.segments || 1) * recCount;
                const safeMsg = (m.message || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

                const getCountdown = (d) => {
                    const diff = new Date(d) - new Date();
                    if(diff <= 0) return (isSent || !isPending) ? 'Already processed.' : 'Processing...';
                    let s = Math.floor(diff/1000), m = Math.floor(s/60), h = Math.floor(m/60), d1 = Math.floor(h/24);
                    let mo = Math.floor(d1/30), y = Math.floor(d1/365);
                    if(y>0) return `Triggers in ${y} year(s), ${mo%12} month(s)`;
                    if(mo>0) return `Triggers in ${mo} month(s), ${d1%30} day(s)`;
                    if(d1>0) return `Triggers in ${d1} day(s), ${h%24} hr(s)`;
                    if(h>0) return `Triggers in ${h} hr(s), ${m%60} min(s)`;
                    if(m>0) return `Triggers in ${m} min(s), ${s%60} sec(s)`;
                    return `Triggers in ${s} seconds`;
                };

                // Map the recipients to their names if present
                let recDisplay = '';
                if(m.recipients && m.recipients.length) {
                    const topList = m.recipients.slice(0, 15);
                    recDisplay = topList.map(num => `<div style="padding:4px 0; border-bottom:1px solid rgba(255,255,255,0.05);">${contactMap[num] ? `<strong style="color:#fff;">${contactMap[num]}</strong> <span style="opacity:0.5;">(${num})</span>` : num}</div>`).join('');
                    if(m.recipients.length > 15) recDisplay += `<div style="padding:4px 0; opacity:0.5; font-style:italic; font-size:0.75rem;">+ ${m.recipients.length - 15} more records...</div>`;
                } else {
                    recDisplay = `<div style="opacity:0.5;">No recipients attached.</div>`;
                }

                return `
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.05); transition:0.2s;">
                        <td style="padding:20px; text-align:center;"><input type="checkbox" class="sched-row-cb" value="${m.id}" onchange="window.ScheduledView.checkRows()" style="width:16px;height:16px;cursor:pointer;accent-color:#0a84ff;"></td>
                        <td style="padding:20px;">
                            <div style="font-size:0.65rem; color:rgba(255,255,255,0.3); text-transform:uppercase; font-weight:700; margin-bottom:2px; letter-spacing:0.04em;">Created ${fmt(m.scheduledAt)}</div>
                            <div class="snapshot-cell" style="position:relative; display:inline-block; cursor:help;">
                                <style>.snapshot-cell:hover .hover-full-msg { display: block !important; }</style>
                                <div style="font-size:0.95rem; font-weight:700; color:#fff;">${fmt(m.scheduleTime)}</div>
                                <div class="hover-full-msg" style="display:none; position:absolute; top:calc(100% + 5px); left:0; width:max-content; background:rgba(30,30,35,0.98); padding:8px 14px; border-radius:10px; border:1px solid rgba(255,255,255,0.1); backdrop-filter:blur(32px); box-shadow:0 8px 30px rgba(0,0,0,0.8); z-index:9999; color:var(--accent-color); font-weight:800; font-size:0.75rem; pointer-events:none;">${getCountdown(m.scheduleTime)}</div>
                            </div>
                            <div style="font-size:0.72rem; color:rgba(255,255,255,0.3); display:flex; align-items:center; gap:6px; margin-top:5px;">
                                ${m.recurring && m.recurring.type !== 'none' ? 
                                `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a84ff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 23l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg><span style="color:#0a84ff; font-weight:700; text-transform:uppercase;">Recurring ${m.recurring.type}</span>` 
                                : '<span style="opacity:0.5;">Manual Dispatch</span>'}
                            </div>
                        </td>
                        <td style="padding:20px; font-size:0.95rem; font-weight:600; color:rgba(255,255,255,0.8);">
                            <div class="snapshot-cell" style="position:relative; display:inline-block; cursor:help;">
                                <style>.snapshot-cell:hover .hover-full-msg { display: block !important; }</style>
                                ${recCount}
                                <div class="hover-full-msg" style="display:none; position:absolute; top:calc(100% + 5px); left:50%; transform:translateX(-50%); width:max-content; min-width:220px; max-height:300px; overflow-y:auto; background:rgba(30,30,35,0.98); padding:12px 16px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); backdrop-filter:blur(32px); box-shadow:0 8px 30px rgba(0,0,0,0.8); z-index:9999; color:rgba(255,255,255,0.8); font-size:0.8rem; pointer-events:none; line-height:1.4; text-align:left;">
                                    <div style="font-size:0.65rem; color:rgba(255,255,255,0.4); text-transform:uppercase; font-weight:800; margin-bottom:6px; letter-spacing:0.04em; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:6px;">Target Contacts</div>
                                    ${recDisplay}
                                </div>
                            </div>
                        </td>
                        <td class="snapshot-cell" style="padding:20px; font-size:0.85rem; color:rgba(255,255,255,0.4); max-width:220px; position:relative; cursor:help;">
                            <style>.snapshot-cell:hover .hover-full-msg { display: block !important; }</style>
                            <div style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;">${safeMsg}</div>
                            <div class="hover-full-msg" style="display:none; position:absolute; top:calc(100% - 10px); left:20px; width:340px; background:rgba(30,30,35,0.98); padding:16px; border-radius:16px; border:1px solid rgba(255,255,255,0.1); backdrop-filter:blur(32px); box-shadow:0 16px 40px rgba(0,0,0,0.8); z-index:9999; color:#fff; font-size:0.85rem; white-space:pre-wrap; word-break:break-word; pointer-events:none; line-height:1.5; text-align:left;">${safeMsg}</div>
                        </td>
                        <td style="padding:20px; font-size:0.95rem; font-weight:700; color:var(--credit-color);">${creditCost}</td>
                        <td style="padding:20px;">
                            ${m.status === 'failed' ?
                            `<div class="snapshot-cell" style="position:relative; display:inline-block; cursor:help;">
                                <div style="background:${statusBg}; color:${statusColor}; padding:6px 14px; border-radius:12px; font-size:0.75rem; font-weight:800; display:inline-flex; align-items:center; gap:4px; text-transform:uppercase; letter-spacing:0.04em;">${m.status} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div>
                                <div class="hover-full-msg" style="display:none; position:absolute; top:calc(100% + 5px); right:0; width:260px; background:rgba(255,69,58,0.95); padding:12px 14px; border-radius:12px; border:1px solid rgba(255,100,100,0.3); backdrop-filter:blur(24px); box-shadow:0 8px 30px rgba(255,69,58,0.4); z-index:9999; color:#fff; font-size:0.75rem; white-space:pre-wrap; word-break:break-word; pointer-events:none; line-height:1.4; text-transform:none; font-weight:500;"><strong>Execution Error:</strong><br>${window.BrandSyncAPI && window.BrandSyncAPI.toFriendlyError ? window.BrandSyncAPI.toFriendlyError({message: m.errorReason}) : (m.errorReason || 'System encountered a processing issue.')}</div>
                            </div>` :
                            `<div>
                                <div style="background:${statusBg}; color:${statusColor}; padding:6px 14px; border-radius:12px; font-size:0.75rem; font-weight:800; display:inline-block; text-transform:uppercase; letter-spacing:0.04em;">${m.status}</div>
                                ${m.cloud_dispatched ? `<div style="margin-top:4px; font-size:0.6rem; color:#0a84ff; font-weight:800; display:flex; align-items:center; gap:3px; text-transform:uppercase; letter-spacing:0.04em;"><i class="icon-lucide-cloud" style="font-size:0.8rem;"></i> Cloud Dispatch</div>` : ''}
                            </div>`
                            }
                        </td>
                        <td style="padding:20px; text-align:right;">
                            <div style="display:inline-flex; gap:10px;">
                                ${isPending 
                                    ? `<button class="btn icon-btn" style="width:38px;height:38px;background:rgba(255,255,255,0.06);color:#fff;" onclick="window.ScheduledView.editMessage('${m.id}')">${editSvg}</button>`
                                    : `<button class="btn icon-btn" style="width:38px;height:38px;background:rgba(50,215,75,0.1);color:#32d74b;border:1px solid rgba(50,215,75,0.2);" onclick="window.ScheduledView.showRescheduleChoice('${m.id}')">${reschedSvg}</button>`
                                }
                                <button class="btn icon-btn" style="width:38px;height:38px;background:rgba(255,69,58,0.1);color:#ff453a;border:1px solid rgba(255,69,58,0.2);" onclick="window.ScheduledView.cancelMessage('${m.id}')">${trashSvg}</button>
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
        } catch(e) { 
            console.error(e); 
            const tbody = document.getElementById('scheduled-list');
            if(tbody) tbody.innerHTML = `<tr><td colspan="7" style="padding:40px; text-align:center; color:#ff453a;">Failed to load queue. Check console for errors.</td></tr>`;
        }
        
        const sa = document.getElementById('schedSelectAll'); if(sa) sa.checked = false;
        this.checkRows();
    },

    toggleAllRow(checked) {
        document.querySelectorAll('.sched-row-cb').forEach(cb => cb.checked = checked);
        this.checkRows();
    },

    checkRows() {
        const checked = document.querySelectorAll('.sched-row-cb:checked');
        const btn = document.getElementById('schedDynamicActionBtn');
        const icon = document.getElementById('schedDynamicActionIcon');
        const txt = document.getElementById('schedDynamicActionText');
        
        if(!btn || !icon || !txt) return;

        if(checked.length > 0) {
            btn.onclick = () => window.ScheduledView.bulkDelete();
            btn.style.background = 'rgba(255,69,58,0.15)';
            btn.style.borderColor = 'rgba(255,69,58,0.4)';
            btn.style.color = '#ff453a';
            btn.style.boxShadow = '0 0 20px rgba(255,69,58,0.3)';
            icon.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path></svg>`;
            txt.style.display = 'inline';
            txt.innerText = `Delete ${checked.length}`;
        } else {
            btn.onclick = () => window.ScheduledView.renderList(true);
            btn.style.background = 'rgba(255,255,255,0.05)';
            btn.style.borderColor = 'rgba(255,255,255,0.1)';
            btn.style.color = 'inherit';
            btn.style.boxShadow = 'none';
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`;
            txt.style.display = 'none';
        }
    },

    bulkDelete() {
        const checked = document.querySelectorAll('.sched-row-cb:checked');
        if(!checked.length) return;
        
        const count = checked.length;
        if(!window.BrandSyncAppInstance) return;

        window.BrandSyncAppInstance.confirmAction(
            "Terminate Automations", 
            `You have selected ${count} scheduled messages. Are you sure you want to stop these broadcasts?`,
            "#ff453a",
            () => {
                // Secondary Final Confirmation (Nested)
                setTimeout(() => {
                    window.BrandSyncAppInstance.confirmAction(
                        "Final Security Warning",
                        "This operation is permanent. This will immediately stop all associated recurring logic and clear these records from history. Confirm final termination?",
                        "#ff3b30",
                        () => {
                            checked.forEach(cb => window.Scheduler.cancelDispatch(cb.value));
                            window.showToast(`Successfully terminated ${count} queued messages.`, 'success');
                            this.renderList();
                        }
                    );
                }, 100);
            }
        );
    },

    showRescheduleChoice(id) { 
        this._activeReschedId = id; document.getElementById('rescheduleChoiceOverlay').style.display = 'flex';
        document.querySelector('.app-container').style.filter = 'blur(12px) contrast(1.1)';
    },
    closeReschedChoice() { 
        document.getElementById('rescheduleChoiceOverlay').style.display = 'none'; 
        document.querySelector('.app-container').style.filter = '';
    },
    openQuickResched() {
        this.closeReschedChoice(); document.getElementById('quickReschedOverlay').style.display = 'flex';
        const now = new Date(); now.setMinutes(now.getMinutes()+5);
        document.getElementById('quick_reschedTime').value = now.toISOString().slice(0,16);
    },
    closeQuickResched() { 
        document.getElementById('quickReschedOverlay').style.display = 'none'; 
        document.querySelector('.app-container').style.filter = '';
    },

    doQuickResched() {
        const id=this._activeReschedId;
        const time=document.getElementById('quick_reschedTime').value;
        const endDateStr=document.getElementById('quick_endDate').value;
        const endDate = endDateStr ? new Date(endDateStr) : null;
        if(endDate) endDate.setHours(23, 59, 59, 999);

        const isRec=document.getElementById('quick_isRecurring').checked, freq=document.getElementById('quick_freq').value, mode=document.getElementById('quick_timeMode').value;
        const old=window.Scheduler.getAll().find(x=>x.id===id); if(!old) return;

        if(isRec && mode==='custom') {
            document.querySelectorAll('.custom-date-item').forEach(inp => {
                if(inp.value && new Date(inp.value) > new Date()) window.Scheduler.save({ ...old, scheduleTime: inp.value, recurring: { type: 'none' } });
            });
            window.showToast('Batch dispatches added.', 'success');
        } else if(isRec && freq==='weekly') {
            const days = Array.from(document.querySelectorAll('.day-btn.active')).map(b=>parseInt(b.dataset.day));
            window.Scheduler.save({ ...old, scheduleTime: time, recurring: { type: 'weekly', days: days.length?days:[1,2,3,4,5], endDate: endDate ? endDate.toISOString() : null } });
            window.showToast('Weekly recurring active.', 'success');
        } else {
            window.Scheduler.save({ ...old, scheduleTime: time, recurring: isRec ? { type: freq, endDate: endDate ? endDate.toISOString() : null } : { type: 'none' } });
            window.showToast('Logic configured.', 'success');
        }
        this.closeQuickResched(); this.renderList();
    },

    openFullEditResched() { this.closeReschedChoice(); this.editMessage(this._activeReschedId, 'reschedule'); },

    editMessage(id, mode='edit') {
        const m = window.Scheduler.getAll().find(x=>x.id===id); if(!m) return;
        document.getElementById('editMsgId').value=id; document.getElementById('editMode').value=mode;
        document.getElementById('edit_recipients').value=m.recipients?.join(', ');
        document.getElementById('edit_message').value=m.message||'';
        document.getElementById('edit_scheduleTime').value = mode==='reschedule' ? new Date(Date.now()+300000).toISOString().slice(0,16) : m.scheduleTime?.slice(0,16);
        document.getElementById('editModalTitle').innerText = mode==='reschedule' ? 'Reschedule Dispatch' : 'Edit Entry';
        document.getElementById('saveEditBtn').innerText = mode==='reschedule' ? 'Confirm Reschedule' : 'Update Message';
        document.getElementById('schedEditOverlay').style.display='flex';
        document.querySelector('.app-container').style.filter='blur(12px)';
        setTimeout(()=>this._bindEditEvents(),50);
    },

    _bindEditEvents() {
        const msgEl=document.getElementById('edit_message'), recEl=document.getElementById('edit_recipients'), backdrop=document.getElementById('edit_backdrop');
        const update=()=>{
            const calc = window.calculateSMSLength(msgEl.value);
            const limit = calc.segments > 1 
                ? (calc.encoding === 'GSM-7' ? 153 : 67) 
                : (calc.encoding === 'GSM-7' ? 160 : 70);

            document.getElementById('edit_charCount').innerText = `${calc.length}/${limit}`; 
            document.getElementById('edit_segCount').innerText = calc.segments; 
            document.getElementById('edit_encoding').innerText = calc.encoding;
            const recs=recEl.value ? recEl.value.split(',').filter(r=>r.trim().length>=10) : [];
            document.getElementById('edit_recipientBadge').innerText=recs.length+' Contacts';
            document.getElementById('edit_cost').innerText=recs.length*calc.segments;

            // Syntax highlighting of bad chars
            if(backdrop) {
                let html = '';
                for(let i=0; i<msgEl.value.length; i++) {
                    const char = msgEl.value[i];
                    if(char === '\n') { html += '\n'; continue; }
                    if(this.isCharGSM(char)) { html += char; }
                    else { html += `<mark style="background:rgba(255,69,58,0.4); border-radius:4px; border-bottom:2px solid #ff453a; color:transparent; box-shadow:0 0 6px rgba(255,69,58,0.6); display:inline;">${char}</mark>`; }
                }
                if(msgEl.value.endsWith('\n')) html += ' ';
                backdrop.innerHTML = html;
            }

            // Warning triggering logic
            const gsmBar = document.getElementById('edit_gsmWarningBar');
            if(calc.encoding === 'UCS-2') {
                document.getElementById('edit_encoding').style.color = '#ff9f0a';
                if(gsmBar) gsmBar.style.display = 'flex';
            } else {
                document.getElementById('edit_encoding').style.color = '#fff';
                if(gsmBar) gsmBar.style.display = 'none';
            }
        };
        msgEl.oninput=update; recEl.oninput=update; update();
        msgEl.onscroll = () => { if(backdrop) { backdrop.scrollTop = msgEl.scrollTop; backdrop.scrollLeft = msgEl.scrollLeft; } };

        // Number Extractor
        const addNumbers = (nums) => {
            let valid = [];
            nums.forEach(n => {
                let num = String(n).replace(/[^\d]/g, '');
                if (num.startsWith('09') && num.length === 11) num = '63' + num.substring(1);
                else if (num.startsWith('9') && num.length === 10) num = '63' + num;
                else if (num.startsWith('6309') && num.length === 13) num = '63' + num.substring(3);
                if (/^639\d{9}$/.test(num)) valid.push(num);
            });
            let existing = recEl.value ? recEl.value.split(',').map(s=>s.trim()).filter(Boolean) : [];
            recEl.value = [...new Set([...existing, ...valid])].join(', ');
            update();
        };

        // File Parsing (same engine as send-sms)
        const fInput = document.getElementById('edit_fileInput');
        if(fInput) {
            fInput.onchange = (e) => {
                const f = e.target.files[0]; if(!f) return;
                const r = new FileReader();
                r.onload = (ev) => {
                    try {
                        let nums = [];
                        const reg = /(?:\+?63|0)?[\s\-\–\(\)]*9[\s\-\–\(\)]*(?:\d[\s\-\–\(\)]*){9}/g;
                        if(f.name.endsWith('.csv')) {
                            const match = ev.target.result.match(reg);
                            if(match) nums.push(...match);
                        } else if(window.XLSX) {
                            const wb = window.XLSX.read(new Uint8Array(ev.target.result), {type: 'array'});
                            wb.SheetNames.forEach(sName => {
                                window.XLSX.utils.sheet_to_json(wb.Sheets[sName], {header: 1}).forEach(row => {
                                    row.forEach(cell => {
                                        if(cell!=null) {
                                            const match = String(cell).match(reg);
                                            if(match) nums.push(...match);
                                            else if(/\d{10}/.test(String(cell).replace(/[^\d]/g,''))) nums.push(String(cell));
                                        }
                                    })
                                })
                            });
                        }
                        addNumbers(nums);
                        window.showToast("Attachment parsed securely.", 'success');
                    } catch(err) { window.showToast("Parse failed.", 'error'); }
                };
                if(f.name.endsWith('.csv')) r.readAsText(f); else r.readAsArrayBuffer(f);
                e.target.value = '';
            };
        }

        // Dropdowns setup
        const cBtn=document.getElementById('edit_btnContactsDrop'), cMenu=document.getElementById('edit_contactsMenu');
        const tBtn=document.getElementById('edit_btnTemplatesDrop'), tMenu=document.getElementById('edit_templatesMenu');
        
        // Contacts
        if(cBtn) {
            cBtn.onclick=()=>cMenu.style.display=cMenu.style.display==='none'?'block':'none';
            Promise.all([
                window.BrandSyncAPI.getGroups?.() || Promise.resolve([]),
                window.BrandSyncAPI.getContacts()
            ]).then(([groups, cs]) => {
                cMenu.innerHTML = '';
                
                if (cs.length > 0) {
                    const allBtn = document.createElement('div');
                    allBtn.style.cssText = 'padding:10px 10px; cursor:pointer; font-size:0.85rem; border-radius:6px; transition:0.2s; color:#32d74b; font-weight:700; display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; background:rgba(50,215,75,0.08); border:1px solid rgba(50,215,75,0.2);';
                    allBtn.onmouseover = () => allBtn.style.background = 'rgba(50,215,75,0.15)';
                    allBtn.onmouseout = () => allBtn.style.background = 'rgba(50,215,75,0.08)';
                    allBtn.innerHTML = `<span><i class="icon-lucide-users" style="font-size:0.8rem; margin-right:4px;"></i> All Contacts</span> <span style="font-size:0.7rem; background:rgba(50,215,75,0.2); padding:2px 6px; border-radius:10px; color:#32d74b;">${cs.length}</span>`;
                    
                    allBtn.onclick = () => {
                        addNumbers(cs.map(c => c.phone));
                        window.showToast(`Added all ${cs.length} contacts`, 'success');
                        cMenu.style.display = 'none';
                    };
                    cMenu.appendChild(allBtn);
                }
                
                if (groups && groups.length > 0) {
                    const gh = document.createElement('div');
                    gh.style.cssText = 'font-size:0.7rem; color:rgba(255,255,255,0.4); padding:4px; font-weight:700; margin-bottom:4px; text-transform:uppercase; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:6px;';
                    gh.innerText = 'Contact Groups';
                    cMenu.appendChild(gh);
                    
                    groups.forEach(g => {
                        const b = document.createElement('div');
                        b.style.cssText = 'padding:10px 10px; cursor:pointer; font-size:0.85rem; border-radius:6px; transition:0.2s; color:var(--accent-color); font-weight:600; display:flex; justify-content:space-between; align-items:center; margin-bottom:2px;';
                        b.onmouseover=()=>b.style.background='rgba(255,255,255,0.1)'; b.onmouseout=()=>b.style.background='';
                        const gContacts = cs.filter(c => c.groupIds && c.groupIds.includes(g.id));
                        b.innerHTML = `<span><i class="icon-lucide-users" style="font-size:0.8rem; margin-right:4px;"></i> ${g.name}</span> <span style="font-size:0.7rem; background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:10px; color:#fff;">${gContacts.length}</span>`;
                        b.onclick=() => {
                            if (gContacts.length > 0) {
                                addNumbers(gContacts.map(c => c.phone));
                                window.showToast("Group contacts loaded successfully.", 'success');
                            } else {
                                window.showToast("Group is empty.", "warning");
                            }
                            cMenu.style.display='none';
                        };
                        cMenu.appendChild(b);
                    });
                }

                if (cs.length > 0) {
                    const ih = document.createElement('div');
                    ih.style.cssText = 'font-size:0.7rem; color:rgba(255,255,255,0.4); padding:4px; font-weight:700; margin-top:8px; margin-bottom:4px; text-transform:uppercase; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:6px;';
                    ih.innerText = 'Individual Contacts';
                    cMenu.appendChild(ih);

                    cs.forEach(c => {
                        const b = document.createElement('div');
                        b.style.cssText = 'padding:6px 10px; cursor:pointer; font-size:0.85rem; border-radius:6px; transition:0.2s; color:#e4e4e7; display:flex; flex-direction:column; line-height:1.3; margin-bottom:2px;';
                        b.onmouseover=()=>b.style.background='rgba(255,255,255,0.1)'; b.onmouseout=()=>b.style.background='';
                        b.innerHTML = `<span style="font-weight:600;">${c.name}</span><span style="font-size:0.75rem; color:var(--success-color); font-family:monospace;">+${c.phone}</span>`;
                        b.onclick=() => { addNumbers([c.phone]); cMenu.style.display='none'; };
                        cMenu.appendChild(b);
                    });
                } else {
                    cMenu.innerHTML += '<div style="padding:10px; color:#888; font-size:0.8rem; text-align:center;">No contacts found</div>';
                }
            });
        }
        
        // Templates
        if(tBtn) {
            tBtn.onclick=()=>tMenu.style.display=tMenu.style.display==='none'?'block':'none';
            window.BrandSyncAPI.getTemplates?.().then(ts => {
                tMenu.innerHTML = '<div style="font-size:0.75rem; color:rgba(255,255,255,0.4); padding:4px; font-weight:bold;">Templates</div>';
                ts.forEach(t => {
                    const b = document.createElement('div');
                    b.style.cssText = 'padding:8px 10px; cursor:pointer; font-size:0.85rem; border-radius:6px; transition:0.2s; margin-bottom:2px; border-bottom:1px solid rgba(255,255,255,0.05);';
                    b.onmouseover=()=>b.style.background='rgba(255,255,255,0.1)'; b.onmouseout=()=>b.style.background='';
                    b.innerHTML=`<strong style="color:#fff;">${t.name}</strong><br><span style="font-size:0.75rem; color:#aaa;">${t.content.substring(0,35)}...</span>`;
                    b.onclick=()=>{ msgEl.value=t.content; update(); tMenu.style.display='none'; };
                    tMenu.appendChild(b);
                });
            });
        }
        
        // Auto-close dropdowns
        document.addEventListener('click', e => {
            if(cBtn && !cBtn.contains(e.target) && !cMenu.contains(e.target)) cMenu.style.display='none';
            if(tBtn && !tBtn.contains(e.target) && !tMenu.contains(e.target)) tMenu.style.display='none';
        }, { capture: true, once: false }); // note: we might overwrite this but it's safe enough for a modal

    },

    applySpintax() {
        const txt = document.getElementById('edit_message'); if(!txt) return;
        let msg = txt.value || "Hello! Check out our new marketing promo today!";
        msg = msg.replace(/hello|hi|hey/gi, '{Hello|Hi|Hey|Greetings}');
        msg = msg.replace(/promo|promotion|offer|discount/gi, '{promo|promotion|special offer|discount|deal}');
        msg = msg.replace(/today|now/gi, '{today|now|immediately|right away}');
        msg = msg.replace(/check out|buy|get|claim/gi, '{check out|review|see|take a look at|claim}');
        msg = msg.replace(/thanks|thank you/gi, '{Thanks|Thank you|Much appreciated}');
        msg = msg.replace(/please/gi, '{Please|Kindly}');
        if(!msg.includes('{')) msg = '{Hi|Hello|Hey|Greetings}! ' + msg;
        txt.value = msg;
        txt.dispatchEvent(new Event('input'));
        window.showToast("Optimized with Spintax formatting!", "success");
    },

    isCharGSM(c) { return /^[@£$¥èéùìòÇ\n\rΔ_ΦΓΛΩΠΨΣΘΞ !"#¤%&'()*+,\-./0-9:;<=>?¡A-ZÄÖÑÜ§¿a-zäöñüà€\{\}\[\]\|]*$/.test(c); },

    fixGsm() {
        const txt = document.getElementById('edit_message'); if(!txt) return;
        let msg = txt.value;
        const map = { '“':'"', '”':'"', "‘":"'", "’":"'", '`':"'", '´':"'", '–':'-', '—':'-', '…':'...', '«':'"', '»':'"', 'á':'a', 'é':'e', 'í':'i', 'ó':'o', 'ú':'u', 'Á':'A', 'É':'E', 'Í':'I', 'Ó':'O', 'Ú':'U', 'ñ':'n', 'Ñ':'N', 'ü':'u', 'Ü':'U', 'ç':'c', 'Ç':'C', 'â':'a', 'ê':'e', 'î':'i', 'ô':'o', 'û':'u', 'ä':'a', 'ë':'e', 'ï':'i', 'ö':'o', 'Ä':'A', 'Ë':'E', 'Ï':'I', 'Ö':'O', 'ß':'ss', 'à':'a', 'è':'e', 'ì':'i', 'ò':'o', 'ù':'u', '·':'-', '•':'-', '◦':'-', '™':'TM', '©':'(c)', '®':'(r)' };
        let out = ''; let errs = 0;
        for(let i=0; i<msg.length; i++) {
            let c = msg[i];
            if(map[c]) out += map[c];
            else if(this.isCharGSM(c)) out += c;
            else { out += c; errs++; }
        }
        txt.value = out;
        txt.dispatchEvent(new Event('input'));
        if(errs > 0) window.showToast(`Fixed known text. Manually correct the remaining ${errs} red character(s).`, "warning");
        else window.showToast("Message effortlessly converted to pure GSM-7!", "success");
    },


    closeEdit() { document.getElementById('schedEditOverlay').style.display='none'; document.querySelector('.app-container').style.filter=''; },
    saveEdit() {
        const mode=document.getElementById('editMode').value, id=document.getElementById('editMsgId').value, text=document.getElementById('edit_message').value, time=document.getElementById('edit_scheduleTime').value, recs=document.getElementById('edit_recipients').value.split(',').map(r=>r.trim()).filter(Boolean);
        if(mode==='reschedule') window.Scheduler.save({ recipients:recs, message:text, scheduleTime:time });
        else window.Scheduler.update(id, { recipients:recs, message:text, scheduleTime:time });
        window.showToast('Queue updated.', 'success'); this.closeEdit(); this.renderList();
    },
    cancelMessage(id) {
        if(!window.BrandSyncAppInstance) return;
        
        window.BrandSyncAppInstance.confirmAction(
            "Cancel Planned Broadcast", 
            "Are you sure you want to stop this scheduled SMS? This will halt any pending execution immediately.",
            "#ff453a",
            () => {
                // Secondary Final Confirmation
                setTimeout(() => {
                    window.BrandSyncAppInstance.confirmAction(
                        "Confirm Permanent Deletion",
                        "This action cannot be undone. All delivery logic and queue data for this entry will be purged. Proceed?",
                        "#ff3b30",
                        () => {
                            window.Scheduler.cancel(id);
                            window.showToast('Message cancelled and removed from queue.', 'success');
                            this.renderList();
                        }
                    );
                }, 100);
            }
        );
    }
};

document.addEventListener('DOMContentLoaded', () => setTimeout(() => { if(window.app) window.app.views['scheduled'] = () => window.ScheduledView.render(window.app.contentArea); }, 100));
