// Automation View Component
window.AutomationView = {
    render(container) {
        container.innerHTML = `
            <div class="view-container active fade-in" style="height: 100%;">
                
                <div style="display:flex; justify-content: space-between; align-items:center;">
                    <div>
                        <h2 style="font-size: 1.25rem; font-weight: 600;">Workflow Builder</h2>
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Automate your SMS marketing with node-based logic.</p>
                    </div>
                    <div style="display:flex; gap: 12px;">
                        <button class="btn" onclick="window.AutomationView.deleteWorkflow()" style="background: rgba(255,69,58,0.1); border: 1px solid rgba(255,69,58,0.2); color: var(--danger-color);">Delete Workflow</button>
                        <button class="btn primary-btn"><i class="icon-lucide-save"></i> Save Flow</button>
                    </div>
                </div>

                <!-- Canvas Visual Placeholder -->
                <div class="card" style="flex: 1; position: relative; background: rgba(0,0,0,0.2); background-image: radial-gradient(var(--border-glass-strong) 1px, transparent 0); background-size: 40px 40px; overflow: hidden; display:flex; align-items:center; justify-content:center;">
                    
                    <!-- Nodes Container mockup -->
                    <div style="display:flex; flex-direction: column; align-items: center; gap: 40px; position: relative;">
                        <!-- Node 1 -->
                        <div style="background: var(--surface-glass); backdrop-filter: blur(20px); border: 1px solid var(--accent-color); padding: 16px; border-radius: var(--radius-md); width: 280px; box-shadow: 0 8px 32px rgba(10, 132, 255, 0.15); z-index: 2; position: relative;">
                            <button onclick="this.parentElement.remove()" style="position: absolute; top: -10px; right: -10px; width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.5); color: white; border: 1px solid rgba(255,255,255,0.2); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; line-height: 1; transition: 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.8)'" onmouseout="this.style.background='rgba(0,0,0,0.5)'">&times;</button>
                            <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 12px;">
                                <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(10, 132, 255, 0.2); display:flex; align-items:center; justify-content:center; color: var(--accent-color);">
                                    <i class="icon-lucide-zap"></i>
                                </div>
                                <div>
                                    <div style="font-weight: 600; font-size: 0.9rem;">Trigger</div>
                                    <div style="font-size: 0.75rem; color: var(--text-muted);">When this happens</div>
                                </div>
                            </div>
                            <div class="glass-input-select" style="width: 100%; border-color: rgba(255,255,255,0.2);">Contact added to "VIP" group</div>
                        </div>

                        <!-- Svg Line -->
                        <div style="position: absolute; top: 90px; left: 50%; width: 2px; height: 40px; background: var(--border-glass-strong); z-index: 1;"></div>

                        <!-- Node 2 -->
                        <div style="background: var(--surface-glass); backdrop-filter: blur(20px); border: 1px solid var(--success-color); padding: 16px; border-radius: var(--radius-md); width: 280px; box-shadow: 0 8px 32px rgba(50, 215, 75, 0.1); z-index: 2; position: relative;">
                            <button onclick="this.parentElement.remove()" style="position: absolute; top: -10px; right: -10px; width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.5); color: white; border: 1px solid rgba(255,255,255,0.2); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; line-height: 1; transition: 0.2s;" onmouseover="this.style.background='rgba(0,0,0,0.8)'" onmouseout="this.style.background='rgba(0,0,0,0.5)'">&times;</button>
                            <div style="display:flex; align-items:center; gap: 12px; margin-bottom: 12px;">
                                <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(50, 215, 75, 0.2); display:flex; align-items:center; justify-content:center; color: var(--success-color);">
                                    <i class="icon-lucide-send"></i>
                                </div>
                                <div>
                                    <div style="font-weight: 600; font-size: 0.9rem;">Action</div>
                                    <div style="font-size: 0.75rem; color: var(--text-muted);">Then do this</div>
                                </div>
                            </div>
                            <div class="glass-input-select" style="width: 100%; border-color: rgba(255,255,255,0.2);">Send SMS: "Welcome VIP!"</div>
                        </div>

                        <!-- Svg Line -->
                        <div style="position: absolute; top: 220px; left: 50%; width: 2px; height: 40px; background: var(--border-glass-strong); z-index: 1;"></div>
                        
                        <!-- Add Node button -->
                        <button class="btn icon-btn" style="background: var(--surface-glass); border: 1px dashed var(--border-glass-strong); z-index: 2; width: 48px; height: 48px;"><i class="icon-lucide-plus"></i></button>

                    </div>

                </div>
            </div>
        `;
    },

    deleteWorkflow() {
        if(!window.BrandSyncAppInstance) return;

        window.BrandSyncAppInstance.confirmAction(
            "Delete Workflow",
            "Are you sure you want to delete this entire automation workflow? All nodes and visual logic will be cleared.",
            "#ff453a",
            () => {
                // Secondary confirmation
                setTimeout(() => {
                    window.BrandSyncAppInstance.confirmAction(
                        "Final Termination Block",
                        "This will immediately de-register this workflow from the engine. Any running triggers will stop instantly. Proceed?",
                        "#ff3b30",
                        () => {
                            window.showToast("Automated workflow has been purged.", "success");
                        }
                    );
                }, 100);
            }
        );
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if(window.app) window.app.views['automation'] = () => window.AutomationView.render(window.app.contentArea);
    }, 100);
});
