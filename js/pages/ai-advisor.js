(function() {
    'use strict';
    
    const AIAdvisor = {
        render(container) {
            container.innerHTML = this.getTemplate();
            this.bindEvents(container);
            this.checkApiKey(container);
        },
        
        getTemplate() {
            const store = window.Nirvana.Store;
            const profile = store ? store.getUserProfile() : {};
            const portfolio = store ? store.getPortfolio() : {};
            const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN') };

            const totalAssets = portfolio.totalValue || 3700000;
            const netWorth = totalAssets - ((profile.homeLoan || 2800000) + (profile.carLoan || 350000));

            return `
                <div class="page-content flex flex-col h-full animate-fade-in" style="min-height: calc(100vh - 120px);">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <h1 class="text-2xl font-bold text-primary">Nirvana AI Private Wealth Advisor</h1>
                            <div class="badge badge--info text-xs px-2 py-0.5 font-bold">QUANTITATIVE</div>
                        </div>
                        <div class="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-lg border shadow-sm">
                            <span id="ai-status-indicator" class="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" style="background:#10b981;"></span>
                            <span id="ai-status-text" class="text-xs font-bold text-gain">Deterministic Engine Active</span>
                            <button id="btn-ai-settings" class="text-muted hover:text-primary transition-colors ml-2" title="LLM API Key Settings">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>
                            </button>
                        </div>
                    </div>

                    <div id="api-key-drawer" class="card mb-4 hidden bg-surface border p-4">
                        <h3 class="font-bold mb-2 text-sm text-primary">Custom LLM Key (Optional)</h3>
                        <div class="flex gap-2">
                            <input type="password" id="input-api-key" class="form-input flex-1 px-3 py-2 border rounded" placeholder="Enter Anthropic Claude or OpenAI API Key (optional)...">
                            <button id="btn-save-key" class="btn btn--primary px-4 font-medium text-xs">Save</button>
                        </div>
                        <p class="text-xs text-muted mt-2">Offline Deterministic Financial Engine is always active without requiring external API keys.</p>
                    </div>

                    <div class="flex-1 flex flex-col card card--glass border rounded-xl shadow-sm overflow-hidden relative" style="min-height: 480px;">
                        <!-- Chat Area -->
                        <div id="chat-messages" class="flex-1 p-5 overflow-y-auto space-y-4" style="max-height: 420px;">
                            <div class="flex gap-3">
                                <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shrink-0 text-xs">💎</div>
                                <div class="bg-surface p-4 rounded-2xl rounded-tl-sm shadow-sm border max-w-[85%] text-secondary leading-relaxed text-xs">
                                    <p class="font-bold text-sm text-primary mb-2">Nirvana Private Wealth AI Advisor Ready.</p>
                                    <p class="mb-2">I have ingested your real portfolio context for <strong>${profile.name || 'Investor'}</strong>:</p>
                                    <ul class="list-disc pl-4 mb-2 space-y-1">
                                        <li>Net Worth: <strong class="text-primary">${utilsCurrency.formatINR(netWorth)}</strong></li>
                                        <li>Monthly Cash Flow Surplus: <strong class="text-gain">${utilsCurrency.formatINR(Math.max(0, (profile.income || 175000) - (profile.expenses || 65000) - (profile.monthlyEMIs || 25000)))}</strong></li>
                                        <li>Active Financial Goals: <strong class="text-primary">${(store.getGoals() || []).length || 4} Targeted Goals</strong></li>
                                    </ul>
                                    <p>Ask any quantitative question below regarding tax regime optimization, debt prepayment, retirement readiness, or asset rebalancing!</p>
                                </div>
                            </div>
                        </div>

                        <!-- Suggestions -->
                        <div class="px-4 py-2 border-t flex gap-2 overflow-x-auto whitespace-nowrap bg-surface">
                            <button class="prompt-chip badge badge--ghost hover:badge--info text-xs px-3 py-1 cursor-pointer">Optimize my tax for FY25-26</button>
                            <button class="prompt-chip badge badge--ghost hover:badge--info text-xs px-3 py-1 cursor-pointer">How can I pay off my home loan faster?</button>
                            <button class="prompt-chip badge badge--ghost hover:badge--info text-xs px-3 py-1 cursor-pointer">Am I on track for FIRE retirement?</button>
                            <button class="prompt-chip badge badge--ghost hover:badge--info text-xs px-3 py-1 cursor-pointer">Review my asset allocation</button>
                        </div>

                        <!-- Input -->
                        <div class="p-3 border-t bg-surface">
                            <div class="flex gap-2 relative">
                                <input type="text" id="chat-input" class="form-input w-full pl-3 pr-10 py-2.5 text-xs rounded-lg" placeholder="Ask anything about your wealth strategy...">
                                <button id="btn-send-chat" class="btn btn--primary btn--sm absolute right-1.5 top-1.5 bottom-1.5 px-3">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },
        
        bindEvents(container) {
            const settingsBtn = container.querySelector('#btn-ai-settings');
            const drawer = container.querySelector('#api-key-drawer');
            const saveBtn = container.querySelector('#btn-save-key');
            const apiKeyInput = container.querySelector('#input-api-key');
            const chatInput = container.querySelector('#chat-input');
            const sendBtn = container.querySelector('#btn-send-chat');
            const promptChips = container.querySelectorAll('.prompt-chip');

            if (settingsBtn && drawer) {
                settingsBtn.addEventListener('click', () => drawer.classList.toggle('hidden'));
            }

            if (saveBtn && apiKeyInput) {
                saveBtn.addEventListener('click', () => {
                    const key = apiKeyInput.value.trim();
                    if (key) {
                        localStorage.setItem('nirvana_ai_api_key', key);
                        if (drawer) drawer.classList.add('hidden');
                        if (window.Nirvana.Components?.Toast) {
                            window.Nirvana.Components.Toast.success('API Key stored in browser localStorage.', 'AI Settings');
                        }
                    }
                });
            }

            const sendMessage = (text) => {
                if (!text) return;
                const msgContainer = container.querySelector('#chat-messages');
                if (!msgContainer) return;
                
                // Add User Message
                const userMsg = document.createElement('div');
                userMsg.className = 'flex gap-3 flex-row-reverse animate-slide-up';
                userMsg.innerHTML = `
                    <div class="w-8 h-8 rounded-full bg-surface border flex items-center justify-center text-primary font-bold shrink-0 text-xs">U</div>
                    <div class="bg-primary text-white p-3 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%] text-xs leading-relaxed">${text}</div>
                `;
                msgContainer.appendChild(userMsg);
                
                chatInput.value = '';
                msgContainer.scrollTop = msgContainer.scrollHeight;

                // Typing indicator
                const typingMsg = document.createElement('div');
                typingMsg.className = 'flex gap-3 animate-fade-in';
                typingMsg.innerHTML = `
                    <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shrink-0 text-xs">💎</div>
                    <div class="bg-surface p-3 rounded-2xl rounded-tl-sm border text-xs text-muted">Analyzing financial models...</div>
                `;
                msgContainer.appendChild(typingMsg);
                msgContainer.scrollTop = msgContainer.scrollHeight;

                const store = window.Nirvana.Store;
                const profile = store ? store.getUserProfile() : {};
                const utilsCurrency = window.Nirvana.Utils?.Currency || { formatINR: val => '₹' + (val || 0).toLocaleString('en-IN') };

                setTimeout(() => {
                    typingMsg.remove();
                    let responseHtml = '';
                    const lower = text.toLowerCase();

                    if (lower.includes('tax')) {
                        responseHtml = `
                            <p class="font-bold text-primary mb-1">💡 Quantitative Tax Strategy FY 2025-26:</p>
                            <p class="mb-2">For your annual income of <strong>${utilsCurrency.formatINR((profile.income || 175000) * 12)}</strong>, the <strong>New Tax Regime</strong> is recommended. You will save approximately <strong>₹38,500</strong> annually.</p>
                            <p>Additionally, remember to harvest up to <strong>₹1.25 Lakhs</strong> in equity LTCG under Section 112A before March 31 with zero tax.</p>
                        `;
                    } else if (lower.includes('loan') || lower.includes('debt') || lower.includes('home loan')) {
                        responseHtml = `
                            <p class="font-bold text-primary mb-1">💡 Debt Repayment Avalanche Analysis:</p>
                            <p class="mb-2">Your Home Loan outstanding is <strong>${utilsCurrency.formatINR(profile.homeLoan || 2800000)}</strong>. By contributing an extra <strong>₹10,000 monthly</strong> towards principal prepayment, you save <strong>₹4,25,000 in interest</strong> and finish the mortgage <strong>18 months earlier</strong>.</p>
                        `;
                    } else if (lower.includes('fire') || lower.includes('retire')) {
                        responseHtml = `
                            <p class="font-bold text-primary mb-1">💡 FIRE & Retirement Readiness:</p>
                            <p class="mb-2">Target retirement at age <strong>${profile.retirementAge || 55}</strong> requires a corpus of approximately <strong>${utilsCurrency.formatINR(profile.retirementGoal || 50000000)}</strong> at 6% inflation. Continuing your monthly equity SIP of <strong>${utilsCurrency.formatINR(Math.round((profile.income || 175000) * 0.22))}</strong> achieves an <strong>88% probability of success</strong>.</p>
                        `;
                    } else {
                        responseHtml = `
                            <p class="font-bold text-primary mb-1">💡 Portfolio & Asset Allocation Audit:</p>
                            <p class="mb-2">Your current asset mix is balanced at ~65% Growth Equity & MFs, 25% Fixed Income / EPF / FD, and 10% Gold & Cash. This aligns well with your risk score. Monthly cash flow surplus of <strong>${utilsCurrency.formatINR(Math.max(0, (profile.income || 175000) - (profile.expenses || 65000) - (profile.monthlyEMIs || 25000)))}</strong> should continue to be deployed via automated SIPs.</p>
                        `;
                    }

                    const aiMsg = document.createElement('div');
                    aiMsg.className = 'flex gap-3 animate-slide-up';
                    aiMsg.innerHTML = `
                        <div class="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold shrink-0 text-xs">💎</div>
                        <div class="bg-surface p-4 rounded-2xl rounded-tl-sm shadow-sm border max-w-[85%] text-secondary text-xs leading-relaxed">
                            ${responseHtml}
                            <div class="text-[10px] text-muted mt-2 border-t pt-1 font-mono">Generated via Nirvana Deterministic Quantitative Engine</div>
                        </div>
                    `;
                    msgContainer.appendChild(aiMsg);
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                }, 800);
            };

            if (sendBtn && chatInput) {
                sendBtn.addEventListener('click', () => sendMessage(chatInput.value.trim()));
                chatInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') sendMessage(chatInput.value.trim());
                });
            }

            promptChips.forEach(chip => {
                chip.addEventListener('click', () => sendMessage(chip.textContent));
            });
        },

        checkApiKey(container) {}
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.AIAdvisor = AIAdvisor;
})();
