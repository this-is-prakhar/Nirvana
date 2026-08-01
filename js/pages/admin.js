(function() {
    'use strict';
    
    const Admin = {
        render(container) {
            container.innerHTML = this.getTemplate();
            this.bindEvents(container);
        },
        
        getTemplate() {
            return `
                <div class="page-content animate-fade-in">
                    <div class="flex items-center justify-between mb-6">
                        <h1 class="text-2xl font-bold">System Control & Data Management</h1>
                        <button class="btn btn--primary flex items-center gap-2" id="btn-refresh-data">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Refresh Platform Data
                        </button>
                    </div>

                    <h2 class="text-lg font-bold mb-3 border-b pb-2">Data Engine Status</h2>
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        <div class="card card--elevated p-4 bg-white border border-gray-100">
                            <div class="text-sm font-medium text-gray-500 mb-1">Stocks (NSE/BSE)</div>
                            <div class="text-2xl font-bold text-gray-800">4,250 <span class="text-xs font-normal text-gray-400">records</span></div>
                            <div class="text-xs font-medium text-green-600 mt-2 flex items-center gap-1">
                                <span class="w-2 h-2 rounded-full bg-green-500"></span> Updated Today, 09:30
                            </div>
                        </div>
                        <div class="card card--elevated p-4 bg-white border border-gray-100">
                            <div class="text-sm font-medium text-gray-500 mb-1">Mutual Funds</div>
                            <div class="text-2xl font-bold text-gray-800">1,820 <span class="text-xs font-normal text-gray-400">records</span></div>
                            <div class="text-xs font-medium text-green-600 mt-2 flex items-center gap-1">
                                <span class="w-2 h-2 rounded-full bg-green-500"></span> Updated Yesterday
                            </div>
                        </div>
                        <div class="card card--elevated p-4 bg-white border border-gray-100">
                            <div class="text-sm font-medium text-gray-500 mb-1">ETFs</div>
                            <div class="text-2xl font-bold text-gray-800">145 <span class="text-xs font-normal text-gray-400">records</span></div>
                            <div class="text-xs font-medium text-green-600 mt-2 flex items-center gap-1">
                                <span class="w-2 h-2 rounded-full bg-green-500"></span> Updated Today, 09:30
                            </div>
                        </div>
                        <div class="card card--elevated p-4 bg-white border border-gray-100">
                            <div class="text-sm font-medium text-gray-500 mb-1">Tax Rules</div>
                            <div class="text-2xl font-bold text-gray-800">FY25-26 <span class="text-xs font-normal text-gray-400">active</span></div>
                            <div class="text-xs font-medium text-green-600 mt-2 flex items-center gap-1">
                                <span class="w-2 h-2 rounded-full bg-green-500"></span> Budget 2024 Verified
                            </div>
                        </div>
                        <div class="card card--elevated p-4 bg-white border border-gray-100">
                            <div class="text-sm font-medium text-gray-500 mb-1">Govt Schemes</div>
                            <div class="text-2xl font-bold text-gray-800">34 <span class="text-xs font-normal text-gray-400">records</span></div>
                            <div class="text-xs font-medium text-yellow-600 mt-2 flex items-center gap-1">
                                <span class="w-2 h-2 rounded-full bg-yellow-500"></span> Updated 1mo ago
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div class="card card--glass p-6">
                            <div class="flex items-center gap-3 mb-4 border-b pb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                                <h3 class="text-lg font-bold text-gray-800">Python Web Scrapers</h3>
                            </div>
                            <p class="text-sm text-gray-600 mb-4 leading-relaxed">Run these commands in your terminal to fetch the latest market data using Nirvana's internal scraping engines. Output JSONs map directly to <code>window.NirvanaData</code>.</p>
                            
                            <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs mb-5 overflow-x-auto shadow-inner leading-loose">
                                <div><span class="text-pink-500">❯</span> python scripts/scrape_investing_com.py --assets "stocks,etfs"</div>
                                <div><span class="text-pink-500">❯</span> python scripts/scrape_paisabazaar.py --type "credit_cards"</div>
                                <div><span class="text-pink-500">❯</span> python scripts/update_macro.py --india</div>
                            </div>
                            
                            <div class="flex gap-3">
                                <button class="btn btn--sm btn--primary px-4">Trigger API Scraper</button>
                                <button class="btn btn--sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4">Upload Scraped JSON</button>
                            </div>
                        </div>

                        <div class="card card--glass p-6">
                            <div class="flex items-center gap-3 mb-4 border-b pb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                                <h3 class="text-lg font-bold text-gray-800">Data Import / Export Studio</h3>
                            </div>
                            <p class="text-sm text-gray-600 mb-5 leading-relaxed">Manage your complete local state. Export your profile for secure offline backups, or import portfolio data from CSV/Excel sheets.</p>
                            
                            <div class="space-y-3">
                                <div class="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>
                                        <span class="text-sm font-semibold text-gray-700">Full Profile State (.json)</span>
                                    </div>
                                    <div class="flex gap-2">
                                        <button class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50">Import</button>
                                        <button class="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">Export Backup</button>
                                    </div>
                                </div>
                                <div class="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        <span class="text-sm font-semibold text-gray-700">Portfolio Holdings (.csv)</span>
                                    </div>
                                    <div class="flex gap-2">
                                        <button class="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">Get Template</button>
                                        <button class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">Upload CSV</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card card--glass p-6">
                        <div class="flex items-center gap-3 mb-4 border-b pb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                            <h3 class="text-lg font-bold text-gray-800">System Diagnostic & Activity Logs</h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="data-table data-table--striped w-full text-sm">
                                <thead>
                                    <tr class="bg-gray-50 text-gray-600 border-b border-gray-200">
                                        <th class="text-left py-3 px-4 font-semibold">Timestamp</th>
                                        <th class="text-left py-3 px-4 font-semibold">Module</th>
                                        <th class="text-left py-3 px-4 font-semibold">Action / Event</th>
                                        <th class="text-left py-3 px-4 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-3 px-4 font-mono text-xs text-gray-500">2026-08-02 09:30:12</td>
                                        <td class="py-3 px-4 font-medium text-gray-700">Engine.Risk</td>
                                        <td class="py-3 px-4 text-gray-600">Recalculated portfolio variance and beta matrix</td>
                                        <td class="py-3 px-4"><span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Success</span></td>
                                    </tr>
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-3 px-4 font-mono text-xs text-gray-500">2026-08-02 09:25:01</td>
                                        <td class="py-3 px-4 font-medium text-gray-700">Store.Portfolio</td>
                                        <td class="py-3 px-4 text-gray-600">Saved new asset allocation target weights</td>
                                        <td class="py-3 px-4"><span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Success</span></td>
                                    </tr>
                                    <tr class="border-b border-gray-100 hover:bg-gray-50">
                                        <td class="py-3 px-4 font-mono text-xs text-gray-500">2026-08-01 18:45:22</td>
                                        <td class="py-3 px-4 font-medium text-gray-700">Data.API</td>
                                        <td class="py-3 px-4 text-gray-600">Failed to fetch live quotes from fallback API endpoint</td>
                                        <td class="py-3 px-4"><span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full">Warning</span></td>
                                    </tr>
                                    <tr class="hover:bg-gray-50">
                                        <td class="py-3 px-4 font-mono text-xs text-gray-500">2026-08-01 10:00:05</td>
                                        <td class="py-3 px-4 font-medium text-gray-700">Scraper.MutualFunds</td>
                                        <td class="py-3 px-4 text-gray-600">Ingested 1,820 NAV records from AMFI raw text file</td>
                                        <td class="py-3 px-4"><span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">Success</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        },
        
        bindEvents(container) {
            const refreshBtn = container.querySelector('#btn-refresh-data');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', () => {
                    alert('Triggering full data engine refresh...');
                });
            }
        },
        
        destroy() {
            // Cleanup logic
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Admin = Admin;
})();
