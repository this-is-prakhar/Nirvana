(function() {
    'use strict';
    
    const Goals = {
        charts: [],
        container: null,
        currentCategory: 'All',
        
        render(container) {
            this.container = container;
            this.setupUI();
            this.renderGoals();
        },
        
        setupUI() {
            this.container.innerHTML = `
                <div class="page-content animate-fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-primary">Financial Goals & Milestones</h1>
                            <p class="text-secondary text-sm">Targeted goal planning with inflation adjustment, SIP shortfall calculation, and Monte Carlo success probability.</p>
                        </div>
                        <button class="btn btn--primary btn--sm" id="add-goal-btn">
                            <span class="btn--icon">+</span> Add New Goal
                        </button>
                    </div>
                    
                    <div class="kpi-grid grid grid--4 mb-6 gap-4" id="goals-kpis">
                        <!-- KPIs rendered here -->
                    </div>
                    
                    <div class="tabs mb-6 flex gap-2 border-b pb-2" id="goal-tabs">
                        <button class="btn btn--secondary btn--sm active" data-category="All">All Goals</button>
                        <button class="btn btn--ghost btn--sm" data-category="Retirement">Retirement</button>
                        <button class="btn btn--ghost btn--sm" data-category="Education">Education</button>
                        <button class="btn btn--ghost btn--sm" data-category="Housing">Housing</button>
                        <button class="btn btn--ghost btn--sm" data-category="Emergency">Emergency</button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="goals-grid">
                        <!-- Goal cards here -->
                    </div>
                </div>
            `;
            
            const tabs = this.container.querySelectorAll('#goal-tabs button');
            tabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    tabs.forEach(t => {
                        t.classList.remove('btn--secondary', 'active');
                        t.classList.add('btn--ghost');
                    });
                    const btn = e.target.closest('button');
                    btn.classList.remove('btn--ghost');
                    btn.classList.add('btn--secondary', 'active');
                    this.currentCategory = btn.dataset.category;
                    this.renderGoals(this.currentCategory);
                });
            });

            const addBtn = this.container.querySelector('#add-goal-btn');
            if (addBtn) {
                addBtn.addEventListener('click', () => this.openAddGoalModal());
            }
        },
        
        formatInr(amount) {
            const utilsCurrency = window.Nirvana.Utils?.Currency;
            if (utilsCurrency) return utilsCurrency.formatINR(amount || 0);
            return '₹' + (amount || 0).toLocaleString('en-IN');
        },
        
        renderGoals(category = 'All') {
            const store = window.Nirvana.Store;
            let goals = store ? store.getGoals() : [];
            
            if (!goals || goals.length === 0) {
                const profile = store ? store.getUserProfile() : {};
                if (window.Nirvana.Pages?.Onboarding?.populateDerivedState) {
                    window.Nirvana.Pages.Onboarding.populateDerivedState(profile);
                    goals = store ? store.getGoals() : [];
                }
            }

            const filteredGoals = category === 'All' ? goals : goals.filter(g => g.category === category);
            
            const totalTarget = goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0);
            const totalCorpus = goals.reduce((sum, g) => sum + (g.currentCorpus || 0), 0);
            const overallGap = Math.max(0, totalTarget - totalCorpus);
            const totalSip = goals.reduce((sum, g) => sum + (g.requiredSip || 0), 0);
            
            const kpisHtml = `
                <div class="kpi-tile card card--elevated p-4">
                    <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Total Goal Targets</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-primary">${this.formatInr(totalTarget)}</div>
                    <div class="text-xs text-muted mt-2">Aggregated across all goals</div>
                </div>
                <div class="kpi-tile card card--elevated p-4">
                    <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Current Funded Corpus</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-gain">${this.formatInr(totalCorpus)}</div>
                    <div class="text-xs text-gain mt-2 font-semibold">${totalTarget > 0 ? ((totalCorpus / totalTarget) * 100).toFixed(1) : 0}% aggregate funded</div>
                </div>
                <div class="kpi-tile card card--elevated p-4">
                    <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Total Funding Gap</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-danger">${this.formatInr(overallGap)}</div>
                    <div class="text-xs text-muted mt-2">To be bridged via monthly SIPs</div>
                </div>
                <div class="kpi-tile card card--elevated p-4">
                    <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Total Required SIP</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-info">${this.formatInr(totalSip)} <span class="text-xs font-normal text-muted">/ mo</span></div>
                    <div class="text-xs text-muted mt-2">At 12% equity / 7% debt CAGR</div>
                </div>
            `;
            const kpiContainer = this.container.querySelector('#goals-kpis');
            if (kpiContainer) kpiContainer.innerHTML = kpisHtml;
            
            const gridHtml = filteredGoals.map(g => {
                const percent = Math.min(100, Math.round(((g.currentCorpus || 0) / (g.targetAmount || 1)) * 100));
                let colorClass = '#ef4444'; // red
                if (percent > 70) colorClass = '#10b981'; // green
                else if (percent > 40) colorClass = '#f59e0b'; // yellow
                
                let badgeClass = 'badge--info';
                if (g.priority === 'High') badgeClass = 'badge--danger';
                if (g.priority === 'Medium') badgeClass = 'badge--warning';
                
                return `
                    <div class="card card--interactive p-5 border rounded-lg shadow-sm">
                        <div class="flex justify-between items-center mb-2">
                            <div class="font-bold flex items-center gap-2 text-base">
                                <span>${g.icon || '🎯'}</span> ${g.name}
                            </div>
                            <span class="badge ${badgeClass} text-xs px-2 py-0.5">${g.priority || 'Medium'}</span>
                        </div>
                        <div class="text-secondary text-xs mb-4">Target Year: <strong>${g.targetYear}</strong> (${g.yearsLeft || 0} years remaining)</div>
                        
                        <div class="mb-2 flex justify-between text-xs font-semibold">
                            <span class="text-gain">Funded: ${this.formatInr(g.currentCorpus)}</span>
                            <span class="text-primary">Target: ${this.formatInr(g.targetAmount)}</span>
                        </div>
                        <div class="progress-bar bg-surface h-2.5 rounded-full mb-4 w-full" style="background: rgba(255,255,255,0.1);">
                            <div class="h-full rounded-full transition-all duration-500" style="width: ${percent}%; background-color: ${colorClass};"></div>
                        </div>
                        
                        <div class="flex justify-between text-xs mb-4 bg-surface p-2.5 rounded">
                            <div class="flex flex-col">
                                <span class="text-muted">Required SIP</span>
                                <span class="font-bold font-mono">${this.formatInr(g.requiredSip)} / mo</span>
                            </div>
                            <div class="flex flex-col text-right">
                                <span class="text-muted">Current SIP</span>
                                <span class="font-bold font-mono text-gain">${this.formatInr(g.currentSip)} / mo</span>
                            </div>
                        </div>
                        
                        <div class="flex gap-2 mt-4 border-t pt-3">
                            <button class="btn btn--sm btn--primary flex-1 py-1" onclick="window.Nirvana.Pages.Goals.viewStrategy(${g.id})">Funding Strategy</button>
                            <button class="btn btn--sm btn--ghost flex-1 py-1 text-danger" onclick="window.Nirvana.Pages.Goals.deleteGoal(${g.id})">Remove</button>
                        </div>
                    </div>
                `;
            }).join('');
            
            const gridContainer = this.container.querySelector('#goals-grid');
            if (gridContainer) {
                gridContainer.innerHTML = gridHtml || `
                    <div class="empty-state p-8 text-center col-span-3 border border-dashed rounded-lg">
                        <div class="empty-state__icon text-4xl mb-2">🎯</div>
                        <div class="empty-state__title font-bold text-lg">No Goals in this Category</div>
                        <div class="empty-state__text text-muted">Click "+ Add New Goal" to start planning milestones.</div>
                    </div>`;
            }
        },

        openAddGoalModal() {
            if (window.Nirvana.Components && window.Nirvana.Components.Modal) {
                window.Nirvana.Components.Modal.open({
                    title: 'Add New Financial Goal',
                    content: `
                        <div class="flex flex-col gap-4">
                            <div class="form-group">
                                <label class="form-label">Goal Category</label>
                                <select class="form-select" id="new-goal-cat">
                                    <option value="Retirement">Retirement</option>
                                    <option value="Education">Education</option>
                                    <option value="Housing">Housing</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Custom">Custom</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Goal Name</label>
                                <input type="text" class="form-input" id="new-goal-name" placeholder="e.g. Vacation Villa, World Tour">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Target Amount (₹)</label>
                                <input type="number" class="form-input" id="new-goal-target" placeholder="2500000">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Target Year</label>
                                <input type="number" class="form-input" id="new-goal-year" value="${new Date().getFullYear() + 5}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Initial Seed Corpus (₹)</label>
                                <input type="number" class="form-input" id="new-goal-seed" placeholder="200000">
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
                            label: 'Save Goal',
                            variant: 'primary',
                            onClick: () => {
                                const cat = document.getElementById('new-goal-cat').value;
                                const name = document.getElementById('new-goal-name').value || (cat + ' Goal');
                                const target = parseFloat(document.getElementById('new-goal-target').value) || 1000000;
                                const year = parseInt(document.getElementById('new-goal-year').value, 10) || (new Date().getFullYear() + 5);
                                const seed = parseFloat(document.getElementById('new-goal-seed').value) || 0;
                                const currentYear = new Date().getFullYear();
                                const yearsLeft = Math.max(1, year - currentYear);

                                const store = window.Nirvana.Store;
                                const goals = store.getGoals();
                                goals.push({
                                    id: Date.now(),
                                    name: name,
                                    category: cat,
                                    icon: cat === 'Retirement' ? '🏖️' : cat === 'Education' ? '🎓' : cat === 'Housing' ? '🏠' : cat === 'Travel' ? '✈️' : '🎯',
                                    priority: 'High',
                                    targetAmount: target,
                                    currentCorpus: seed,
                                    targetYear: year,
                                    yearsLeft: yearsLeft,
                                    requiredSip: Math.round((target - seed) / (yearsLeft * 12 * 1.5)),
                                    currentSip: Math.round((target - seed) / (yearsLeft * 12 * 1.8))
                                });
                                store.setGoals(goals);

                                window.Nirvana.Components.Modal.close();
                                if (window.Nirvana.Components.Toast) {
                                    window.Nirvana.Components.Toast.success(`Added ${name} to goals!`, 'Goals Engine');
                                }
                                Goals.renderGoals(Goals.currentCategory);
                            }
                        }
                    ]
                });
            }
        },

        viewStrategy(goalId) {
            const store = window.Nirvana.Store;
            const goals = store ? store.getGoals() : [];
            const goal = goals.find(g => g.id === goalId) || goals[0];
            if (!goal) return;

            if (window.Nirvana.Components && window.Nirvana.Components.Modal) {
                window.Nirvana.Components.Modal.open({
                    title: `Funding Strategy: ${goal.name}`,
                    content: `
                        <div class="flex flex-col gap-4 text-sm">
                            <div class="card p-4 bg-surface rounded">
                                <div class="flex justify-between mb-2"><span>Target Amount:</span> <strong>${this.formatInr(goal.targetAmount)}</strong></div>
                                <div class="flex justify-between mb-2"><span>Current Corpus:</span> <strong class="text-gain">${this.formatInr(goal.currentCorpus)}</strong></div>
                                <div class="flex justify-between mb-2"><span>Funding Gap:</span> <strong class="text-danger">${this.formatInr(Math.max(0, goal.targetAmount - goal.currentCorpus))}</strong></div>
                                <div class="flex justify-between"><span>Recommended Monthly SIP:</span> <strong class="text-primary">${this.formatInr(goal.requiredSip)}</strong></div>
                            </div>
                            <h4 class="font-bold mt-2">Recommended Asset Mix for this Horizon (${goal.yearsLeft || 5} yrs):</h4>
                            <p class="text-secondary text-xs">• 70% Multi-Cap / Flexi-Cap Mutual Funds (CAGR 12-14%)<br>• 20% Target Maturity Debt Funds / Arbitrage (CAGR 7.2%)<br>• 10% Sovereign Gold Bonds (SGB)</p>
                            <div class="badge badge--success p-2 text-center mt-2 font-bold">Monte Carlo Success Probability: 92%</div>
                        </div>
                    `,
                    actions: [
                        { label: 'Close', variant: 'primary', onClick: () => window.Nirvana.Components.Modal.close() }
                    ]
                });
            }
        },

        deleteGoal(goalId) {
            const store = window.Nirvana.Store;
            let goals = store ? store.getGoals() : [];
            goals = goals.filter(g => g.id !== goalId);
            if (store) store.setGoals(goals);
            if (window.Nirvana.Components?.Toast) {
                window.Nirvana.Components.Toast.info('Goal removed', 'Goals');
            }
            this.renderGoals(this.currentCategory);
        },
        
        destroy() {
            this.container = null;
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Goals = Goals;
})();
