(function() {
    'use strict';
    
    const Withdrawal = {
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
            const portfolio = store ? store.getPortfolio() : {};
            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN') };

            const totalAssets = portfolio.totalValue || 3700000;
            const liquidCorpus = (profile.bankBalance || 350000) + Math.round((profile.fdValue || 400000) * 0.5);
            const sustainableSwp = Math.round((totalAssets * 0.04) / 12);

            const bucket1 = Math.round(liquidCorpus);
            const bucket2 = Math.round((profile.fdValue || 400000) * 0.5 + (profile.goldValue || 250000) + (profile.retCorpus || 650000));
            const bucket3 = Math.round((profile.stocksValue || 850000) + (profile.mfValue || 1200000));

            this.container.innerHTML = `
                <div class="page-content animate-fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-primary">Withdrawal & Systematic Outflow Planner</h1>
                            <p class="text-secondary text-sm">Tax-optimized asset liquidation sequencing, 3-Bucket liquidity management, and dream purchase simulator.</p>
                        </div>
                        <button class="btn btn--primary btn--sm" id="btn-new-swp">+ New SWP Rule</button>
                    </div>
                    
                    <!-- KPI Tiles -->
                    <div class="kpi-grid grid grid--4 gap-4 mb-6">
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Available Liquid Buffer</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-primary">${utilsCurrency.formatINR(liquidCorpus)}</div>
                            <div class="text-xs text-gain mt-2 font-semibold">T+0 instant liquidity</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Sustainable Monthly SWP</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-gain">${utilsCurrency.formatINR(sustainableSwp)} <span class="text-xs font-normal text-muted">/ mo</span></div>
                            <div class="text-xs text-muted mt-2">Perpetual 4% rule rate</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Annual Tax-Free LTCG</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-info">₹1,25,000</div>
                            <div class="text-xs text-muted mt-2">Section 112A tax exemption</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Active Outflows</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-secondary">0 Active SWP</div>
                            <div class="text-xs text-gain mt-2 font-semibold">Pure Accumulation Phase</div>
                        </div>
                    </div>
                    
                    <!-- Dream Purchase Simulator -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div class="col-span-2 card card--glass p-6 border rounded-lg">
                            <h3 class="text-lg font-bold mb-2">🚗 Dream Purchase & Capital Outflow Simulator</h3>
                            <p class="text-xs text-secondary mb-4">Simulate how a major lump-sum purchase (e.g. Luxury Car, Real Estate downpayment, Dream Wedding) should be funded tax-efficiently without disrupting long-term compounding.</p>
                            
                            <div class="flex flex-wrap gap-4 mb-4">
                                <div class="flex-1 min-w-[200px]">
                                    <label class="text-xs font-bold text-muted block mb-1">Target Purchase Amount (₹)</label>
                                    <input type="number" class="form-input" value="1500000" id="sim-amount">
                                </div>
                                <div class="flex items-end">
                                    <button class="btn btn--primary" id="btn-run-sim">Simulate Optimal Liquidation</button>
                                </div>
                            </div>
                            
                            <div id="sim-results" class="bg-surface p-4 rounded-lg border text-sm">
                                <h4 class="font-bold mb-2 text-primary">Recommended Liquidation Hierarchy:</h4>
                                <div class="space-y-2 text-xs">
                                    <div class="flex justify-between border-b pb-1"><span>1. Bank Savings & Liquid Cash (Zero tax, instant):</span> <strong class="font-mono">₹3,50,000</strong></div>
                                    <div class="flex justify-between border-b pb-1"><span>2. Maturing Bank Fixed Deposits (Marginal slab):</span> <strong class="font-mono">₹4,00,000</strong></div>
                                    <div class="flex justify-between border-b pb-1"><span>3. Arbitrage & Hybrid Funds (Tax-free under ₹1.25L limit):</span> <strong class="font-mono">₹7,50,000</strong></div>
                                    <div class="flex justify-between pt-1 font-bold"><span class="text-gain">Total Estimated Capital Gains Tax:</span> <span class="text-gain font-mono">₹0 (Within exemptions)</span></div>
                                </div>
                            </div>
                        </div>

                        <!-- Bucket Strategy Breakdown -->
                        <div class="col-span-1 card card--glass p-5">
                            <h3 class="text-lg font-bold mb-4">3-Bucket Liquidity Model</h3>
                            <div class="space-y-4 text-xs">
                                <div class="p-3 bg-surface rounded border">
                                    <div class="font-bold text-primary mb-1">Bucket 1 (0–3 Years Outflows)</div>
                                    <div class="text-muted mb-2">Liquid Cash, Savings, Ultra Short Debt</div>
                                    <div class="font-bold font-mono text-sm text-gain">${utilsCurrency.formatINR(bucket1)}</div>
                                </div>
                                <div class="p-3 bg-surface rounded border">
                                    <div class="font-bold text-primary mb-1">Bucket 2 (3–7 Years Milestones)</div>
                                    <div class="text-muted mb-2">FDs, Corporate Bonds, Hybrid MFs, SGB</div>
                                    <div class="font-bold font-mono text-sm text-info">${utilsCurrency.formatINR(bucket2)}</div>
                                </div>
                                <div class="p-3 bg-surface rounded border">
                                    <div class="font-bold text-primary mb-1">Bucket 3 (7+ Years Growth)</div>
                                    <div class="text-muted mb-2">Direct Equities, Flexi-Cap & Small-Cap MFs</div>
                                    <div class="font-bold font-mono text-sm text-secondary">${utilsCurrency.formatINR(bucket3)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        bindEvents() {
            const btnSim = this.container.querySelector('#btn-run-sim');
            const simAmt = this.container.querySelector('#sim-amount');
            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN') };

            if (btnSim && simAmt) {
                btnSim.addEventListener('click', () => {
                    const amt = parseFloat(simAmt.value) || 1500000;
                    const res = document.getElementById('sim-results');
                    if (res) {
                        res.innerHTML = `
                            <h4 class="font-bold mb-2 text-primary">Optimal Liquidation Order for ${utilsCurrency.formatINR(amt)}:</h4>
                            <div class="space-y-2 text-xs">
                                <div class="flex justify-between border-b pb-1"><span>1. Liquid Savings & Bank Balance:</span> <strong class="font-mono">${utilsCurrency.formatINR(Math.min(amt, 350000))}</strong></div>
                                <div class="flex justify-between border-b pb-1"><span>2. Fixed Deposits / Liquid Funds:</span> <strong class="font-mono">${utilsCurrency.formatINR(Math.min(Math.max(0, amt - 350000), 400000))}</strong></div>
                                <div class="flex justify-between border-b pb-1"><span>3. Mutual Funds (Harvesting LTCG):</span> <strong class="font-mono">${utilsCurrency.formatINR(Math.max(0, amt - 750000))}</strong></div>
                                <div class="flex justify-between pt-1 font-bold"><span class="text-gain">Estimated Effective Tax:</span> <span class="text-gain font-mono">₹${Math.round(Math.max(0, amt - 1000000) * 0.05).toLocaleString('en-IN')} (Optimized)</span></div>
                            </div>
                        `;
                    }
                    if (window.Nirvana.Components?.Toast) {
                        window.Nirvana.Components.Toast.success('Simulated tax-optimized withdrawal sequence!', 'Withdrawal Engine');
                    }
                });
            }

            const btnNewSwp = this.container.querySelector('#btn-new-swp');
            if (btnNewSwp) {
                btnNewSwp.addEventListener('click', () => {
                    if (window.Nirvana.Components?.Toast) {
                        window.Nirvana.Components.Toast.info('You are currently in Wealth Accumulation phase. SWP can be activated during target retirement.', 'SWP Planner');
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
    window.Nirvana.Pages.Withdrawal = Withdrawal;
})();
