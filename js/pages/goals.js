(function() {
    'use strict';
    
    const Goals = {
        charts: [],
        container: null,
        
        render(container) {
            this.container = container;
            this.setupUI();
            this.renderGoals();
        },
        
        setupUI() {
            this.container.innerHTML = `
                <div class="page-content animate-fade-in">
                    <div class="flex justify-between items-center mb-4">
                        <h1 class="text-primary text-2xl font-bold">Financial Goals</h1>
                        <button class="btn btn--primary" id="add-goal-btn">
                            <span class="btn--icon">+</span> Add New Goal
                        </button>
                    </div>
                    
                    <div class="kpi-grid grid grid--4 mb-4 gap-4" id="goals-kpis">
                        <!-- KPIs will be rendered here -->
                    </div>
                    
                    <div class="tabs mb-4 flex gap-2 border-b pb-2" id="goal-tabs">
                        <button class="btn btn--secondary active" data-category="All">All</button>
                        <button class="btn btn--ghost" data-category="Retirement">Retirement</button>
                        <button class="btn btn--ghost" data-category="Education">Education</button>
                        <button class="btn btn--ghost" data-category="Housing">Housing</button>
                        <button class="btn btn--ghost" data-category="Emergency">Emergency</button>
                        <button class="btn btn--ghost" data-category="Travel">Travel</button>
                        <button class="btn btn--ghost" data-category="Custom">Custom</button>
                    </div>
                    
                    <div class="grid grid--3 gap-4 mt-4" id="goals-grid">
                        <!-- Goal cards here -->
                    </div>
                </div>
                
                <!-- Add Goal Modal -->
                <div id="goal-modal" class="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style="display: none; z-index: 50;">
                    <div class="modal-content card card--elevated p-6 w-full max-w-lg bg-white rounded-lg">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-bold">Add / Edit Goal</h2>
                            <button class="btn btn--icon btn--ghost" id="close-modal-btn">&times;</button>
                        </div>
                        <form id="goal-form" class="flex flex-col gap-4">
                            <div class="form-group">
                                <label class="form-label">Goal Category</label>
                                <select class="form-select border p-2 rounded" id="form-category">
                                    <option>Retirement</option>
                                    <option>Education</option>
                                    <option>Housing</option>
                                    <option>Car</option>
                                    <option>Wedding</option>
                                    <option>Travel</option>
                                    <option>Emergency</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Goal Name</label>
                                <input type="text" class="form-input border p-2 rounded" placeholder="e.g. Daughter's College">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Target Amount (₹)</label>
                                <input type="number" class="form-input border p-2 rounded" placeholder="10000000">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Target Year</label>
                                <input type="number" class="form-input border p-2 rounded" placeholder="2035">
                            </div>
                            <button type="button" class="btn btn--primary mt-2">Save Goal</button>
                        </form>
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
                    e.target.classList.remove('btn--ghost');
                    e.target.classList.add('btn--secondary', 'active');
                    this.renderGoals(e.target.dataset.category);
                });
            });

            const addBtn = this.container.querySelector('#add-goal-btn');
            const closeBtn = this.container.querySelector('#close-modal-btn');
            const modal = this.container.querySelector('#goal-modal');
            
            addBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
            closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
        },
        
        formatInr(amount) {
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
        },
        
        renderGoals(category = 'All') {
            const goals = this.getMockGoals();
            const filteredGoals = category === 'All' ? goals : goals.filter(g => g.category === category);
            
            const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
            const totalCorpus = goals.reduce((sum, g) => sum + g.currentCorpus, 0);
            const overallGap = Math.max(0, totalTarget - totalCorpus);
            const totalSip = goals.reduce((sum, g) => sum + g.requiredSip, 0);
            
            const kpisHtml = `
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase tracking-wide">Total Target Amount</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-primary">${this.formatInr(totalTarget)}</div>
                </div>
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase tracking-wide">Total Current Corpus</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-gain">${this.formatInr(totalCorpus)}</div>
                </div>
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase tracking-wide">Overall Gap</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-danger">${this.formatInr(overallGap)}</div>
                </div>
                <div class="kpi-tile card card--glass p-4 border rounded-lg shadow-sm">
                    <div class="kpi-label text-muted text-sm font-semibold uppercase tracking-wide">Total Required SIP (Monthly)</div>
                    <div class="kpi-value font-bold text-2xl mt-1 text-info">${this.formatInr(totalSip)}</div>
                </div>
            `;
            this.container.querySelector('#goals-kpis').innerHTML = kpisHtml;
            
            const gridHtml = filteredGoals.map(g => {
                const percent = Math.min(100, Math.round((g.currentCorpus / g.targetAmount) * 100));
                let colorClass = '#ef4444'; // red
                if(percent > 80) colorClass = '#10b981'; // green
                else if (percent > 50) colorClass = '#f59e0b'; // yellow
                
                let badgeClass = 'badge--info';
                if(g.priority === 'High') badgeClass = 'badge--danger';
                if(g.priority === 'Medium') badgeClass = 'badge--warning';
                
                return `
                    <div class="card card--interactive p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-center mb-2">
                            <div class="font-bold flex items-center gap-2 text-lg">
                                <span>${g.icon}</span> ${g.name}
                            </div>
                            <span class="badge ${badgeClass} text-xs px-2 py-1 rounded">${g.priority}</span>
                        </div>
                        <div class="text-muted text-sm mb-4">Target: ${g.targetYear} (${g.yearsLeft} years left)</div>
                        
                        <div class="mb-2 flex justify-between text-sm font-medium">
                            <span class="text-gain">${this.formatInr(g.currentCorpus)}</span>
                            <span class="text-primary">${this.formatInr(g.targetAmount)}</span>
                        </div>
                        <div class="progress-bar bg-gray-200 h-2 rounded-full mb-4 w-full" style="background-color: #e5e7eb;">
                            <div class="h-full rounded-full transition-all duration-500" style="width: ${percent}%; background-color: ${colorClass};"></div>
                        </div>
                        
                        <div class="flex justify-between text-sm mb-4 bg-gray-50 p-2 rounded">
                            <div class="flex flex-col">
                                <span class="text-xs text-muted">Required SIP</span>
                                <span class="font-bold">${this.formatInr(g.requiredSip)}</span>
                            </div>
                            <div class="flex flex-col text-right">
                                <span class="text-xs text-muted">Current SIP</span>
                                <span class="font-bold ${g.currentSip < g.requiredSip ? 'text-danger' : 'text-gain'}">${this.formatInr(g.currentSip)}</span>
                            </div>
                        </div>
                        
                        <div class="flex gap-2 mt-4 border-t pt-3">
                            <button class="btn btn--sm btn--primary flex-1 bg-blue-600 text-white rounded py-1">Edit</button>
                            <button class="btn btn--sm btn--ghost flex-1 border border-blue-600 text-blue-600 rounded py-1">Strategy</button>
                        </div>
                    </div>
                `;
            }).join('');
            
            this.container.querySelector('#goals-grid').innerHTML = gridHtml || `
                <div class="empty-state p-8 text-center col-span-3 border border-dashed rounded-lg">
                    <div class="empty-state__icon text-4xl mb-2">🎯</div>
                    <div class="empty-state__title font-bold text-lg">No Goals Found</div>
                    <div class="empty-state__text text-muted">You haven't added any goals in this category yet.</div>
                </div>`;
        },
        
        getMockGoals() {
            return [
                { id: 1, name: 'Retirement Corpus', category: 'Retirement', icon: '🏖️', priority: 'High', targetAmount: 50000000, currentCorpus: 15000000, targetYear: 2045, yearsLeft: 19, requiredSip: 45000, currentSip: 40000 },
                { id: 2, name: 'Child Education', category: 'Education', icon: '🎓', priority: 'High', targetAmount: 10000000, currentCorpus: 2000000, targetYear: 2035, yearsLeft: 9, requiredSip: 30000, currentSip: 30000 },
                { id: 3, name: 'Downpayment for House', category: 'Housing', icon: '🏠', priority: 'Medium', targetAmount: 5000000, currentCorpus: 4000000, targetYear: 2028, yearsLeft: 2, requiredSip: 38000, currentSip: 40000 },
                { id: 4, name: 'Europe Tour', category: 'Travel', icon: '✈️', priority: 'Low', targetAmount: 800000, currentCorpus: 200000, targetYear: 2026, yearsLeft: 1, requiredSip: 45000, currentSip: 10000 },
                { id: 5, name: 'Emergency Fund', category: 'Emergency', icon: '🏥', priority: 'High', targetAmount: 1200000, currentCorpus: 900000, targetYear: 2025, yearsLeft: 0, requiredSip: 25000, currentSip: 25000 }
            ];
        },
        
        destroy() {
            if(this.container) this.container.innerHTML = '';
            this.charts.forEach(c => c && typeof c.destroy === 'function' && c.destroy());
            this.charts = [];
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Goals = Goals;
})();
