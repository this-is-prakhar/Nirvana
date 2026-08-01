(function() {
    'use strict';
    
    const AIAdvisor = {
        render(container) {
            container.innerHTML = this.getTemplate();
            this.bindEvents(container);
            this.checkApiKey(container);
        },
        
        getTemplate() {
            return `
                <div class="page-content flex flex-col h-full animate-fade-in" style="min-height: calc(100vh - 100px);">
                    <div class="flex items-center justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <h1 class="text-2xl font-bold">Nirvana AI Private Wealth Advisor</h1>
                            <div class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">BETA</div>
                        </div>
                        <div class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                            <span id="ai-status-indicator" class="w-2.5 h-2.5 rounded-full bg-danger relative shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                            <span id="ai-status-text" class="text-xs font-bold text-gray-700">API Key Required</span>
                            <div class="w-px h-4 bg-gray-300 mx-1"></div>
                            <button id="btn-ai-settings" class="text-gray-500 hover:text-gray-900 transition-colors" title="Settings">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" /></svg>
                            </button>
                        </div>
                    </div>

                    <div id="api-key-drawer" class="card mb-4 hidden bg-slate-50 border border-slate-200 p-4">
                        <h3 class="font-bold mb-3 text-slate-800">LLM Configuration (Local-First)</h3>
                        <div class="flex gap-2">
                            <input type="password" id="input-api-key" class="form-input flex-1 px-3 py-2 border border-slate-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter Anthropic / OpenAI API Key to unlock full intelligence...">
                            <button id="btn-save-key" class="btn btn--primary px-5 font-medium">Save Securely</button>
                        </div>
                        <p class="text-xs text-slate-500 mt-3 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" /></svg>
                            Key stored exclusively in browser localStorage. Never sent to our servers.
                        </p>
                    </div>

                    <div class="flex-1 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative">
                        <!-- Chat Area -->
                        <div id="chat-messages" class="flex-1 p-5 overflow-y-auto space-y-6 bg-gray-50">
                            <div class="flex gap-4">
                                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                <div class="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 max-w-[85%] text-gray-800 leading-relaxed text-sm">
                                    <p class="font-semibold text-base mb-2">Welcome to Nirvana Private Wealth AI.</p>
                                    <p class="mb-3">I have automatically digested your complete profile context:</p>
                                    <ul class="list-disc pl-5 mb-3 text-gray-600 space-y-1">
                                        <li>Net Worth: <span class="font-semibold text-gray-800">₹2.85 Cr</span></li>
                                        <li>Risk Profile: <span class="font-semibold text-gray-800">Aggressive</span></li>
                                        <li>Target Goal: <span class="font-semibold text-gray-800">FIRE by 45 (₹5.2 Cr req)</span></li>
                                    </ul>
                                    <p>How can I assist you with your wealth strategy today?</p>
                                </div>
                            </div>
                        </div>

                        <!-- Suggestions -->
                        <div class="px-4 py-3 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto whitespace-nowrap hide-scrollbar">
                            <button class="prompt-chip bg-gray-50 border border-gray-200 text-gray-700 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm">Optimize my tax for FY25-26</button>
                            <button class="prompt-chip bg-gray-50 border border-gray-200 text-gray-700 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm">Analyze portfolio risk</button>
                            <button class="prompt-chip bg-gray-50 border border-gray-200 text-gray-700 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm">Am I on track for FIRE?</button>
                            <button class="prompt-chip bg-gray-50 border border-gray-200 text-gray-700 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm">Best credit card for travel?</button>
                        </div>

                        <!-- Input -->
                        <div class="p-4 bg-white border-t border-gray-200">
                            <div class="flex gap-3 relative">
                                <input type="text" id="chat-input" class="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-800" placeholder="Ask anything about your wealth strategy...">
                                <button id="btn-send-chat" class="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 font-medium transition-colors flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" /></svg>
                                </button>
                            </div>
                            <div class="text-center mt-2">
                                <span class="text-[10px] text-gray-400 uppercase tracking-wider">Secure Local Execution Environment</span>
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

            settingsBtn.addEventListener('click', () => {
                drawer.classList.toggle('hidden');
            });

            saveBtn.addEventListener('click', () => {
                const key = apiKeyInput.value.trim();
                if (key) {
                    localStorage.setItem('nirvana_ai_api_key', key);
                    this.checkApiKey(container);
                    drawer.classList.add('hidden');
                    apiKeyInput.value = '';
                }
            });

            const sendMessage = (text) => {
                if(!text) return;
                const msgContainer = container.querySelector('#chat-messages');
                
                // Add User Message
                const userMsg = document.createElement('div');
                userMsg.className = 'flex gap-4 flex-row-reverse animate-slide-up';
                userMsg.innerHTML = \`
                    <div class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold shadow-md shrink-0">U</div>
                    <div class="bg-gray-800 text-white p-4 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%] text-sm leading-relaxed">\${text}</div>
                \`;
                msgContainer.appendChild(userMsg);
                
                chatInput.value = '';
                msgContainer.scrollTop = msgContainer.scrollHeight;

                // Simulate AI Typing
                const typingMsg = document.createElement('div');
                typingMsg.className = 'flex gap-4 animate-fade-in';
                typingMsg.id = 'typing-indicator';
                typingMsg.innerHTML = \`
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div class="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 flex items-center gap-1">
                        <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                        <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
                    </div>
                \`;
                msgContainer.appendChild(typingMsg);
                msgContainer.scrollTop = msgContainer.scrollHeight;

                // Simulate AI Response based on offline fallback
                setTimeout(() => {
                    typingMsg.remove();
                    const aiMsg = document.createElement('div');
                    aiMsg.className = 'flex gap-4 animate-slide-up';
                    aiMsg.innerHTML = \`
                        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div class="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 max-w-[85%] text-gray-800 text-sm leading-relaxed">
                            <p class="mb-2">Based on the deterministic outputs from Nirvana's Risk & Tax engines:</p>
                            <p class="mb-2">Your current asset allocation deviates from the target aggressive profile by <strong>12% over-exposure to large caps</strong>. Consider tax harvesting ₹45,000 in unrealized LTCG before rebalancing.</p>
                            <p class="mt-3 text-xs text-gray-400 italic flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                Generated using Offline Rule-Based Engine (No API Key detected)
                            </p>
                        </div>
                    \`;
                    msgContainer.appendChild(aiMsg);
                    msgContainer.scrollTop = msgContainer.scrollHeight;
                }, 1500);
            };

            sendBtn.addEventListener('click', () => sendMessage(chatInput.value.trim()));
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage(chatInput.value.trim());
            });

            promptChips.forEach(chip => {
                chip.addEventListener('click', () => {
                    sendMessage(chip.textContent);
                });
            });
        },

        checkApiKey(container) {
            const key = localStorage.getItem('nirvana_ai_api_key');
            const indicator = container.querySelector('#ai-status-indicator');
            const statusText = container.querySelector('#ai-status-text');
            
            if (key) {
                indicator.classList.remove('bg-danger', 'shadow-[0_0_8px_rgba(239,68,68,0.6)]');
                indicator.classList.add('bg-success', 'shadow-[0_0_8px_rgba(34,197,94,0.6)]');
                statusText.textContent = 'Active / Connected';
                statusText.classList.add('text-green-700');
            } else {
                indicator.classList.remove('bg-success', 'shadow-[0_0_8px_rgba(34,197,94,0.6)]');
                indicator.classList.add('bg-danger', 'shadow-[0_0_8px_rgba(239,68,68,0.6)]');
                statusText.textContent = 'Offline Mode (API Key Required)';
                statusText.classList.remove('text-green-700');
            }
        },
        
        destroy() {}
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};
    window.Nirvana.Pages.AIAdvisor = AIAdvisor;
})();
