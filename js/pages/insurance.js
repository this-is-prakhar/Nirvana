(function() {
    'use strict';
    
    const Insurance = {
        charts: [],
        container: null,
        
        render(container) {
            this.container = container;
            this.setupUI();
            this.bindEvents();
        },
        
        setupUI() {
            const store = window.Nirvana.Store;
            const profile = store ? store.getUserProfile() : {};
            const insurance = store ? store.get('insurance') || {} : {};
            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN') };

            const annualIncome = (profile.income || 175000) * 12;
            const requiredLife = annualIncome * 10;
            const currentLife = profile.lifeCover || (insurance.life ? insurance.life.sumAssured : 15000000);
            const lifeGap = Math.max(0, requiredLife - currentLife);
            const lifeAdequacyPct = requiredLife > 0 ? Math.min(100, Math.round((currentLife / requiredLife) * 100)) : 100;

            const recommendedHealth = 1500000;
            const currentHealth = profile.healthCover || (insurance.health ? insurance.health.sumAssured : 1500000);
            const healthAdequacyPct = Math.min(100, Math.round((currentHealth / recommendedHealth) * 100));

            this.container.innerHTML = `
                <div class="page-content animate-fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-primary">Insurance & Human Capital Protection</h1>
                            <p class="text-secondary text-sm">Human Life Value (HLV) gap analysis, comprehensive medical cover benchmarks, and active policy vault.</p>
                        </div>
                        <button class="btn btn--primary btn--sm" id="btn-reeval-ins">🛡️ Re-evaluate Protection</button>
                    </div>
                    
                    <!-- Coverage Cards -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <!-- Life Insurance -->
                        <div class="card card--glass p-6 border rounded-lg">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-bold flex items-center gap-2">👨‍👩‍👧 Life Insurance (Pure Term Protection)</h3>
                                <span class="badge ${lifeGap === 0 ? 'badge--success' : 'badge--warning'} text-xs px-2 py-0.5">${lifeGap === 0 ? 'Adequate Cover' : 'Underinsured'}</span>
                            </div>
                            
                            <div class="mb-4">
                                <div class="flex justify-between text-xs mb-1">
                                    <span class="text-muted">Current Active Cover:</span>
                                    <span class="font-bold font-mono text-primary">${utilsCurrency.formatINR(currentLife)}</span>
                                </div>
                                <div class="flex justify-between text-xs mb-2">
                                    <span class="text-muted">Required Cover (10x Annual Income):</span>
                                    <span class="font-bold font-mono">${utilsCurrency.formatINR(requiredLife)}</span>
                                </div>
                                <div class="progress-bar bg-surface h-2.5 rounded-full mb-2 w-full" style="background: rgba(255,255,255,0.1);">
                                    <div class="h-full rounded-full" style="width: ${lifeAdequacyPct}%; background: ${lifeAdequacyPct >= 90 ? '#10b981' : '#f59e0b'};"></div>
                                </div>
                                <div class="text-xs ${lifeGap === 0 ? 'text-gain' : 'text-danger'} font-semibold">
                                    ${lifeGap === 0 ? '✓ Protection covers 100% of family liabilities' : `⚠️ Protection Gap: ${utilsCurrency.formatINR(lifeGap)} (Add Term Plan)`}
                                </div>
                            </div>
                            
                            <div class="card p-3 bg-surface rounded border text-xs">
                                <div class="font-bold text-primary mb-1">Recommended Plan</div>
                                <p class="text-secondary mb-2">HDFC Life Click 2 Protect 3D Plus or Tata AIA Sampoorna Raksha (₹${(requiredLife/10000000).toFixed(1)} Cr Cover ~ ₹14,500/yr).</p>
                                <button class="btn btn--sm btn--primary py-1" onclick="alert('Viewing Top Term Plans...')">Compare 5 Top Term Plans</button>
                            </div>
                        </div>
                        
                        <!-- Health Insurance -->
                        <div class="card card--glass p-6 border rounded-lg">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-bold flex items-center gap-2">🏥 Health & Critical Illness Protection</h3>
                                <span class="badge ${healthAdequacyPct >= 100 ? 'badge--success' : 'badge--warning'} text-xs px-2 py-0.5">${healthAdequacyPct >= 100 ? 'Adequate Base Cover' : 'Top-up Needed'}</span>
                            </div>
                            
                            <div class="mb-4">
                                <div class="flex justify-between text-xs mb-1">
                                    <span class="text-muted">Family Floater Sum Insured:</span>
                                    <span class="font-bold font-mono text-gain">${utilsCurrency.formatINR(currentHealth)}</span>
                                </div>
                                <div class="flex justify-between text-xs mb-2">
                                    <span class="text-muted">Senior Parents Cover:</span>
                                    <span class="font-bold font-mono text-primary">${utilsCurrency.formatINR(profile.parentHealthCover || 500000)}</span>
                                </div>
                                <div class="progress-bar bg-surface h-2.5 rounded-full mb-2 w-full" style="background: rgba(255,255,255,0.1);">
                                    <div class="h-full rounded-full bg-emerald-500" style="width: ${healthAdequacyPct}%; background: #10b981;"></div>
                                </div>
                                <div class="text-xs text-gain font-semibold">✓ 100% Hospitalization & 1X Restoration active</div>
                            </div>
                            
                            <div class="card p-3 bg-surface rounded border text-xs">
                                <div class="font-bold text-primary mb-1">Enhancement Recommendation</div>
                                <p class="text-secondary mb-2">Add a ₹50L Super Top-up plan with ₹10L deductible to protect against severe medical inflation (~₹3,500/yr).</p>
                                <button class="btn btn--sm btn--secondary py-1" onclick="alert('Viewing Super Top-up plans...')">Compare Super Top-ups</button>
                            </div>
                        </div>
                    </div>

                    <!-- Policy Vault Table -->
                    <div class="card card--glass p-5 mb-6">
                        <h3 class="text-lg font-bold mb-4">Active Policy Vault</h3>
                        <div class="overflow-x-auto">
                            <table class="data-table data-table--striped w-full text-sm">
                                <thead>
                                    <tr class="border-b text-muted">
                                        <th class="text-left py-2 px-3">Policy Type</th>
                                        <th class="text-left py-2 px-3">Plan Name</th>
                                        <th class="text-right py-2 px-3">Sum Insured</th>
                                        <th class="text-right py-2 px-3">Annual Premium</th>
                                        <th class="text-center py-2 px-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b hover:bg-surface">
                                        <td class="py-2.5 px-3 font-semibold text-primary">Pure Term Life</td>
                                        <td class="py-2.5 px-3">${insurance.life?.planName || 'HDFC Life Click 2 Protect'}</td>
                                        <td class="py-2.5 px-3 text-right font-mono font-bold">${utilsCurrency.formatINR(currentLife)}</td>
                                        <td class="py-2.5 px-3 text-right font-mono">${utilsCurrency.formatINR(profile.lifePremium || 16500)}</td>
                                        <td class="py-2.5 px-3 text-center"><span class="badge badge--success text-xs px-2 py-0.5">Active</span></td>
                                    </tr>
                                    <tr class="border-b hover:bg-surface">
                                        <td class="py-2.5 px-3 font-semibold text-gain">Family Health Floater</td>
                                        <td class="py-2.5 px-3">${insurance.health?.planName || 'Care Supreme Health Insurance'}</td>
                                        <td class="py-2.5 px-3 text-right font-mono font-bold">${utilsCurrency.formatINR(currentHealth)}</td>
                                        <td class="py-2.5 px-3 text-right font-mono">₹22,000</td>
                                        <td class="py-2.5 px-3 text-center"><span class="badge badge--success text-xs px-2 py-0.5">Active</span></td>
                                    </tr>
                                    <tr class="hover:bg-surface">
                                        <td class="py-2.5 px-3 font-semibold text-warning">Parents Health Cover</td>
                                        <td class="py-2.5 px-3">${insurance.parents?.planName || 'Star Health Senior Citizens'}</td>
                                        <td class="py-2.5 px-3 text-right font-mono font-bold">${utilsCurrency.formatINR(profile.parentHealthCover || 500000)}</td>
                                        <td class="py-2.5 px-3 text-right font-mono">₹28,000</td>
                                        <td class="py-2.5 px-3 text-center"><span class="badge badge--success text-xs px-2 py-0.5">Active</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        },
        
        bindEvents() {
            const btn = this.container.querySelector('#btn-reeval-ins');
            if (btn) {
                btn.addEventListener('click', () => {
                    if (window.Nirvana.Components?.Toast) {
                        window.Nirvana.Components.Toast.success('Insurance adequacy metrics refreshed against current income!', 'Insurance Engine');
                    }
                });
            }
        },
        
        destroy() {
            this.container = null;
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Insurance = Insurance;
})();
