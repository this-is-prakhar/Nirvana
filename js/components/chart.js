(function() {
    'use strict';

    const ChartComponent = {
        _renderCard: function(title, subtitle, canvasId, controlsHtml = '', legendHtml = '') {
            const hasHeader = !!(title || subtitle || controlsHtml);
            return `
                <div class="chart-card card card--elevated p-5">
                    ${hasHeader ? `
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            ${title ? `<h3 class="text-primary font-bold text-base">${title}</h3>` : ''}
                            ${subtitle ? `<p class="text-secondary text-xs mt-0.5">${subtitle}</p>` : ''}
                        </div>
                        ${controlsHtml ? `<div class="chart-controls">${controlsHtml}</div>` : ''}
                    </div>` : ''}
                    <div class="chart-container" style="position: relative; height: 260px; min-height: 260px;">
                        <canvas id="${canvasId}"></canvas>
                    </div>
                    ${legendHtml ? `<div class="chart-legend mt-4 border-t pt-3 flex flex-wrap justify-center gap-4 text-xs">${legendHtml}</div>` : ''}
                </div>
            `;
        },

        createDonut: function(containerId, { title, subtitle, labels = [], data = [], colors, centerValue, centerLabel }) {
            const container = document.getElementById(containerId);
            if (!container) return null;

            const canvasId = `donut-${containerId}-${Math.random().toString(36).substr(2, 9)}`;
            const palette = colors || ['#10b981', '#6366f1', '#f59e0b', '#0ea5e9', '#ec4899', '#8b5cf6'];
            
            // Build visual legend
            let legendHtml = '';
            const total = data.reduce((s, v) => s + (v || 0), 0) || 1;
            labels.forEach((lbl, idx) => {
                const val = data[idx] || 0;
                const pct = Math.round((val / total) * 100);
                const col = palette[idx % palette.length];
                legendHtml += `
                    <div class="flex items-center gap-1.5">
                        <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${col};"></span>
                        <span class="text-secondary font-medium">${lbl}:</span>
                        <span class="font-bold text-primary">${pct}%</span>
                    </div>
                `;
            });

            container.innerHTML = this._renderCard(title, subtitle, canvasId, '', legendHtml);

            // If Chart.js is loaded
            if (typeof Chart !== 'undefined' && window.Nirvana && window.Nirvana.Charts) {
                const helper = window.Nirvana.Charts;
                const fn = helper.createDonut || helper.createDonutChart;
                if (fn) {
                    return fn.call(helper, canvasId, { labels, data, colors: palette, centerValue, centerLabel });
                }
            } else {
                // High fidelity SVG fallback
                this._renderSvgDonutFallback(canvasId, labels, data, palette);
            }
            return null;
        },

        createLine: function(containerId, { title, subtitle, labels = [], datasets = [], periods }) {
            const container = document.getElementById(containerId);
            if (!container) return null;

            const canvasId = `line-${containerId}-${Math.random().toString(36).substr(2, 9)}`;
            
            let controlsHtml = '';
            if (periods && periods.length > 0) {
                controlsHtml = `<div class="period-selectors flex gap-2">`;
                periods.forEach((p, i) => {
                    controlsHtml += `<button class="btn btn--sm ${i === 0 ? 'btn--primary' : 'btn--ghost'} text-xs py-0.5 px-2" data-period="${p}">${p}</button>`;
                });
                controlsHtml += `</div>`;
            }

            container.innerHTML = this._renderCard(title, subtitle, canvasId, controlsHtml);

            if (typeof Chart !== 'undefined' && window.Nirvana && window.Nirvana.Charts) {
                const helper = window.Nirvana.Charts;
                const fn = helper.createLine || helper.createLineChart;
                if (fn) {
                    return fn.call(helper, canvasId, { labels, datasets });
                }
            }
            return null;
        },

        createBar: function(containerId, { title, subtitle, labels = [], datasets = [], stacked }) {
            const container = document.getElementById(containerId);
            if (!container) return null;

            const canvasId = `bar-${containerId}-${Math.random().toString(36).substr(2, 9)}`;
            
            // Build legend
            let legendHtml = '';
            const palette = ['#10b981', '#f59e0b', '#6366f1', '#ef4444'];
            datasets.forEach((ds, idx) => {
                const col = ds.backgroundColor || palette[idx % palette.length];
                legendHtml += `
                    <div class="flex items-center gap-1.5">
                        <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${col};"></span>
                        <span class="text-secondary font-medium">${ds.label || `Dataset ${idx+1}`}</span>
                    </div>
                `;
            });

            container.innerHTML = this._renderCard(title, subtitle, canvasId, '', legendHtml);

            if (typeof Chart !== 'undefined' && window.Nirvana && window.Nirvana.Charts) {
                const helper = window.Nirvana.Charts;
                const fn = helper.createBar || helper.createBarChart;
                if (fn) {
                    return fn.call(helper, canvasId, { labels, datasets, stacked });
                }
            } else {
                this._renderSvgBarFallback(canvasId, labels, datasets);
            }
            return null;
        },

        createRadar: function(containerId, { title, labels, data, maxValue }) {
            const container = document.getElementById(containerId);
            if (!container) return null;

            const canvasId = `radar-${containerId}-${Math.random().toString(36).substr(2, 9)}`;
            container.innerHTML = this._renderCard(title, '', canvasId);

            if (typeof Chart !== 'undefined' && window.Nirvana && window.Nirvana.Charts) {
                const helper = window.Nirvana.Charts;
                const fn = helper.createRadar || helper.createRadarChart;
                if (fn) {
                    return fn.call(helper, canvasId, { labels, data, maxValue });
                }
            }
            return null;
        },

        _renderSvgDonutFallback(canvasId, labels, data, palette) {
            const canvas = document.getElementById(canvasId);
            if (!canvas || !canvas.parentElement) return;
            const parent = canvas.parentElement;
            
            let total = data.reduce((s, v) => s + (v || 0), 0) || 100;
            let currentAngle = 0;
            let svgPaths = '';
            
            data.forEach((val, idx) => {
                const angle = (val / total) * 360;
                const col = palette[idx % palette.length];
                const x1 = 100 + 80 * Math.cos(Math.PI * currentAngle / 180);
                const y1 = 100 + 80 * Math.sin(Math.PI * currentAngle / 180);
                const x2 = 100 + 80 * Math.cos(Math.PI * (currentAngle + angle) / 180);
                const y2 = 100 + 80 * Math.sin(Math.PI * (currentAngle + angle) / 180);
                const largeArc = angle > 180 ? 1 : 0;
                
                svgPaths += `<path d="M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${col}" opacity="0.9"/>`;
                currentAngle += angle;
            });
            
            parent.innerHTML = `
                <div class="flex items-center justify-center h-full">
                    <svg viewBox="0 0 200 200" width="200" height="200">
                        ${svgPaths}
                        <circle cx="100" cy="100" r="55" fill="#111827"/>
                        <text x="100" y="105" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">ALLOCATION</text>
                    </svg>
                </div>
            `;
        },

        _renderSvgBarFallback(canvasId, labels, datasets) {
            const canvas = document.getElementById(canvasId);
            if (!canvas || !canvas.parentElement) return;
            const parent = canvas.parentElement;
            
            let barsHtml = '<div class="flex items-end justify-around h-48 pt-6 px-4 gap-2 border-b">';
            labels.forEach((lbl, i) => {
                const v1 = (datasets[0] && datasets[0].data[i]) || 50;
                const v2 = (datasets[1] && datasets[1].data[i]) || 30;
                const h1 = Math.min(100, Math.round((v1 / 150) * 100));
                const h2 = Math.min(100, Math.round((v2 / 150) * 100));
                
                barsHtml += `
                    <div class="flex flex-col items-center gap-1 flex-1">
                        <div class="flex items-end gap-1 w-full justify-center" style="height: 120px;">
                            <div style="height: ${h1}%; width: 12px; background: #10b981; border-radius: 2px 2px 0 0;" title="${datasets[0]?.label}: ₹${v1}k"></div>
                            <div style="height: ${h2}%; width: 12px; background: #f59e0b; border-radius: 2px 2px 0 0;" title="${datasets[1]?.label}: ₹${v2}k"></div>
                        </div>
                        <span class="text-[10px] text-muted font-semibold mt-1">${lbl}</span>
                    </div>
                `;
            });
            barsHtml += '</div>';
            parent.innerHTML = barsHtml;
        }
    };

    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Components = window.Nirvana.Components || {};
    window.Nirvana.Components.ChartComponent = ChartComponent;
})();
