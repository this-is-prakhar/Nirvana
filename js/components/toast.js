(function() {
    'use strict';

    const icons = {
        success: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        error: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
        warning: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };

    const Toast = {
        show: function({ title, message, type = 'info', duration = 4000, dismissible = true }) {
            let container = document.getElementById('toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'toast-container';
                container.className = 'toast-container';
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = `toast toast--${type} animate-slide-up`;
            
            let html = `
                <div class="toast-icon">${icons[type] || icons.info}</div>
                <div class="toast-content">
                    ${title ? `<div class="toast-title font-semibold text-xs">${title}</div>` : ''}
                    <div class="toast-message text-xs">${message}</div>
                </div>
            `;
            
            if (dismissible) {
                html += `<button class="toast-close btn--icon btn--ghost" aria-label="Close">✕</button>`;
            }

            if (duration > 0) {
                html += `<div class="toast-progress" style="animation-duration: ${duration}ms"></div>`;
            }

            toast.innerHTML = html;
            container.appendChild(toast);

            const dismiss = () => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    if (toast.parentNode) toast.parentNode.removeChild(toast);
                    if (container.children.length === 0) {
                        if (container.parentNode) container.parentNode.removeChild(container);
                    }
                }, 300);
            };

            if (dismissible) {
                const closeBtn = toast.querySelector('.toast-close');
                if (closeBtn && typeof closeBtn.addEventListener === 'function') {
                    closeBtn.addEventListener('click', dismiss);
                }
                if (typeof toast.addEventListener === 'function') {
                    toast.addEventListener('click', dismiss);
                }
            }

            if (duration > 0) {
                setTimeout(dismiss, duration);
            }
        },

        success: function(message, title) {
            this.show({ message, title, type: 'success' });
        },

        error: function(message, title) {
            this.show({ message, title, type: 'error' });
        },

        warning: function(message, title) {
            this.show({ message, title, type: 'warning' });
        },

        info: function(message, title) {
            this.show({ message, title, type: 'info' });
        }
    };

    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Components = window.Nirvana.Components || {};
    window.Nirvana.Components.Toast = Toast;
})();
