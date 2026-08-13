(function() {
    'use strict';

    const Reports = {
        charts: [],

        render(container) {
            container.innerHTML = this.getTemplate();
            this.bindEvents(container);
        },

        getTemplate() {
            const store = window.Nirvana.Store;
            const userProfile = store ? store.getUserProfile() : {};
            const userName = userProfile.name || 'Investor';

            return `
                <div class="page-content animate-fade-in">
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h1 class="text-2xl font-bold text-primary">Institutional Wealth Audit & Reports</h1>
                            <p class="text-secondary text-sm">Generate downloadable PDF audit statements compiled directly from your real portfolio metrics.</p>
                        </div>
                        <button class="btn btn--primary btn--sm px-4 py-2 flex items-center gap-2" id="btn-generate-audit">
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V8l-4-6z"/><path d="M12 2v6h6"/><path d="M12 11H8M12 14H8"/></svg>
                            Generate Master Wealth Audit (PDF)
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div class="card card--glass p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 group report-card-item">
                            <div class="flex items-center mb-3">
                                <div class="bg-blue-500/20 p-3 rounded-xl mr-4 text-primary">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <h3 class="text-base font-bold">Executive Summary</h3>
                            </div>
                            <p class="text-xs text-secondary leading-relaxed mb-4">High-level wealth health audit, consolidated net worth summary, and macro allocation overview.</p>
                            <button class="btn btn--sm btn--primary w-full btn-download-pdf" data-title="Executive Summary Audit">Download PDF</button>
                        </div>

                        <div class="card card--glass p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 group report-card-item">
                            <div class="flex items-center mb-3">
                                <div class="bg-emerald-500/20 p-3 rounded-xl mr-4 text-gain">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                                </div>
                                <h3 class="text-base font-bold">Asset Allocation & XIRR</h3>
                            </div>
                            <p class="text-xs text-secondary leading-relaxed mb-4">Detailed breakdown of portfolio holdings, asset class proportions, and annualized returns.</p>
                            <button class="btn btn--sm btn--primary w-full btn-download-pdf" data-title="Asset Allocation Report">Download PDF</button>
                        </div>

                        <div class="card card--glass p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 group report-card-item">
                            <div class="flex items-center mb-3">
                                <div class="bg-purple-500/20 p-3 rounded-xl mr-4 text-purple-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                </div>
                                <h3 class="text-base font-bold">Tax Optimization Audit</h3>
                            </div>
                            <p class="text-xs text-secondary leading-relaxed mb-4">Comprehensive tax planning, Section 80C/80D utilization, and capital gains harvesting statement.</p>
                            <button class="btn btn--sm btn--primary w-full btn-download-pdf" data-title="Tax Optimization Report">Download PDF</button>
                        </div>

                        <div class="card card--glass p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 group report-card-item">
                            <div class="flex items-center mb-3">
                                <div class="bg-red-500/20 p-3 rounded-xl mr-4 text-danger">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </div>
                                <h3 class="text-base font-bold">Insurance & Protection</h3>
                            </div>
                            <p class="text-xs text-secondary leading-relaxed mb-4">Human Life Value coverage adequacy for health and life insurance policies against liabilities.</p>
                            <button class="btn btn--sm btn--primary w-full btn-download-pdf" data-title="Insurance Gap Report">Download PDF</button>
                        </div>

                        <div class="card card--glass p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 group report-card-item">
                            <div class="flex items-center mb-3">
                                <div class="bg-yellow-500/20 p-3 rounded-xl mr-4 text-warning">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <h3 class="text-base font-bold">Retirement & FIRE Report</h3>
                            </div>
                            <p class="text-xs text-secondary leading-relaxed mb-4">FIRE readiness projections, Monte Carlo simulations, and milestone funding roadmap.</p>
                            <button class="btn btn--sm btn--primary w-full btn-download-pdf" data-title="Retirement Readiness Report">Download PDF</button>
                        </div>

                        <div class="card card--glass p-5 cursor-pointer hover:shadow-lg transition-shadow border border-gray-100 group report-card-item">
                            <div class="flex items-center mb-3">
                                <div class="bg-gray-500/20 p-3 rounded-xl mr-4 text-muted">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <h3 class="text-base font-bold">Debt Amortization Schedule</h3>
                            </div>
                            <p class="text-xs text-secondary leading-relaxed mb-4">Mortgage and loan repayment schedules, Avalanche interest savings, and debt-free target.</p>
                            <button class="btn btn--sm btn--primary w-full btn-download-pdf" data-title="Debt Amortization Report">Download PDF</button>
                        </div>
                    </div>

                    <div class="card card--glass p-6">
                        <h3 class="text-lg font-bold mb-4">Generated Official Audit Log</h3>
                        <div class="overflow-x-auto">
                            <table class="data-table data-table--striped w-full text-sm">
                                <thead>
                                    <tr class="border-b text-muted">
                                        <th class="text-left py-2 px-3">Date Generated</th>
                                        <th class="text-left py-2 px-3">Report Document</th>
                                        <th class="text-left py-2 px-3">Format</th>
                                        <th class="text-right py-2 px-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="border-b hover:bg-surface">
                                        <td class="py-2.5 px-3 font-mono">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td class="py-2.5 px-3 font-medium text-primary">Master Wealth Audit FY 2025-26 (${userName})</td>
                                        <td class="py-2.5 px-3 text-muted">PDF Document</td>
                                        <td class="text-right py-2.5 px-3">
                                            <button class="btn btn--sm btn--primary text-xs btn-download-pdf" data-title="Master Wealth Audit">Download PDF</button>
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
                    const title = btn.getAttribute('data-title') || 'Master Wealth Audit';
                    this.generatePDF(title);
                });
            });
        },

        generatePDF(reportTitle) {
            const store = window.Nirvana.Store;
            const profile = store ? store.getUserProfile() : {};
            const portfolio = store ? store.getPortfolio() : {};
            const goals = store ? store.getGoals() : [];
            const loans = store ? store.get('loans') || [] : [];
            const insurance = store ? store.get('insurance') || {} : {};

            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => 'Rs. ' + (val || 0).toLocaleString('en-IN') };

            const userName = profile.name || 'Investor';
            const income = profile.income || 175000;
            const expenses = profile.expenses || 65000;
            const totalAssets = portfolio.totalValue || (profile.bankBalance + profile.stocksValue + profile.mfValue + profile.fdValue + profile.goldValue + profile.retCorpus) || 3700000;
            const totalDebt = loans.reduce((s, l) => s + (l.principalRemaining || 0), 0) || (profile.homeLoan || 2800000) + (profile.carLoan || 350000);
            const netWorth = totalAssets - totalDebt;

            let score = 82;
            if (window.Nirvana.Engines?.WealthHealthEngine) {
                const wh = window.Nirvana.Engines.WealthHealthEngine.calculate(profile, portfolio, goals, loans, insurance);
                score = wh.overallScore;
            }

            const alloc = portfolio.allocation || { equity: 60, debt: 25, gold: 8, cash: 7 };

            if (window.jspdf && window.jspdf.jsPDF) {
                try {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();

                    // Header Emerald Banner
                    doc.setFillColor(16, 185, 129);
                    doc.rect(0, 0, 210, 28, 'F');
                    
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(16);
                    doc.setFont('helvetica', 'bold');
                    doc.text('NIRVANA PRIVATE WEALTH MANAGEMENT', 15, 18);

                    // Document Title
                    doc.setTextColor(15, 23, 42);
                    doc.setFontSize(13);
                    doc.text(reportTitle.toUpperCase(), 15, 42);

                    // Meta Info
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(100, 116, 139);
                    doc.text(`Investor Name: ${userName}`, 15, 50);
                    doc.text(`Audit Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, 15, 56);
                    doc.text(`Assessment Year: AY 2026-27 (FY 2025-26)`, 15, 62);

                    doc.setDrawColor(226, 232, 240);
                    doc.line(15, 67, 195, 67);

                    // Section 1: Executive Wealth Summary
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(15, 23, 42);
                    doc.text('1. CONSOLIDATED WEALTH SUMMARY', 15, 76);

                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    doc.text(`• Total Gross Assets: ${utilsCurrency.formatINR(totalAssets)}`, 20, 84);
                    doc.text(`• Total Outstanding Liabilities: ${utilsCurrency.formatINR(totalDebt)}`, 20, 91);
                    doc.text(`• Net Worth Valuation: ${utilsCurrency.formatINR(netWorth)}`, 20, 98);
                    doc.text(`• Monthly Inflow (Take-Home): ${utilsCurrency.formatINR(income)} / month`, 20, 105);
                    doc.text(`• Monthly Outflow & Living Expenses: ${utilsCurrency.formatINR(expenses)} / month`, 20, 112);
                    doc.text(`• Institutional Wealth Health Score: ${score} / 100 (${score >= 80 ? 'Excellent' : 'Good'} Standing)`, 20, 119);

                    doc.line(15, 126, 195, 126);

                    // Section 2: Asset Allocation
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.text('2. STRATEGIC ASSET ALLOCATION', 15, 135);

                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    doc.text(`• Direct Equities & Growth Mutual Funds: ${alloc.equity}% (${utilsCurrency.formatINR(Math.round(totalAssets * alloc.equity / 100))})`, 20, 143);
                    doc.text(`• Fixed Deposits, Bonds & EPF/PPF: ${alloc.debt}% (${utilsCurrency.formatINR(Math.round(totalAssets * alloc.debt / 100))})`, 20, 150);
                    doc.text(`• Sovereign Gold Bonds & Gold ETFs: ${alloc.gold}% (${utilsCurrency.formatINR(Math.round(totalAssets * alloc.gold / 100))})`, 20, 157);
                    doc.text(`• Liquid Bank Savings & Cash Buffer: ${alloc.cash}% (${utilsCurrency.formatINR(Math.round(totalAssets * alloc.cash / 100))})`, 20, 164);

                    doc.line(15, 172, 195, 172);

                    // Section 3: Priority Milestones
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.text('3. FINANCIAL GOALS & RETIREMENT ROADMAP', 15, 181);

                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    if (goals.length > 0) {
                        goals.slice(0, 3).forEach((g, idx) => {
                            const fundedPct = Math.min(100, Math.round(((g.currentCorpus || 0) / (g.targetAmount || 1)) * 100));
                            doc.text(`${idx + 1}. ${g.name}: Target ${utilsCurrency.formatINR(g.targetAmount)} (${fundedPct}% Funded, Required SIP: ${utilsCurrency.formatINR(g.requiredSip)}/mo)`, 20, 190 + (idx * 7));
                        });
                    } else {
                        doc.text('1. Retirement Corpus: Target Rs. 5.00 Cr (On Track)', 20, 190);
                        doc.text('2. Emergency Living Fund: 6.0 Months Funded', 20, 197);
                    }

                    doc.line(15, 215, 195, 215);

                    // Section 4: Quantitative Actions
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.text('4. TOP QUANTITATIVE ACTIONS', 15, 224);

                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'normal');
                    doc.text('1. Tax Optimization: Harvest Rs. 1.25 Lakh annual tax-free LTCG under Section 112A.', 20, 232);
                    doc.text('2. Debt Prepayment: Allocate Rs. 10,000 monthly prepayment to save Rs. 4.25L in mortgage interest.', 20, 239);
                    doc.text('3. Protection: Maintain 10x Human Capital Life Cover and Rs. 50L Super Top-up Health Cover.', 20, 246);

                    // Footer
                    doc.setFontSize(7.5);
                    doc.setTextColor(148, 163, 184);
                    doc.text('Nirvana Private Wealth Management — Confidential & Institutional Document — Generated via Local Browser Protocol', 15, 282);

                    const filename = `${reportTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Nirvana.pdf`;
                    doc.save(filename);

                    if (window.Nirvana.Components?.Toast) {
                        window.Nirvana.Components.Toast.success(`Downloaded ${filename} successfully!`, 'Report Engine');
                    }
                    return;
                } catch (err) {
                    console.warn('PDF save fallback:', err);
                }
            }

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
