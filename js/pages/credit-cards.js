(function() {
    'use strict';
    
    const CreditCards = {
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
                        <h1 class="text-primary text-2xl font-bold">Credit Card Optimization Engine</h1>
                        <button class="btn btn--primary px-4 py-2 bg-blue-600 text-white rounded">
                            <span class="btn--icon">✨</span> Optimize My Cards
                        </button>
                    </div>
                    
                    <div class="kpi-grid grid grid--4 gap-4 mb-6" id="cc-kpis"></div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div class="col-span-1 card card--elevated p-6 border rounded-lg shadow-sm bg-white">
                            <h2 class="text-xl font-bold mb-4">Your Spending Profile</h2>
                            <p class="text-sm text-muted mb-4">Adjust your monthly spending to see personalized card recommendations.</p>
                            
                            <form id="spend-profile-form" class="space-y-4">
                                <div class="form-group flex justify-between items-center">
                                    <label class="text-sm font-semibold w-1/2">Dining & Delivery</label>
                                    <input type="number" class="form-input border p-2 rounded w-1/2 text-right" value="15000">
                                </div>
                                <div class="form-group flex justify-between items-center">
                                    <label class="text-sm font-semibold w-1/2">Travel & Flights</label>
                                    <input type="number" class="form-input border p-2 rounded w-1/2 text-right" value="20000">
                                </div>
                                <div class="form-group flex justify-between items-center">
                                    <label class="text-sm font-semibold w-1/2">Online Shopping</label>
                                    <input type="number" class="form-input border p-2 rounded w-1/2 text-right" value="25000">
                                </div>
                                <div class="form-group flex justify-between items-center">
                                    <label class="text-sm font-semibold w-1/2">Groceries</label>
                                    <input type="number" class="form-input border p-2 rounded w-1/2 text-right" value="12000">
                                </div>
                                <div class="form-group flex justify-between items-center">
                                    <label class="text-sm font-semibold w-1/2">Fuel</label>
                                    <input type="number" class="form-input border p-2 rounded w-1/2 text-right" value="8000">
                                </div>
                                <div class="form-group flex justify-between items-center">
                                    <label class="text-sm font-semibold w-1/2">International</label>
                                    <input type="number" class="form-input border p-2 rounded w-1/2 text-right" value="5000">
                                </div>
                                <button type="button" class="btn w-full mt-4 bg-gray-800 text-white p-2 rounded">Recalculate Benefits</button>
                            </form>
                        </div>
                        
                        <div class="col-span-2 space-y-6">
                            <div class="card card--elevated p-6 border rounded-lg shadow-sm bg-white">
                                <h2 class="text-xl font-bold mb-4">Top Recommendations For You</h2>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="cc-recommendations">
                                    <!-- Recommended cards -->
                                </div>
                            </div>
                            
                            <div class="card card--elevated p-6 border rounded-lg shadow-sm bg-white">
                                <h2 class="text-xl font-bold mb-4">Best Cards by Category</h2>
                                <div class="overflow-x-auto">
                                    <table class="w-full text-left border-collapse">
                                        <thead>
                                            <tr class="bg-gray-100 border-b">
                                                <th class="p-2 font-semibold text-sm">Category</th>
                                                <th class="p-2 font-semibold text-sm">Top Card</th>
                                                <th class="p-2 font-semibold text-sm">Reward Rate</th>
                                                <th class="p-2 font-semibold text-sm">Est. Annual Value</th>
                                            </tr>
                                        </thead>
                                        <tbody id="cc-category-table">
                                            <!-- Table body -->
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        formatInr(amount) {
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
        },
        
        renderContent() {
            // KPIs
            const totalAnnualValue = 85400;
            const avgCashback = 3.8;
            const loungeCount = 12;
            const recommendedNew = 2;
            
            const kpisHtml = `
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase">Total Annual Reward Value</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-gain">${this.formatInr(totalAnnualValue)}</div>
                </div>
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase">Average Reward Rate</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-primary">${avgCashback}%</div>
                </div>
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase">Free Lounge Visits (Yearly)</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-info">${loungeCount}</div>
                </div>
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase">New Cards Recommended</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-warning">${recommendedNew}</div>
                </div>
            `;
            this.container.querySelector('#cc-kpis').innerHTML = kpisHtml;
            
            // Recommendations
            const recs = [
                { name: 'HDFC Infinia', type: 'Premium Super-Premium', fee: '10,000', value: 45000, why: 'Best for your high travel and dining spends. 33% reward rate via SmartBuy.', image: '💳' },
                { name: 'SBI Cashback', type: 'Pure Cashback', fee: '999', value: 18000, why: 'Flat 5% cashback on all your online shopping without merchant restrictions.', image: '💳' }
            ];
            
            const recsHtml = recs.map(card => `
                <div class="border rounded-lg p-4 hover:shadow-md transition bg-gray-50 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-start mb-2">
                            <div class="font-bold text-lg flex items-center gap-2"><span>${card.image}</span> ${card.name}</div>
                            <span class="badge badge--success bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Net: +${this.formatInr(card.value)}/yr</span>
                        </div>
                        <div class="text-xs text-muted mb-3">Fee: ₹${card.fee} (Waiver applicable)</div>
                        <p class="text-sm text-gray-700 mb-4"><strong>Why get it:</strong> ${card.why}</p>
                    </div>
                    <button class="btn btn--sm btn--primary w-full bg-blue-600 text-white rounded py-2 text-sm">View Details & Apply</button>
                </div>
            `).join('');
            this.container.querySelector('#cc-recommendations').innerHTML = recsHtml;
            
            // Category Table
            const categories = [
                { cat: 'Online Shopping', card: 'SBI Cashback Card', rate: '5.0%', val: 15000 },
                { cat: 'Travel & Flights', card: 'Axis Atlas / HDFC Infinia', rate: '10.0%+', val: 24000 },
                { cat: 'Dining', card: 'HDFC Swiggy / EazyDiner', rate: '10.0%', val: 18000 },
                { cat: 'Fuel', card: 'BPCL SBI Card Octane', rate: '6.25%', val: 6000 }
            ];
            
            const catHtml = categories.map(c => `
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-2 font-medium">${c.cat}</td>
                    <td class="p-2 text-primary font-semibold">${c.card}</td>
                    <td class="p-2 text-gain">${c.rate}</td>
                    <td class="p-2 font-bold">${this.formatInr(c.val)}</td>
                </tr>
            `).join('');
            this.container.querySelector('#cc-category-table').innerHTML = catHtml;
        },
        
        destroy() {
            if(this.container) this.container.innerHTML = '';
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.CreditCards = CreditCards;
})();
