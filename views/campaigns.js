// Campaigns View Component
window.CampaignsView = {
    render(container) {
        container.innerHTML = `
            <div class="view-container active fade-in">
                
                <div style="display:flex; justify-content: space-between; align-items:center;">
                    <div style="display:flex; gap: 12px;">
                        <input type="text" class="glass-input" placeholder="Search campaigns..." style="width: 250px;">
                        <select class="glass-input-select" style="padding: 8px 12px;">
                            <option value="">All Statuses</option>
                            <option value="Running">Running</option>
                            <option value="Completed">Completed</option>
                            <option value="Scheduled">Scheduled</option>
                        </select>
                    </div>
                    <button class="btn primary-btn"><i class="icon-lucide-rocket"></i> Launch Campaign</button>
                </div>

                <div class="card" style="padding: 0; overflow: hidden;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--border-glass);">
                                <th style="padding: 16px 20px; font-weight: 600; font-size: 0.85rem; color: var(--text-muted);">Campaign Name</th>
                                <th style="padding: 16px 20px; font-weight: 600; font-size: 0.85rem; color: var(--text-muted);">Target Group</th>
                                <th style="padding: 16px 20px; font-weight: 600; font-size: 0.85rem; color: var(--text-muted);">Status</th>
                                <th style="padding: 16px 20px; font-weight: 600; font-size: 0.85rem; color: var(--text-muted);">Delivery Rate</th>
                                <th style="padding: 16px 20px; font-weight: 600; font-size: 0.85rem; color: var(--text-muted);">Date</th>
                                <th style="padding: 16px 20px; text-align: right;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid var(--border-glass);">
                                <td style="padding: 16px 20px;">
                                    <div style="font-weight: 500;">Black Friday VIP Presale</div>
                                    <div style="font-size: 0.75rem; color: var(--text-muted);">Template: Flash Sale 50% Off</div>
                                </td>
                                <td style="padding: 16px 20px; color: var(--text-secondary);">VIP Customers (12,450)</td>
                                <td style="padding: 16px 20px;">
                                    <span style="background: rgba(50, 215, 75, 0.1); color: var(--success-color); padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">Completed</span>
                                </td>
                                <td style="padding: 16px 20px;">
                                    <div style="display:flex; align-items:center; gap: 8px;">
                                        <div style="flex:1; background: var(--surface-glass); height: 6px; border-radius: 4px; overflow: hidden;">
                                            <div style="width: 98%; background: var(--success-color); height: 100%;"></div>
                                        </div>
                                        <span style="font-size: 0.85rem; font-weight: 600;">98%</span>
                                    </div>
                                </td>
                                <td style="padding: 16px 20px; color: var(--text-secondary); font-size: 0.9rem;">Nov 23, 2024</td>
                                <td style="padding: 16px 20px; text-align: right;">
                                    <button class="btn" style="background: var(--surface-glass); border: 1px solid var(--border-glass); padding: 4px 12px; font-size: 0.8rem; color: white;">Report</button>
                                </td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border-glass);">
                                <td style="padding: 16px 20px;">
                                    <div style="font-weight: 500;">Weekend Restock Alert</div>
                                    <div style="font-size: 0.75rem; color: var(--text-muted);">Template: Custom</div>
                                </td>
                                <td style="padding: 16px 20px; color: var(--text-secondary);">All Subscribers (45,100)</td>
                                <td style="padding: 16px 20px;">
                                    <span style="background: rgba(10, 132, 255, 0.1); color: var(--accent-color); padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 600;">Running</span>
                                </td>
                                <td style="padding: 16px 20px;">
                                    <div style="display:flex; align-items:center; gap: 8px;">
                                        <div style="flex:1; background: var(--surface-glass); height: 6px; border-radius: 4px; overflow: hidden;">
                                            <div style="width: 45%; background: var(--accent-color); height: 100%;"></div>
                                        </div>
                                        <span style="font-size: 0.85rem; font-weight: 600;">45%</span>
                                    </div>
                                </td>
                                <td style="padding: 16px 20px; color: var(--text-secondary); font-size: 0.9rem;">Today, 09:00 AM</td>
                                <td style="padding: 16px 20px; text-align: right;">
                                    <button class="btn icon-btn" style="color: var(--danger-color);"><i class="icon-lucide-pause"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if(window.app) window.app.views['campaigns'] = () => window.CampaignsView.render(window.app.contentArea);
    }, 100);
});
