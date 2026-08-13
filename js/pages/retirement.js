(function() {
    'use strict';
    
    const Retirement = {
        charts: [],
        
        render(container) {
            container.innerHTML = this.getTemplate();
            this.bindEvents(container);
            this.renderCharts(container);
        },
        
        getTemplate() {
            const store = window.Nirvana.Store;
            const profile = store ? store.getUserProfile() : {};
            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN') };

            const userAge = profile.age || 32;
            const targetAge = profile.retirementAge || 55;
            const monthlyExp = profile.expenses || 65000;
            const retCorpus = (profile.retCorpus || 650000) + Math.round((profile.mfValue || 1200000) * 0.5);

            let retCalc = {
                retirementAge: targetAge,
                yearsToRetirement: Math.max(1, targetAge - userAge),
                corpusRequired: 52000000,
                currentCorpus: retCorpus,
                readinessPercent: 88,
                additionalMonthlySavings: 28500,
                monthlyExpenseAtRetirement: 245000
            };

            if (window.Nirvana.Engines && window.Nirvana.Engines.RetirementEngine) {
                retCalc = window.Nirvana.Engines.RetirementEngine.calculate({
                    age: userAge,
                    targetRetirementAge: targetAge,
                    currentMonthlyExpense: monthlyExp,
                    currentRetirementCorpus: retCorpus
                });
            }

            return `
                <div class="page-content animate-fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-primary">Retirement & Financial Independence (FIRE)</h1>
                            <p class="text-secondary text-sm">Monte Carlo projected retirement readiness, inflation-adjusted corpus requirements, and sustainable withdrawal rates.</p>
                        </div>
                        <button class="btn btn--primary btn--sm" id="btn-recalc-fire">⚡ Recalculate FIRE</button>
                    </div>
                    
                    <!-- KPI Tiles -->
                    <div class="kpi-grid grid grid--4 gap-4 mb-6">
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Current Age vs Target</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-primary">${userAge} <span class="text-sm font-normal text-muted">/ ${targetAge} yrs (${retCalc.yearsToRetirement} yrs left)</span></div>
                            <div class="text-xs text-muted mt-2">Target year: <strong>${new Date().getFullYear() + retCalc.yearsToRetirement}</strong></div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Required Corpus at ${targetAge}</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-danger">${utilsCurrency.formatINR(retCalc.corpusRequired)}</div>
                            <div class="text-xs text-muted mt-2">At 6% inflation, life expectancy 85</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Current Dedicated Corpus</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-gain">${utilsCurrency.formatINR(retCorpus)}</div>
                            <div class="text-xs text-gain mt-2 font-semibold">Projected to grow to ${utilsCurrency.formatINR(retCorpus * Math.pow(1.11, retCalc.yearsToRetirement))}</div>
                        </div>

                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-muted text-xs uppercase font-bold tracking-wider">Required Monthly SIP</div>
                            <div class="kpi-value font-bold text-2xl mt-1 text-info">${utilsCurrency.formatINR(retCalc.additionalMonthlySavings)} <span class="text-xs font-normal text-muted">/ mo</span></div>
                            <div class="text-xs text-muted mt-2">To bridge 100% of retirement gap</div>
                        </div>
                    </div>

                    <!-- Interactive Simulation Grid -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div class="col-span-1 card card--glass p-5">
                            <h3 class="text-lg font-bold mb-4">Interactive FIRE Sliders</h3>
                            
                            <div class="mb-4">
                                <div class="flex justify-between text-xs font-bold mb-1">
                                    <span>Target Retirement Age</span>
                                    <span id="label-ret-age" class="text-primary font-mono">${targetAge} yrs</span>
                                </div>
                                <input type="range" class="w-full accent-emerald-500" min="40" max="65" value="${targetAge}" id="slider-ret-age">
                            </div>

                            <div class="mb-4">
                                <div class="flex justify-between text-xs font-bold mb-1">
                                    <span>Current Monthly Expenses (₹)</span>
                                    <span id="label-ret-exp" class="text-primary font-mono">${utilsCurrency.formatINR(monthlyExp)}</span>
                                </div>
                                <input type="range" class="w-full accent-emerald-500" min="30000" max="250000" step="5000" value="${monthlyExp}" id="slider-ret-exp">
                            </div>

                            <div class="mb-4">
                                <div class="flex justify-between text-xs font-bold mb-1">
                                    <span>Expected Return Pre-Retirement (%)</span>
                                    <span class="text-gain font-mono">11.5%</span>
                                </div>
                                <input type="range" class="w-full accent-emerald-500" min="8" max="15" step="0.5" value="11.5">
                            </div>

                            <div class="card p-3 bg-surface rounded-lg mt-4 border text-xs">
                                <div class="font-bold text-primary mb-1">💡 Sustainable Withdrawal Rate</div>
                                <div>At retirement, safe 4% rule allows monthly withdrawal of <strong>${utilsCurrency.formatINR(retCalc.corpusRequired * 0.04 / 12)}</strong> indexed to inflation.</div>
                            </div>
                        </div>

                        <div class="col-span-2">
                            <div id="retirement-projection-chart"></div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        bindEvents(container) {
            const sliderAge = container.querySelector('#slider-ret-age');
            const sliderExp = container.querySelector('#slider-ret-exp');
            const labelAge = container.querySelector('#label-ret-age');
            const labelExp = container.querySelector('#label-ret-exp');

            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN') };

            if (sliderAge && labelAge) {
                sliderAge.addEventListener('input', (e) => {
                    labelAge.textContent = `${e.target.value} yrs`;
                });
            }

            if (sliderExp && labelExp) {
                sliderExp.addEventListener('input', (e) => {
                    labelExp.textContent = utilsCurrency.formatINR(parseFloat(e.target.value));
                });
            }

            const btnRecalc = container.querySelector('#btn-recalc-fire');
            if (btnRecalc) {
                btnRecalc.addEventListener('click', () => {
                    const store = window.Nirvana.Store;
                    const p = store ? store.getUserProfile() : {};
                    if (sliderAge) p.retirementAge = parseInt(sliderAge.value, 10);
                    if (sliderExp) p.expenses = parseFloat(sliderExp.value);
                    if (store) store.setUserProfile(p);
                    if (window.Nirvana.Components?.Toast) {
                        window.Nirvana.Components.Toast.success('Retirement trajectory updated with new scenario parameters!', 'Retirement Engine');
                    }
                    const c = document.getElementById('page-content');
                    if (c) Retirement.render(c);
                });
            }
        },
        
        renderCharts(container) {
            if (window.Nirvana.Components && window.Nirvana.Components.ChartComponent) {
                const store = window.Nirvana.Store;
                const profile = store ? store.getUserProfile() : {};
                const age = profile.age || 32;
                const retAge = profile.retirementAge || 55;

                const labels = [];
                const corpusData = [];
                let current = (profile.retCorpus || 650000) + Math.round((profile.mfValue || 1200000) * 0.5);
                const sipAnnual = ((profile.income || 175000) * 0.22) * 12;

                for (let a = age; a <= 75; a += 3) {
                    labels.push(`Age ${a}`);
                    if (a <= retAge) {
                        current = current * Math.pow(1.11, 3) + (sipAnnual * 3);
                    } else {
                        current = Math.max(0, current * Math.pow(1.075, 3) - ((profile.expenses || 65000) * 12 * 3 * 2.5));
                    }
                    corpusData.push(Math.round(current / 100000));
                }

                const line = window.Nirvana.Components.ChartComponent.createLine('retirement-projection-chart', {
                    title: 'Corpus Accumulation & Distribution Trajectory',
                    subtitle: 'Corpus Growth in ₹ Lakhs (Age 32 to 75)',
                    labels: labels,
                    datasets: [
                        { label: 'Projected Corpus (₹ Lakhs)', data: corpusData, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)' }
                    ]
                });
                if (line) this.charts.push(line);
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
    window.Nirvana.Pages.Retirement = Retirement;
})();
