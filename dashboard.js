// Dashboard View Component — Minimalist Apple VisionOS Edition
window.DashboardView = {
    async render(container) {
        const now = new Date();
        const hour = now.getHours();
        let greeting = "Good Morning";
        if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
        else if (hour >= 17) greeting = "Good Evening";

        const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
        const dateStr = now.toLocaleDateString('en-US', dateOptions);

        container.innerHTML = `
            <div class="view-container active fade-in" style="gap: 32px; padding: 40px;">
                
                <!-- Apple-Style Cinematic Header -->
                <header class="dashboard-header" style="animation: fadeIn 1s ease-out;">
                    <p style="font-size: 0.85rem; font-weight: 800; color: rgba(255,159,10,0.8); text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 8px;">Intelligence Overview</p>
                    <h1 class="apple-heading">${greeting}, Admin</h1>
                    <p style="font-size: 1rem; color: rgba(255,255,255,0.4); font-weight: 500;">${dateStr} <span style="margin: 0 10px; opacity: 0.3;">|</span> System Pulse: Optimal</p>
                </header>

                <!-- Key Metrics Grid -->
                <div class="grid-4 stagger-entrance" id="dash-stats">
                    <!-- Skeleton Cards during fetch handled by global loader -->
                </div>

                <!-- Secondary Data Layer -->
                <div class="grid-2 stagger-entrance" style="animation-delay: 0.4s;">
                    
                    <!-- Performance Analytics (VisionOS Style) -->
                    <div class="apple-card" style="display:flex; flex-direction:column; gap: 24px; min-height: 420px;">
                        <div>
                            <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 4px;">Delivery Analytics</h3>
                            <p style="font-size: 0.8rem; color: rgba(255,255,255,0.4);">Real-time transmission success metrics.</p>
                        </div>
                        
                        <div style="flex: 1; position: relative; display: flex; align-items: center; justify-content: center;">
                            <div style="position: relative; height: 260px; width: 100%;">
                                <canvas id="deliveryChart"></canvas>
                            </div>
                        </div>
                        
                        <!-- Intelligent Insight Card -->
                        <div style="background: rgba(10, 132, 255, 0.08); border: 1px solid rgba(10, 132, 255, 0.15); border-radius: 20px; padding: 20px; display: flex; gap: 16px; align-items: flex-start;">
                            <div class="glass-icon-wrapper" style="color: #0a84ff; flex-shrink: 0;">
                                <i class="icon-lucide-sparkles"></i>
                            </div>
                            <div>
                                <h4 style="font-size: 0.85rem; font-weight: 800; color: #fff; margin-bottom: 4px;">AI Insight</h4>
                                <p id="ai-summary-text" style="font-size: 0.85rem; color: rgba(255,255,255,0.6); line-height: 1.5;">Generating intelligence summary...</p>
                            </div>
                        </div>
                    </div>

                    <!-- Activity Stream -->
                    <div class="apple-card" style="display:flex; flex-direction:column; gap: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <h3 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 4px;">Transmission Stream</h3>
                                <p style="font-size: 0.8rem; color: rgba(255,255,255,0.4);">Recent messaging node activity.</p>
                            </div>
                            <button onclick="window.location.hash='#inbox'" class="btn" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); font-size: 0.75rem; font-weight: 800; color: #fff; padding: 8px 14px; border-radius: 12px;">Live View</button>
                        </div>
                        
                        <div class="activity-timeline" id="recent-activity-container" style="display:flex; flex-direction: column; gap: 4px; flex: 1; overflow-y: auto;">
                            <!-- Activity Items Injected Dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Fetch Data
        try {
            const stats = await window.BrandSyncAPI.getDashboardStats();
            this.renderStats(stats);
            this.initActivityList(stats.recentActivity);
            
            const totalResolved = stats.delivered + stats.failed;
            const deliveryRate = totalResolved > 0 ? ((stats.delivered / totalResolved) * 100).toFixed(1) : 0;
            
            this.initChart(stats, deliveryRate);
            this.generateAISummary(stats, deliveryRate);
        } catch (e) {
            console.error("Dashboard Render Failed", e);
        }
    },

    renderStats(stats) {
        const statsContainer = document.getElementById('dash-stats');
        if (!statsContainer) return;

        const totalResolved = stats.delivered + stats.failed;
        const deliveryRate = totalResolved > 0 ? ((stats.delivered / totalResolved) * 100).toFixed(1) : 0;
        const failRate = totalResolved > 0 ? ((stats.failed / totalResolved) * 100).toFixed(1) : 0;

        const metrics = [
            { label: 'Credits Status', value: stats.credits.toLocaleString(), color: 'var(--credit-color)', icon: 'icon-lucide-coins', sub: 'Available for dispatch' },
            { label: 'Total Dispatched', value: stats.sent.toLocaleString(), color: 'var(--accent-color)', icon: 'icon-lucide-send', sub: 'Gross message volume' },
            { label: 'Successful Delivery', value: stats.delivered.toLocaleString(), color: 'var(--success-color)', icon: 'icon-lucide-check-circle-2', sub: `${deliveryRate}% success rate` },
            { label: 'Failed Transmission', value: stats.failed.toLocaleString(), color: 'var(--danger-color)', icon: 'icon-lucide-zap-off', sub: `${failRate}% failure rate` }
        ];

        statsContainer.innerHTML = metrics.map(m => `
            <div class="apple-card" style="display: flex; flex-direction: column; gap: 12px; justify-content: flex-start; align-items: flex-start;">
                <div class="glass-icon-wrapper" style="color: ${m.color}; margin-bottom: 4px;">
                    <i class="${m.icon}"></i>
                </div>
                <div>
                    <p style="font-size: 0.65rem; color: rgba(255,255,255,0.4); font-weight: 800; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 4px;">${m.label}</p>
                    <div style="font-size: 2.4rem; font-weight: 800; letter-spacing: -0.03em; color: #fff; line-height: 1;">${m.value}</div>
                    <p style="font-size: 0.75rem; font-weight: 700; color: ${m.color}; margin-top: 8px; opacity: 0.9;">${m.sub}</p>
                </div>
            </div>
        `).join('');
    },

    initActivityList(activities) {
        const container = document.getElementById('recent-activity-container');
        if(!container) return;
        
        if(!activities || activities.length === 0) {
            container.innerHTML = '<div style="padding: 40px; text-align:center; color: rgba(255,255,255,0.2); font-size: 0.85rem;">No recent transmission logs.</div>';
            return;
        }

        container.innerHTML = activities.map(act => {
            const st = String(act.status).toLowerCase();
            let color = 'rgba(255,255,255,0.2)';
            if(st.includes('deliver')) color = 'var(--success-color)';
            else if(st.includes('fail')) color = 'var(--danger-color)';
            else if(st.includes('pend')) color = 'var(--warning-color)';

            const dateStr = act.date ? new Date(act.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'Just now';
            const snippet = act.message.length > 50 ? act.message.substring(0, 50) + '...' : act.message;

            return `
                <div style="display:flex; gap: 16px; align-items: center; padding: 14px 16px; border-radius: 16px; transition: 0.2s; cursor: pointer;" 
                     onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background='transparent'">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${color}; box-shadow: 0 0 10px ${color}66;"></div>
                    <div style="flex: 1; overflow: hidden;">
                        <div style="display:flex; justify-content: space-between; gap: 12px; align-items: baseline;">
                            <span style="font-size: 0.85rem; font-weight: 700; color: #fff; font-family: monospace;">+${act.to}</span>
                            <span style="font-size: 0.65rem; color: rgba(255,255,255,0.3); font-weight: 700;">${dateStr}</span>
                        </div>
                        <p style="font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${act.message}</p>
                    </div>
                    <div style="font-size: 0.65rem; font-weight: 900; text-transform: uppercase; color: ${color}; letter-spacing: 0.05em; min-width: 65px; text-align: right;">${act.status}</div>
                </div>
            `;
        }).join('');
    },

    generateAISummary(stats, deliveryRate) {
        const p = document.getElementById('ai-summary-text');
        if(!p) return;

        if (stats.sent === 0) {
            p.innerHTML = "Secure link established. No message cycles detected in the current epoch. Awaiting transmission commands.";
            return;
        }

        let insight = `Node performance is peaking with a <strong>${deliveryRate}%</strong> transmission integrity. `;
        insight += `Successfully routed ${stats.delivered.toLocaleString()} packages through secure gateway. `;

        if (deliveryRate >= 95) {
            insight += "System health is optimized. No intervention required.";
        } else if (deliveryRate >= 85) {
            insight += "Slight packet loss detected. Monitor destination list hygiene.";
        } else {
            insight += "Critical failure rate. Recommend immediate audience sanitization.";
        }

        p.innerHTML = insight;
    },

    initChart(stats, deliveryRate) {
        const ctx = document.getElementById('deliveryChart');
        if(!ctx) return;
        
        Chart.defaults.color = 'rgba(255,255,255,0.3)';
        Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Inter", sans-serif';

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Delivered', 'Failed'],
                datasets: [{
                    data: [stats.delivered, stats.failed],
                    backgroundColor: [
                        '#32d74b',   // Apple Green
                        'rgba(255, 69, 58, 0.2)'  // Apple Red Soft
                    ],
                    hoverBackgroundColor: [
                        '#32d74b',
                        '#ff453a'
                    ],
                    borderWidth: 0,
                    borderRadius: 30, // Extremely rounded edges
                    spacing: 12,      // Wide gap for minimalist feel
                    hoverOffset: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '88%',        // Ultra-thin VisionOS ring
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(30, 30, 35, 0.95)',
                        backdropFilter: 'blur(20px)',
                        titleColor: '#fff',
                        titleFont: { size: 14, weight: '800' },
                        bodyColor: 'rgba(255,255,255,0.6)',
                        padding: 16,
                        cornerRadius: 20,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.1)'
                    }
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: (chart) => {
                    const { width, height, ctx } = chart;
                    ctx.restore();
                    
                    ctx.font = 'bold 2.5rem -apple-system, sans-serif';
                    ctx.textBaseline = "middle";
                    ctx.fillStyle = "#ffffff";
                    const text = deliveryRate + "%";
                    const textX = Math.round((width - ctx.measureText(text).width) / 2);
                    const textY = height / 2 - 5;
                    ctx.fillText(text, textX, textY);

                    ctx.font = '700 0.75rem -apple-system, sans-serif';
                    ctx.fillStyle = "rgba(255,255,255,0.3)";
                    const subText = "INTEGRITY";
                    const subX = Math.round((width - ctx.measureText(subText).width) / 2);
                    ctx.fillText(subText, subX, textY + 35);
                    
                    ctx.save();
                }
            }]
        });
    }
};
