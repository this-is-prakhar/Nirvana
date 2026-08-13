(function() {
    'use strict';

    const icons = {
        grid: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
        briefcase: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>',
        target: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
        lightbulb: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.41.6 2.5 1.5 3.5.76.76 1.23 1.52 1.41 2.5"></path></svg>',
        wallet: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>',
        'credit-card': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
        shield: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
        bank: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>',
        calculator: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><line x1="8" y1="10" x2="8" y2="10"></line><line x1="12" y1="10" x2="12" y2="10"></line><line x1="16" y1="10" x2="16" y2="10"></line><line x1="8" y1="14" x2="8" y2="14"></line><line x1="12" y1="14" x2="12" y2="14"></line><line x1="8" y1="18" x2="8" y2="18"></line><line x1="12" y1="18" x2="12" y2="18"></line></svg>',
        sunset: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6"></path><path d="M22 17a10 10 0 0 0-20 0"></path><line x1="2" y1="22" x2="22" y2="22"></line></svg>',
        'file-text': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
        sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path></svg>',
        settings: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>'
    };

    const navStructure = [
        {
            title: 'OVERVIEW',
            items: [
                { path: '/', label: 'Dashboard', icon: 'grid' }
            ]
        },
        {
            title: 'WEALTH',
            items: [
                { path: '/portfolio', label: 'Portfolio', icon: 'briefcase' },
                { path: '/goals', label: 'Goals', icon: 'target' },
                { path: '/recommendations', label: 'Recommendations', icon: 'lightbulb' },
                { path: '/withdrawal', label: 'Withdrawal Planner', icon: 'wallet' }
            ]
        },
        {
            title: 'OPTIMIZE',
            items: [
                { path: '/credit-cards', label: 'Credit Cards', icon: 'credit-card' },
                { path: '/insurance', label: 'Insurance', icon: 'shield' },
                { path: '/loans', label: 'Loans', icon: 'bank' },
                { path: '/tax', label: 'Tax', icon: 'calculator' },
                { path: '/retirement', label: 'Retirement', icon: 'sunset' }
            ]
        },
        {
            title: 'TOOLS',
            items: [
                { path: '/reports', label: 'Reports', icon: 'file-text' },
                { path: '/ai-advisor', label: 'AI Advisor', icon: 'sparkles' },
                { path: '/admin', label: 'Admin', icon: 'settings' }
            ]
        }
    ];

    const Sidebar = {
        init: function() {
            const navContainer = document.getElementById('sidebar-nav');
            if (!navContainer) return;

            let html = '';
            navStructure.forEach(section => {
                html += `<div class="sidebar-section">
                    <div class="sidebar-section__title">${section.title}</div>
                    <div class="sidebar-section__items">`;
                
                section.items.forEach(item => {
                    html += `<a href="#" class="nav-item" data-path="${item.path}">
                        <span class="nav-item__icon">${icons[item.icon] || ''}</span>
                        <span class="nav-item__label">${item.label}</span>
                    </a>`;
                });

                html += `</div></div>`;
            });

            navContainer.innerHTML = html;

            navContainer.addEventListener('click', (e) => {
                const navItem = e.target.closest('.nav-item');
                if (navItem) {
                    e.preventDefault();
                    const path = navItem.getAttribute('data-path');
                    if (window.Nirvana.Router) {
                        window.Nirvana.Router.navigate(path);
                    }
                    if (window.innerWidth < 768) {
                        this.closeMobile();
                    }
                }
            });

            const toggleBtn = document.getElementById('sidebar-collapse-btn') || document.getElementById('sidebar-toggle');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => this.toggle());
            }

            const mobileBtn = document.getElementById('mobile-menu-btn');
            if (mobileBtn) {
                mobileBtn.addEventListener('click', () => {
                    document.body.classList.toggle('sidebar-open');
                    const appEl = document.getElementById('app');
                    if (appEl) appEl.classList.toggle('sidebar-open');
                });
            }
            
            const overlay = document.getElementById('sidebar-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => this.closeMobile());
            }

            const isCollapsed = localStorage.getItem('nirvana_sidebar_collapsed') === 'true';
            if (isCollapsed && window.innerWidth >= 768) {
                document.body.classList.add('sidebar-collapsed');
                const appEl = document.getElementById('app');
                if (appEl) appEl.classList.add('sidebar-collapsed');
            }
        },

        setActive: function(path) {
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                const itemPath = item.getAttribute('data-path');
                if (itemPath === path || (path === '/' && itemPath === '/dashboard') || (path === '/dashboard' && itemPath === '/')) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        },

        toggle: function() {
            if (window.innerWidth < 768) {
                document.body.classList.toggle('sidebar-open');
                const appEl = document.getElementById('app');
                if (appEl) appEl.classList.toggle('sidebar-open');
            } else {
                const isCollapsed = document.body.classList.toggle('sidebar-collapsed');
                const appEl = document.getElementById('app');
                if (appEl) appEl.classList.toggle('sidebar-collapsed', isCollapsed);
                localStorage.setItem('nirvana_sidebar_collapsed', isCollapsed);
            }
        },
        
        closeMobile: function() {
            document.body.classList.remove('sidebar-open');
            const appEl = document.getElementById('app');
            if (appEl) appEl.classList.remove('sidebar-open');
        }
    };

    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Components = window.Nirvana.Components || {};
    window.Nirvana.Components.Sidebar = Sidebar;
})();
