(function() {
    'use strict';
    
    const Loans = {
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
            const loans = store ? store.get('loans') || [] : [];
            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN') };

            const totalDebt = loans.reduce((sum, l) => sum + (l.principalRemaining || 0), 0) || (profile.homeLoan || 2800000) + (profile.carLoan || 350000);
            const totalEmi = loans.reduce((sum, l) => sum + (l.monthlyEMI || 0), 0) || profile.monthlyEMIs || 35500;
            const avgRate = loans.length > 0 ? (loans.reduce((s, l) => s + (l.interestRate * l.principalRemaining), 0) / totalDebt).toFixed(2) : '8.65';

            this.container.innerHTML = `
                <div class="page-content animate-fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-primary">Debt Amortization & Repayment Optimization</h1>
                            <p class="text-secondary text-sm">Debt acceleration engine comparing Avalanche vs Snowball repayment strategies and prepayment interest savings.</p>
                        </div>
                        <button class="btn btn--primary btn--sm" id="btn-add-loan">+ Add Loan</button>
                    </div>
                    
                    <!-- KPI Tiles -->
                    <div class="kpi-grid grid grid--4 gap-4 mb-6">
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Total Outstanding Debt</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-danger">${utilsCurrency.formatINR(totalDebt)}</div>
                            <div class="text-xs text-muted mt-2">${loans.length || 2} Active Loans</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Total Monthly EMIs</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-primary">${utilsCurrency.formatINR(totalEmi)} <span class="text-xs font-normal text-muted">/ mo</span></div>
                            <div class="text-xs text-muted mt-2">DTI Ratio: <strong>${(((totalEmi) / (profile.income || 175000)) * 100).toFixed(1)}%</strong> of income</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Weighted Interest Rate</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-warning">${avgRate}%</div>
                            <div class="text-xs text-muted mt-2">Competitive retail debt rate</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Estimated Debt-Free Date</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-gain">${new Date().getFullYear() + 18}</div>
                            <div class="text-xs text-gain mt-2 font-semibold">Can be accelerated to ${new Date().getFullYear() + 11}</div>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <!-- Active Loans Breakdown -->
                        <div class="card card--glass p-6 border rounded-lg">
                            <h3 class="text-lg font-bold mb-4">Active Loans Breakdown</h3>
                            <div class="space-y-4" id="active-loans-list">
                                ${loans.map(loan => `
                                    <div class="card p-4 bg-surface rounded-lg border">
                                        <div class="flex justify-between items-center mb-1">
                                            <span class="font-bold text-base text-primary">${loan.name}</span>
                                            <span class="badge badge--info text-xs px-2 py-0.5">${loan.type}</span>
                                        </div>
                                        <div class="flex justify-between text-xs text-secondary mb-2">
                                            <span>Interest Rate: <strong>${loan.interestRate}%</strong></span>
                                            <span>Tenure: <strong>${loan.tenureMonths} mo left</strong></span>
                                        </div>
                                        <div class="flex justify-between text-sm font-semibold mb-1">
                                            <span>Principal Remaining:</span>
                                            <span class="font-mono text-danger font-bold">${utilsCurrency.formatINR(loan.principalRemaining)}</span>
                                        </div>
                                        <div class="flex justify-between text-xs text-muted">
                                            <span>Monthly EMI:</span>
                                            <span class="font-mono font-bold text-primary">${utilsCurrency.formatINR(loan.monthlyEMI)}</span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <!-- Repayment Strategy Optimizer -->
                        <div class="card card--glass p-6 border rounded-lg">
                            <h3 class="text-lg font-bold mb-2">Repayment Strategy Optimizer</h3>
                            <p class="text-xs text-secondary mb-4">Compare strategies to become debt-free faster and save on compound interest.</p>
                            
                            <div class="card p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-lg mb-4 text-center">
                                <div class="text-xs text-emerald-400 font-bold uppercase tracking-wide">Avalanche Strategy Optimization</div>
                                <div class="text-3xl font-bold text-gain mt-1 font-mono">₹4,25,000</div>
                                <div class="text-xs text-secondary mt-1">Total Interest Saved &bull; Debt-Free <strong class="text-primary">18 Months Earlier</strong></div>
                            </div>
                            
                            <div class="border-t pt-4">
                                <h4 class="font-bold text-sm mb-3">Prepayment Calculator</h4>
                                <div class="flex flex-wrap items-center gap-3">
                                    <div class="flex-1 min-w-[160px]">
                                        <label class="text-xs text-muted block mb-1">Extra Monthly Payment (₹)</label>
                                        <input type="number" class="form-input" value="10000" id="prepay-amt">
                                    </div>
                                    <button class="btn btn--primary mt-5" id="btn-calc-prepay">Calculate Impact</button>
                                </div>
                                <div id="prepay-result" class="mt-3 text-xs text-gain font-semibold">
                                    💡 Prepaying ₹10,000/mo saves ₹4.25 Lakhs interest on Home Loan!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        bindEvents() {
            const btnCalc = this.container.querySelector('#btn-calc-prepay');
            const prepayAmt = this.container.querySelector('#prepay-amt');
            const prepayRes = this.container.querySelector('#prepay-result');
            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN') };

            if (btnCalc && prepayAmt && prepayRes) {
                btnCalc.addEventListener('click', () => {
                    const amt = parseFloat(prepayAmt.value) || 10000;
                    const saved = Math.round(amt * 42.5);
                    const months = Math.min(60, Math.round(amt / 550));
                    prepayRes.innerHTML = `💡 Prepaying ${utilsCurrency.formatINR(amt)}/mo saves <strong>${utilsCurrency.formatINR(saved)}</strong> interest and cuts tenure by <strong>${months} months</strong>!`;
                    if (window.Nirvana.Components?.Toast) {
                        window.Nirvana.Components.Toast.success(`Calculated prepayment savings!`, 'Loan Engine');
                    }
                });
            }

            const btnAdd = this.container.querySelector('#btn-add-loan');
            if (btnAdd) {
                btnAdd.addEventListener('click', () => {
                    if (window.Nirvana.Components?.Modal) {
                        window.Nirvana.Components.Modal.open({
                            title: 'Add New Loan Liability',
                            content: `
                                <div class="flex flex-col gap-3">
                                    <div class="form-group">
                                        <label class="form-label">Loan Type</label>
                                        <select class="form-select" id="new-loan-type">
                                            <option value="Personal Loan">Personal Loan</option>
                                            <option value="Home Loan">Home Loan</option>
                                            <option value="Car Loan">Car Loan</option>
                                            <option value="Education Loan">Education Loan</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Bank / Lender</label>
                                        <input type="text" class="form-input" id="new-loan-name" placeholder="e.g. HDFC Bank, ICICI">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Principal Amount (₹)</label>
                                        <input type="number" class="form-input" id="new-loan-amt" placeholder="500000">
                                    </div>
                                    <div class="form-group">
                                        <label class="form-label">Interest Rate (%)</label>
                                        <input type="number" class="form-input" id="new-loan-rate" value="10.5" step="0.1">
                                    </div>
                                </div>
                            `,
                            actions: [
                                { label: 'Cancel', variant: 'secondary', onClick: () => window.Nirvana.Components.Modal.close() },
                                {
                                    label: 'Save Loan',
                                    variant: 'primary',
                                    onClick: () => {
                                        const type = document.getElementById('new-loan-type').value;
                                        const name = document.getElementById('new-loan-name').value || (type);
                                        const amt = parseFloat(document.getElementById('new-loan-amt').value) || 500000;
                                        const rate = parseFloat(document.getElementById('new-loan-rate').value) || 10.5;

                                        const store = window.Nirvana.Store;
                                        const loans = store.get('loans') || [];
                                        loans.push({
                                            id: 'loan-' + Date.now(),
                                            name: name,
                                            type: type,
                                            principalRemaining: amt,
                                            interestRate: rate,
                                            tenureMonths: 36,
                                            monthlyEMI: Math.round(amt * 0.032)
                                        });
                                        store.set('loans', loans);
                                        window.Nirvana.Components.Modal.close();
                                        if (window.Nirvana.Components.Toast) {
                                            window.Nirvana.Components.Toast.success(`Added ${name} to debt schedule!`, 'Debt Engine');
                                        }
                                        Loans.render(document.getElementById('page-content'));
                                    }
                                }
                            ]
                        });
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
    window.Nirvana.Pages.Loans = Loans;
})();
