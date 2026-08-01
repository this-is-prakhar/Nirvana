(function() {
    'use strict';

    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Pages = window.Nirvana.Pages || {};

    const App = {
        init: async function() {
            this.showLoading('Initializing wealth engine...');
            
            try {
                // Initialize Data Loader
                if (window.Nirvana.DataLoader && typeof window.Nirvana.DataLoader.init === 'function') {
                    this.updateLoadingText('Loading market datasets...');
                    window.Nirvana.DataLoader.init();
                }

                // Initialize Components (Sidebar, etc.)
                if (window.Nirvana.Components && window.Nirvana.Components.Sidebar && typeof window.Nirvana.Components.Sidebar.init === 'function') {
                    window.Nirvana.Components.Sidebar.init();
                }

                // Setup global event listeners
                this.setupGlobalEvents();
                
                // Initialize Router with routes
                this.setupRoutes();

                // Small delay to ensure smooth transition
                setTimeout(() => {
                    this.hideLoading();
                    
                    // Route resolution
                    const store = window.Nirvana.Store;
                    const router = window.Nirvana.Router;
                    
                    if (router) {
                        router.init();
                        const currentRoute = router.getCurrentRoute();
                        
                        if (store && typeof store.isOnboarded === 'function' && !store.isOnboarded()) {
                            router.navigate('/onboarding');
                        } else if (!currentRoute || currentRoute.path === '/' || currentRoute.path === '') {
                            router.navigate('/dashboard');
                        }
                    }
                    
                    this.logActivity('App initialized successfully');
                }, 400);

            } catch (error) {
                console.error('Initialization error:', error);
                this.showError('Failed to initialize application: ' + error.message);
            }
        },
        
        setupRoutes: function() {
            if (!window.Nirvana.Router) {
                console.error('Router module missing');
                return;
            }
            
            const router = window.Nirvana.Router;
            const container = document.getElementById('page-content');
            
            if (!container) {
                console.error('Page container (#page-content) missing');
                return;
            }
            
            let currentPageObj = null;
            
            router.onRouteChange((route) => {
                const path = route.path.replace('/', '');
                
                // Update sidebar active state
                if (window.Nirvana.Components && window.Nirvana.Components.Sidebar) {
                    window.Nirvana.Components.Sidebar.setActive(route.path);
                }

                // Destroy previous page instance if present
                if (currentPageObj && typeof currentPageObj.destroy === 'function') {
                    try {
                        currentPageObj.destroy();
                    } catch (e) {
                        console.warn('Error destroying page:', e);
                    }
                }
                
                container.innerHTML = '';
                
                // Route mapping to window.Nirvana.Pages.[PageName]
                const pageName = this.pathToPageName(path);
                
                if (window.Nirvana.Pages && window.Nirvana.Pages[pageName]) {
                    currentPageObj = window.Nirvana.Pages[pageName];
                    try {
                        currentPageObj.render(container);
                    } catch (renderErr) {
                        console.error(`Error rendering page ${pageName}:`, renderErr);
                        container.innerHTML = `
                            <div class="empty-state">
                                <div class="empty-state__icon">⚠️</div>
                                <div class="empty-state__title">Render Error</div>
                                <div class="empty-state__text">Failed to render ${pageName}: ${renderErr.message}</div>
                            </div>
                        `;
                    }
                } else {
                    container.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state__icon">🔍</div>
                            <div class="empty-state__title">Page Not Found</div>
                            <div class="empty-state__text">The requested route <code>${route.path}</code> could not be found.</div>
                            <button class="btn btn--primary mt-4" onclick="window.Nirvana.Router.navigate('/dashboard')">Go to Dashboard</button>
                        </div>
                    `;
                    currentPageObj = null;
                }
            });
        },

        pathToPageName: function(path) {
            if (!path || path === '' || path === 'dashboard') return 'Dashboard';
            // Handles hyphens like 'credit-cards' -> 'CreditCards', 'ai-advisor' -> 'AIAdvisor'
            if (path === 'credit-cards') return 'CreditCards';
            if (path === 'ai-advisor') return 'AIAdvisor';
            return path.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
        },
        
        setupGlobalEvents: function() {
            // Cmd+K or Ctrl+K search palette
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    this.toggleCommandPalette();
                }
            });

            // Mobile menu button
            const mobileBtn = document.getElementById('mobile-menu-btn');
            if (mobileBtn) {
                mobileBtn.addEventListener('click', () => {
                    if (window.Nirvana.Components && window.Nirvana.Components.Sidebar) {
                        window.Nirvana.Components.Sidebar.toggle();
                    }
                });
            }

            // Sidebar collapse button
            const collapseBtn = document.getElementById('sidebar-collapse-btn');
            if (collapseBtn) {
                collapseBtn.addEventListener('click', () => {
                    if (window.Nirvana.Components && window.Nirvana.Components.Sidebar) {
                        window.Nirvana.Components.Sidebar.toggle();
                    }
                });
            }

            // Theme toggle button
            const themeBtn = document.getElementById('theme-toggle-btn');
            if (themeBtn) {
                themeBtn.addEventListener('click', () => {
                    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
                    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                    document.documentElement.setAttribute('data-theme', newTheme);
                    
                    const darkIcon = themeBtn.querySelector('.theme-icon-dark');
                    const lightIcon = themeBtn.querySelector('.theme-icon-light');
                    if (darkIcon && lightIcon) {
                        darkIcon.style.display = newTheme === 'dark' ? 'block' : 'none';
                        lightIcon.style.display = newTheme === 'light' ? 'block' : 'none';
                    }

                    if (window.Nirvana.Store) {
                        const settings = window.Nirvana.Store.getSettings() || {};
                        settings.theme = newTheme;
                        window.Nirvana.Store.setSettings(settings);
                    }
                });
            }

            // Search trigger input button
            const searchTrigger = document.getElementById('search-trigger');
            if (searchTrigger) {
                searchTrigger.addEventListener('click', () => {
                    this.toggleCommandPalette();
                });
            }

            // Command Palette overlay close
            const paletteOverlay = document.getElementById('command-palette-overlay');
            if (paletteOverlay) {
                paletteOverlay.addEventListener('click', () => {
                    this.toggleCommandPalette(false);
                });
            }

            // ESC key to close command palette
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.toggleCommandPalette(false);
                }
            });
        },
        
        toggleCommandPalette: function(show) {
            const palette = document.getElementById('command-palette');
            if (!palette) return;

            const isVisible = palette.style.display !== 'none';
            const shouldShow = show !== undefined ? show : !isVisible;

            if (shouldShow) {
                palette.style.display = 'block';
                const input = document.getElementById('command-palette-input');
                if (input) {
                    input.value = '';
                    input.focus();
                    this.renderCommandResults('');
                }
            } else {
                palette.style.display = 'none';
            }
        },

        renderCommandResults: function(query) {
            const container = document.getElementById('command-palette-results');
            if (!container) return;

            if (!query) {
                container.innerHTML = `
                    <div class="command-palette-group">Quick Navigation</div>
                    <div class="command-palette-item" onclick="window.Nirvana.Router.navigate('/dashboard'); window.Nirvana.App.toggleCommandPalette(false);">
                        <div class="command-palette-item__icon">📊</div>
                        <div class="command-palette-item__text">
                            <div class="command-palette-item__title">Dashboard</div>
                            <div class="command-palette-item__subtitle">Overview of portfolio, net worth, and health score</div>
                        </div>
                    </div>
                    <div class="command-palette-item" onclick="window.Nirvana.Router.navigate('/portfolio'); window.Nirvana.App.toggleCommandPalette(false);">
                        <div class="command-palette-item__icon">💼</div>
                        <div class="command-palette-item__text">
                            <div class="command-palette-item__title">Portfolio</div>
                            <div class="command-palette-item__subtitle">Holdings, XIRR returns, asset allocation</div>
                        </div>
                    </div>
                    <div class="command-palette-item" onclick="window.Nirvana.Router.navigate('/goals'); window.Nirvana.App.toggleCommandPalette(false);">
                        <div class="command-palette-item__icon">🎯</div>
                        <div class="command-palette-item__text">
                            <div class="command-palette-item__title">Financial Goals</div>
                            <div class="command-palette-item__subtitle">Track retirement, housing, education goals</div>
                        </div>
                    </div>
                    <div class="command-palette-item" onclick="window.Nirvana.Router.navigate('/tax'); window.Nirvana.App.toggleCommandPalette(false);">
                        <div class="command-palette-item__icon">🧮</div>
                        <div class="command-palette-item__text">
                            <div class="command-palette-item__title">Tax Optimization</div>
                            <div class="command-palette-item__subtitle">Old vs New tax regime, capital gains harvesting</div>
                        </div>
                    </div>
                `;
                return;
            }

            const results = window.Nirvana.DataLoader ? window.Nirvana.DataLoader.search(query) : [];
            if (results.length === 0) {
                container.innerHTML = `<div class="p-4 text-center text-tertiary">No matching items found for "${query}"</div>`;
                return;
            }

            container.innerHTML = results.slice(0, 8).map(res => `
                <div class="command-palette-item">
                    <div class="command-palette-item__icon">⚡</div>
                    <div class="command-palette-item__text">
                        <div class="command-palette-item__title">${res.item.name || res.item.symbol || 'Result'}</div>
                        <div class="command-palette-item__subtitle">${res.type} — ${res.matchText}</div>
                    </div>
                </div>
            `).join('');
        },
        
        showLoading: function(text) {
            const loader = document.getElementById('loading-screen');
            if (loader) {
                loader.classList.remove('fade-out');
                loader.style.display = 'flex';
            }
            if (text) {
                this.updateLoadingText(text);
            }
        },

        updateLoadingText: function(text) {
            const txtEl = document.getElementById('loading-text');
            const barEl = document.getElementById('loading-bar-fill');
            if (txtEl) txtEl.textContent = text;
            if (barEl) {
                const currentWidth = parseInt(barEl.style.width || '20', 10);
                barEl.style.width = Math.min(currentWidth + 30, 90) + '%';
            }
        },
        
        hideLoading: function() {
            const loader = document.getElementById('loading-screen');
            const barEl = document.getElementById('loading-bar-fill');
            const app = document.getElementById('app');

            if (barEl) barEl.style.width = '100%';

            if (loader) {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 400);
            }

            if (app) {
                app.style.display = 'flex';
            }
        },
        
        showError: function(msg) {
            this.hideLoading();
            const container = document.getElementById('page-content') || document.body;
            container.innerHTML = `<div class="p-8 text-center" style="color:var(--color-loss);"><h2>Initialization Error</h2><p>${msg}</p></div>`;
        },
        
        logActivity: function(details) {
            if (window.Nirvana.Store && typeof window.Nirvana.Store.logActivity === 'function') {
                window.Nirvana.Store.logActivity('System', details);
            }
        }
    };

    window.Nirvana = window.Nirvana || {};
    window.Nirvana.App = App;

    // Command palette search listener
    document.addEventListener('input', (e) => {
        if (e.target && e.target.id === 'command-palette-input') {
            App.renderCommandResults(e.target.value);
        }
    });

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }
})();
