(function() {
    'use strict';

    const ChartComponent = {
        _renderCard: function(title, subtitle, canvasId, controlsHtml = '') {
            const hasHeader = !!(title || subtitle || controlsHtml);
            return `
                <div class="chart-card card card--elevated">
                    ${hasHeader ? `
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            ${title ? `<h3 class="text-primary">${title}</h3>` : ''}
                            ${subtitle ? `<p class="text-secondary text-sm">${subtitle}</p>` : ''}
                        </div>
                        ${controlsHtml ? `<div class="chart-controls">${controlsHtml}</div>` : ''}
                    </div>` : ''}
                    <div class="chart-container" style="position: relative; height: 300px;">
                        <canvas id="${canvasId}"></canvas>
                    </div>
                </div>
            `;
        },

        createDonut: function(containerId, { title, subtitle, labels, data, colors, centerValue, centerLabel }) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const canvasId = `donut-${containerId}-${Math.random().toString(36).substr(2, 9)}`;
            container.innerHTML = this._renderCard(title, subtitle, canvasId);

            if (window.Nirvana && window.Nirvana.Charts && window.Nirvana.Charts.createDonut) {
                window.Nirvana.Charts.createDonut(canvasId, { labels, data, colors, centerValue, centerLabel });
            }
        },

        createLine: function(containerId, { title, labels, datasets, periods }) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const canvasId = `line-${containerId}-${Math.random().toString(36).substr(2, 9)}`;
            
            let controlsHtml = '';
            if (periods && periods.length > 0) {
                controlsHtml = `<div class="period-selectors flex gap-2">`;
                periods.forEach((p, i) => {
                    controlsHtml += `<button class="btn btn--sm ${i === 0 ? 'btn--primary' : 'btn--ghost'}" data-period="${p}">${p}</button>`;
                });
                controlsHtml += `</div>`;
            }

            container.innerHTML = this._renderCard(title, '', canvasId, controlsHtml);

            if (window.Nirvana && window.Nirvana.Charts && window.Nirvana.Charts.createLine) {
                window.Nirvana.Charts.createLine(canvasId, { labels, datasets });
            }
        },

        createBar: function(containerId, { title, labels, datasets, stacked }) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const canvasId = `bar-${containerId}-${Math.random().toString(36).substr(2, 9)}`;
            container.innerHTML = this._renderCard(title, '', canvasId);

            if (window.Nirvana && window.Nirvana.Charts && window.Nirvana.Charts.createBar) {
                window.Nirvana.Charts.createBar(canvasId, { labels, datasets, stacked });
            }
        },

        createRadar: function(containerId, { title, labels, data, maxValue }) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const canvasId = `radar-${containerId}-${Math.random().toString(36).substr(2, 9)}`;
            container.innerHTML = this._renderCard(title, '', canvasId);

            if (window.Nirvana && window.Nirvana.Charts && window.Nirvana.Charts.createRadar) {
                window.Nirvana.Charts.createRadar(canvasId, { labels, data, maxValue });
            }
        },

        createAllocationBar: function(containerId, { segments }) {
            const container = document.getElementById(containerId);
            if (!container) return;

            let barHtml = '<div class="allocation-bar" style="display: flex; height: 16px; border-radius: 8px; overflow: hidden; width: 100%;">';
            let legendHtml = '<div class="allocation-legend flex gap-4 mt-4" style="flex-wrap: wrap;">';

            segments.forEach(seg => {
                barHtml += `<div style="width: ${seg.percentage}%; background-color: ${seg.color}; height: 100%;" title="${seg.label}: ${seg.percentage}%"></div>`;
                legendHtml += `
                    <div class="flex items-center gap-2">
                        <span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background-color: ${seg.color};"></span>
                        <span class="text-sm text-secondary">${seg.label}</span>
                        <span class="text-sm font-semibold">${seg.percentage}%</span>
                    </div>
                `;
            });

            barHtml += '</div>';
            legendHtml += '</div>';

            container.innerHTML = `
                <div class="card card--elevated">
                    ${barHtml}
                    ${legendHtml}
                </div>
            `;
        }
    };

    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Components = window.Nirvana.Components || {};
    window.Nirvana.Components.ChartComponent = ChartComponent;
})();
