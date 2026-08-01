(function() {
    'use strict';
    
    const Withdrawal = {
        charts: [],
        container: null,
        
        render(container) {
            this.container = container;
            this.setupUI();
            this.renderContent();
        },
        
        setupUI() {
            this.container.innerHTML = `
                <div class="page-content animate-fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <h1 class="text-primary text-2xl font-bold">Withdrawal & SWP Planner</h1>
                        <button class="btn btn--primary px-4 py-2 bg-blue-600 text-white rounded">
                            <span class="btn--icon">+</span> New Withdrawal Request
                        </button>
                    </div>
                    
                    <div class="kpi-grid grid grid--4 gap-4 mb-6" id="withdrawal-kpis"></div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div class="col-span-2 card card--elevated p-6 border rounded-lg shadow-sm">
                            <h2 class="text-xl font-bold mb-4">Dream Purchase Simulator</h2>
                            <p class="text-sm text-muted mb-4">Simulate the impact of a large withdrawal (e.g., Car, House) on your overall portfolio and tax liability.</p>
                            
                            <div class="flex gap-4 mb-6">
                                <div class="form-group flex-1">
                                    <label class="form-label text-sm font-semibold">Purchase Amount (₹)</label>
                                    <input type="number" class="form-input border p-2 w-full rounded mt-1" value="1500000" id="sim-amount">
                                </div>
                                <div class="form-group flex-1">
                                    <label class="form-label text-sm font-semibold">Target Date</label>
                                    <input type="month" class="form-input border p-2 w-full rounded mt-1" id="sim-date">
                                </div>
                                <div class="flex items-end">
                                    <button class="btn btn--secondary bg-gray-800 text-white px-4 py-2 rounded" id="btn-simulate">Simulate</button>
                                </div>
                            </div>
                            
                            <div id="sim-results" class="hidden bg-gray-50 p-4 rounded-lg border">
                                <h3 class="font-bold text-lg mb-2 border-b pb-2">Simulation Results</h3>
                                <div class="grid grid-cols-2 gap-4 text-sm mt-3">
                                    <div>
                                        <div class="text-muted">Recommended Sourcing</div>
                                        <div class="font-semibold text-primary">₹5L Cash → ₹7L Debt → ₹3L Equity</div>
                                    </div>
                                    <div>
                                        <div class="text-muted">Est. Tax Impact</div>
                                        <div class="font-semibold text-danger">₹25,000 (LTCG Exceeded)</div>
                                    </div>
                                    <div>
                                        <div class="text-muted">Impact on Retirement</div>
                                        <div class="font-semibold text-warning">Delayed by 1.5 Years</div>
                                    </div>
                                    <div>
                                        <div class="text-muted">Post-Purchase Wealth Score</div>
                                        <div class="font-semibold text-gain">78 / 100 (Safe)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-span-1 card card--elevated p-6 border rounded-lg shadow-sm">
                            <h2 class="text-xl font-bold mb-4">Bucket Strategy</h2>
                            <div class="space-y-4">
                                <div>
                                    <div class="flex justify-between text-sm mb-1">
                                        <span class="font-semibold">Bucket 1 (Cash/Liquid)</span>
                                        <span class="text-muted">0-3 yrs</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                                        <div class="bg-blue-600 h-2.5 rounded-full" style="width: 15%"></div>
                                    </div>
                                    <div class="text-xs text-right mt-1 text-muted">Current: 15% | Target: 10%</div>
                                </div>
                                <div>
                                    <div class="flex justify-between text-sm mb-1">
                                        <span class="font-semibold">Bucket 2 (Debt)</span>
                                        <span class="text-muted">3-7 yrs</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                                        <div class="bg-yellow-500 h-2.5 rounded-full" style="width: 35%"></div>
                                    </div>
                                    <div class="text-xs text-right mt-1 text-muted">Current: 35% | Target: 30%</div>
                                </div>
                                <div>
                                    <div class="flex justify-between text-sm mb-1">
                                        <span class="font-semibold">Bucket 3 (Equity)</span>
                                        <span class="text-muted">7+ yrs</span>
                                    </div>
                                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                                        <div class="bg-green-500 h-2.5 rounded-full" style="width: 50%"></div>
                                    </div>
                                    <div class="text-xs text-right mt-1 text-muted">Current: 50% | Target: 60%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card card--elevated p-6 border rounded-lg shadow-sm">
                        <h2 class="text-xl font-bold mb-4">Active SWPs (Systematic Withdrawal Plans)</h2>
                        <div class="overflow-x-auto">
                            <table class="data-table data-table--striped w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-100 border-b">
                                        <th class="p-3 font-semibold text-sm">Goal / Purpose</th>
                                        <th class="p-3 font-semibold text-sm">Monthly SWP</th>
                                        <th class="p-3 font-semibold text-sm">Source Asset</th>
                                        <th class="p-3 font-semibold text-sm">Est. Tax Impact</th>
                                        <th class="p-3 font-semibold text-sm">Status</th>
                                        <th class="p-3 font-semibold text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody id="swp-table-body">
                                    <!-- Table content -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
            
            const btnSim = this.container.querySelector('#btn-simulate');
            btnSim.addEventListener('click', () => {
                this.container.querySelector('#sim-results').classList.remove('hidden');
            });
        },
        
        formatInr(amount) {
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
        },
        
        renderContent() {
            // KPIs
            const availableLiquid = 3500000;
            const sustainableSwp = 85000; // ~4% rule on corpus
            const activeSwpCount = 2;
            const taxFreeRemaining = 125000 - 45000; // New 1.25L limit
            
            const kpisHtml = `
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase tracking-wide">Available Liquid Corpus</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-primary">${this.formatInr(availableLiquid)}</div>
                </div>
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase tracking-wide">Sustainable Monthly SWP</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-gain">${this.formatInr(sustainableSwp)}</div>
                    <div class="text-xs text-muted mt-1">Based on dynamic 4% rule</div>
                </div>
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase tracking-wide">Active SWPs</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-info">${activeSwpCount}</div>
                </div>
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase tracking-wide">Remaining Tax-Free LTCG</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-warning">${this.formatInr(taxFreeRemaining)}</div>
                    <div class="text-xs text-muted mt-1">Of ₹1.25L annual limit</div>
                </div>
            `;
            this.container.querySelector('#withdrawal-kpis').innerHTML = kpisHtml;
            
            // SWP Table
            const swps = [
                { purpose: 'Parental Support', amount: 25000, asset: 'HDFC Short Term Debt Fund', tax: 'Marginal Rate (STCG)', status: 'Active' },
                { purpose: 'Travel Fund', amount: 15000, asset: 'SBI Equity Hybrid Fund', tax: '12.5% (LTCG > 1.25L)', status: 'Active' }
            ];
            
            const tbodyHtml = swps.map(swp => `
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-3 font-medium">${swp.purpose}</td>
                    <td class="p-3 text-primary font-bold">${this.formatInr(swp.amount)}</td>
                    <td class="p-3 text-sm text-gray-700">${swp.asset}</td>
                    <td class="p-3 text-sm text-danger">${swp.tax}</td>
                    <td class="p-3"><span class="badge badge--success bg-green-100 text-green-800 px-2 py-1 rounded text-xs">${swp.status}</span></td>
                    <td class="p-3">
                        <button class="text-blue-600 hover:underline text-sm mr-2">Edit</button>
                        <button class="text-red-600 hover:underline text-sm">Pause</button>
                    </td>
                </tr>
            `).join('');
            
            this.container.querySelector('#swp-table-body').innerHTML = tbodyHtml;
        },
        
        destroy() {
            if(this.container) this.container.innerHTML = '';
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Withdrawal = Withdrawal;
})();
