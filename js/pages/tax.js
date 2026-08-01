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
            return `
                <div class="page-content animate-fade-in">
                    <div class="flex items-center justify-between mb-4">
                        <h1 class="text-2xl font-bold">Tax Optimization & Harvesting</h1>
                        <button class="btn btn--primary" id="btn-compare-regimes">Compare Tax Regimes</button>
                    </div>
                    
                    <div class="kpi-grid grid grid--4 mb-4 gap-4">
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-sm text-muted">Estimated Taxable Income</div>
                            <div class="kpi-value text-xl font-bold text-primary mt-1">₹18,50,000</div>
                        </div>
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-sm text-muted">Total Estimated Tax</div>
                            <div class="kpi-value text-xl font-bold text-danger mt-1">₹2,85,000</div>
                        </div>
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-sm text-muted">Recommended Regime</div>
                            <div class="kpi-value text-xl font-bold text-gain mt-1">New Regime</div>
                        </div>
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-sm text-muted">Tax Savings Opportunity</div>
                            <div class="kpi-value text-xl font-bold text-success mt-1">₹42,500</div>
                        </div>
                    </div>

                    <div class="grid grid--2 gap-4 mb-6">
                        <div class="card card--glass p-5">
                            <h3 class="text-xl font-bold mb-4">Old Tax Regime</h3>
                            <div class="flex justify-between border-b pb-2 mb-3"><span class="text-muted">Gross Income</span><span class="font-bold">₹20,00,000</span></div>
                            <div class="flex justify-between border-b pb-2 mb-3"><span class="text-muted">Deductions Allowed</span><span class="font-bold">₹1,50,000 (80C) + ₹50,000 (80D)</span></div>
                            <div class="flex justify-between border-b pb-2 mb-3"><span class="text-muted">Taxable Income</span><span class="font-bold">₹18,00,000</span></div>
                            <div class="flex justify-between pt-1"><span class="text-muted">Net Tax Payable</span><span class="text-danger font-bold text-lg">₹3,51,000</span></div>
                        </div>
                        <div class="card card--glass p-5 border-2 border-green-500 relative">
                            <div class="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-md">RECOMMENDED</div>
                            <h3 class="text-xl font-bold mb-4">New Tax Regime</h3>
                            <div class="flex justify-between border-b pb-2 mb-3"><span class="text-muted">Gross Income</span><span class="font-bold">₹20,00,000</span></div>
                            <div class="flex justify-between border-b pb-2 mb-3"><span class="text-muted">Standard Deduction</span><span class="font-bold">₹50,000</span></div>
                            <div class="flex justify-between border-b pb-2 mb-3"><span class="text-muted">Taxable Income</span><span class="font-bold">₹19,50,000</span></div>
                            <div class="flex justify-between pt-1"><span class="text-muted">Net Tax Payable</span><span class="text-success font-bold text-lg">₹3,08,500</span></div>
                        </div>
                    </div>

                    <div class="card card--glass mb-6 p-5">
                        <h3 class="text-lg font-bold mb-4">Deduction Utilization Progress</h3>
                        <div class="mb-4">
                            <div class="flex justify-between text-sm mb-1 font-semibold">
                                <span>Section 80C (PPF/EPF/ELSS/Life Ins)</span>
                                <span>₹1,00,000 / ₹1,50,000</span>
                            </div>
                            <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                                <div class="bg-blue-600 h-full" style="width: 66%;"></div>
                            </div>
                        </div>
                        <div class="mb-4">
                            <div class="flex justify-between text-sm mb-1 font-semibold">
                                <span>Section 80D (Health Insurance)</span>
                                <span>₹25,000 / ₹25,000</span>
                            </div>
                            <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                                <div class="bg-green-500 h-full" style="width: 100%;"></div>
                            </div>
                        </div>
                        <div class="mb-4">
                            <div class="flex justify-between text-sm mb-1 font-semibold">
                                <span>Section 24(b) (Home Loan Interest)</span>
                                <span>₹50,000 / ₹2,00,000</span>
                            </div>
                            <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                                <div class="bg-blue-600 h-full" style="width: 25%;"></div>
                            </div>
                        </div>
                        <div class="mb-2">
                            <div class="flex justify-between text-sm mb-1 font-semibold">
                                <span>Section 80CCD(1B) (NPS)</span>
                                <span>₹0 / ₹50,000</span>
                            </div>
                            <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                                <div class="bg-red-500 h-full" style="width: 0%;"></div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid--2 gap-4">
                        <div class="card card--glass p-5">
                            <h3 class="text-lg font-bold mb-4">Tax Harvesting Scanner</h3>
                            <div class="bg-blue-50 text-blue-800 p-3 rounded-md mb-4 text-sm border border-blue-200">
                                <strong>Opportunity:</strong> Harvest ₹1,00,000 unrealized LTCG tax-free before March 31.
                            </div>
                            <table class="data-table data-table--striped w-full text-sm">
                                <thead>
                                    <tr class="border-b">
                                        <th class="text-left py-2">Asset</th>
                                        <th class="text-right py-2">Unrealized LTCG</th>
                                        <th class="text-right py-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b">
                                        <td class="py-2">Nippon India Small Cap</td>
                                        <td class="text-right text-success font-semibold py-2">₹45,000</td>
                                        <td class="text-right py-2"><button class="btn btn--sm btn--primary text-xs px-2 py-1">Harvest</button></td>
                                    </tr>
                                    <tr>
                                        <td class="py-2">HDFC Bank Equity</td>
                                        <td class="text-right text-success font-semibold py-2">₹60,000</td>
                                        <td class="text-right py-2"><button class="btn btn--sm btn--primary text-xs px-2 py-1">Harvest</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="card card--glass p-5">
                            <h3 class="text-lg font-bold mb-4">Actionable Recommendations</h3>
                            <ul class="space-y-3">
                                <li class="flex justify-between items-center p-3 border border-gray-200 rounded-md bg-gray-50">
                                    <div>
                                        <div class="font-bold text-sm">Invest ₹50,000 in NPS</div>
                                        <div class="text-xs text-muted mt-1">Save up to ₹15,600 in tax under 80CCD(1B)</div>
                                    </div>
                                    <button class="btn btn--sm btn--primary text-xs px-3 py-1">Invest Now</button>
                                </li>
                                <li class="flex justify-between items-center p-3 border border-gray-200 rounded-md bg-gray-50">
                                    <div>
                                        <div class="font-bold text-sm">Max out 80C via ELSS</div>
                                        <div class="text-xs text-muted mt-1">Invest remaining ₹50,000 for maximum benefit</div>
                                    </div>
                                    <button class="btn btn--sm btn--secondary text-xs px-3 py-1 bg-white border border-gray-300">Explore ELSS</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        },
        
        bindEvents(container) {
            const btn = container.querySelector('#btn-compare-regimes');
            if (btn) {
                btn.addEventListener('click', () => {
                    alert('Running detailed tax optimization engine...');
                });
            }
        },
        
        renderCharts(container) {
            // Chart implementation placeholder
        },
        
        destroy() {
            this.charts.forEach(c => {
                if (c && typeof c.destroy === 'function') c.destroy();
            });
            this.charts = [];
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Tax = Tax;
})();
