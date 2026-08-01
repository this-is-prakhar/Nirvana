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
            return `
                <div class="page-content animate-fade-in">
                    <div class="flex items-center justify-between mb-4">
                        <h1 class="text-2xl font-bold">Retirement & FIRE Planner</h1>
                        <button class="btn btn--primary px-4 py-2" id="btn-simulate-ret">Simulate Retirement</button>
                    </div>
                    
                    <div class="kpi-grid grid grid--5 mb-6 gap-4">
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-sm text-muted">Age vs Target</div>
                            <div class="kpi-value text-xl font-bold mt-1">32 <span class="text-sm font-normal text-muted">/ 45 yrs</span></div>
                        </div>
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-sm text-muted">Required Corpus</div>
                            <div class="kpi-value text-xl font-bold text-primary mt-1">₹5.2 Cr</div>
                        </div>
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-sm text-muted">Projected Corpus</div>
                            <div class="kpi-value text-xl font-bold text-success mt-1">₹6.1 Cr</div>
                        </div>
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-sm text-muted">Readiness Score</div>
                            <div class="kpi-value text-xl font-bold text-gain mt-1">117%</div>
                        </div>
                        <div class="kpi-tile card card--elevated p-4">
                            <div class="kpi-label text-sm text-muted">Post-Ret. Monthly</div>
                            <div class="kpi-value text-xl font-bold text-warning mt-1">₹1.5L <span class="text-xs font-normal text-muted">infl. adj</span></div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div class="card card--glass p-5 col-span-1">
                            <h3 class="text-lg font-bold mb-5 border-b pb-2">Scenario Sliders</h3>
                            
                            <div class="mb-4">
                                <label class="flex justify-between text-sm font-semibold mb-1">
                                    <span>Target Retirement Age</span>
                                    <span id="val-ret-age" class="text-primary">45</span>
                                </label>
                                <input type="range" class="w-full accent-blue-600" min="35" max="65" value="45" id="slider-ret-age">
                            </div>
                            
                            <div class="mb-4">
                                <label class="flex justify-between text-sm font-semibold mb-1">
                                    <span>Current Monthly Exp (₹)</span>
                                    <span id="val-mo-exp" class="text-primary">60,000</span>
                                </label>
                                <input type="range" class="w-full accent-blue-600" min="20000" max="300000" step="5000" value="60000" id="slider-mo-exp">
                            </div>

                            <div class="mb-4">
                                <label class="flex justify-between text-sm font-semibold mb-1">
                                    <span>Inflation Rate (%)</span>
                                    <span id="val-inf" class="text-primary">6.0%</span>
                                </label>
                                <input type="range" class="w-full accent-blue-600" min="3" max="10" step="0.5" value="6" id="slider-inf">
                            </div>

                            <div class="mb-4">
                                <label class="flex justify-between text-sm font-semibold mb-1">
                                    <span>Pre-Ret. Return (%)</span>
                                    <span id="val-pre-ret" class="text-primary">12.0%</span>
                                </label>
                                <input type="range" class="w-full accent-blue-600" min="6" max="15" step="0.5" value="12" id="slider-pre-ret">
                            </div>

                            <div class="mb-4">
                                <label class="flex justify-between text-sm font-semibold mb-1">
                                    <span>Post-Ret. Return (%)</span>
                                    <span id="val-post-ret" class="text-primary">8.0%</span>
                                </label>
                                <input type="range" class="w-full accent-blue-600" min="4" max="10" step="0.5" value="8" id="slider-post-ret">
                            </div>
                            
                            <div class="mb-2">
                                <label class="flex justify-between text-sm font-semibold mb-1">
                                    <span>Life Expectancy</span>
                                    <span id="val-life" class="text-primary">85</span>
                                </label>
                                <input type="range" class="w-full accent-blue-600" min="70" max="100" step="1" value="85" id="slider-life">
                            </div>
                        </div>

                        <div class="card card--glass p-5 md:col-span-2">
                            <h3 class="text-lg font-bold mb-4">Monte Carlo Corpus Trajectory</h3>
                            <div id="retirement-chart" class="w-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center" style="height: 400px;">
                                <span class="text-slate-400 font-medium">Monte Carlo Chart Rendered Here (Curves to Age 85)</span>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="card card--glass p-5">
                            <h3 class="text-lg font-bold mb-4">Retirement Accounts (Accumulation)</h3>
                            <div class="space-y-5">
                                <div>
                                    <div class="flex justify-between text-sm mb-1 font-semibold"><span>EPF Balance</span><span>₹12,45,000</span></div>
                                    <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden"><div class="bg-blue-600 h-full" style="width: 40%;"></div></div>
                                </div>
                                <div>
                                    <div class="flex justify-between text-sm mb-1 font-semibold"><span>PPF Balance</span><span>₹8,50,000</span></div>
                                    <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden"><div class="bg-indigo-500 h-full" style="width: 25%;"></div></div>
                                </div>
                                <div>
                                    <div class="flex justify-between text-sm mb-1 font-semibold"><span>NPS Tier I</span><span>₹4,20,000</span></div>
                                    <div class="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden"><div class="bg-sky-500 h-full" style="width: 15%;"></div></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card card--glass p-5">
                            <h3 class="text-lg font-bold mb-4">FIRE Target Calculator</h3>
                            <div class="space-y-3">
                                <div class="p-3 border border-gray-200 rounded-md flex justify-between items-center bg-gray-50">
                                    <div>
                                        <div class="font-bold text-sm">LeanFIRE</div>
                                        <div class="text-xs text-muted mt-0.5">Basic living expenses covered</div>
                                    </div>
                                    <div class="text-lg font-bold">₹3.5 Cr</div>
                                </div>
                                <div class="p-3 border border-green-300 rounded-md flex justify-between items-center bg-green-50 shadow-sm relative overflow-hidden">
                                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                                    <div class="pl-2">
                                        <div class="font-bold text-green-800 text-sm">Standard FIRE</div>
                                        <div class="text-xs text-green-600 mt-0.5">Current lifestyle maintained</div>
                                    </div>
                                    <div class="text-lg font-bold text-green-800">₹5.2 Cr</div>
                                </div>
                                <div class="p-3 border border-gray-200 rounded-md flex justify-between items-center bg-gray-50">
                                    <div>
                                        <div class="font-bold text-sm">FatFIRE</div>
                                        <div class="text-xs text-muted mt-0.5">Luxury lifestyle with buffer</div>
                                    </div>
                                    <div class="text-lg font-bold">₹8.5 Cr</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        bindEvents(container) {
            const syncSlider = (id, valId, formatter) => {
                const slider = container.querySelector(id);
                const valDisplay = container.querySelector(valId);
                if (slider && valDisplay) {
                    slider.addEventListener('input', (e) => {
                        valDisplay.textContent = formatter ? formatter(e.target.value) : e.target.value;
                    });
                }
            };
            
            syncSlider('#slider-ret-age', '#val-ret-age');
            syncSlider('#slider-mo-exp', '#val-mo-exp', (v) => Number(v).toLocaleString('en-IN'));
            syncSlider('#slider-inf', '#val-inf', (v) => v + '%');
            syncSlider('#slider-pre-ret', '#val-pre-ret', (v) => v + '%');
            syncSlider('#slider-post-ret', '#val-post-ret', (v) => v + '%');
            syncSlider('#slider-life', '#val-life');

            const simBtn = container.querySelector('#btn-simulate-ret');
            if (simBtn) {
                simBtn.addEventListener('click', () => {
                    alert('Simulating Retirement trajectory via Monte Carlo...');
                });
            }
        },
        
        renderCharts(container) {
            // Chart rendering logic to be wired up with a library
        },
        
        destroy() {
            this.charts.forEach(c => {
                if (c && typeof c.destroy === 'function') c.destroy();
            });
            this.charts = [];
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Retirement = Retirement;
})();
