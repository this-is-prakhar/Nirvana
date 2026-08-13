(function() {
    'use strict';

    const Onboarding = {
        currentStep: 1,
        totalSteps: 8,
        profileData: {},
        container: null,

        render(container) {
            this.container = container;
            this.loadDraft();
            container.innerHTML = this.getTemplate();
            this.bindEvents(container);
            this.updateStepView();
        },

        loadDraft() {
            const store = window.Nirvana.Store;
            if (store) {
                this.profileData = store.getOnboardingDraft() || store.getUserProfile() || {};
                this.currentStep = this.profileData.lastStep || 1;
            }
        },

        saveDraft() {
            const store = window.Nirvana.Store;
            if (store) {
                this.collectCurrentStepData();
                this.profileData.lastStep = this.currentStep;
                store.setOnboardingDraft(this.profileData);
            }
        },

        getTemplate() {
            return `
                <div class="onboarding-wizard max-w-4xl mx-auto py-8 px-4">
                    <div class="mb-8 text-center">
                        <h1 class="text-3xl font-bold text-primary mb-2">Welcome to Nirvana Wealth Intelligence</h1>
                        <p class="text-secondary text-sm">Let's build your unified, institutional-grade private financial fortress.</p>
                        
                        <!-- Progress Indicator -->
                        <div class="wizard-progress flex items-center justify-between max-w-2xl mx-auto mt-6 relative">
                            <div class="wizard-progress-bar-bg absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 w-full z-0"></div>
                            <div id="wizard-progress-fill" class="wizard-progress-bar-fill absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-300" style="width: 0%;"></div>
                            ${[1,2,3,4,5,6,7,8].map(step => `
                                <div class="wizard-step-node relative z-10 flex flex-col items-center cursor-pointer" data-step="${step}">
                                    <div class="step-circle w-8 h-8 rounded-full border-2 border-gray-300 bg-surface flex items-center justify-center text-xs font-bold transition-all duration-200">${step}</div>
                                    <span class="step-label text-[10px] text-muted mt-1 hidden md:block">${this.getStepShortLabel(step)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="card card--glass p-6 md:p-8 shadow-xl border border-gray-100 min-h-[420px] flex flex-col justify-between" id="wizard-card-body">
                        <div id="wizard-step-content" class="animate-fade-in">
                            <!-- Dynamic Step HTML Injected Here -->
                        </div>

                        <div class="wizard-footer flex justify-between items-center border-t pt-6 mt-8">
                            <button id="btn-wizard-prev" class="btn btn--secondary flex items-center gap-2" style="visibility: hidden;">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                                Previous
                            </button>
                            <div class="flex gap-3">
                                <button id="btn-wizard-demo" class="btn btn--ghost text-xs text-muted">Load Demo Profile</button>
                                <button id="btn-wizard-next" class="btn btn--primary flex items-center gap-2 px-6">
                                    Next Step
                                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        getStepShortLabel(step) {
            const labels = ['Profile', 'Income', 'Assets', 'Liabilities', 'Insurance', 'Goals', 'Risk', 'Review'];
            return labels[step - 1] || '';
        },

        getStepHTML(step) {
            const p = this.profileData;
            switch(step) {
                case 1:
                    return `
                        <h2 class="text-xl font-bold text-primary mb-1">Step 1: Personal & Demographic Profile</h2>
                        <p class="text-secondary text-xs mb-6">Your personal data is strictly stored in your local browser storage.</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="form-label text-xs font-semibold">Full Legal Name</label>
                                <input type="text" id="inp-name" class="form-input" placeholder="e.g. Prakhar Sharma" value="${p.name || ''}" required>
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Age</label>
                                <input type="number" id="inp-age" class="form-input" placeholder="e.g. 32" value="${p.age || 32}" min="18" max="100">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">City Tier</label>
                                <select id="inp-city-tier" class="form-input">
                                    <option value="Tier-1" ${p.cityTier === 'Tier-1' ? 'selected' : ''}>Tier 1 (Metro - Mumbai, Bangalore, Delhi NCR, etc.)</option>
                                    <option value="Tier-2" ${p.cityTier === 'Tier-2' ? 'selected' : ''}>Tier 2 (Pune, Ahmedabad, Jaipur, etc.)</option>
                                    <option value="Tier-3" ${p.cityTier === 'Tier-3' ? 'selected' : ''}>Tier 3 / Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Occupation / Employment Type</label>
                                <select id="inp-occupation" class="form-input">
                                    <option value="Salaried - Private" ${p.occupation === 'Salaried - Private' ? 'selected' : ''}>Salaried (Corporate / Private Sector)</option>
                                    <option value="Salaried - Govt" ${p.occupation === 'Salaried - Govt' ? 'selected' : ''}>Salaried (Public Sector / Govt)</option>
                                    <option value="Self-Employed / Business" ${p.occupation === 'Self-Employed / Business' ? 'selected' : ''}>Business Owner / Entrepreneur</option>
                                    <option value="Professional" ${p.occupation === 'Professional' ? 'selected' : ''}>Independent Professional (Doctor, CA, Lawyer)</option>
                                    <option value="Retired" ${p.occupation === 'Retired' ? 'selected' : ''}>Retired / Senior Citizen</option>
                                </select>
                            </div>
                        </div>
                    `;
                case 2:
                    return `
                        <h2 class="text-xl font-bold text-primary mb-1">Step 2: Monthly Cash Flows (Inflows vs Outflows)</h2>
                        <p class="text-secondary text-xs mb-6">Quantify your net take-home cash flows and monthly living burn rate.</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="form-label text-xs font-semibold">Monthly Net In-hand Salary (₹)</label>
                                <input type="number" id="inp-income" class="form-input" placeholder="e.g. 175000" value="${p.income || 175000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Annual Performance Bonus / Other Inflow (₹)</label>
                                <input type="number" id="inp-bonus" class="form-input" placeholder="e.g. 300000" value="${p.bonus || 300000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Monthly Essential Living Expenses (₹)</label>
                                <input type="number" id="inp-expenses" class="form-input" placeholder="e.g. 65000" value="${p.expenses || 65000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Existing Monthly Loan EMIs (₹)</label>
                                <input type="number" id="inp-emis" class="form-input" placeholder="e.g. 35000" value="${p.monthlyEMIs || 35500}">
                            </div>
                        </div>
                    `;
                case 3:
                    return `
                        <h2 class="text-xl font-bold text-primary mb-1">Step 3: Current Assets & Investment Holdings</h2>
                        <p class="text-secondary text-xs mb-6">Enter the current market valuation across all liquid and non-liquid asset classes.</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="form-label text-xs font-semibold">Savings Accounts & Liquid Cash (₹)</label>
                                <input type="number" id="inp-bank-balance" class="form-input" placeholder="e.g. 350000" value="${p.bankBalance ?? 350000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Direct Equity / Listed Stocks (₹)</label>
                                <input type="number" id="inp-stocks-value" class="form-input" placeholder="e.g. 850000" value="${p.stocksValue ?? 850000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Mutual Funds (Equity, Hybrid & Debt) (₹)</label>
                                <input type="number" id="inp-mf-value" class="form-input" placeholder="e.g. 1200000" value="${p.mfValue ?? 1200000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Bank Fixed Deposits & Corporate Bonds (₹)</label>
                                <input type="number" id="inp-fd-value" class="form-input" placeholder="e.g. 400000" value="${p.fdValue ?? 400000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Gold, Silver & Sovereign Gold Bonds (₹)</label>
                                <input type="number" id="inp-gold-value" class="form-input" placeholder="e.g. 250000" value="${p.goldValue ?? 250000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">EPF, PPF & NPS Retirement Corpus (₹)</label>
                                <input type="number" id="inp-ret-corpus" class="form-input" placeholder="e.g. 650000" value="${p.retCorpus ?? 650000}">
                            </div>
                        </div>
                    `;
                case 4:
                    return `
                        <h2 class="text-xl font-bold text-primary mb-1">Step 4: Active Liabilities & Debt Obligations</h2>
                        <p class="text-secondary text-xs mb-6">Enter outstanding loan principal balances for amortization analysis.</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="form-label text-xs font-semibold">Home Loan Outstanding Balance (₹)</label>
                                <input type="number" id="inp-home-loan" class="form-input" placeholder="e.g. 2800000" value="${p.homeLoan ?? 2800000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Vehicle / Car Loan Outstanding (₹)</label>
                                <input type="number" id="inp-car-loan" class="form-input" placeholder="e.g. 350000" value="${p.carLoan ?? 350000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Personal / Education Loan (₹)</label>
                                <input type="number" id="inp-personal-loan" class="form-input" placeholder="e.g. 0" value="${p.personalLoan ?? 0}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Credit Card Outstanding Balance (₹)</label>
                                <input type="number" id="inp-cc-debt" class="form-input" placeholder="e.g. 0" value="${p.ccOutstanding ?? 0}">
                            </div>
                        </div>
                    `;
                case 5:
                    return `
                        <h2 class="text-xl font-bold text-primary mb-1">Step 5: Existing Insurance & Risk Cover</h2>
                        <p class="text-secondary text-xs mb-6">Evaluate Human Life Value protection and health catastrophe coverage.</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="form-label text-xs font-semibold">Term Life Insurance Sum Assured (₹)</label>
                                <input type="number" id="inp-life-cover" class="form-input" placeholder="e.g. 15000000" value="${p.lifeCover ?? 15000000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Health Insurance Sum Insured (Self & Family) (₹)</label>
                                <input type="number" id="inp-health-cover" class="form-input" placeholder="e.g. 1500000" value="${p.healthCover ?? 1500000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Separate Parents Health Cover (₹)</label>
                                <input type="number" id="inp-parent-health" class="form-input" placeholder="e.g. 500000" value="${p.parentHealthCover ?? 500000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Annual Term Insurance Premium (₹)</label>
                                <input type="number" id="inp-life-premium" class="form-input" placeholder="e.g. 16500" value="${p.lifePremium ?? 16500}">
                            </div>
                        </div>
                    `;
                case 6:
                    return `
                        <h2 class="text-xl font-bold text-primary mb-1">Step 6: Financial Goals & Target Timelines</h2>
                        <p class="text-secondary text-xs mb-6">Define your life milestones to calculate required monthly SIP trajectories.</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="form-label text-xs font-semibold">Target Retirement Age</label>
                                <input type="number" id="inp-ret-age" class="form-input" placeholder="e.g. 55" value="${p.retirementAge || 55}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Target Retirement Corpus (₹)</label>
                                <input type="number" id="inp-ret-goal" class="form-input" placeholder="e.g. 50000000" value="${p.retirementGoal || 50000000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Child Higher Education Target Corpus (₹)</label>
                                <input type="number" id="inp-edu-goal" class="form-input" placeholder="e.g. 2500000" value="${p.educationGoal ?? 2500000}">
                            </div>
                            <div>
                                <label class="form-label text-xs font-semibold">Emergency Fund Buffer (Months of Burn)</label>
                                <input type="number" id="inp-emergency-months" class="form-input" placeholder="e.g. 6" value="${p.emergencyMonths || 6}">
                            </div>
                        </div>
                    `;
                case 7:
                    return `
                        <h2 class="text-xl font-bold text-primary mb-1">Step 7: Risk Tolerance Assessment</h2>
                        <p class="text-secondary text-xs mb-6">Deterministic profiling to establish your strategic equity vs debt allocation.</p>
                        <div class="flex flex-col gap-4">
                            <div class="p-4 rounded-lg bg-surface border">
                                <label class="font-bold text-xs block mb-2">1. If the stock market drops 25% in a short correction, what would you do?</label>
                                <div class="flex flex-col gap-2 text-xs">
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="risk_q1" value="panic" ${p.riskQ1 === 'panic' ? 'checked' : ''}> Sell holdings immediately to preserve capital</label>
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="risk_q1" value="wait" ${p.riskQ1 === 'wait' ? 'checked' : ''}> Hold and wait for recovery</label>
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="risk_q1" value="buy" ${(!p.riskQ1 || p.riskQ1 === 'buy') ? 'checked' : ''}> Aggressively buy more units at discounted valuations</label>
                                </div>
                            </div>
                            <div class="p-4 rounded-lg bg-surface border">
                                <label class="font-bold text-xs block mb-2">2. What is your primary investment goal?</label>
                                <div class="flex flex-col gap-2 text-xs">
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="risk_q2" value="protect" ${p.riskQ2 === 'protect' ? 'checked' : ''}> Capital Protection & Guaranteed Fixed Returns</label>
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="risk_q2" value="moderate" ${p.riskQ2 === 'moderate' ? 'checked' : ''}> Balanced Growth with Moderate Stability</label>
                                    <label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="risk_q2" value="wealth" ${(!p.riskQ2 || p.riskQ2 === 'wealth') ? 'checked' : ''}> Long-term Wealth Maximization & Inflation Outperformance</label>
                                </div>
                            </div>
                        </div>
                    `;
                case 8:
                    const totalAssets = (p.bankBalance ?? 350000) + (p.stocksValue ?? 850000) + (p.mfValue ?? 1200000) + (p.fdValue ?? 400000) + (p.goldValue ?? 250000) + (p.retCorpus ?? 650000);
                    const totalLiabilities = (p.homeLoan ?? 2800000) + (p.carLoan ?? 350000) + (p.personalLoan ?? 0) + (p.ccOutstanding ?? 0);
                    const netWorth = totalAssets - totalLiabilities;
                    const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: v => '₹' + (v || 0).toLocaleString('en-IN') };

                    return `
                        <h2 class="text-xl font-bold text-primary mb-1">Step 8: Portfolio Summary & Activation</h2>
                        <p class="text-secondary text-xs mb-6">Review your consolidated balance sheet before activating your private wealth cockpit.</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div class="card p-4 bg-emerald-500/10 border border-emerald-500/20 text-center">
                                <span class="text-xs text-muted block mb-1">Total Assets</span>
                                <span class="text-lg font-bold text-gain">${utilsCurrency.formatINR(totalAssets)}</span>
                            </div>
                            <div class="card p-4 bg-red-500/10 border border-red-500/20 text-center">
                                <span class="text-xs text-muted block mb-1">Total Liabilities</span>
                                <span class="text-lg font-bold text-danger">${utilsCurrency.formatINR(totalLiabilities)}</span>
                            </div>
                            <div class="card p-4 bg-blue-500/10 border border-blue-500/20 text-center">
                                <span class="text-xs text-muted block mb-1">Consolidated Net Worth</span>
                                <span class="text-lg font-bold text-primary">${utilsCurrency.formatINR(netWorth)}</span>
                            </div>
                        </div>

                        <div class="card p-4 bg-surface border text-xs leading-relaxed mb-4">
                            <p><strong>Investor:</strong> ${p.name || 'Investor'}</p>
                            <p><strong>Monthly Cash Inflow:</strong> ${utilsCurrency.formatINR(p.income || 175000)} / month | <strong>Expenses:</strong> ${utilsCurrency.formatINR(p.expenses || 65000)} / month</p>
                            <p><strong>Strategic Protection:</strong> ${utilsCurrency.formatINR(p.lifeCover ?? 15000000)} Life Cover | ${utilsCurrency.formatINR(p.healthCover ?? 1500000)} Health Cover</p>
                        </div>
                    `;
                default:
                    return '';
            }
        },

        collectCurrentStepData() {
            const container = this.container;
            if (!container) return;

            const getNum = (id, fallback) => {
                const el = container.querySelector(id);
                if (!el) return fallback;
                const v = el.value.trim();
                return v === '' ? fallback : Number(v);
            };

            const getStr = (id, fallback) => {
                const el = container.querySelector(id);
                return el ? el.value.trim() || fallback : fallback;
            };

            switch(this.currentStep) {
                case 1:
                    this.profileData.name = getStr('#inp-name', this.profileData.name || 'Prakhar Sharma');
                    this.profileData.age = getNum('#inp-age', this.profileData.age || 32);
                    this.profileData.cityTier = getStr('#inp-city-tier', 'Tier-1');
                    this.profileData.occupation = getStr('#inp-occupation', 'Salaried - Private');
                    break;
                case 2:
                    this.profileData.income = getNum('#inp-income', 175000);
                    this.profileData.bonus = getNum('#inp-bonus', 300000);
                    this.profileData.expenses = getNum('#inp-expenses', 65000);
                    this.profileData.monthlyEMIs = getNum('#inp-emis', 35500);
                    break;
                case 3:
                    this.profileData.bankBalance = getNum('#inp-bank-balance', 350000);
                    this.profileData.stocksValue = getNum('#inp-stocks-value', 850000);
                    this.profileData.mfValue = getNum('#inp-mf-value', 1200000);
                    this.profileData.fdValue = getNum('#inp-fd-value', 400000);
                    this.profileData.goldValue = getNum('#inp-gold-value', 250000);
                    this.profileData.retCorpus = getNum('#inp-ret-corpus', 650000);
                    break;
                case 4:
                    this.profileData.homeLoan = getNum('#inp-home-loan', 2800000);
                    this.profileData.carLoan = getNum('#inp-car-loan', 350000);
                    this.profileData.personalLoan = getNum('#inp-personal-loan', 0);
                    this.profileData.ccOutstanding = getNum('#inp-cc-debt', 0);
                    break;
                case 5:
                    this.profileData.lifeCover = getNum('#inp-life-cover', 15000000);
                    this.profileData.healthCover = getNum('#inp-health-cover', 1500000);
                    this.profileData.parentHealthCover = getNum('#inp-parent-health', 500000);
                    this.profileData.lifePremium = getNum('#inp-life-premium', 16500);
                    break;
                case 6:
                    this.profileData.retirementAge = getNum('#inp-ret-age', 55);
                    this.profileData.retirementGoal = getNum('#inp-ret-goal', 50000000);
                    this.profileData.educationGoal = getNum('#inp-edu-goal', 2500000);
                    this.profileData.emergencyMonths = getNum('#inp-emergency-months', 6);
                    break;
                case 7:
                    const q1 = container.querySelector('input[name="risk_q1"]:checked');
                    const q2 = container.querySelector('input[name="risk_q2"]:checked');
                    this.profileData.riskQ1 = q1 ? q1.value : 'buy';
                    this.profileData.riskQ2 = q2 ? q2.value : 'wealth';
                    break;
            }
        },

        updateStepView() {
            const contentEl = this.container.querySelector('#wizard-step-content');
            if (contentEl) {
                contentEl.innerHTML = this.getStepHTML(this.currentStep);
            }

            const prevBtn = this.container.querySelector('#btn-wizard-prev');
            const nextBtn = this.container.querySelector('#btn-wizard-next');
            const progressFill = this.container.querySelector('#wizard-progress-fill');

            if (prevBtn) {
                prevBtn.style.visibility = this.currentStep > 1 ? 'visible' : 'hidden';
            }

            if (nextBtn) {
                nextBtn.innerHTML = this.currentStep === this.totalSteps ? 'Activate Nirvana Dashboard 🚀' : 'Next Step →';
            }

            if (progressFill) {
                const pct = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
                progressFill.style.width = `${pct}%`;
            }

            const nodes = this.container.querySelectorAll('.wizard-step-node');
            nodes.forEach(node => {
                const s = parseInt(node.getAttribute('data-step'), 10);
                const circle = node.querySelector('.step-circle');
                if (circle) {
                    if (s < this.currentStep) {
                        circle.style.background = '#10b981';
                        circle.style.borderColor = '#10b981';
                        circle.style.color = '#fff';
                    } else if (s === this.currentStep) {
                        circle.style.background = '#6366f1';
                        circle.style.borderColor = '#6366f1';
                        circle.style.color = '#fff';
                    } else {
                        circle.style.background = '';
                        circle.style.borderColor = '';
                        circle.style.color = '';
                    }
                }
            });
        },

        bindEvents(container) {
            const nextBtn = container.querySelector('#btn-wizard-next');
            const prevBtn = container.querySelector('#btn-wizard-prev');
            const demoBtn = container.querySelector('#btn-wizard-demo');

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    this.collectCurrentStepData();
                    if (this.currentStep < this.totalSteps) {
                        this.currentStep++;
                        this.saveDraft();
                        this.updateStepView();
                    } else {
                        // Submit Onboarding
                        this.profileData.onboarded = true;
                        const store = window.Nirvana.Store;
                        if (store) {
                            store.setUserProfile(this.profileData);
                            store.set('onboarded', true);
                            this.populateDerivedState(this.profileData);
                        }
                        if (window.Nirvana.Components && window.Nirvana.Components.Toast) {
                            window.Nirvana.Components.Toast.success('Profile onboarded successfully! Welcome to Nirvana.', 'Onboarding');
                        }
                        window.Nirvana.Router.navigate('/dashboard');
                    }
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    this.collectCurrentStepData();
                    if (this.currentStep > 1) {
                        this.currentStep--;
                        this.saveDraft();
                        this.updateStepView();
                    }
                });
            }

            if (demoBtn) {
                demoBtn.addEventListener('click', () => {
                    this.loadDemo();
                });
            }

            const stepNodes = container.querySelectorAll('.wizard-step-node');
            stepNodes.forEach(node => {
                node.addEventListener('click', () => {
                    const s = parseInt(node.getAttribute('data-step'), 10);
                    this.collectCurrentStepData();
                    this.currentStep = s;
                    this.saveDraft();
                    this.updateStepView();
                });
            });
        },

        loadDemo() {
            const store = window.Nirvana.Store;
            if (store) {
                const demoProfile = {
                    name: 'Prakhar Sharma',
                    age: 32,
                    cityTier: 'Tier-1',
                    occupation: 'Salaried - Private',
                    income: 175000,
                    bonus: 300000,
                    expenses: 65000,
                    monthlyEMIs: 35500,
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
                    healthCover: 1500000,
                    parentHealthCover: 500000,
                    lifePremium: 16500,
                    retirementAge: 55,
                    retirementGoal: 50000000,
                    educationGoal: 2500000,
                    emergencyMonths: 6,
                    riskQ1: 'buy',
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

            const stocks = (profile.stocksValue !== undefined && profile.stocksValue !== null) ? Number(profile.stocksValue) : 850000;
            const mf = (profile.mfValue !== undefined && profile.mfValue !== null) ? Number(profile.mfValue) : 1200000;
            const fd = (profile.fdValue !== undefined && profile.fdValue !== null) ? Number(profile.fdValue) : 400000;
            const gold = (profile.goldValue !== undefined && profile.goldValue !== null) ? Number(profile.goldValue) : 250000;
            const bank = (profile.bankBalance !== undefined && profile.bankBalance !== null) ? Number(profile.bankBalance) : 350000;
            const epf = (profile.retCorpus !== undefined && profile.retCorpus !== null) ? Number(profile.retCorpus) : 650000;

            const totalAssets = stocks + mf + fd + gold + bank + epf;
            const totalInvested = (stocks * 0.82) + (mf * 0.80) + (fd * 0.95) + (gold * 0.84) + bank + epf;

            // 1. Generate realistic Holdings Table
            const items = [];

            if (stocks > 0) {
                items.push(
                    { id: 'stk-1', name: 'Reliance Industries Ltd.', type: 'Stock', category: 'Equity', invested: Math.round(stocks * 0.28 * 0.82), currentValue: Math.round(stocks * 0.28), returnsPct: 22.0, cmp: 2980, qty: Math.max(1, Math.round((stocks * 0.28) / 2980)) },
                    { id: 'stk-2', name: 'Tata Consultancy Services', type: 'Stock', category: 'Equity', invested: Math.round(stocks * 0.24 * 0.85), currentValue: Math.round(stocks * 0.24), returnsPct: 17.6, cmp: 3850, qty: Math.max(1, Math.round((stocks * 0.24) / 3850)) },
                    { id: 'stk-3', name: 'HDFC Bank Ltd.', type: 'Stock', category: 'Equity', invested: Math.round(stocks * 0.22 * 0.88), currentValue: Math.round(stocks * 0.22), returnsPct: 13.6, cmp: 1650, qty: Math.max(1, Math.round((stocks * 0.22) / 1650)) },
                    { id: 'stk-4', name: 'Infosys Ltd.', type: 'Stock', category: 'Equity', invested: Math.round(stocks * 0.16 * 0.80), currentValue: Math.round(stocks * 0.16), returnsPct: 25.0, cmp: 1520, qty: Math.max(1, Math.round((stocks * 0.16) / 1520)) },
                    { id: 'stk-5', name: 'ITC Ltd.', type: 'Stock', category: 'Equity', invested: Math.round(stocks * 0.10 * 0.78), currentValue: Math.round(stocks * 0.10), returnsPct: 28.2, cmp: 430, qty: Math.max(1, Math.round((stocks * 0.10) / 430)) }
                );
            }

            if (mf > 0) {
                items.push(
                    { id: 'mf-1', name: 'Parag Parikh Flexi Cap Fund', type: 'Mutual Fund', category: 'Equity', invested: Math.round(mf * 0.35 * 0.78), currentValue: Math.round(mf * 0.35), returnsPct: 28.2, nav: 76.5, units: Math.max(1, Math.round((mf * 0.35) / 76.5)) },
                    { id: 'mf-2', name: 'Mirae Asset Large & Midcap Fund', type: 'Mutual Fund', category: 'Equity', invested: Math.round(mf * 0.25 * 0.82), currentValue: Math.round(mf * 0.25), returnsPct: 21.9, nav: 124.2, units: Math.max(1, Math.round((mf * 0.25) / 124.2)) },
                    { id: 'mf-3', name: 'SBI Small Cap Fund', type: 'Mutual Fund', category: 'Equity', invested: Math.round(mf * 0.20 * 0.75), currentValue: Math.round(mf * 0.20), returnsPct: 33.3, nav: 162.8, units: Math.max(1, Math.round((mf * 0.20) / 162.8)) },
                    { id: 'mf-4', name: 'HDFC Balanced Advantage Fund', type: 'Mutual Fund', category: 'Hybrid', invested: Math.round(mf * 0.20 * 0.85), currentValue: Math.round(mf * 0.20), returnsPct: 17.6, nav: 442.1, units: Math.max(1, Math.round((mf * 0.20) / 442.1)) }
                );
            }

            if (fd > 0) {
                items.push(
                    { id: 'fd-1', name: 'HDFC Bank Fixed Deposit (7.25%)', type: 'Fixed Deposit', category: 'Debt', invested: Math.round(fd * 0.60), currentValue: Math.round(fd * 0.60), returnsPct: 7.25 },
                    { id: 'fd-2', name: 'SBI Special FD Scheme (7.10%)', type: 'Fixed Deposit', category: 'Debt', invested: Math.round(fd * 0.40), currentValue: Math.round(fd * 0.40), returnsPct: 7.10 }
                );
            }

            if (gold > 0) {
                items.push(
                    { id: 'gold-1', name: 'Sovereign Gold Bonds (SGB 2023-24)', type: 'Gold Bond', category: 'Gold', invested: Math.round(gold * 0.70 * 0.85), currentValue: Math.round(gold * 0.70), returnsPct: 17.6 },
                    { id: 'gold-2', name: 'Nippon India Gold BeES ETF', type: 'Gold ETF', category: 'Gold', invested: Math.round(gold * 0.30 * 0.88), currentValue: Math.round(gold * 0.30), returnsPct: 13.6 }
                );
            }

            if (epf > 0) {
                items.push(
                    { id: 'epf-1', name: 'Employees Provident Fund (EPF 8.25%)', type: 'Retirement Scheme', category: 'Debt', invested: Math.round(epf * 0.70), currentValue: Math.round(epf * 0.70), returnsPct: 8.25 },
                    { id: 'ppf-1', name: 'Public Provident Fund (PPF 7.10%)', type: 'Govt Scheme', category: 'Debt', invested: Math.round(epf * 0.30), currentValue: Math.round(epf * 0.30), returnsPct: 7.10 }
                );
            }

            if (bank > 0) {
                items.push(
                    { id: 'cash-1', name: 'HDFC Premium Savings Account', type: 'Bank Account', category: 'Cash', invested: Math.round(bank * 0.65), currentValue: Math.round(bank * 0.65), returnsPct: 3.5 },
                    { id: 'cash-2', name: 'ICICI Prudential Liquid Fund', type: 'Liquid Fund', category: 'Cash', invested: Math.round(bank * 0.35), currentValue: Math.round(bank * 0.35), returnsPct: 6.8 }
                );
            }

            const equityTotal = stocks + (mf * 0.8);
            const debtTotal = fd + epf + (mf * 0.2);
            const goldTotal = gold;
            const cashTotal = bank;

            const safeAssets = totalAssets > 0 ? totalAssets : 1;

            const portfolioData = {
                totalValue: totalAssets,
                totalInvested: Math.round(totalInvested),
                returns: Math.round(totalAssets - totalInvested),
                returnsPct: parseFloat(((totalAssets - totalInvested) / (totalInvested || 1) * 100).toFixed(1)),
                xirr: 15.2,
                items: items,
                allocation: {
                    equity: Math.round((equityTotal / safeAssets) * 100),
                    debt: Math.round((debtTotal / safeAssets) * 100),
                    gold: Math.round((goldTotal / safeAssets) * 100),
                    cash: Math.round((cashTotal / safeAssets) * 100)
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
            const homeLoan = (profile.homeLoan !== undefined && profile.homeLoan !== null) ? Number(profile.homeLoan) : 0;
            const carLoan = (profile.carLoan !== undefined && profile.carLoan !== null) ? Number(profile.carLoan) : 0;
            const personalLoan = (profile.personalLoan !== undefined && profile.personalLoan !== null) ? Number(profile.personalLoan) : 0;
            const ccDebt = (profile.ccOutstanding !== undefined && profile.ccOutstanding !== null) ? Number(profile.ccOutstanding) : 0;

            const loans = [];
            if (homeLoan > 0) {
                loans.push({ id: 'loan-1', name: 'SBI Home Loan', type: 'Home Loan', principalRemaining: homeLoan, interestRate: 8.50, tenureMonths: 216, monthlyEMI: Math.round(homeLoan * 0.0087) });
            }
            if (carLoan > 0) {
                loans.push({ id: 'loan-2', name: 'HDFC Car Loan', type: 'Car Loan', principalRemaining: carLoan, interestRate: 9.20, tenureMonths: 36, monthlyEMI: Math.round(carLoan * 0.0318) });
            }
            if (personalLoan > 0) {
                loans.push({ id: 'loan-3', name: 'Personal / Education Loan', type: 'Personal', principalRemaining: personalLoan, interestRate: 11.50, tenureMonths: 48, monthlyEMI: Math.round(personalLoan * 0.026) });
            }
            if (ccDebt > 0) {
                loans.push({ id: 'loan-4', name: 'Credit Card Balance', type: 'Credit Card', principalRemaining: ccDebt, interestRate: 42.0, tenureMonths: 12, monthlyEMI: Math.round(ccDebt * 0.10) });
            }
            store.set('loans', loans);

            // 4. Generate Real Insurance Policies
            const lifeCover = (profile.lifeCover !== undefined && profile.lifeCover !== null) ? Number(profile.lifeCover) : 15000000;
            const healthCover = (profile.healthCover !== undefined && profile.healthCover !== null) ? Number(profile.healthCover) : 1500000;
            const parentHealth = (profile.parentHealthCover !== undefined && profile.parentHealthCover !== null) ? Number(profile.parentHealthCover) : 500000;
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
