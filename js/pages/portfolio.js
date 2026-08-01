(function() {
    'use strict';
    
    const Portfolio = {
        charts: [],
        
        render(container) {
            const store = window.Nirvana.Store;
            const portfolio = store ? store.getPortfolio() : { items: [] };
            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + val, formatPercentage: val => val + '%' };
            
            const totalValue = portfolio.items ? portfolio.items.reduce((acc, item) => acc + (item.currentValue || 0), 0) : 1500000;
            const totalInvested = portfolio.items ? portfolio.items.reduce((acc, item) => acc + (item.invested || 0), 0) : 1200000;
            const returns = totalValue - totalInvested;
            const returnsPct = totalInvested > 0 ? (returns / totalInvested) * 100 : 25;
            
            const html = `
                <div class="portfolio page-content">
                    <div class="flex justify-between items-center mb-4">
                        <h2>My Portfolio</h2>
                        <button class="btn btn--primary" onclick="alert('Add Asset modal')">+ Add Asset</button>
                    </div>

                    <div class="kpi-grid grid grid--4 mb-4">
                        <div class="kpi-tile card card--elevated">
                            <div class="kpi-label">Total Value</div>
                            <div class="kpi-value">${utilsCurrency.formatINR(totalValue)}</div>
                        </div>
                        <div class="kpi-tile card card--elevated">
                            <div class="kpi-label">Total Invested</div>
                            <div class="kpi-value">${utilsCurrency.formatINR(totalInvested)}</div>
                        </div>
                        <div class="kpi-tile card card--elevated">
                            <div class="kpi-label">Overall Returns</div>
                            <div class="kpi-value text-gain">${utilsCurrency.formatINR(returns)} (${utilsCurrency.formatPercentage(returnsPct)})</div>
                        </div>
                        <div class="kpi-tile card card--elevated">
                            <div class="kpi-label">XIRR</div>
                            <div class="kpi-value text-gain">14.5%</div>
                        </div>
                    </div>
                    
                    <div class="grid grid--3 gap-4 mb-4">
                        <div class="card chart-card" style="grid-column: span 1;">
                            <h3>Asset Allocation</h3>
                            <div id="portfolio-allocation-chart" class="chart-container" style="height:250px;"></div>
                        </div>
                        <div class="card" style="grid-column: span 2;">
                            <h3>Holdings</h3>
                            <div class="table-responsive mt-4">
                                <table class="data-table data-table--striped w-full">
                                    <thead>
                                        <tr>
                                            <th>Asset</th>
                                            <th>Type</th>
                                            <th>Invested</th>
                                            <th>Current Value</th>
                                            <th>Returns</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>HDFC Bank</td>
                                            <td>Equity</td>
                                            <td>₹1,00,000</td>
                                            <td>₹1,15,000</td>
                                            <td class="text-gain">+15%</td>
                                        </tr>
                                        <tr>
                                            <td>Parag Parikh Flexi Cap</td>
                                            <td>Mutual Fund</td>
                                            <td>₹2,50,000</td>
                                            <td>₹3,20,000</td>
                                            <td class="text-gain">+28%</td>
                                        </tr>
                                        <tr>
                                            <td>SGB 2023-24</td>
                                            <td>Gold</td>
                                            <td>₹50,000</td>
                                            <td>₹58,000</td>
                                            <td class="text-gain">+16%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
            
            if (window.Nirvana.Components && window.Nirvana.Components.ChartComponent) {
                const donut = window.Nirvana.Components.ChartComponent.createDonut('portfolio-allocation-chart', {
                    labels: ['Equity', 'Mutual Funds', 'Gold', 'Fixed Income'],
                    data: [30, 45, 10, 15]
                });
                if (donut) this.charts.push(donut);
            } else {
                document.getElementById('portfolio-allocation-chart').innerHTML = '<div class="empty-state">Chart Placeholder</div>';
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
