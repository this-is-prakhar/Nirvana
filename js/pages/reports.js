(function() {
    'use strict';

    const Reports = {
        charts: [],

        render(container) {
            container.innerHTML = this.getTemplate();
            this.bindEvents(container);
        },

        getTemplate() {
            const userProfile = window.Nirvana.Store ? window.Nirvana.Store.getUserProfile() : {};
            const userName = userProfile.name || 'Investor';

            return `
                <div class="page-content animate-fade-in">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h1 class="text-2xl font-bold">Institutional Wealth Reports</h1>
                            <p class="text-sm text-secondary">Generate and download official PDF wealth audits and financial statements.</p>
                        </div>
                        <button class="btn btn--primary px-4 py-2 flex items-center gap-2" id="btn-generate-audit">
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V8l-4-6z"/><path d="M12 2v6h6"/><path d="M12 11H8M12 14H8"/></svg>
                            Generate Master Wealth Audit (PDF)
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div class="card card--glass p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 group report-card-item" data-report-type="Executive Summary">
                            <div class="flex items-center mb-3">
                                <div class="bg-blue-100 p-3 rounded-xl mr-4 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <h3 class="text-lg font-bold text-gray-800">Executive Summary</h3>
                            </div>
                            <p class="text-sm text-gray-600 leading-relaxed mb-4">High-level wealth health audit, net worth summary, and macro allocation overview.</p>
                            <button class="btn btn--sm btn--primary w-full btn-download-pdf" data-title="Executive Summary">Download PDF</button>
                        </div>

                        <div class="card card--glass p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 group report-card-item" data-report-type="Asset Allocation">
                            <div class="flex items-center mb-3">
                                <div class="bg-green-100 p-3 rounded-xl mr-4 text-green-700 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                                </div>
                                <h3 class="text-lg font-bold text-gray-800">Asset Allocation & XIRR</h3>
                            </div>
                            <p class="text-sm text-gray-600 leading-relaxed mb-4">Detailed breakdown of portfolio holdings, sectoral exposure, and annualized returns.</p>
                            <button class="btn btn--sm btn--primary w-full btn-download-pdf" data-title="Asset Allocation Report">Download PDF</button>
                        </div>

                        <div class="card card--glass p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 group report-card-item" data-report-type="Tax Optimization">
                            <div class="flex items-center mb-3">
                                <div class="bg-purple-100 p-3 rounded-xl mr-4 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                </div>
                                <h3 class="text-lg font-bold text-gray-800">Tax Optimization</h3>
                            </div>
                            <p class="text-sm text-gray-600 leading-relaxed mb-4">Comprehensive tax planning, Section 80C/80D utilization, and harvesting report.</p>
                            <button class="btn btn--sm btn--primary w-full btn-download-pdf" data-title="Tax Optimization Report">Download PDF</button>
                        </div>

                        <div class="card card--glass p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 group report-card-item" data-report-type="Insurance Protection">
                            <div class="flex items-center mb-3">
                                <div class="bg-red-100 p-3 rounded-xl mr-4 text-red-700 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </div>
                                <h3 class="text-lg font-bold text-gray-800">Insurance & Protection</h3>
                            </div>
                            <p class="text-sm text-gray-600 leading-relaxed mb-4">Coverage analysis for health and life insurance policies against risk profile.</p>
                            <button class="btn btn--sm btn--primary w-full btn-download-pdf" data-title="Insurance Gap Report">Download PDF</button>
                        </div>

                        <div class="card card--glass p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 group report-card-item" data-report-type="Retirement Readiness">
                            <div class="flex items-center mb-3">
                                <div class="bg-yellow-100 p-3 rounded-xl mr-4 text-yellow-700 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <h3 class="text-lg font-bold text-gray-800">Retirement Readiness</h3>
                            </div>
                            <p class="text-sm text-gray-600 leading-relaxed mb-4">FIRE projections, Monte Carlo simulations, and goal progress statement.</p>
                            <button class="btn btn--sm btn--primary w-full btn-download-pdf" data-title="Retirement Readiness Report">Download PDF</button>
                        </div>

                        <div class="card card--glass p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 group report-card-item" data-report-type="Debt Amortization">
                            <div class="flex items-center mb-3">
                                <div class="bg-gray-100 p-3 rounded-xl mr-4 text-gray-700 group-hover:bg-gray-800 group-hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <h3 class="text-lg font-bold text-gray-800">Debt Amortization</h3>
                            </div>
                            <p class="text-sm text-gray-600 leading-relaxed mb-4">Loan repayment schedules, principal/interest breakdown, and prepayment planning.</p>
                            <button class="btn btn--sm btn--primary w-full btn-download-pdf" data-title="Debt Amortization Report">Download PDF</button>
                        </div>
                    </div>

                    <div class="card card--glass p-6">
                        <h3 class="text-xl font-bold mb-4">Generated Reports Log</h3>
                        <div class="overflow-x-auto">
                            <table class="data-table data-table--striped w-full text-sm">
                                <thead>
                                    <tr class="border-b">
                                        <th class="text-left py-3 px-4 font-semibold text-gray-700">Date Generated</th>
                                        <th class="text-left py-3 px-4 font-semibold text-gray-700">Report Title</th>
                                        <th class="text-left py-3 px-4 font-semibold text-gray-700">Format</th>
                                        <th class="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="py-3 px-4">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td class="py-3 px-4 font-medium">Master Wealth Audit FY 2025-26 (${userName})</td>
                                        <td class="py-3 px-4 text-gray-500">PDF Document</td>
                                        <td class="text-right py-3 px-4">
                                            <button class="btn btn--sm btn--ghost mr-2 btn-download-pdf" data-title="Master Wealth Audit">Print / View PDF</button>
                                            <button class="btn btn--sm btn--primary text-xs btn-download-pdf" data-title="Master Wealth Audit">Download PDF</button>
                                        </td>
                                    </tr>
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="py-3 px-4">15 Jul 2025</td>
                                        <td class="py-3 px-4 font-medium">Tax Optimization Statement FY 2025-26</td>
                                        <td class="py-3 px-4 text-gray-500">PDF Document</td>
                                        <td class="text-right py-3 px-4">
                                            <button class="btn btn--sm btn--primary text-xs btn-download-pdf" data-title="Tax Optimization Statement">Download PDF</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        },

        bindEvents(container) {
            const btnAudit = container.querySelector('#btn-generate-audit');
            if (btnAudit) {
                btnAudit.addEventListener('click', () => {
                    this.generatePDF('Master Wealth Audit');
                });
            }

            const downloadBtns = container.querySelectorAll('.btn-download-pdf');
            downloadBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const title = btn.getAttribute('data-title') || 'Wealth Report';
                    this.generatePDF(title);
                });
            });
        },

        generatePDF(reportTitle) {
            if (window.Nirvana.Components && window.Nirvana.Components.Toast) {
                window.Nirvana.Components.Toast.info(`Generating ${reportTitle} PDF...`, 'Report Engine');
            }

            const userProfile = window.Nirvana.Store ? window.Nirvana.Store.getUserProfile() : {};
            const userName = userProfile.name || 'Investor';
            const income = userProfile.income || 175000;
            const expenses = userProfile.expenses || 65000;
            const netWorth = (userProfile.bankBalance || 350000) + (userProfile.stocksValue || 850000) + (userProfile.mfValue || 1200000) + (userProfile.fdValue || 400000) + (userProfile.goldValue || 250000) + (userProfile.retCorpus || 650000) - ((userProfile.homeLoan || 2800000) + (userProfile.carLoan || 350000));

            // Use jsPDF library if loaded
            if (window.jspdf && window.jspdf.jsPDF) {
                try {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();

                    // Header Banner
                    doc.setFillColor(10, 185, 129); // Accent Emerald
                    doc.rect(0, 0, 210, 30, 'F');
                    
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(18);
                    doc.setFont('helvetica', 'bold');
                    doc.text('NIRVANA PRIVATE WEALTH MANAGEMENT', 15, 18);

                    // Title
                    doc.setTextColor(15, 23, 42);
                    doc.setFontSize(14);
                    doc.text(reportTitle.toUpperCase(), 15, 45);

                    // Meta Details
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(100, 116, 139);
                    doc.text(`Investor Name: ${userName}`, 15, 53);
                    doc.text(`Generated Date: ${new Date().toLocaleDateString('en-IN')}`, 15, 60);
                    doc.text(`Financial Assessment Year: AY 2026-27`, 15, 67);

                    doc.setDrawColor(226, 232, 240);
                    doc.line(15, 72, 195, 72);

                    // Section 1: Key Wealth Metrics
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(15, 23, 42);
                    doc.text('1. EXECUTIVE WEALTH METRICS', 15, 82);

                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.text(`Estimated Net Worth: Rs. ${window.Nirvana.Utils.Currency.formatINR(netWorth || 2500000)}`, 20, 92);
                    doc.text(`Monthly Income: Rs. ${window.Nirvana.Utils.Currency.formatINR(income)}`, 20, 100);
                    doc.text(`Monthly Living Expenses: Rs. ${window.Nirvana.Utils.Currency.formatINR(expenses)}`, 20, 108);
                    doc.text(`Monthly Net Surplus: Rs. ${window.Nirvana.Utils.Currency.formatINR(income - expenses)}`, 20, 116);
                    doc.text(`Wealth Health Score: 85 / 100 (Excellent)`, 20, 124);

                    doc.line(15, 132, 195, 132);

                    // Section 2: Asset Allocation
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.text('2. STRATEGIC ASSET ALLOCATION', 15, 142);

                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.text('• Equity & Mutual Funds: 65% (Growth Focused)', 20, 152);
                    doc.text('• Debt & Fixed Deposits: 25% (Capital Preservation)', 20, 160);
                    doc.text('• Sovereign Gold & Physical Gold: 10% (Hedge)', 20, 168);

                    doc.line(15, 176, 195, 176);

                    // Section 3: Recommendations
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.text('3. TOP QUANTITATIVE RECOMMENDATIONS', 15, 186);

                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    doc.text('1. Tax Optimization: Utilize Section 80C ELSS limit before FY end to save Rs 15,000.', 20, 196);
                    doc.text('2. Emergency Fund: Top up liquid bank savings to cover 6 months of living expenses.', 20, 204);
                    doc.text('3. Debt Amortization: Prepay Rs 10,000 monthly towards Home Loan to save Rs 4.2L interest.', 20, 212);

                    // Footer
                    doc.setFontSize(8);
                    doc.setTextColor(148, 163, 184);
                    doc.text('Nirvana Private Wealth Management — Confidential & Institutional Document — Generated via Local Browser Protocol', 15, 280);

                    const filename = `${reportTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Nirvana.pdf`;
                    doc.save(filename);

                    if (window.Nirvana.Components && window.Nirvana.Components.Toast) {
                        window.Nirvana.Components.Toast.success(`Downloaded ${filename}!`, 'PDF Engine');
                    }
                    return;
                } catch (pdfErr) {
                    console.warn('jsPDF error, falling back to window.print():', pdfErr);
                }
            }

            // Fallback to browser print if jsPDF unavailable
            window.print();
        },

        destroy() {
            this.charts = [];
        }
    };

    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.Reports = Reports;
})();
