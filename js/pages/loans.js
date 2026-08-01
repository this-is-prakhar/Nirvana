(function() {
    'use strict';
    
    const Loans = {
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
                        <h1 class="text-primary text-2xl font-bold">Debt & Repayment Optimization</h1>
                        <button class="btn btn--primary px-4 py-2 bg-blue-600 text-white rounded">
                            <span class="btn--icon">+</span> Add Loan
                        </button>
                    </div>
                    
                    <div class="kpi-grid grid grid--4 gap-4 mb-6" id="loans-kpis"></div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div class="card card--elevated p-6 border rounded-lg shadow-sm bg-white">
                            <h2 class="text-xl font-bold mb-4">Active Loans Breakdown</h2>
                            <div class="space-y-6" id="active-loans-list">
                                <!-- Loans will be inserted here -->
                            </div>
                        </div>
                        
                        <div class="card card--elevated p-6 border rounded-lg shadow-sm bg-white">
                            <h2 class="text-xl font-bold mb-4">Repayment Strategy Optimizer</h2>
                            <p class="text-sm text-muted mb-4">Compare strategies to become debt-free faster and save on interest.</p>
                            
                            <div class="flex gap-2 mb-6 border-b pb-4">
                                <button class="btn btn--secondary flex-1 bg-gray-800 text-white rounded py-2 text-sm font-semibold">Avalanche Method<br><span class="text-xs font-normal opacity-80">(Highest Interest First)</span></button>
                                <button class="btn btn--ghost flex-1 border rounded py-2 text-sm font-semibold hover:bg-gray-50">Snowball Method<br><span class="text-xs font-normal text-muted">(Smallest Balance First)</span></button>
                            </div>
                            
                            <div class="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                                <div class="text-center">
                                    <div class="text-sm text-gray-700 font-medium">Interest Saved under Avalanche</div>
                                    <div class="text-3xl font-bold text-gain mt-1">₹4,25,000</div>
                                    <div class="text-sm text-gray-700 mt-1">Debt-free <span class="font-bold text-primary">14 months</span> earlier</div>
                                </div>
                            </div>
                            
                            <div class="border-t pt-4">
                                <h3 class="font-semibold mb-3">Prepayment Calculator</h3>
                                <div class="flex items-center gap-4">
                                    <div class="flex-1">
                                        <label class="text-xs text-muted block mb-1">Extra Monthly Payment (₹)</label>
                                        <input type="number" class="form-input border p-2 w-full rounded" value="10000">
                                    </div>
                                    <button class="btn btn--primary mt-5 px-4 py-2 bg-blue-600 text-white rounded">Calculate</button>
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
            const totalDebt = 6500000;
            const totalEmi = 85000;
            const avgInterest = 8.6;
            const debtFreeDate = 'Oct 2034';
            
            const kpisHtml = `
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase">Total Debt Balance</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-danger">${this.formatInr(totalDebt)}</div>
                </div>
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase">Total Monthly EMI</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-primary">${this.formatInr(totalEmi)}</div>
                </div>
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase">Avg Interest Rate</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-warning">${avgInterest}%</div>
                </div>
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase">Est. Debt-Free Date</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-success text-gain">${debtFreeDate}</div>
                </div>
            `;
            this.container.querySelector('#loans-kpis').innerHTML = kpisHtml;
            
            // Loans list
            const loans = [
                { name: 'SBI Home Loan', type: 'Home Loan', principal: 5000000, total: 6000000, rate: 8.5, emi: 55000, tenureLeft: '12 Years' },
                { name: 'HDFC Car Loan', type: 'Car Loan', principal: 800000, total: 1000000, rate: 9.2, emi: 18000, tenureLeft: '4 Years' },
                { name: 'ICICI Personal Loan', type: 'Personal Loan', principal: 700000, total: 800000, rate: 11.5, emi: 12000, tenureLeft: '3 Years' }
            ];
            
            const listHtml = loans.map(loan => {
                const percent = Math.round((1 - (loan.principal / loan.total)) * 100);
                return `
                <div class="border p-4 rounded-lg bg-gray-50 hover:bg-white transition-colors">
                    <div class="flex justify-between items-center mb-2">
                        <div class="font-bold text-lg text-primary">${loan.name}</div>
                        <span class="text-sm font-semibold bg-gray-200 px-2 py-1 rounded">${loan.rate}%</span>
                    </div>
                    
                    <div class="flex justify-between text-sm mb-3">
                        <span class="text-muted">EMI: <span class="font-semibold text-gray-800">${this.formatInr(loan.emi)}</span></span>
                        <span class="text-muted">Left: <span class="font-semibold text-gray-800">${loan.tenureLeft}</span></span>
                    </div>
                    
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div class="bg-blue-600 h-2 rounded-full" style="width: ${percent}%"></div>
                    </div>
                    <div class="flex justify-between text-xs text-muted">
                        <span>Paid: ${percent}%</span>
                        <span>Outstanding: ${this.formatInr(loan.principal)}</span>
                    </div>
                </div>
            `}).join('');
            
            this.container.querySelector('#active-loans-list').innerHTML = listHtml;
        },
        
        destroy() {
            if(this.container) this.container.innerHTML = '';
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Loans = Loans;
})();
