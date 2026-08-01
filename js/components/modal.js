(function() {
    'use strict';

    let modalCounter = 0;

    const Modal = {
        open: function({ title, content, size = 'md', actions = [], onClose }) {
            const modalId = `modal-${++modalCounter}`;
            let container = document.getElementById('modal-container');
            
            if (!container) {
                container = document.createElement('div');
                container.id = 'modal-container';
                document.body.appendChild(container);
            }

            const sizeClass = size === 'sm' ? 'modal--sm' : size === 'lg' ? 'modal--lg' : size === 'full' ? 'modal--full' : '';
            
            let actionsHtml = '';
            if (actions.length > 0) {
                actionsHtml = '<div class="modal-footer flex justify-end gap-2 mt-6 pt-4 border-t border-secondary">';
                actions.forEach((btn, idx) => {
                    const btnClass = btn.variant ? `btn--${btn.variant}` : 'btn--secondary';
                    actionsHtml += `<button class="btn ${btnClass} modal-action-btn" data-idx="${idx}">${btn.label}</button>`;
                });
                actionsHtml += '</div>';
            }

            const modalHtml = `
                <div class="modal-overlay animate-fade-in" id="${modalId}-overlay">
                    <div class="modal card card--elevated ${sizeClass} animate-scale-in" id="${modalId}" role="dialog" aria-modal="true">
                        <div class="modal-header flex justify-between items-center mb-4">
                            <h2 class="text-primary">${title}</h2>
                            <button class="btn btn--icon btn--ghost modal-close-btn" aria-label="Close">✕</button>
                        </div>
                        <div class="modal-content">
                            ${typeof content === 'string' ? content : ''}
                        </div>
                        ${actionsHtml}
                    </div>
                </div>
            `;

            const wrapper = document.createElement('div');
            wrapper.innerHTML = modalHtml;
            const overlay = wrapper.firstElementChild;
            container.appendChild(overlay);

            if (typeof content !== 'string' && content instanceof HTMLElement) {
                overlay.querySelector('.modal-content').appendChild(content);
            }

            document.body.style.overflow = 'hidden';

            const closeFn = () => {
                overlay.classList.remove('animate-fade-in');
                overlay.querySelector('.modal').classList.remove('animate-scale-in');
                overlay.style.opacity = '0';
                
                setTimeout(() => {
                    if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                    if (container.children.length === 0) document.body.style.overflow = '';
                    if (onClose) onClose();
                }, 200); // match transition time
            };

            overlay.querySelector('.modal-close-btn').addEventListener('click', closeFn);
            
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeFn();
            });

            document.addEventListener('keydown', function escListener(e) {
                if (e.key === 'Escape') {
                    closeFn();
                    document.removeEventListener('keydown', escListener);
                }
            });

            if (actions.length > 0) {
                const actionBtns = overlay.querySelectorAll('.modal-action-btn');
                actionBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const idx = parseInt(btn.getAttribute('data-idx'), 10);
                        const action = actions[idx];
                        if (action && action.onClick) {
                            action.onClick(closeFn);
                        } else {
                            closeFn();
                        }
                    });
                });
            }
            
            // Focus trap (simplified)
            const focusable = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusable.length > 0) focusable[0].focus();

            return closeFn;
        },

        close: function() {
            const container = document.getElementById('modal-container');
            if (container && container.lastElementChild) {
                const closeBtn = container.lastElementChild.querySelector('.modal-close-btn');
                if (closeBtn) closeBtn.click();
            }
        },

        confirm: function({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'primary' }) {
            return new Promise((resolve) => {
                this.open({
                    title,
                    content: `<p>${message}</p>`,
                    size: 'sm',
                    actions: [
                        { label: cancelText, variant: 'secondary', onClick: (close) => { resolve(false); close(); } },
                        { label: confirmText, variant: variant, onClick: (close) => { resolve(true); close(); } }
                    ],
                    onClose: () => resolve(false)
                });
            });
        },

        alert: function({ title, message, buttonText = 'OK' }) {
            return new Promise((resolve) => {
                this.open({
                    title,
                    content: `<p>${message}</p>`,
                    size: 'sm',
                    actions: [
                        { label: buttonText, variant: 'primary', onClick: (close) => { resolve(); close(); } }
                    ],
                    onClose: () => resolve()
                });
            });
        }
    };

    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Components = window.Nirvana.Components || {};
    window.Nirvana.Components.Modal = Modal;
})();
