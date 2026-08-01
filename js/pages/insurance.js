(function() {
    'use strict';
    
    const Insurance = {
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
                        <h1 class="text-primary text-2xl font-bold">Insurance & Protection Analysis</h1>
                        <button class="btn btn--primary px-4 py-2 bg-blue-600 text-white rounded">
                            <span class="btn--icon">🛡️</span> Re-evaluate Coverage
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <!-- Life Insurance -->
                        <div class="card card--elevated p-6 border rounded-lg shadow-sm bg-white">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-xl font-bold flex items-center gap-2">👨‍👩‍👧 Life Insurance Coverage</h2>
                                <span class="badge badge--warning bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Underinsured</span>
                            </div>
                            
                            <div class="mb-6">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-muted">Current Cover</span>
                                    <span class="font-bold text-primary">₹1.50 Cr</span>
                                </div>
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-muted">Required Cover (HCV Method)</span>
                                    <span class="font-bold text-gray-800">₹3.00 Cr</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-3">
                                    <div class="bg-yellow-500 h-3 rounded-full" style="width: 50%"></div>
                                </div>
                                <div class="text-xs text-danger mt-2 font-semibold">Gap: ₹1.50 Cr (Action Required)</div>
                            </div>
                            
                            <div class="bg-blue-50 p-4 rounded border border-blue-100">
                                <h3 class="font-semibold text-sm mb-2">Recommended Solution</h3>
                                <p class="text-sm text-gray-700 mb-3">Add a pure term plan of ₹1.5 Cr until age 60.</p>
                                <button class="btn btn--sm btn--primary bg-blue-600 text-white px-3 py-1 rounded text-sm">Compare Term Plans</button>
                            </div>
                        </div>
                        
                        <!-- Health Insurance -->
                        <div class="card card--elevated p-6 border rounded-lg shadow-sm bg-white">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-xl font-bold flex items-center gap-2">🏥 Health Insurance Coverage</h2>
                                <span class="badge badge--success bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Adequate</span>
                            </div>
                            
                            <div class="mb-6">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-muted">Base + Super Top-up</span>
                                    <span class="font-bold text-primary">₹25L + ₹50L</span>
                                </div>
                                <div class="flex justify-between text-sm mb-2">
                                    <span class="text-muted">Recommended Cover</span>
                                    <span class="font-bold text-gray-800">₹50L Total</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-3">
                                    <div class="bg-green-500 h-3 rounded-full" style="width: 100%"></div>
                                </div>
                                <div class="text-xs text-gain mt-2 font-semibold">Adequately covered for family floaters.</div>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-2 text-sm border-t pt-4">
                                <div>
                                    <span class="text-muted block text-xs">Senior Parent Cover</span>
                                    <span class="font-semibold">₹10L (Active)</span>
                                </div>
                                <div>
                                    <span class="text-muted block text-xs">Restoration Benefit</span>
                                    <span class="font-semibold text-gain">Available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card card--elevated p-6 border rounded-lg shadow-sm bg-white mb-6">
                        <h2 class="text-xl font-bold mb-4">Policy Vault & Renewal Alerts</h2>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-100 border-b">
                                        <th class="p-3 font-semibold text-sm">Policy Name</th>
                                        <th class="p-3 font-semibold text-sm">Type</th>
                                        <th class="p-3 font-semibold text-sm">Cover Amount</th>
                                        <th class="p-3 font-semibold text-sm">Premium</th>
                                        <th class="p-3 font-semibold text-sm">Next Renewal</th>
                                        <th class="p-3 font-semibold text-sm">Status</th>
                                    </tr>
                                </thead>
                                <tbody id="policy-vault-body">
                                    <!-- Populated by JS -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        },
        
        formatInr(amount) {
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
        },
        
        renderContent() {
            const policies = [
                { name: 'HDFC Ergo Optima Restore', type: 'Health (Family)', cover: 2500000, premium: 28500, date: '15-Oct-2026', status: 'Active' },
                { name: 'Max Life Smart Term', type: 'Term Life', cover: 15000000, premium: 14500, date: '02-Nov-2026', status: 'Active' },
                { name: 'Star Health Senior Citizen Red Carpet', type: 'Health (Parents)', cover: 1000000, premium: 45000, date: '10-Aug-2026', status: 'Due Soon' }
            ];
            
            const tbodyHtml = policies.map(p => {
                let badgeClass = p.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
                return `
                <tr class="border-b hover:bg-gray-50">
                    <td class="p-3 font-medium">${p.name}</td>
                    <td class="p-3 text-sm text-gray-600">${p.type}</td>
                    <td class="p-3 font-semibold">${this.formatInr(p.cover)}</td>
                    <td class="p-3 text-sm">${this.formatInr(p.premium)}/yr</td>
                    <td class="p-3 text-sm ${p.status === 'Due Soon' ? 'text-danger font-bold' : ''}">${p.date}</td>
                    <td class="p-3"><span class="badge px-2 py-1 rounded text-xs ${badgeClass}">${p.status}</span></td>
                </tr>
            `}).join('');
            
            this.container.querySelector('#policy-vault-body').innerHTML = tbodyHtml;
        },
        
        destroy() {
            if(this.container) this.container.innerHTML = '';
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Insurance = Insurance;
})();
