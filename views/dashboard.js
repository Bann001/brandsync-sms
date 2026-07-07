// Dashboard View Component
window.DashboardView = {
    async render(container) {
        container.innerHTML = `
            <div class="view-container active fade-in">
                <!-- Top Stats Grid -->
                <div class="grid-4" id="dash-stats">
                    <div class="card" style="align-items: center; justify-content: center; min-height: 120px;">
                        <span style="color:var(--text-muted)">Loading stats...</span>
                    </div>
                </div>

                <!-- Main Grid -->
                <div class="grid-2">
                    <!-- Chart -->
                    <div class="card" style="grid-column: span 1; display:flex; flex-direction:column; justify-content: space-between;">
                        <div>
                            <h3 style="font-size: 1rem; margin-bottom: 16px;">Delivery vs Failed Rate</h3>
                            <div style="position: relative; height: 220px; width: 100%;">
                                <canvas id="deliveryChart"></canvas>
                            </div>
                        </div>
                        
                        <!-- AI Insight Summary -->
                        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05);">
                            <div style="display:flex; align-items:center; gap: 8px; margin-bottom: 8px;">
                                <i class="icon-lucide-sparkles" style="color: var(--accent-color); font-size: 0.9rem;"></i>
                                <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); text-transform: uppercase;">Performance Summary</span>
                            </div>
                            <p id="ai-summary-text" style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">
                                Generating insights...
                            </p>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="card" style="grid-column: span 1; overflow: hidden; display:flex; flex-direction:column;">
                        <h3 style="font-size: 1rem; margin-bottom: 16px;">Recent Message Activity</h3>
                        <div class="activity-timeline" id="recent-activity-container" style="display:flex; flex-direction: column; gap: 16px; flex: 1; overflow-y: auto;">
                            <!-- Activity Items Injected Dynamically -->
                            <div style="color: var(--text-muted); font-size: 0.85rem;">Loading recent history...</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Fetch Stats
        const stats = await window.BrandSyncAPI.getDashboardStats();
        
        const totalResolved = stats.delivered + stats.failed;
        const deliveryRate = totalResolved > 0 ? ((stats.delivered / totalResolved) * 100).toFixed(1) : 0;
        const failRate = totalResolved > 0 ? ((stats.failed / totalResolved) * 100).toFixed(1) : 0;

        const statsContainer = document.getElementById('dash-stats');
        statsContainer.innerHTML = `
            <div class="card" style="box-shadow: 0 4px 20px rgba(191, 90, 242, 0.15); border-color: rgba(191, 90, 242, 0.3);">
                <div style="display:flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600; text-transform: uppercase;">Credits Remaining</span>
                    <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(191, 90, 242, 0.1); display:flex; align-items:center; justify-content:center; color: var(--credit-color);">
                        <i class="icon-lucide-coins"></i>
                    </div>
                </div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--credit-color);">${stats.credits.toLocaleString()}</div>
            </div>
            
            <div class="card">
                <div style="display:flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600; text-transform: uppercase;">Total Sent</span>
                    <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(10, 132, 255, 0.1); display:flex; align-items:center; justify-content:center; color: var(--accent-color);">
                        <i class="icon-lucide-send"></i>
                    </div>
                </div>
                <div style="font-size: 2rem; font-weight: 700;">${stats.sent.toLocaleString()}</div>
            </div>

            <div class="card">
                <div style="display:flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600; text-transform: uppercase;">Delivered</span>
                    <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(50, 215, 75, 0.1); display:flex; align-items:center; justify-content:center; color: var(--success-color);">
                        <i class="icon-lucide-check-circle-2"></i>
                    </div>
                </div>
                <div style="font-size: 2rem; font-weight: 700;">${stats.delivered.toLocaleString()}</div>
                <div style="font-size: 0.75rem; color: var(--success-color); margin-top: -8px;">${deliveryRate}% delivery rate</div>
            </div>

            <div class="card">
                <div style="display:flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--text-muted); font-size: 0.85rem; font-weight: 600; text-transform: uppercase;">Failed</span>
                    <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(255, 69, 58, 0.1); display:flex; align-items:center; justify-content:center; color: var(--danger-color);">
                        <i class="icon-lucide-x-circle"></i>
                    </div>
                </div>
                <div style="font-size: 2rem; font-weight: 700;">${stats.failed.toLocaleString()}</div>
                <div style="font-size: 0.75rem; color: var(--danger-color); margin-top: -8px;">${failRate}% failure rate</div>
            </div>
        `;

        this.initActivityList(stats.recentActivity);
        this.initChart(stats, deliveryRate);
        this.generateAISummary(stats, deliveryRate);
    },

    initActivityList(activities) {
        const container = document.getElementById('recent-activity-container');
        if(!container) return;
        
        if(!activities || activities.length === 0) {
            container.innerHTML = '<div style="color: var(--text-muted); font-size: 0.85rem;">No recent messages found.</div>';
            return;
        }

        container.innerHTML = activities.map(act => {
            const st = String(act.status).toLowerCase();
            let color = 'var(--text-muted)';
            if(st.includes('deliver')) color = 'var(--success-color)';
            else if(st.includes('fail') || st.includes('reject')) color = 'var(--danger-color)';
            else color = 'var(--warning-color)';

            const dateStr = act.date ? new Date(act.date).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}) : 'Just now';
            const snippet = act.message.length > 40 ? act.message.substring(0, 40) + '...' : act.message;

            return `
                <div style="display:flex; gap: 12px; align-items: flex-start; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color}; margin-top: 6px; flex-shrink: 0;"></div>
                    <div style="flex: 1; overflow: hidden;">
                        <div style="display:flex; justify-content: space-between; gap: 8px;">
                            <p style="font-size: 0.9rem; font-weight: 500; font-family: monospace;">To: ${act.to}</p>
                            <span style="font-size: 0.75rem; color: ${color}; font-weight: 600;">${act.status}</span>
                        </div>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">"${snippet}"</p>
                        <p style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">${dateStr}</p>
                    </div>
                </div>
            `;
        }).join('');
    },

    generateAISummary(stats, deliveryRate) {
        const p = document.getElementById('ai-summary-text');
        if(!p) return;

        if (stats.sent === 0) {
            p.innerHTML = "You haven't sent any campaigns yet. Start scheduling messages to see your performance breakdown here.";
            return;
        }

        let insight = `You have dispatched a total of <strong>${stats.sent.toLocaleString()}</strong> messages. `;
        insight += `Currently, <strong>${stats.delivered.toLocaleString()}</strong> (<span style="color:var(--success-color)">${deliveryRate}%</span>) successfully reached your recipients, `;
        insight += `while <strong>${stats.failed.toLocaleString()}</strong> failed to deliver. `;

        if (deliveryRate >= 95) {
            insight += "Your delivery health is excellent!";
        } else if (deliveryRate >= 85) {
            insight += "Delivery rate is stable, but consider cleaning your contact lists of inactive numbers.";
        } else {
            insight += "High failure rate detected. It is highly recommended to purge blocked or invalid numbers from your audience.";
        }

        p.innerHTML = insight;
    },

    initChart(stats, deliveryRate) {
        const ctx = document.getElementById('deliveryChart');
        if(!ctx) return;
        
        Chart.defaults.color = '#a1a1aa';
        Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Inter", sans-serif';

        // Apple Fitness Style Centre Plugin
        const centerTextPlugin = {
            id: 'centerText',
            beforeDraw: function(chart) {
                if (chart.config.type !== 'doughnut') return;
                var width = chart.width,
                    height = chart.height,
                    ctx = chart.ctx;

                ctx.restore();
                
                // Main Percentage
                var fontSize = (height / 120).toFixed(2);
                ctx.font = 'bold ' + fontSize + 'em -apple-system, sans-serif';
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#ffffff";
                var text = deliveryRate + "%",
                    textX = Math.round((width - ctx.measureText(text).width) / 2),
                    textY = height / 2 - 10;
                ctx.fillText(text, textX, textY);

                // Subtitle
                var subFontSize = (height / 280).toFixed(2);
                ctx.font = '600 ' + subFontSize + 'em -apple-system, sans-serif';
                ctx.fillStyle = "#a1a1aa";
                var subText = "Delivered";
                var subX = Math.round((width - ctx.measureText(subText).width) / 2);
                ctx.fillText(subText, subX, textY + 28);
                
                ctx.save();
            }
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Delivered', 'Failed'],
                datasets: [{
                    data: [stats.delivered, stats.failed],
                    backgroundColor: [
                        'rgba(50, 215, 75, 1)',   // Apple Green Solid
                        'rgba(255, 69, 58, 0.4)'  // Apple Red Softened
                    ],
                    borderWidth: 0,
                    borderRadius: 20, // Pill shaped overlap ends
                    spacing: 4,       // Gap between segments
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '84%',        // Extremely sleek thin ring
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            padding: 24, 
                            usePointStyle: true, 
                            pointStyle: 'circle',
                            font: { size: 12, weight: '600' }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(28, 28, 30, 0.85)', // Glass tooltips
                        titleColor: '#fff',
                        bodyColor: '#e0e0e0',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 14,
                        cornerRadius: 16,
                        displayColors: true,
                        boxPadding: 8,
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) label += ': ';
                                if (context.parsed !== null) label += context.parsed + ' msgs';
                                return label;
                            }
                        }
                    }
                }
            },
            plugins: [centerTextPlugin] // Inject text plugin
        });
    }
};

// Hook into app
document.addEventListener('DOMContentLoaded', () => {
    // Wait for app to be ready
    setTimeout(() => {
        if(window.app) window.app.views['dashboard'] = () => window.DashboardView.render(window.app.contentArea);
    }, 100);
});
