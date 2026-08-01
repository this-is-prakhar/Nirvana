(function() {
    'use strict';
    
    const validRoutes = [
        '/dashboard', '/portfolio', '/goals', '/recommendations', '/withdrawal', 
        '/credit-cards', '/insurance', '/loans', '/tax', '/retirement', 
        '/reports', '/ai-advisor', '/onboarding', '/admin', '/settings'
    ];
    
    const routeListeners = [];
    
    const Router = {
        init: function() {
            window.addEventListener('hashchange', this._handleHashChange.bind(this));
            if (!window.location.hash) {
                this.navigate('/dashboard');
            } else {
                this._handleHashChange();
            }
        },
        
        navigate: function(path) {
            window.location.hash = '#' + path;
        },
        
        getCurrentRoute: function() {
            const hash = window.location.hash.replace('#', '') || '/dashboard';
            const [pathPart, queryPart] = hash.split('?');
            
            let path = pathPart;
            if (!validRoutes.includes(path)) {
                path = '/dashboard'; // default redirect
            }
            
            const params = this._parseParams(queryPart || '');
            const page = path.replace('/', '') || 'dashboard';
            
            return { path, page, params };
        },
        
        _parseParams: function(queryString) {
            const params = {};
            if (!queryString) return params;
            const pairs = queryString.split('&');
            pairs.forEach(pair => {
                const [key, value] = pair.split('=');
                if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
            });
            return params;
        },
        
        getParams: function() {
            return this.getCurrentRoute().params;
        },
        
        onRouteChange: function(callback) {
            routeListeners.push(callback);
            // Immediately inform subscriber of current route if initialized
            const currentRoute = this.getCurrentRoute();
            if (currentRoute) {
                callback(currentRoute);
            }
            return () => {
                const index = routeListeners.indexOf(callback);
                if (index > -1) routeListeners.splice(index, 1);
            };
        },
        
        _handleHashChange: function() {
            const route = this.getCurrentRoute();
            
            // Route guard
            if (window.Nirvana.Store && !window.Nirvana.Store.isOnboarded() && route.path !== '/onboarding') {
                this.navigate('/onboarding');
                return;
            }
            
            this._updateBreadcrumb(route.page);
            this._animateTransition();
            
            routeListeners.forEach(cb => cb(route));
            
            // Look for page render method if it exists
            const pageObj = window.Nirvana.Pages && window.Nirvana.Pages[this._capitalize(route.page)];
            const container = document.querySelector('.page-content');
            
            if (pageObj && container) {
                if (window.Nirvana._currentPage && window.Nirvana._currentPage.destroy) {
                    window.Nirvana._currentPage.destroy();
                }
                container.innerHTML = '';
                pageObj.render(container);
                window.Nirvana._currentPage = pageObj;
            }
        },
        
        _animateTransition: function() {
            const container = document.querySelector('.page-content');
            if (container) {
                container.classList.remove('animate-fade-in');
                void container.offsetWidth; // trigger reflow
                container.classList.add('animate-fade-in');
            }
        },
        
        _updateBreadcrumb: function(pageName) {
            const bcElement = document.querySelector('.breadcrumb-current');
            if (bcElement) {
                bcElement.textContent = this._capitalize(pageName.replace('-', ' '));
            }
        },
        
        _capitalize: function(str) {
            if (!str) return '';
            return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Router = Router;
    
    // Auto-init on load if ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Router.init());
    } else {
        // Use timeout to ensure store is loaded if running immediately
        setTimeout(() => Router.init(), 0);
    }
})();
