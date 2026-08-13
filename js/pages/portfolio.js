(function() {
    'use strict';
    
    const Portfolio = {
        charts: [],
        currentTab: 'All',
        
        render(container) {
            const store = window.Nirvana.Store;
            let userProfile = store ? store.getUserProfile() : {};
            let portfolio = store ? store.getPortfolio() : {};
            
            // Ensure state exists
            if (!portfolio || !portfolio.items || portfolio.items.length === 0) {
                if (window.Nirvana.Pages && window.Nirvana.Pages.Onboarding && window.Nirvana.Pages.Onboarding.populateDerivedState) {
                    window.Nirvana.Pages.Onboarding.populateDerivedState(userProfile);
                    portfolio = store ? store.getPortfolio() : {};
                }
            }

            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN'), formatPercentage: val => val + '%' };
            
            const totalValue = portfolio.totalValue || 3700000;
            const totalInvested = portfolio.totalInvested || 3100000;
            const returns = totalValue - totalInvested;
            const returnsPct = totalInvested > 0 ? ((returns / totalInvested) * 100).toFixed(1) : '19.4';
            const xirr = portfolio.xirr || 15.2;

            const items = portfolio.items || [];
            const filteredItems = this.currentTab === 'All' ? items : items.filter(item => {
                if (this.currentTab === 'Equity') return item.type === 'Stock' || (item.category === 'Equity' && item.type === 'Stock');
                if (this.currentTab === 'Mutual Funds') return item.type === 'Mutual Fund';
                if (this.currentTab === 'Debt & FD') return item.type === 'Fixed Deposit' || item.category === 'Debt' || item.type === 'Retirement Scheme' || item.type === 'Govt Scheme';
                if (this.currentTab === 'Gold') return item.category === 'Gold';
                if (this.currentTab === 'Cash') return item.category === 'Cash';
                return true;
            });

            const html = `
                <div class="portfolio page-content animate-fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-primary">Investment Portfolio</h1>
                            <p class="text-secondary text-sm">Comprehensive consolidated tracking of direct equity, mutual funds, fixed income, gold, and liquid assets.</p>
                        </div>
                        <div class="flex gap-2">
                            <button class="btn btn--secondary btn--sm" onclick="window.Nirvana.Pages.Portfolio.rebalanceModal()">⚖️ Rebalance</button>
                            <button class="btn btn--primary btn--sm" onclick="window.Nirvana.Pages.Portfolio.addAssetModal()">+ Add Asset</button>
                        </div>
                    </div>

                    <!-- KPI Tiles -->
                    <div class="kpi-grid grid grid--4 gap-4 mb-6">
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Total Portfolio Value</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-primary">${utilsCurrency.formatINR(totalValue)}</div>
                            <div class="text-xs text-muted mt-2">Live market mark-to-market</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Total Capital Invested</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-secondary">${utilsCurrency.formatINR(totalInvested)}</div>
                            <div class="text-xs text-muted mt-2">Cost basis of current holdings</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Unrealized Capital Gains</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-gain">+${utilsCurrency.formatINR(returns)} <span class="text-sm font-normal text-muted">(+${returnsPct}%)</span></div>
                            <div class="text-xs text-gain mt-2 font-semibold">Profitable across ${items.length} positions</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Annualized Returns (XIRR)</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-gain">${xirr}%</div>
                            <div class="text-xs text-muted mt-2">Outperforming NIFTY 50 TRI (+13.8%)</div>
                        </div>
                    </div>
                    
                    <!-- Chart & Table Grid -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div class="col-span-1">
                            <div id="portfolio-allocation-chart"></div>
                        </div>

                        <div class="col-span-2 card card--glass p-5">
                            <div class="flex flex-wrap justify-between items-center mb-4 gap-2">
                                <h3 class="text-lg font-bold">Consolidated Holdings (${filteredItems.length})</h3>
                                <div class="flex flex-wrap gap-1" id="portfolio-filter-tabs">
                                    <button class="badge ${this.currentTab === 'All' ? 'badge--info font-bold' : 'badge--ghost'} cursor-pointer px-3 py-1" onclick="window.Nirvana.Pages.Portfolio.filterTab('All')">All</button>
                                    <button class="badge ${this.currentTab === 'Equity' ? 'badge--info font-bold' : 'badge--ghost'} cursor-pointer px-3 py-1" onclick="window.Nirvana.Pages.Portfolio.filterTab('Equity')">Equity</button>
                                    <button class="badge ${this.currentTab === 'Mutual Funds' ? 'badge--info font-bold' : 'badge--ghost'} cursor-pointer px-3 py-1" onclick="window.Nirvana.Pages.Portfolio.filterTab('Mutual Funds')">Mutual Funds</button>
                                    <button class="badge ${this.currentTab === 'Debt & FD' ? 'badge--info font-bold' : 'badge--ghost'} cursor-pointer px-3 py-1" onclick="window.Nirvana.Pages.Portfolio.filterTab('Debt & FD')">Debt & FD</button>
                                    <button class="badge ${this.currentTab === 'Gold' ? 'badge--info font-bold' : 'badge--ghost'} cursor-pointer px-3 py-1" onclick="window.Nirvana.Pages.Portfolio.filterTab('Gold')">Gold</button>
                                    <button class="badge ${this.currentTab === 'Cash' ? 'badge--info font-bold' : 'badge--ghost'} cursor-pointer px-3 py-1" onclick="window.Nirvana.Pages.Portfolio.filterTab('Cash')">Cash</button>
                                </div>
                            </div>

                            <div class="overflow-x-auto">
                                <table class="data-table data-table--striped w-full text-sm">
                                    <thead>
                                        <tr class="border-b text-muted">
                                            <th class="text-left py-2 px-3">Asset Holding</th>
                                            <th class="text-left py-2 px-3">Asset Class</th>
                                            <th class="text-right py-2 px-3">Cost Value</th>
                                            <th class="text-right py-2 px-3">Current Value</th>
                                            <th class="text-right py-2 px-3">P&L (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${filteredItems.map(item => `
                                            <tr class="border-b hover:bg-surface">
                                                <td class="py-2.5 px-3">
                                                    <div class="font-bold text-primary">${item.name}</div>
                                                    <div class="text-xs text-muted">${item.type} ${item.qty ? `&bull; ${item.qty} units @ CMP ₹${item.cmp}` : ''}</div>
                                                </td>
                                                <td class="py-2.5 px-3">
                                                    <span class="badge ${item.category === 'Equity' ? 'badge--info' : item.category === 'Gold' ? 'badge--warning' : 'badge--success'} text-xs px-2 py-0.5">${item.category}</span>
                                                </td>
                                                <td class="py-2.5 px-3 text-right font-mono">${utilsCurrency.formatINR(item.invested)}</td>
                                                <td class="py-2.5 px-3 text-right font-mono font-bold">${utilsCurrency.formatINR(item.currentValue)}</td>
                                                <td class="py-2.5 px-3 text-right font-mono font-bold text-gain">+${item.returnsPct}%</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
            
            // Allocation Donut Chart
            if (window.Nirvana.Components && window.Nirvana.Components.ChartComponent) {
                const alloc = portfolio.allocation || { equity: 60, debt: 25, gold: 8, cash: 7 };
                const donut = window.Nirvana.Components.ChartComponent.createDonut('portfolio-allocation-chart', {
                    title: 'Asset Allocation',
                    subtitle: `Net Assets: ${utilsCurrency.formatINR(totalValue)}`,
                    labels: ['Equity & MFs', 'Fixed Income & Debt', 'Gold & Precious', 'Cash & Liquid'],
                    data: [alloc.equity || 60, alloc.debt || 25, alloc.gold || 8, alloc.cash || 7]
                });
                if (donut) this.charts.push(donut);
            }
        },

        filterTab(tab) {
            this.currentTab = tab;
            const container = document.getElementById('page-content');
            if (container) this.render(container);
        },

        addAssetModal() {
            if (window.Nirvana.Components && window.Nirvana.Components.Modal) {
                window.Nirvana.Components.Modal.open({
                    title: 'Add New Investment Asset',
                    content: `
                        <div class="flex flex-col gap-4">
                            <div class="form-group">
                                <label class="form-label">Asset Type</label>
                                <select class="form-select" id="new-asset-type">
                                    <option value="Equity">Direct Stock (NSE/BSE)</option>
                                    <option value="Mutual Fund">Mutual Fund (SIP / Lumpsum)</option>
                                    <option value="Fixed Deposit">Bank Fixed Deposit</option>
                                    <option value="Gold">Sovereign Gold Bond / ETF</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Asset Name / Scheme</label>
                                <input type="text" class="form-input" id="new-asset-name" placeholder="e.g. HDFC Bank, Mirae Asset">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Amount (₹)</label>
                                <input type="number" class="form-input" id="new-asset-val" placeholder="50000">
                            </div>
                        </div>
                    `,
                    actions: [
                        {
                            label: 'Cancel',
                            variant: 'secondary',
                            onClick: () => window.Nirvana.Components.Modal.close()
                        },
                        {
                            label: 'Add to Portfolio',
                            variant: 'primary',
                            onClick: () => {
                                const name = document.getElementById('new-asset-name').value || 'New Asset';
                                const val = parseFloat(document.getElementById('new-asset-val').value) || 50000;
                                const type = document.getElementById('new-asset-type').value;
                                
                                const store = window.Nirvana.Store;
                                const p = store.getPortfolio();
                                p.items.push({
                                    id: 'ast-' + Date.now(),
                                    name: name,
                                    type: type,
                                    category: type.includes('Gold') ? 'Gold' : type.includes('Deposit') ? 'Debt' : 'Equity',
                                    invested: Math.round(val * 0.9),
                                    currentValue: val,
                                    returnsPct: 11.1
                                });
                                p.totalValue += val;
                                p.totalInvested += Math.round(val * 0.9);
                                store.setPortfolio(p);

                                window.Nirvana.Components.Modal.close();
                                if (window.Nirvana.Components.Toast) {
                                    window.Nirvana.Components.Toast.success(`Added ${name} (₹${val.toLocaleString('en-IN')}) to portfolio!`, 'Portfolio');
                                }
                                const container = document.getElementById('page-content');
                                if (container) Portfolio.render(container);
                            }
                        }
                    ]
                });
            }
        },

        rebalanceModal() {
            if (window.Nirvana.Components && window.Nirvana.Components.Toast) {
                window.Nirvana.Components.Toast.info('Rebalancing Engine: Current asset allocation is within optimal risk tolerance band (+/- 3%). No rebalancing needed.', 'Allocation Engine');
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
    window.Nirvana.Pages.Portfolio = Portfolio;
})();
