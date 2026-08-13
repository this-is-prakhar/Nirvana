(function() {
    'use strict';
    
    const Onboarding = {
        charts: [],
        currentStep: 1,
        totalSteps: 8,
        formData: {},
        
        render(container) {
            this.container = container;
            this.loadDraft();
            this.renderStep();
        },
        
        loadDraft() {
            const store = window.Nirvana.Store;
            if (store) {
                this.formData = store.getOnboardingDraft() || store.getUserProfile() || {};
            }
        },
        
        saveDraft() {
            const store = window.Nirvana.Store;
            if (store) {
                store.setOnboardingDraft(this.formData);
            }
        },
        
        renderStep() {
            let stepContent = '';
            let stepTitle = '';
            
            switch (this.currentStep) {
                case 1:
                    stepTitle = 'Personal Details';
                    stepContent = `
                        <p class="text-secondary text-sm mb-6">Tell us about yourself to customize your private wealth dashboard.</p>
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label form-label--required">Full Name</label>
                                <input type="text" class="form-input" id="ob-name" value="${this.formData.name || ''}" placeholder="e.g. Vikram Sharma" oninput="window.Nirvana.Pages.Onboarding.updateData('name', this.value)">
                            </div>
                            <div class="form-group">
                                <label class="form-label form-label--required">Age</label>
                                <input type="number" class="form-input" id="ob-age" value="${this.formData.age || 32}" placeholder="32" oninput="window.Nirvana.Pages.Onboarding.updateData('age', parseInt(this.value, 10))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">City Tier</label>
                                <select class="form-select" id="ob-city" onchange="window.Nirvana.Pages.Onboarding.updateData('cityTier', this.value)">
                                    <option value="Tier-1" ${this.formData.cityTier === 'Tier-1' ? 'selected' : ''}>Tier 1 (Mumbai, Delhi-NCR, Bengaluru, etc.)</option>
                                    <option value="Tier-2" ${this.formData.cityTier === 'Tier-2' ? 'selected' : ''}>Tier 2 (Pune, Ahmedabad, Jaipur, etc.)</option>
                                    <option value="Tier-3" ${this.formData.cityTier === 'Tier-3' ? 'selected' : ''}>Tier 3 & Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Occupation / Employment</label>
                                <select class="form-select" id="ob-occupation" onchange="window.Nirvana.Pages.Onboarding.updateData('occupation', this.value)">
                                    <option value="Salaried Corporate" ${this.formData.occupation === 'Salaried Corporate' ? 'selected' : ''}>Salaried Corporate</option>
                                    <option value="Business Owner / Founder" ${this.formData.occupation === 'Business Owner / Founder' ? 'selected' : ''}>Business Owner / Founder</option>
                                    <option value="Professional (Doctor/CA/Lawyer)" ${this.formData.occupation === 'Professional (Doctor/CA/Lawyer)' ? 'selected' : ''}>Professional (Doctor/CA/Lawyer)</option>
                                    <option value="Freelancer / Consultant" ${this.formData.occupation === 'Freelancer / Consultant' ? 'selected' : ''}>Freelancer / Consultant</option>
                                </select>
                            </div>
                            <div class="form-group form-group--full">
                                <label class="form-label">Number of Financial Dependents</label>
                                <input type="number" class="form-input" id="ob-dependents" value="${this.formData.dependents !== undefined ? this.formData.dependents : 2}" placeholder="2" oninput="window.Nirvana.Pages.Onboarding.updateData('dependents', parseInt(this.value, 10))">
                            </div>
                        </div>
                    `;
                    break;

                case 2:
                    stepTitle = 'Income & Monthly Cash Flow';
                    stepContent = `
                        <p class="text-secondary text-sm mb-6">Specify your regular earnings and monthly living commitments in INR.</p>
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label form-label--required">Monthly Salary / Primary Income (₹)</label>
                                <input type="number" class="form-input" id="ob-income" value="${this.formData.income || 175000}" placeholder="175000" oninput="window.Nirvana.Pages.Onboarding.updateData('income', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Annual Bonus / Other Variable Income (₹)</label>
                                <input type="number" class="form-input" id="ob-bonus" value="${this.formData.bonus || 300000}" placeholder="300000" oninput="window.Nirvana.Pages.Onboarding.updateData('bonus', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label form-label--required">Monthly Household Expenses (₹)</label>
                                <input type="number" class="form-input" id="ob-expenses" value="${this.formData.expenses || 65000}" placeholder="65000" oninput="window.Nirvana.Pages.Onboarding.updateData('expenses', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Existing Monthly Loan EMIs (₹)</label>
                                <input type="number" class="form-input" id="ob-emis" value="${this.formData.monthlyEMIs || 25000}" placeholder="25000" oninput="window.Nirvana.Pages.Onboarding.updateData('monthlyEMIs', parseFloat(this.value))">
                            </div>
                        </div>
                    `;
                    break;

                case 3:
                    stepTitle = 'Current Asset Holdings';
                    stepContent = `
                        <p class="text-secondary text-sm mb-6">Enter approximate current balances across major asset classes.</p>
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Bank Balances & Savings (₹)</label>
                                <input type="number" class="form-input" id="ob-bank" value="${this.formData.bankBalance || 350000}" placeholder="350000" oninput="window.Nirvana.Pages.Onboarding.updateData('bankBalance', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Direct Equity / Indian Stocks (₹)</label>
                                <input type="number" class="form-input" id="ob-stocks" value="${this.formData.stocksValue || 850000}" placeholder="850000" oninput="window.Nirvana.Pages.Onboarding.updateData('stocksValue', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Mutual Funds & ETFs (₹)</label>
                                <input type="number" class="form-input" id="ob-mf" value="${this.formData.mfValue || 1200000}" placeholder="1200000" oninput="window.Nirvana.Pages.Onboarding.updateData('mfValue', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Fixed Deposits & Bonds (₹)</label>
                                <input type="number" class="form-input" id="ob-fd" value="${this.formData.fdValue || 400000}" placeholder="400000" oninput="window.Nirvana.Pages.Onboarding.updateData('fdValue', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Gold & Precious Metals (₹)</label>
                                <input type="number" class="form-input" id="ob-gold" value="${this.formData.goldValue || 250000}" placeholder="250000" oninput="window.Nirvana.Pages.Onboarding.updateData('goldValue', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">EPF / PPF / NPS Corpus (₹)</label>
                                <input type="number" class="form-input" id="ob-ret-corpus" value="${this.formData.retCorpus || 650000}" placeholder="650000" oninput="window.Nirvana.Pages.Onboarding.updateData('retCorpus', parseFloat(this.value))">
                            </div>
                        </div>
                    `;
                    break;

                case 4:
                    stepTitle = 'Liabilities & Outstanding Debt';
                    stepContent = `
                        <p class="text-secondary text-sm mb-6">List any active loans or liabilities for debt payoff optimization.</p>
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Home Loan Principal Remaining (₹)</label>
                                <input type="number" class="form-input" id="ob-hl" value="${this.formData.homeLoan || 2800000}" placeholder="2800000" oninput="window.Nirvana.Pages.Onboarding.updateData('homeLoan', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Car Loan Balance (₹)</label>
                                <input type="number" class="form-input" id="ob-cl" value="${this.formData.carLoan || 350000}" placeholder="350000" oninput="window.Nirvana.Pages.Onboarding.updateData('carLoan', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Personal / Education Loan (₹)</label>
                                <input type="number" class="form-input" id="ob-pl" value="${this.formData.personalLoan || 0}" placeholder="0" oninput="window.Nirvana.Pages.Onboarding.updateData('personalLoan', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Credit Card Outstanding Balance (₹)</label>
                                <input type="number" class="form-input" id="ob-cc" value="${this.formData.ccOutstanding || 0}" placeholder="0" oninput="window.Nirvana.Pages.Onboarding.updateData('ccOutstanding', parseFloat(this.value))">
                            </div>
                        </div>
                    `;
                    break;

                case 5:
                    stepTitle = 'Insurance & Protection Cover';
                    stepContent = `
                        <p class="text-secondary text-sm mb-6">Specify existing term life and health insurance covers.</p>
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Term Life Insurance Sum Assured (₹)</label>
                                <input type="number" class="form-input" id="ob-life-cover" value="${this.formData.lifeCover || 10000000}" placeholder="10000000" oninput="window.Nirvana.Pages.Onboarding.updateData('lifeCover', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Annual Term Insurance Premium (₹)</label>
                                <input type="number" class="form-input" id="ob-life-prem" value="${this.formData.lifePremium || 14000}" placeholder="14000" oninput="window.Nirvana.Pages.Onboarding.updateData('lifePremium', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Health Insurance Sum Insured (₹)</label>
                                <input type="number" class="form-input" id="ob-health-cover" value="${this.formData.healthCover || 1000000}" placeholder="1000000" oninput="window.Nirvana.Pages.Onboarding.updateData('healthCover', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Parents' Health Insurance Cover (₹)</label>
                                <input type="number" class="form-input" id="ob-parent-health" value="${this.formData.parentHealthCover || 500000}" placeholder="500000" oninput="window.Nirvana.Pages.Onboarding.updateData('parentHealthCover', parseFloat(this.value))">
                            </div>
                        </div>
                    `;
                    break;

                case 6:
                    stepTitle = 'Key Financial Goals';
                    stepContent = `
                        <p class="text-secondary text-sm mb-6">Define primary long-term wealth milestones.</p>
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">Target Retirement Age</label>
                                <input type="number" class="form-input" id="ob-ret-age" value="${this.formData.retirementAge || 55}" placeholder="55" oninput="window.Nirvana.Pages.Onboarding.updateData('retirementAge', parseInt(this.value, 10))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Target Retirement Corpus Goal (₹)</label>
                                <input type="number" class="form-input" id="ob-ret-goal" value="${this.formData.retirementGoal || 50000000}" placeholder="50000000" oninput="window.Nirvana.Pages.Onboarding.updateData('retirementGoal', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Child Education Target (₹)</label>
                                <input type="number" class="form-input" id="ob-edu-goal" value="${this.formData.educationGoal || 2500000}" placeholder="2500000" oninput="window.Nirvana.Pages.Onboarding.updateData('educationGoal', parseFloat(this.value))">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Emergency Fund Target Months (Expenses)</label>
                                <input type="number" class="form-input" id="ob-em-months" value="${this.formData.emergencyMonths || 6}" placeholder="6" oninput="window.Nirvana.Pages.Onboarding.updateData('emergencyMonths', parseInt(this.value, 10))">
                            </div>
                        </div>
                    `;
                    break;

                case 7:
                    stepTitle = 'Risk Assessment & Behavioural Profile';
                    stepContent = `
                        <p class="text-secondary text-sm mb-6">Answer these quick questions to generate your risk score (0–100).</p>
                        <div class="form-group mb-5">
                            <label class="form-label">1. How do you react if the stock market falls 20% in a month?</label>
                            <select class="form-select" id="ob-q1" onchange="window.Nirvana.Pages.Onboarding.updateData('riskQ1', this.value)">
                                <option value="buy" ${this.formData.riskQ1 === 'buy' ? 'selected' : ''}>Invest more aggressively to buy the dip</option>
                                <option value="hold" ${this.formData.riskQ1 === 'hold' || !this.formData.riskQ1 ? 'selected' : ''}>Hold current positions and wait for recovery</option>
                                <option value="sell" ${this.formData.riskQ1 === 'sell' ? 'selected' : ''}>Sell investments to cut further losses</option>
                            </select>
                        </div>
                        <div class="form-group mb-5">
                            <label class="form-label">2. What is your primary investment objective?</label>
                            <select class="form-select" id="ob-q2" onchange="window.Nirvana.Pages.Onboarding.updateData('riskQ2', this.value)">
                                <option value="wealth" ${this.formData.riskQ2 === 'wealth' || !this.formData.riskQ2 ? 'selected' : ''}>Aggressive Wealth Creation (accept high volatility)</option>
                                <option value="balanced" ${this.formData.riskQ2 === 'balanced' ? 'selected' : ''}>Balanced Growth & Capital Preservation</option>
                                <option value="preservation" ${this.formData.riskQ2 === 'preservation' ? 'selected' : ''}>Capital Protection first (FDs, Debt, PPF)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">3. Expected Investment Horizon for core portfolio</label>
                            <select class="form-select" id="ob-q3" onchange="window.Nirvana.Pages.Onboarding.updateData('riskQ3', this.value)">
                                <option value="7+" ${this.formData.riskQ3 === '7+' || !this.formData.riskQ3 ? 'selected' : ''}>Long Term (7+ Years)</option>
                                <option value="3-7" ${this.formData.riskQ3 === '3-7' ? 'selected' : ''}>Medium Term (3 to 7 Years)</option>
                                <option value="<3" ${this.formData.riskQ3 === '<3' ? 'selected' : ''}>Short Term (< 3 Years)</option>
                            </select>
                        </div>
                    `;
                    break;

                case 8:
                    stepTitle = 'Comprehensive Profile Summary';
                    const name = this.formData.name || 'Vikram Sharma';
                    const income = this.formData.income || 175000;
                    const expenses = this.formData.expenses || 65000;
                    const totalAssets = (this.formData.bankBalance || 350000) + (this.formData.stocksValue || 850000) + (this.formData.mfValue || 1200000) + (this.formData.fdValue || 400000) + (this.formData.goldValue || 250000) + (this.formData.retCorpus || 650000);
                    const totalDebt = (this.formData.homeLoan || 2800000) + (this.formData.carLoan || 350000) + (this.formData.personalLoan || 0) + (this.formData.ccOutstanding || 0);
                    const netWorth = totalAssets - totalDebt;

                    stepContent = `
                        <div class="card card--glass p-5 mb-6">
                            <h4 class="font-bold mb-4 text-base">Summary for ${name}</h4>
                            <div class="stat-row">
                                <span class="stat-row__label">Monthly Surplus Cash Flow</span>
                                <span class="stat-row__value text-gain">${window.Nirvana.Utils.Currency.formatINR(income - expenses - (this.formData.monthlyEMIs || 25000))}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-row__label">Total Assets Recorded</span>
                                <span class="stat-row__value">${window.Nirvana.Utils.Currency.formatINR(totalAssets)}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-row__label">Total Liabilities & Debt</span>
                                <span class="stat-row__value text-loss">${window.Nirvana.Utils.Currency.formatINR(totalDebt)}</span>
                            </div>
                            <div class="stat-row">
                                <span class="stat-row__label">Calculated Net Worth</span>
                                <span class="stat-row__value text-accent font-bold">${window.Nirvana.Utils.Currency.formatINR(netWorth)}</span>
                            </div>
                        </div>
                        <p class="text-xs text-secondary text-center">Clicking "Finish & Launch Dashboard" will run all 12 financial engines to optimize your complete wealth strategy.</p>
                    `;
                    break;
            }
            
            const html = `
                <div class="onboarding page-content max-w-3xl mx-auto">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h1 class="text-2xl font-bold">Welcome to Nirvana</h1>
                            <p class="text-sm text-secondary">Set up your private wealth management profile</p>
                        </div>
                        <button class="btn btn--sm btn--ghost" onclick="window.Nirvana.Pages.Onboarding.skipOnboarding()">
                            ⚡ Skip & Explore Demo Dashboard
                        </button>
                    </div>

                    <div class="card p-6 shadow-lg">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-lg font-bold">${stepTitle}</h3>
                            <span class="badge badge--accent">Step ${this.currentStep} of ${this.totalSteps}</span>
                        </div>
                        
                        <div class="progress mb-6" style="height:6px;">
                            <div class="progress__fill" style="width:${(this.currentStep / this.totalSteps) * 100}%;"></div>
                        </div>
                        
                        <div class="step-content mb-8">
                            ${stepContent}
                        </div>
                        
                        <div class="flex justify-between items-center border-t pt-4">
                            <button class="btn btn--secondary" onclick="window.Nirvana.Pages.Onboarding.prevStep()" ${this.currentStep === 1 ? 'disabled' : ''}>
                                ← Previous
                            </button>
                            ${this.currentStep < this.totalSteps 
                                ? `<button class="btn btn--primary" onclick="window.Nirvana.Pages.Onboarding.nextStep()">Next Step →</button>` 
                                : `<button class="btn btn--primary px-6" onclick="window.Nirvana.Pages.Onboarding.submit()">Finish & Launch Dashboard 🚀</button>`
                            }
                        </div>
                    </div>
                </div>
            `;
            
            this.container.innerHTML = html;
        },
        
        updateData(key, value) {
            this.formData[key] = value;
            this.saveDraft();
        },
        
        nextStep() {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.renderStep();
            }
        },
        
        prevStep() {
            if (this.currentStep > 1) {
                this.currentStep--;
                this.renderStep();
            }
        },
        
        submit() {
            const store = window.Nirvana.Store;
            if (store) {
                this.formData.onboarded = true;
                store.setUserProfile(this.formData);
                store.set('onboarded', true);
                
                // Initialize all linked financial datasets from user inputs
                window.Nirvana.Pages.Onboarding.populateDerivedState(this.formData);
                
                if (window.Nirvana.Components && window.Nirvana.Components.Toast) {
                    window.Nirvana.Components.Toast.success('Profile saved! Calculating wealth plan...', 'Nirvana Wealth');
                }
                window.Nirvana.Router.navigate('/dashboard');
            }
        },

        skipOnboarding() {
            const store = window.Nirvana.Store;
            if (store) {
                const demoProfile = {
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
                    personalLoan: 0,
                    ccOutstanding: 0,
                    lifeCover: 15000000,
                    lifePremium: 16500,
                    healthCover: 1500000,
                    parentHealthCover: 500000,
                    retirementAge: 55,
                    retirementGoal: 50000000,
                    educationGoal: 2500000,
                    emergencyMonths: 6,
                    riskQ1: 'hold',
                    riskQ2: 'wealth',
                    riskQ3: '7+',
                    onboarded: true
                };
                store.setUserProfile(demoProfile);
                store.set('onboarded', true);
                
                window.Nirvana.Pages.Onboarding.populateDerivedState(demoProfile);
                
                if (window.Nirvana.Components && window.Nirvana.Components.Toast) {
                    window.Nirvana.Components.Toast.info('Loaded demo profile. Welcome to Nirvana!', 'Demo Mode');
                }
                window.Nirvana.Router.navigate('/dashboard');
            }
        },

        populateDerivedState(profile) {
            const store = window.Nirvana.Store;
            if (!store) return;

            const stocks = profile.stocksValue || 850000;
            const mf = profile.mfValue || 1200000;
            const fd = profile.fdValue || 400000;
            const gold = profile.goldValue || 250000;
            const bank = profile.bankBalance || 350000;
            const epf = profile.retCorpus || 650000;

            const totalAssets = stocks + mf + fd + gold + bank + epf;
            const totalInvested = (stocks * 0.82) + (mf * 0.80) + (fd * 0.95) + (gold * 0.84) + bank + epf;

            // 1. Generate realistic Holdings Table
            const items = [
                { id: 'stk-1', name: 'Reliance Industries Ltd.', type: 'Stock', category: 'Equity', invested: Math.round(stocks * 0.28 * 0.82), currentValue: Math.round(stocks * 0.28), returnsPct: 22.0, cmp: 2980, qty: Math.round((stocks * 0.28) / 2980) },
                { id: 'stk-2', name: 'Tata Consultancy Services', type: 'Stock', category: 'Equity', invested: Math.round(stocks * 0.24 * 0.85), currentValue: Math.round(stocks * 0.24), returnsPct: 17.6, cmp: 3850, qty: Math.round((stocks * 0.24) / 3850) },
                { id: 'stk-3', name: 'HDFC Bank Ltd.', type: 'Stock', category: 'Equity', invested: Math.round(stocks * 0.22 * 0.88), currentValue: Math.round(stocks * 0.22), returnsPct: 13.6, cmp: 1650, qty: Math.round((stocks * 0.22) / 1650) },
                { id: 'stk-4', name: 'Infosys Ltd.', type: 'Stock', category: 'Equity', invested: Math.round(stocks * 0.16 * 0.80), currentValue: Math.round(stocks * 0.16), returnsPct: 25.0, cmp: 1520, qty: Math.round((stocks * 0.16) / 1520) },
                { id: 'stk-5', name: 'ITC Ltd.', type: 'Stock', category: 'Equity', invested: Math.round(stocks * 0.10 * 0.78), currentValue: Math.round(stocks * 0.10), returnsPct: 28.2, cmp: 430, qty: Math.round((stocks * 0.10) / 430) },
                
                { id: 'mf-1', name: 'Parag Parikh Flexi Cap Fund', type: 'Mutual Fund', category: 'Equity', invested: Math.round(mf * 0.35 * 0.78), currentValue: Math.round(mf * 0.35), returnsPct: 28.2, nav: 76.5, units: Math.round((mf * 0.35) / 76.5) },
                { id: 'mf-2', name: 'Mirae Asset Large & Midcap Fund', type: 'Mutual Fund', category: 'Equity', invested: Math.round(mf * 0.25 * 0.82), currentValue: Math.round(mf * 0.25), returnsPct: 21.9, nav: 124.2, units: Math.round((mf * 0.25) / 124.2) },
                { id: 'mf-3', name: 'SBI Small Cap Fund', type: 'Mutual Fund', category: 'Equity', invested: Math.round(mf * 0.20 * 0.75), currentValue: Math.round(mf * 0.20), returnsPct: 33.3, nav: 162.8, units: Math.round((mf * 0.20) / 162.8) },
                { id: 'mf-4', name: 'HDFC Balanced Advantage Fund', type: 'Mutual Fund', category: 'Hybrid', invested: Math.round(mf * 0.20 * 0.85), currentValue: Math.round(mf * 0.20), returnsPct: 17.6, nav: 442.1, units: Math.round((mf * 0.20) / 442.1) },
                
                { id: 'fd-1', name: 'HDFC Bank Fixed Deposit (7.25%)', type: 'Fixed Deposit', category: 'Debt', invested: Math.round(fd * 0.60), currentValue: Math.round(fd * 0.60), returnsPct: 7.25 },
                { id: 'fd-2', name: 'SBI Special FD Scheme (7.10%)', type: 'Fixed Deposit', category: 'Debt', invested: Math.round(fd * 0.40), currentValue: Math.round(fd * 0.40), returnsPct: 7.10 },
                
                { id: 'gold-1', name: 'Sovereign Gold Bonds (SGB 2023-24)', type: 'Gold Bond', category: 'Gold', invested: Math.round(gold * 0.70 * 0.85), currentValue: Math.round(gold * 0.70), returnsPct: 17.6 },
                { id: 'gold-2', name: 'Nippon India Gold BeES ETF', type: 'Gold ETF', category: 'Gold', invested: Math.round(gold * 0.30 * 0.88), currentValue: Math.round(gold * 0.30), returnsPct: 13.6 },
                
                { id: 'epf-1', name: 'Employees Provident Fund (EPF 8.25%)', type: 'Retirement Scheme', category: 'Debt', invested: Math.round(epf * 0.70), currentValue: Math.round(epf * 0.70), returnsPct: 8.25 },
                { id: 'ppf-1', name: 'Public Provident Fund (PPF 7.10%)', type: 'Govt Scheme', category: 'Debt', invested: Math.round(epf * 0.30), currentValue: Math.round(epf * 0.30), returnsPct: 7.10 },
                
                { id: 'cash-1', name: 'HDFC Premium Savings Account', type: 'Bank Account', category: 'Cash', invested: Math.round(bank * 0.65), currentValue: Math.round(bank * 0.65), returnsPct: 3.5 },
                { id: 'cash-2', name: 'ICICI Prudential Liquid Fund', type: 'Liquid Fund', category: 'Cash', invested: Math.round(bank * 0.35), currentValue: Math.round(bank * 0.35), returnsPct: 6.8 }
            ];

            const equityTotal = stocks + (mf * 0.8);
            const debtTotal = fd + epf + (mf * 0.2);
            const goldTotal = gold;
            const cashTotal = bank;

            const portfolioData = {
                totalValue: totalAssets,
                totalInvested: Math.round(totalInvested),
                returns: Math.round(totalAssets - totalInvested),
                returnsPct: parseFloat(((totalAssets - totalInvested) / totalInvested * 100).toFixed(1)),
                xirr: 15.2,
                items: items,
                allocation: {
                    equity: Math.round((equityTotal / totalAssets) * 100),
                    debt: Math.round((debtTotal / totalAssets) * 100),
                    gold: Math.round((goldTotal / totalAssets) * 100),
                    cash: Math.round((cashTotal / totalAssets) * 100)
                }
            };
            store.setPortfolio(portfolioData);

            // 2. Generate Real Goals
            const currentYear = new Date().getFullYear();
            const retAge = profile.retirementAge || 55;
            const yearsToRet = Math.max(1, retAge - (profile.age || 32));
            const goals = [
                {
                    id: 1,
                    name: 'Retirement Corpus (FIRE)',
                    category: 'Retirement',
                    icon: '🏖️',
                    priority: 'High',
                    targetAmount: profile.retirementGoal || 50000000,
                    currentCorpus: epf + Math.round(mf * 0.5),
                    targetYear: currentYear + yearsToRet,
                    yearsLeft: yearsToRet,
                    requiredSip: Math.round(((profile.retirementGoal || 50000000) * 0.003)),
                    currentSip: Math.round((profile.income || 175000) * 0.22)
                },
                {
                    id: 2,
                    name: 'Child Higher Education',
                    category: 'Education',
                    icon: '🎓',
                    priority: 'High',
                    targetAmount: profile.educationGoal || 2500000,
                    currentCorpus: Math.round(stocks * 0.35),
                    targetYear: currentYear + 10,
                    yearsLeft: 10,
                    requiredSip: 12500,
                    currentSip: 10000
                },
                {
                    id: 3,
                    name: 'Emergency Living Fund',
                    category: 'Emergency',
                    icon: '🏥',
                    priority: 'High',
                    targetAmount: (profile.expenses || 65000) * (profile.emergencyMonths || 6),
                    currentCorpus: bank,
                    targetYear: currentYear,
                    yearsLeft: 0,
                    requiredSip: 15000,
                    currentSip: 15000
                },
                {
                    id: 4,
                    name: 'Downpayment for Real Estate',
                    category: 'Housing',
                    icon: '🏠',
                    priority: 'Medium',
                    targetAmount: 4000000,
                    currentCorpus: Math.round(fd * 0.75),
                    targetYear: currentYear + 3,
                    yearsLeft: 3,
                    requiredSip: 35000,
                    currentSip: 25000
                }
            ];
            store.setGoals(goals);

            // 3. Generate Real Loans
            const homeLoan = profile.homeLoan || 2800000;
            const carLoan = profile.carLoan || 350000;
            const personalLoan = profile.personalLoan || 0;
            const loans = [
                { id: 'loan-1', name: 'SBI Home Loan', type: 'Home Loan', principalRemaining: homeLoan, interestRate: 8.50, tenureMonths: 216, monthlyEMI: 24350 },
                { id: 'loan-2', name: 'HDFC Car Loan', type: 'Car Loan', principalRemaining: carLoan, interestRate: 9.20, tenureMonths: 36, monthlyEMI: 11150 }
            ];
            if (personalLoan > 0) {
                loans.push({ id: 'loan-3', name: 'Personal Loan', type: 'Personal', principalRemaining: personalLoan, interestRate: 12.50, tenureMonths: 24, monthlyEMI: Math.round(personalLoan * 0.047) });
            }
            store.set('loans', loans);

            // 4. Generate Real Insurance Policies
            const lifeCover = profile.lifeCover || 15000000;
            const healthCover = profile.healthCover || 1500000;
            const parentHealth = profile.parentHealthCover || 500000;
            const insurance = {
                life: { sumAssured: lifeCover, premiumAnnual: profile.lifePremium || 16500, planName: 'HDFC Life Click 2 Protect 3D Plus', renewalDate: '2026-11-15' },
                health: { sumAssured: healthCover, premiumAnnual: 22000, planName: 'Care Supreme Health Insurance', renewalDate: '2026-09-20' },
                parents: { sumAssured: parentHealth, premiumAnnual: 28000, planName: 'Star Health Senior Citizens Red Carpet', renewalDate: '2026-10-05' }
            };
            store.set('insurance', insurance);
        },
        
        destroy() {
            this.container = null;
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Onboarding = Onboarding;
})();
