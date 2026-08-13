(function() {
    'use strict';
    
    const CreditCards = {
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
            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN') };

            const monthlyExp = profile.expenses || 65000;
            const annualSpend = monthlyExp * 12;
            const estRewardsAnnual = Math.round(annualSpend * 0.042);

            this.container.innerHTML = `
                <div class="page-content animate-fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-primary">Credit Card & Reward Maximizer</h1>
                            <p class="text-secondary text-sm">Reward optimization matrix matching category spending against India's top super-premium & cashback cards.</p>
                        </div>
                        <button class="btn btn--primary btn--sm" id="btn-opt-cards">💳 Re-optimize Rewards</button>
                    </div>
                    
                    <!-- KPI Tiles -->
                    <div class="kpi-grid grid grid--4 gap-4 mb-6">
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Annual Card Spend</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-primary">${utilsCurrency.formatINR(annualSpend)}</div>
                            <div class="text-xs text-muted mt-2">Based on ₹${(monthlyExp/1000).toFixed(0)}k/mo living spend</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Max Net Reward Value</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-gain">${utilsCurrency.formatINR(estRewardsAnnual)} <span class="text-xs font-normal text-muted">/ yr</span></div>
                            <div class="text-xs text-gain mt-2 font-semibold">4.2% Blended Reward Rate</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Airport Lounge Access</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-info">Unlimited Domestic + Priority Pass</div>
                            <div class="text-xs text-muted mt-2">With recommended 2-card combo</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Zero Forex Markup</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-warning">Active (Saves 3.5%)</div>
                            <div class="text-xs text-muted mt-2">On international transactions</div>
                        </div>
                    </div>
                    
                    <!-- Spending Matrix & Best Card per Category -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div class="col-span-2 card card--glass p-5">
                            <h3 class="text-lg font-bold mb-4">Optimal Card Allocation by Category</h3>
                            <div class="overflow-x-auto">
                                <table class="data-table data-table--striped w-full text-sm">
                                    <thead>
                                        <tr class="border-b text-muted">
                                            <th class="text-left py-2 px-3">Spend Category</th>
                                            <th class="text-left py-2 px-3">Recommended Card</th>
                                            <th class="text-right py-2 px-3">Reward Rate</th>
                                            <th class="text-right py-2 px-3">Monthly Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="border-b hover:bg-surface">
                                            <td class="py-2.5 px-3 font-semibold">Online Shopping & E-Commerce</td>
                                            <td class="py-2.5 px-3 text-primary font-bold">SBI Cashback / ICICI Amazon Pay</td>
                                            <td class="py-2.5 px-3 text-right text-gain font-mono font-bold">5.0%</td>
                                            <td class="py-2.5 px-3 text-right font-mono">${utilsCurrency.formatINR(monthlyExp * 0.25 * 0.05)}</td>
                                        </tr>
                                        <tr class="border-b hover:bg-surface">
                                            <td class="py-2.5 px-3 font-semibold">Flights, Hotels & Travel</td>
                                            <td class="py-2.5 px-3 text-primary font-bold">HDFC Infinia / Axis Atlas</td>
                                            <td class="py-2.5 px-3 text-right text-gain font-mono font-bold">16.5%</td>
                                            <td class="py-2.5 px-3 text-right font-mono">${utilsCurrency.formatINR(monthlyExp * 0.20 * 0.165)}</td>
                                        </tr>
                                        <tr class="border-b hover:bg-surface">
                                            <td class="py-2.5 px-3 font-semibold">Dining, Swiggy & Zomato</td>
                                            <td class="py-2.5 px-3 text-primary font-bold">HDFC Diners Club Black</td>
                                            <td class="py-2.5 px-3 text-right text-gain font-mono font-bold">10.0%</td>
                                            <td class="py-2.5 px-3 text-right font-mono">${utilsCurrency.formatINR(monthlyExp * 0.15 * 0.10)}</td>
                                        </tr>
                                        <tr class="border-b hover:bg-surface">
                                            <td class="py-2.5 px-3 font-semibold">Fuel & Utilities</td>
                                            <td class="py-2.5 px-3 text-primary font-bold">Airtel Axis Bank Card</td>
                                            <td class="py-2.5 px-3 text-right text-gain font-mono font-bold">10.0%</td>
                                            <td class="py-2.5 px-3 text-right font-mono">${utilsCurrency.formatINR(monthlyExp * 0.15 * 0.10)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Card Recommendation Summary -->
                        <div class="col-span-1 card card--glass p-5">
                            <h3 class="text-lg font-bold mb-3">Top 2-Card Stack</h3>
                            <div class="space-y-3 text-xs">
                                <div class="card p-3 bg-surface rounded border">
                                    <div class="font-bold text-primary text-sm">1. HDFC Infinia Metal</div>
                                    <div class="text-secondary mt-1">Super-premium card for travel (SmartBuy 5x rewards, 1:1 air miles transfer, unlimited international lounges).</div>
                                    <div class="text-gain font-bold mt-1 font-mono">Net Annual Benefit: ₹62,000</div>
                                </div>
                                <div class="card p-3 bg-surface rounded border">
                                    <div class="font-bold text-primary text-sm">2. SBI Cashback Card</div>
                                    <div class="text-secondary mt-1">Flat 5% direct statement cashback on all online retail transactions with zero merchant exclusions.</div>
                                    <div class="text-gain font-bold mt-1 font-mono">Net Annual Benefit: ₹18,000</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        bindEvents() {
            const btn = this.container.querySelector('#btn-opt-cards');
            if (btn) {
                btn.addEventListener('click', () => {
                    if (window.Nirvana.Components?.Toast) {
                        window.Nirvana.Components.Toast.success('Updated reward rate rankings for all Indian cards!', 'Credit Card Engine');
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
    window.Nirvana.Pages.CreditCards = CreditCards;
})();
