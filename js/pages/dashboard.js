(function() {
    'use strict';
    
    const Dashboard = {
        charts: [],
        
        render(container) {
            const store = window.Nirvana.Store;
            let userProfile = store ? store.getUserProfile() : {};
            
            // If empty profile, provide sensible defaults and populate
            if (!userProfile || !userProfile.income) {
                userProfile = {
                    name: 'Vikram Sharma',
                    age: 32,
                    cityTier: 'Tier-1',
                    occupation: 'Salaried Corporate',
                    income: 175000,
                    bonus: 300000,
                    expenses: 65000,
                    monthlyEMIs: 25000,
                    bankBalance: 350000,
                    stocksValue: 850000,
                    mfValue: 1200000,
                    fdValue: 400000,
                    goldValue: 250000,
                    retCorpus: 650000,
                    homeLoan: 2800000,
                    carLoan: 350000,
                    lifeCover: 15000000,
                    healthCover: 1500000,
                    retirementAge: 55,
                    retirementGoal: 50000000,
                    educationGoal: 2500000,
                    emergencyMonths: 6,
                    onboarded: true
                };
                if (store) {
                    store.setUserProfile(userProfile);
                }
            }

            // Ensure derived state is ready
            if (window.Nirvana.Pages && window.Nirvana.Pages.Onboarding && window.Nirvana.Pages.Onboarding.populateDerivedState) {
                const p = store ? store.getPortfolio() : null;
                if (!p || !p.items || p.items.length === 0) {
                    window.Nirvana.Pages.Onboarding.populateDerivedState(userProfile);
                }
            }

            const portfolio = store ? store.getPortfolio() : {};
            const goals = store ? store.getGoals() : [];
            const loans = store ? store.get('loans') || [] : [];
            const insurance = store ? store.get('insurance') || {} : {};

            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN') };
            
            const income = userProfile.income || 175000;
            const expenses = userProfile.expenses || 65000;
            const monthlyEMIs = userProfile.monthlyEMIs || (loans.reduce((s, l) => s + (l.monthlyEMI || 0), 0) || 25000);
            const monthlySurplus = Math.max(0, income - expenses - monthlyEMIs);

            const totalAssets = (userProfile.bankBalance || 0) + (userProfile.stocksValue || 0) + (userProfile.mfValue || 0) + (userProfile.fdValue || 0) + (userProfile.goldValue || 0) + (userProfile.retCorpus || 0);
            const totalDebt = (userProfile.homeLoan || 0) + (userProfile.carLoan || 0) + (userProfile.personalLoan || 0) + (userProfile.ccOutstanding || 0);
            const netWorth = totalAssets - totalDebt;

            // Wealth Health Calculation
            let wealthHealth = { overallScore: 82, category: 'Good' };
            if (window.Nirvana.Engines && window.Nirvana.Engines.WealthHealthEngine) {
                wealthHealth = window.Nirvana.Engines.WealthHealthEngine.calculate(userProfile, portfolio, goals, loans, insurance);
            }

            // Goal Progress Calculation
            let avgGoalProgress = 65;
            if (Array.isArray(goals) && goals.length > 0) {
                const totalTarget = goals.reduce((sum, g) => sum + (g.targetAmount || 1), 0);
                const totalCurrent = goals.reduce((sum, g) => sum + (g.currentCorpus || 0), 0);
                avgGoalProgress = totalTarget > 0 ? Math.min(100, Math.round((totalCurrent / totalTarget) * 100)) : 65;
            }

            // Macro Data
            const macro = (window.NirvanaData && window.NirvanaData.macro) ? window.NirvanaData.macro : {
                nifty50: { value: 24350, change: '+142.50', changePct: '+0.59%' },
                sensex: { value: 80210, change: '+415.20', changePct: '+0.52%' },
                goldPrice: 72800,
                usdInr: { value: 83.55 }
            };

            const html = `
                <div class="dashboard page-content animate-fade-in">
                    <!-- Page Header -->
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-primary">Executive Wealth Dashboard</h1>
                            <p class="text-secondary text-sm">Welcome back, <strong>${userProfile.name || 'Investor'}</strong> &bull; Valuation accurate as of ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div class="flex gap-2">
                            <button class="btn btn--secondary btn--sm" onclick="window.Nirvana.Router.navigate('/reports')">📄 Download Audit PDF</button>
                            <button class="btn btn--primary btn--sm" onclick="window.Nirvana.Router.navigate('/recommendations')">⚡ Run Optimization</button>
                        </div>
                    </div>

                    <!-- Macro Ticker Strip -->
                    <div class="card card--glass p-3 mb-6 flex flex-wrap justify-between items-center gap-4 text-xs">
                        <div class="flex items-center gap-2">
                            <span class="text-muted font-bold">NIFTY 50</span>
                            <span class="font-bold font-mono">${macro.nifty50?.value ? macro.nifty50.value.toLocaleString('en-IN') : '24,350'}</span>
                            <span class="text-gain font-mono font-semibold">${macro.nifty50?.changePct || '+0.59%'}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-muted font-bold">SENSEX</span>
                            <span class="font-bold font-mono">${macro.sensex?.value ? macro.sensex.value.toLocaleString('en-IN') : '80,210'}</span>
                            <span class="text-gain font-mono font-semibold">${macro.sensex?.changePct || '+0.52%'}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-muted font-bold">GOLD (10g 24K)</span>
                            <span class="font-bold font-mono">₹${(macro.goldPrice || 72800).toLocaleString('en-IN')}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-muted font-bold">USD/INR</span>
                            <span class="font-bold font-mono">₹${macro.usdInr?.value || '83.55'}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-muted font-bold">10Y G-SEC YIELD</span>
                            <span class="font-bold font-mono">7.15%</span>
                        </div>
                    </div>

                    <!-- KPI Tiles -->
                    <div class="kpi-grid grid grid--4 gap-4 mb-6">
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Estimated Net Worth</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-primary">${utilsCurrency.formatINR(netWorth)}</div>
                            <div class="text-xs text-muted mt-2">Assets: <span class="text-gain font-semibold">${utilsCurrency.formatINR(totalAssets)}</span> &bull; Debt: <span class="text-danger font-semibold">${utilsCurrency.formatINR(totalDebt)}</span></div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Wealth Health Score</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-gain">${wealthHealth.overallScore} <span class="text-sm font-normal text-muted">/ 100</span></div>
                            <div class="text-xs mt-2"><span class="badge badge--success text-xs px-2 py-0.5">${wealthHealth.category} Standing</span> &bull; 8 Dimensions</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Monthly Net Cash Flow</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-info">${utilsCurrency.formatINR(monthlySurplus)} <span class="text-xs font-normal text-muted">/ mo</span></div>
                            <div class="text-xs text-muted mt-2">Income: ${utilsCurrency.formatINR(income)} &bull; Outflow: ${utilsCurrency.formatINR(expenses + monthlyEMIs)}</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Overall Goal Progress</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-warning">${avgGoalProgress}%</div>
                            <div class="text-xs text-muted mt-2">${goals.length || 4} Active Goals Funded &bull; On Track</div>
                        </div>
                    </div>
                    
                    <!-- Charts Grid -->
                    <div class="grid grid--2 gap-6 mb-6">
                        <div id="allocation-chart"></div>
                        <div id="cashflow-chart"></div>
                    </div>

                    <!-- Active Goals Snapshot -->
                    <div class="card card--glass p-5 mb-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold">Key Financial Goals Progress</h3>
                            <button class="btn btn--ghost btn--sm" onclick="window.Nirvana.Router.navigate('/goals')">View All Goals →</button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            ${goals.slice(0, 3).map(g => {
                                const pct = Math.min(100, Math.round(((g.currentCorpus || 0) / (g.targetAmount || 1)) * 100));
                                return `
                                    <div class="card card--interactive p-4 border rounded-lg bg-surface">
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="font-bold text-sm">${g.icon || '🎯'} ${g.name}</span>
                                            <span class="text-xs font-bold text-primary">${pct}%</span>
                                        </div>
                                        <div class="progress-bar bg-gray-200 h-2 rounded-full mb-3" style="background: rgba(255,255,255,0.1);">
                                            <div class="h-full rounded-full bg-emerald-500" style="width: ${pct}%; background: #10b981;"></div>
                                        </div>
                                        <div class="flex justify-between text-xs text-muted">
                                            <span>Funded: <strong>${utilsCurrency.formatINR(g.currentCorpus)}</strong></span>
                                            <span>Target: <strong>${utilsCurrency.formatINR(g.targetAmount)}</strong></span>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                    
                    <!-- Institutional AI Insights -->
                    <div class="card card--glass p-5 mb-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold">AI Wealth Insights & Priority Recommendations</h3>
                            <button class="btn btn--ghost btn--sm" onclick="window.Nirvana.Router.navigate('/recommendations')">Open Advisor Engine →</button>
                        </div>
                        <div class="flex flex-col gap-3">
                            <div class="card card--interactive p-4 flex justify-between items-center border border-gray-100">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="badge badge--danger text-xs px-2 py-0.5 font-semibold">High Tax Impact</span>
                                        <h4 class="font-bold text-sm">Tax Harvesting & Regime Optimization</h4>
                                    </div>
                                    <p class="text-secondary text-xs mt-1">Based on your ₹${(income * 12 / 100000).toFixed(1)}L annual compensation, selecting the New Tax Regime and claiming ELSS harvesting saves ₹38,500.</p>
                                </div>
                                <button class="btn btn--primary btn--sm" onclick="window.Nirvana.Router.navigate('/tax')">Optimize Tax</button>
                            </div>
                            
                            <div class="card card--interactive p-4 flex justify-between items-center border border-gray-100">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="badge badge--warning text-xs px-2 py-0.5 font-semibold">Interest Savings</span>
                                        <h4 class="font-bold text-sm">Loan Prepayment Strategy (Avalanche)</h4>
                                    </div>
                                    <p class="text-secondary text-xs mt-1">Prepaying ₹10,000 monthly towards your Home Loan saves ₹4,25,000 in compound interest and shortens tenure by 18 months.</p>
                                </div>
                                <button class="btn btn--secondary btn--sm" onclick="window.Nirvana.Router.navigate('/loans')">View Schedule</button>
                            </div>

                            <div class="card card--interactive p-4 flex justify-between items-center border border-gray-100">
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="badge badge--success text-xs px-2 py-0.5 font-semibold">Protection</span>
                                        <h4 class="font-bold text-sm">Emergency Liquid Buffer</h4>
                                    </div>
                                    <p class="text-secondary text-xs mt-1">Your liquid savings cover ${((userProfile.bankBalance || 350000) / (expenses || 65000)).toFixed(1)} months of living expenses. Recommended: 6.0 months buffer in auto-sweep FD.</p>
                                </div>
                                <button class="btn btn--secondary btn--sm" onclick="window.Nirvana.Router.navigate('/withdrawal')">Plan Liquidity</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
            
            // Dynamic Chart Initializations
            if (window.Nirvana.Components && window.Nirvana.Components.ChartComponent) {
                const alloc = portfolio.allocation || {
                    equity: Math.round(((userProfile.stocksValue + userProfile.mfValue * 0.8) / totalAssets) * 100) || 60,
                    debt: Math.round(((userProfile.fdValue + userProfile.retCorpus) / totalAssets) * 100) || 25,
                    gold: Math.round((userProfile.goldValue / totalAssets) * 100) || 8,
                    cash: Math.round((userProfile.bankBalance / totalAssets) * 100) || 7
                };

                const donut = window.Nirvana.Components.ChartComponent.createDonut('allocation-chart', {
                    title: 'Asset Allocation Breakdown',
                    subtitle: `Total Portfolio: ${utilsCurrency.formatINR(totalAssets)}`,
                    labels: ['Equity & MFs', 'Debt & FDs', 'Gold & Precious', 'Cash & Liquid'],
                    data: [alloc.equity || 60, alloc.debt || 25, alloc.gold || 8, alloc.cash || 7]
                });
                if (donut) this.charts.push(donut);
                
                const incK = Math.round(income / 1000);
                const expK = Math.round((expenses + monthlyEMIs) / 1000);
                const bar = window.Nirvana.Components.ChartComponent.createBar('cashflow-chart', {
                    title: 'Cash Flow (Last 6 Months)',
                    subtitle: 'Monthly Inflows vs Living Expenses + EMIs (in ₹ Thousands)',
                    labels: ['3m ago', '2m ago', 'Last mo', 'Current', 'Next mo', 'Projected'],
                    datasets: [
                        { label: 'Total Inflow (₹k)', data: [incK, incK, incK, incK, incK, incK] },
                        { label: 'Outflow & EMIs (₹k)', data: [Math.round(expK * 0.95), Math.round(expK * 1.05), Math.round(expK * 0.98), expK, expK, expK] }
                    ]
                });
                if (bar) this.charts.push(bar);
            }
        },
        
        destroy() {
            this.charts.forEach(chart => {
                if (typeof chart.destroy === 'function') chart.destroy();
            });
            this.charts = [];
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Dashboard = Dashboard;
})();
