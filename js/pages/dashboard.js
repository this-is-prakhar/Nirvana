(function() {
    'use strict';
    
    const Dashboard = {
        charts: [],
        
        render(container) {
            const store = window.Nirvana.Store;
            const profile = store ? store.getUserProfile() : { name: 'User' };
            const utilsMath = window.Nirvana.Utils?.Math || {};
            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + val };
            
            const portfolio = store ? store.getPortfolio() : { totalValue: 0, change: 0 };
            
            let html = `
                <div class="dashboard page-content">
                    <div class="flex justify-between items-center mb-4">
                        <h2>Welcome back, ${profile.name || 'User'}</h2>
                        <div class="text-muted">${new Date().toLocaleDateString()}</div>
                    </div>
                    
                    <div class="market-ticker-strip mb-4 p-2 card--glass flex gap-4 text-sm">
                        <span><strong>NIFTY 50:</strong> 22,000 <span class="text-gain">+1.2%</span></span>
                        <span><strong>Sensex:</strong> 72,500 <span class="text-gain">+1.1%</span></span>
                        <span><strong>Gold:</strong> ₹6,200 <span class="text-loss">-0.5%</span></span>
                        <span><strong>USD/INR:</strong> 83.10 <span class="text-muted">0.0%</span></span>
                    </div>

                    <div class="kpi-grid grid grid--4 mb-4">
                        <div class="kpi-tile card card--elevated">
                            <div class="kpi-label">Net Worth</div>
                            <div class="kpi-value">${utilsCurrency.formatINR(portfolio.totalValue || 0)}</div>
                            <div class="kpi-trend kpi-trend--up">+5% this month</div>
                        </div>
                        <div class="kpi-tile card card--elevated">
                            <div class="kpi-label">Wealth Health Score</div>
                            <div class="kpi-value text-primary">85/100</div>
                            <div class="kpi-trend kpi-trend--up">Excellent</div>
                        </div>
                        <div class="kpi-tile card card--elevated">
                            <div class="kpi-label">Monthly Cash Flow</div>
                            <div class="kpi-value">${utilsCurrency.formatINR(50000)}</div>
                            <div class="kpi-trend kpi-trend--up">Positive</div>
                        </div>
                        <div class="kpi-tile card card--elevated">
                            <div class="kpi-label">Goal Progress</div>
                            <div class="kpi-value">62%</div>
                            <div class="kpi-trend kpi-trend--up">On Track</div>
                        </div>
                    </div>
                    
                    <div class="grid grid--2 gap-4 mb-4">
                        <div id="allocation-chart"></div>
                        <div id="cashflow-chart"></div>
                    </div>
                    
                    <div class="card mb-4">
                        <h3>AI Insights & Recommendations</h3>
                        <div class="mt-4 flex flex-col gap-2">
                            <div class="card card--interactive p-4 flex justify-between items-center">
                                <div>
                                    <h4>Tax Optimization</h4>
                                    <p class="text-muted text-sm">You can save ₹15,000 by investing in ELSS before financial year end.</p>
                                </div>
                                <button class="btn btn--primary btn--sm" onclick="window.Nirvana.Router.navigate('/recommendations')">View Details</button>
                            </div>
                            <div class="card card--interactive p-4 flex justify-between items-center">
                                <div>
                                    <h4>Emergency Fund Alert</h4>
                                    <p class="text-muted text-sm">Your emergency fund covers 4 months of expenses. Recommended: 6 months.</p>
                                </div>
                                <button class="btn btn--secondary btn--sm" onclick="window.Nirvana.Router.navigate('/goals')">Update Goal</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.innerHTML = html;
            
            // Chart initialization using ChartComponent
            if (window.Nirvana.Components && window.Nirvana.Components.ChartComponent) {
                const donut = window.Nirvana.Components.ChartComponent.createDonut('allocation-chart', {
                    title: 'Asset Allocation',
                    subtitle: 'Current Portfolio Breakdown',
                    labels: ['Equity', 'Debt', 'Gold', 'Cash'],
                    data: [60, 25, 10, 5]
                });
                if (donut) this.charts.push(donut);
                
                const bar = window.Nirvana.Components.ChartComponent.createBar('cashflow-chart', {
                    title: 'Cash Flow (Last 6 Months)',
                    subtitle: 'Monthly Income vs Expenses (in ₹ Thousands)',
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [
                        { label: 'Income', data: [100, 100, 100, 110, 110, 110] },
                        { label: 'Expenses', data: [60, 75, 55, 65, 80, 50] }
                    ]
                });
                if (bar) this.charts.push(bar);
            } else {
                document.getElementById('allocation-chart').innerHTML = '<div class="empty-state">Chart Placeholder</div>';
                document.getElementById('cashflow-chart').innerHTML = '<div class="empty-state">Chart Placeholder</div>';
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
