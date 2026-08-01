(function() {
    'use strict';

    const Form = {
        createInput: function({ name, label, type = 'text', placeholder = '', required = false, value = '', hint = '', error = '' }) {
            return `
                <div class="form-group">
                    <label class="form-label">${label}${required ? ' <span class="text-danger">*</span>' : ''}</label>
                    <input type="${type}" name="${name}" class="form-input ${error ? 'error' : ''}" placeholder="${placeholder}" value="${value}" ${required ? 'required' : ''}>
                    ${hint ? `<div class="form-hint text-sm text-secondary mt-1">${hint}</div>` : ''}
                    ${error ? `<div class="form-error text-sm text-danger mt-1">${error}</div>` : ''}
                </div>
            `;
        },

        createSelect: function({ name, label, options, value, placeholder = '', required = false }) {
            let optsHtml = placeholder ? `<option value="" disabled ${!value ? 'selected' : ''}>${placeholder}</option>` : '';
            options.forEach(opt => {
                const optVal = typeof opt === 'object' ? opt.value : opt;
                const optLabel = typeof opt === 'object' ? opt.label : opt;
                const isSelected = value === optVal ? 'selected' : '';
                optsHtml += `<option value="${optVal}" ${isSelected}>${optLabel}</option>`;
            });

            return `
                <div class="form-group">
                    <label class="form-label">${label}${required ? ' <span class="text-danger">*</span>' : ''}</label>
                    <select name="${name}" class="form-select" ${required ? 'required' : ''}>
                        ${optsHtml}
                    </select>
                </div>
            `;
        },

        createCurrencyInput: function({ name, label, value = '', required = false }) {
            return `
                <div class="form-group">
                    <label class="form-label">${label}${required ? ' <span class="text-danger">*</span>' : ''}</label>
                    <div class="input-with-prefix">
                        <span class="input-prefix">₹</span>
                        <input type="text" name="${name}" class="form-input currency-input" value="${value}" ${required ? 'required' : ''} data-type="currency">
                    </div>
                </div>
            `;
        },

        createRadioGroup: function({ name, label, options, value }) {
            let optsHtml = options.map((opt, i) => {
                const id = `${name}-opt-${i}`;
                const optVal = typeof opt === 'object' ? opt.value : opt;
                const optLabel = typeof opt === 'object' ? opt.label : opt;
                const isChecked = value === optVal ? 'checked' : '';
                return `
                    <div class="radio-item flex items-center gap-2">
                        <input type="radio" id="${id}" name="${name}" value="${optVal}" ${isChecked}>
                        <label for="${id}">${optLabel}</label>
                    </div>
                `;
            }).join('');

            return `
                <div class="form-group">
                    <label class="form-label">${label}</label>
                    <div class="radio-group flex gap-4 mt-2">
                        ${optsHtml}
                    </div>
                </div>
            `;
        },

        createCheckbox: function({ name, label, checked = false }) {
            const id = `cb-${name}-${Math.random().toString(36).substr(2, 9)}`;
            return `
                <div class="form-group checkbox-group flex items-center gap-2">
                    <input type="checkbox" id="${id}" name="${name}" ${checked ? 'checked' : ''}>
                    <label for="${id}">${label}</label>
                </div>
            `;
        },
        
        createToggle: function({ name, label, checked = false }) {
            const id = `toggle-${name}-${Math.random().toString(36).substr(2, 9)}`;
            return `
                <div class="form-group toggle-group flex items-center justify-between">
                    <label for="${id}" class="form-label mb-0">${label}</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="${id}" name="${name}" ${checked ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            `;
        },

        createTextarea: function({ name, label, value = '', rows = 3 }) {
            return `
                <div class="form-group">
                    <label class="form-label">${label}</label>
                    <textarea name="${name}" class="form-input" rows="${rows}">${value}</textarea>
                </div>
            `;
        },

        getFormData: function(formElement) {
            const formData = new FormData(formElement);
            const data = {};
            for (let [key, val] of formData.entries()) {
                const input = formElement.querySelector(`[name="${key}"]`);
                if (input && input.dataset.type === 'currency') {
                    val = val.replace(/[^0-9.-]+/g, "");
                    val = parseFloat(val) || 0;
                }
                data[key] = val;
            }
            // Add unchecked checkboxes/toggles
            const checkboxes = formElement.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                if (!cb.checked) data[cb.name] = false;
                else data[cb.name] = true;
            });
            return data;
        },

        validateField: function(input, rules) {
            let valid = true;
            let message = '';
            const val = input.value;

            if (rules.required && !val.trim()) {
                valid = false;
                message = 'This field is required';
            } else if (rules.min && parseFloat(val) < rules.min) {
                valid = false;
                message = `Value must be at least ${rules.min}`;
            }
            // Add more as needed

            return { valid, message };
        },

        setupCurrencyFormatting: function(inputElement) {
            inputElement.addEventListener('input', (e) => {
                let val = e.target.value.replace(/[^0-9]/g, '');
                if (val) {
                    val = parseInt(val, 10).toLocaleString('en-IN');
                    e.target.value = val;
                }
            });
        },

        createWizard: function({ steps, containerId, onStepChange, onComplete }) {
            const container = document.getElementById(containerId);
            if (!container) return;

            let currentStepIdx = 0;
            let wizardData = {};

            const renderWizard = () => {
                const step = steps[currentStepIdx];
                
                let progressHtml = '<div class="wizard-progress flex gap-2 mb-6">';
                steps.forEach((s, i) => {
                    const activeClass = i === currentStepIdx ? 'active bg-primary' : (i < currentStepIdx ? 'completed bg-primary' : 'bg-secondary opacity-50');
                    progressHtml += `<div class="progress-bar flex-1 h-2 rounded ${activeClass}"></div>`;
                });
                progressHtml += '</div>';

                let fieldsHtml = '<form id="wizard-form">';
                fieldsHtml += `<h2>${step.title}</h2>`;
                if (step.description) fieldsHtml += `<p class="text-secondary mb-4">${step.description}</p>`;
                
                if (step.render) {
                    fieldsHtml += step.render(wizardData);
                } else if (step.fields) {
                    step.fields.forEach(f => {
                        const mergedField = { ...f, value: wizardData[f.name] || f.value || '' };
                        if (f.type === 'select') fieldsHtml += this.createSelect(mergedField);
                        else if (f.type === 'currency') fieldsHtml += this.createCurrencyInput(mergedField);
                        else if (f.type === 'radio') fieldsHtml += this.createRadioGroup(mergedField);
                        else fieldsHtml += this.createInput(mergedField);
                    });
                }
                fieldsHtml += '</form>';

                let actionsHtml = '<div class="wizard-actions flex justify-between mt-6 pt-4 border-t border-secondary">';
                if (currentStepIdx > 0) {
                    actionsHtml += `<button class="btn btn--secondary" id="wizard-prev">Back</button>`;
                } else {
                    actionsHtml += `<div></div>`;
                }
                
                if (currentStepIdx < steps.length - 1) {
                    actionsHtml += `<button class="btn btn--primary" id="wizard-next">Next</button>`;
                } else {
                    actionsHtml += `<button class="btn btn--primary" id="wizard-finish">Complete</button>`;
                }
                actionsHtml += '</div>';

                container.innerHTML = `
                    <div class="wizard card card--elevated">
                        ${progressHtml}
                        ${fieldsHtml}
                        ${actionsHtml}
                    </div>
                `;

                // Setup currency formatting
                const currInputs = container.querySelectorAll('.currency-input');
                currInputs.forEach(inp => this.setupCurrencyFormatting(inp));

                // Autosave
                const form = container.querySelector('#wizard-form');
                form.addEventListener('input', () => {
                    const data = this.getFormData(form);
                    wizardData = { ...wizardData, ...data };
                });

                const prevBtn = container.querySelector('#wizard-prev');
                if (prevBtn) prevBtn.addEventListener('click', () => {
                    currentStepIdx--;
                    renderWizard();
                    if (onStepChange) onStepChange(currentStepIdx, wizardData);
                });

                const nextBtn = container.querySelector('#wizard-next');
                if (nextBtn) nextBtn.addEventListener('click', () => {
                    // Simple validation check
                    if (form.checkValidity()) {
                        const data = this.getFormData(form);
                        wizardData = { ...wizardData, ...data };
                        currentStepIdx++;
                        renderWizard();
                        if (onStepChange) onStepChange(currentStepIdx, wizardData);
                    } else {
                        form.reportValidity();
                    }
                });

                const finishBtn = container.querySelector('#wizard-finish');
                if (finishBtn) finishBtn.addEventListener('click', () => {
                    if (form.checkValidity()) {
                        const data = this.getFormData(form);
                        wizardData = { ...wizardData, ...data };
                        if (onComplete) onComplete(wizardData);
                    } else {
                        form.reportValidity();
                    }
                });
            };

            renderWizard();
        }
    };

    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Components = window.Nirvana.Components || {};
    window.Nirvana.Components.Form = Form;
})();
