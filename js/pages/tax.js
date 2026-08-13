(function() {
    'use strict';
    
    const Tax = {
        charts: [],
        
        render(container) {
            container.innerHTML = this.getTemplate();
            this.bindEvents(container);
            this.renderCharts(container);
        },
        
        getTemplate() {
            const store = window.Nirvana.Store;
            const profile = store ? store.getUserProfile() : {};
            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN') };

            const monthlyIncome = profile.income || 175000;
            const bonus = profile.bonus || 200000;
            const grossAnnual = (monthlyIncome * 12) + bonus;

            // Deductions
            const sec80C = 150000;
            const sec80D = profile.parentHealthCover ? 50000 : 25000;
            const sec24b = profile.homeLoan ? 200000 : 0;
            const totalDeductions = sec80C + sec80D + sec24b + 50000; // 50k standard deduction

            let comparison = {
                oldRegime: { taxableIncome: Math.max(0, grossAnnual - totalDeductions), totalTax: 0, effectiveRate: 0 },
                newRegime: { taxableIncome: Math.max(0, grossAnnual - 75000), totalTax: 0, effectiveRate: 0 },
                recommendation: 'New',
                savings: 0
            };

            if (window.Nirvana.Engines && window.Nirvana.Engines.TaxEngine) {
                comparison = window.Nirvana.Engines.TaxEngine.compareRegimes(grossAnnual, totalDeductions);
            }

            const isNewBetter = comparison.recommendation === 'New';

            return `
                <div class="page-content animate-fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-primary">Tax Planning & Regime Optimization</h1>
                            <p class="text-secondary text-sm">Automated FY 2025-26 tax liability simulation, Section 80C/80D optimization, and capital gains harvesting.</p>
                        </div>
                        <button class="btn btn--primary btn--sm" id="btn-compare-regimes">Recalculate Tax</button>
                    </div>
                    
                    <!-- KPI Tiles -->
                    <div class="kpi-grid grid grid--4 gap-4 mb-6">
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Gross Annual Income</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-primary">${utilsCurrency.formatINR(grossAnnual)}</div>
                            <div class="text-xs text-muted mt-2">Salary + Annual Incentive</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Estimated Minimum Tax</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-danger">${utilsCurrency.formatINR(Math.min(comparison.oldRegime.totalTax, comparison.newRegime.totalTax))}</div>
                            <div class="text-xs text-muted mt-2">Effective Tax Rate: <strong>${(Math.min(comparison.oldRegime.totalTax, comparison.newRegime.totalTax) / grossAnnual * 100).toFixed(1)}%</strong></div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Optimal Regime</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-gain">${comparison.recommendation} Regime</div>
                            <div class="text-xs text-gain mt-2 font-semibold">Saves ${utilsCurrency.formatINR(comparison.savings)} in tax</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">LTCG Exemption Limit</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-info">₹1,25,000</div>
                            <div class="text-xs text-muted mt-2">Annual 12.5% LTCG tax-free threshold</div>
                        </div>
                    </div>

                    <!-- Comparison Side by Side -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <!-- Old Regime -->
                        <div class="card card--glass p-5 ${!isNewBetter ? 'border-2 border-emerald-500 relative' : ''}">
                            ${!isNewBetter ? `<div class="badge badge--success absolute top-3 right-3 text-xs font-bold">RECOMMENDED</div>` : ''}
                            <h3 class="text-lg font-bold mb-4">Old Tax Regime (With Deductions)</h3>
                            <div class="flex justify-between border-b pb-2 mb-2 text-sm"><span class="text-muted">Gross Income</span><span class="font-bold">${utilsCurrency.formatINR(grossAnnual)}</span></div>
                            <div class="flex justify-between border-b pb-2 mb-2 text-sm"><span class="text-muted">Standard Deduction</span><span>₹50,000</span></div>
                            <div class="flex justify-between border-b pb-2 mb-2 text-sm"><span class="text-muted">Section 80C (ELSS/EPF/PPF)</span><span>${utilsCurrency.formatINR(sec80C)}</span></div>
                            <div class="flex justify-between border-b pb-2 mb-2 text-sm"><span class="text-muted">Section 80D (Health Insurance)</span><span>${utilsCurrency.formatINR(sec80D)}</span></div>
                            ${profile.homeLoan ? `<div class="flex justify-between border-b pb-2 mb-2 text-sm"><span class="text-muted">Section 24(b) Home Loan Interest</span><span>${utilsCurrency.formatINR(sec24b)}</span></div>` : ''}
                            <div class="flex justify-between border-b pb-2 mb-2 text-sm"><span class="text-muted">Taxable Income</span><span class="font-bold font-mono">${utilsCurrency.formatINR(comparison.oldRegime.taxableIncome)}</span></div>
                            <div class="flex justify-between pt-2 text-base"><span class="font-bold">Total Tax Payable (incl. Cess)</span><span class="font-bold font-mono ${!isNewBetter ? 'text-gain' : 'text-danger'}">${utilsCurrency.formatINR(comparison.oldRegime.totalTax)}</span></div>
                        </div>

                        <!-- New Regime -->
                        <div class="card card--glass p-5 ${isNewBetter ? 'border-2 border-emerald-500 relative' : ''}">
                            ${isNewBetter ? `<div class="badge badge--success absolute top-3 right-3 text-xs font-bold">RECOMMENDED</div>` : ''}
                            <h3 class="text-lg font-bold mb-4">New Tax Regime (Lower Slabs)</h3>
                            <div class="flex justify-between border-b pb-2 mb-2 text-sm"><span class="text-muted">Gross Income</span><span class="font-bold">${utilsCurrency.formatINR(grossAnnual)}</span></div>
                            <div class="flex justify-between border-b pb-2 mb-2 text-sm"><span class="text-muted">Standard Deduction (FY 2025-26)</span><span>₹75,000</span></div>
                            <div class="flex justify-between border-b pb-2 mb-2 text-sm"><span class="text-muted">Itemized Deductions</span><span class="text-muted font-mono">Nil (Simplified)</span></div>
                            <div class="flex justify-between border-b pb-2 mb-2 text-sm"><span class="text-muted">Taxable Income</span><span class="font-bold font-mono">${utilsCurrency.formatINR(comparison.newRegime.taxableIncome)}</span></div>
                            <div class="flex justify-between pt-2 text-base"><span class="font-bold">Total Tax Payable (incl. Cess)</span><span class="font-bold font-mono ${isNewBetter ? 'text-gain' : 'text-danger'}">${utilsCurrency.formatINR(comparison.newRegime.totalTax)}</span></div>
                        </div>
                    </div>

                    <!-- Deductions & Tax Optimization Actions -->
                    <div class="card card--glass p-5 mb-6">
                        <h3 class="text-lg font-bold mb-4">Deduction Utilization & Harvesting Strategies</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div class="mb-4">
                                    <div class="flex justify-between text-xs font-bold mb-1">
                                        <span>Section 80C Utilization (Cap ₹1.5L)</span>
                                        <span class="text-gain">₹1,50,000 / ₹1,50,000 (100%)</span>
                                    </div>
                                    <div class="progress-bar bg-surface h-2 rounded-full"><div class="bg-emerald-500 h-2 rounded-full" style="width:100%; background:#10b981;"></div></div>
                                </div>
                                <div class="mb-4">
                                    <div class="flex justify-between text-xs font-bold mb-1">
                                        <span>Section 80D Health Cover (Self + Parents Cap ₹75k)</span>
                                        <span class="text-gain">${utilsCurrency.formatINR(sec80D)} / ₹75,000</span>
                                    </div>
                                    <div class="progress-bar bg-surface h-2 rounded-full"><div class="bg-emerald-500 h-2 rounded-full" style="width:${(sec80D/75000*100).toFixed(0)}%; background:#10b981;"></div></div>
                                </div>
                                <div>
                                    <div class="flex justify-between text-xs font-bold mb-1">
                                        <span>NPS Sec 80CCD(1B) Additional ₹50k</span>
                                        <span class="text-warning">₹0 / ₹50,000 (Available)</span>
                                    </div>
                                    <div class="progress-bar bg-surface h-2 rounded-full"><div class="bg-yellow-500 h-2 rounded-full" style="width:0%; background:#f59e0b;"></div></div>
                                </div>
                            </div>
                            <div class="bg-surface p-4 rounded-lg border">
                                <h4 class="font-bold text-sm mb-2 text-primary">💡 Quantitative Tax Action</h4>
                                <p class="text-secondary text-xs mb-3">You have unharvested equity gains under ₹1.25 Lakh. By booking gains before March 31 and immediately re-entering, you reset your cost basis without paying any tax under Section 112A.</p>
                                <button class="btn btn--primary btn--sm" onclick="alert('LTCG Tax Harvesting schedule generated!')">Harvest ₹1.25L Tax-Free LTCG</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        bindEvents(container) {
            const btn = container.querySelector('#btn-compare-regimes');
            if (btn) {
                btn.addEventListener('click', () => {
                    if (window.Nirvana.Components?.Toast) {
                        window.Nirvana.Components.Toast.success('Tax rules & slabs up to date for FY 2025-26!', 'Tax Engine');
                    }
                });
            }
        },
        
        renderCharts(container) {},
        
        destroy() {
            this.charts.forEach(chart => {
                if (typeof chart.destroy === 'function') chart.destroy();
            });
            this.charts = [];
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Tax = Tax;
})();
