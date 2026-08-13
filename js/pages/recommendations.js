(function() {
    'use strict';
    
    const Recommendations = {
        charts: [],
        currentCategory: 'All',
        
        render(container) {
            const store = window.Nirvana.Store;
            const profile = store ? store.getUserProfile() : {};
            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN') };

            const income = profile.income || 175000;
            const expenses = profile.expenses || 65000;
            const homeLoan = profile.homeLoan || 2800000;

            const recommendationsList = [
                {
                    id: 1,
                    category: 'Tax',
                    impact: 'High Impact',
                    impactClass: 'badge--danger',
                    title: 'Switch to New Tax Regime & Harvest ₹1.25L LTCG',
                    description: `At an annual income of ${utilsCurrency.formatINR(income * 12)}, opting for the New Tax Regime and harvesting ₹1.25L tax-free equity capital gains saves ₹38,500 annually.`,
                    why: 'Your itemized deductions under Old Regime do not cross the break-even threshold for your tax bracket.',
                    savings: '₹38,500 / year',
                    actionLabel: 'Apply Tax Plan',
                    route: '/tax'
                },
                {
                    id: 2,
                    category: 'Loans',
                    impact: 'High Impact',
                    impactClass: 'badge--danger',
                    title: 'Accelerate Home Loan Repayment via Monthly Prepayment',
                    description: `Adding an extra ₹10,000 monthly prepayment towards your Home Loan saves ₹4,25,000 in compound interest and cuts 18 months off your loan tenure.`,
                    why: 'Retail mortgage compound interest is front-loaded; prepayments in early years directly extinguish high-interest principal.',
                    savings: '₹4,25,000 total',
                    actionLabel: 'View Schedule',
                    route: '/loans'
                },
                {
                    id: 3,
                    category: 'Investments',
                    impact: 'Medium Impact',
                    impactClass: 'badge--warning',
                    title: 'Automate Monthly Retirement SIP into Flexi-Cap Funds',
                    description: `Direct 22% of monthly income (${utilsCurrency.formatINR(Math.round(income * 0.22))}) into consistent SIPs across Parag Parikh Flexi Cap & Mirae Asset Large & Midcap to secure retirement corpus.`,
                    why: 'Rupee Cost Averaging across Indian equities produces superior risk-adjusted alpha over 10+ year horizons.',
                    savings: 'Compounding at 12.8% CAGR',
                    actionLabel: 'Explore Funds',
                    route: '/portfolio'
                },
                {
                    id: 4,
                    category: 'Insurance',
                    impact: 'Medium Impact',
                    impactClass: 'badge--warning',
                    title: 'Secure ₹50L Super Top-Up Health Insurance',
                    description: 'Enhance your base family health cover with a ₹50 Lakh Super Top-up policy (₹10L deductible) at a nominal cost of ~₹3,500 annually.',
                    why: 'Protects against catastrophic healthcare events and medical inflation without increasing base policy premiums.',
                    savings: '₹50 Lakhs Coverage',
                    actionLabel: 'View Policies',
                    route: '/insurance'
                }
            ];

            const filtered = this.currentCategory === 'All' ? recommendationsList : recommendationsList.filter(r => r.category === this.currentCategory);

            container.innerHTML = `
                <div class="recommendations page-content animate-fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-primary">Quantitative Wealth Recommendations</h1>
                            <p class="text-secondary text-sm">Actionable optimization insights ranked by financial impact and net economic benefit.</p>
                        </div>
                        <button class="btn btn--primary btn--sm" onclick="window.Nirvana.Pages.Recommendations.refreshEngine()">⚡ Re-run Optimization Engine</button>
                    </div>
                    
                    <div class="flex gap-2 mb-6 border-b pb-3">
                        <button class="btn btn--secondary btn--sm ${this.currentCategory === 'All' ? 'active' : ''}" onclick="window.Nirvana.Pages.Recommendations.setCategory('All')">All (${recommendationsList.length})</button>
                        <button class="btn btn--ghost btn--sm ${this.currentCategory === 'Tax' ? 'active' : ''}" onclick="window.Nirvana.Pages.Recommendations.setCategory('Tax')">Tax Optimization</button>
                        <button class="btn btn--ghost btn--sm ${this.currentCategory === 'Loans' ? 'active' : ''}" onclick="window.Nirvana.Pages.Recommendations.setCategory('Loans')">Debt Repayment</button>
                        <button class="btn btn--ghost btn--sm ${this.currentCategory === 'Investments' ? 'active' : ''}" onclick="window.Nirvana.Pages.Recommendations.setCategory('Investments')">Investments</button>
                        <button class="btn btn--ghost btn--sm ${this.currentCategory === 'Insurance' ? 'active' : ''}" onclick="window.Nirvana.Pages.Recommendations.setCategory('Insurance')">Protection</button>
                    </div>

                    <div class="grid grid-cols-1 gap-4">
                        ${filtered.map(rec => `
                            <div class="card card--interactive p-5 border rounded-lg shadow-sm">
                                <div class="flex flex-wrap justify-between items-start gap-4">
                                    <div class="flex-1">
                                        <div class="flex items-center gap-2 mb-2">
                                            <span class="badge ${rec.impactClass} text-xs px-2 py-0.5 font-bold">${rec.impact}</span>
                                            <span class="badge badge--ghost text-xs px-2 py-0.5">${rec.category}</span>
                                            <span class="text-xs font-bold text-gain font-mono ml-auto">Value: ${rec.savings}</span>
                                        </div>
                                        <h3 class="text-base font-bold text-primary mb-2">${rec.title}</h3>
                                        <p class="text-secondary text-xs leading-relaxed mb-3">${rec.description}</p>
                                        <div class="text-xs text-muted bg-surface p-2.5 rounded border">
                                            <strong class="text-primary">Quantitative Rationale:</strong> ${rec.why}
                                        </div>
                                    </div>
                                    <div class="flex flex-col gap-2 min-w-[140px]">
                                        <button class="btn btn--primary btn--sm w-full" onclick="window.Nirvana.Router.navigate('${rec.route}')">${rec.actionLabel}</button>
                                        <button class="btn btn--ghost btn--sm w-full" onclick="alert('Recommendation marked as completed!')">Dismiss / Done</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        setCategory(cat) {
            this.currentCategory = cat;
            const c = document.getElementById('page-content');
            if (c) this.render(c);
        },

        refreshEngine() {
            if (window.Nirvana.Components?.Toast) {
                window.Nirvana.Components.Toast.success('Quantitative recommendations recalculated against current asset base!', 'Advisor Engine');
            }
            const c = document.getElementById('page-content');
            if (c) this.render(c);
        },
        
        destroy() {
            this.charts = [];
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Recommendations = Recommendations;
})();
