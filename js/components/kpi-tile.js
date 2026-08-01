(function() {
    'use strict';

    const KPITile = {
        render: function({ label, value, trend, trendValue, icon, iconColor, format }) {
            let formattedValue = value;
            if (window.Nirvana && window.Nirvana.Utils && window.Nirvana.Utils.Currency && format === 'currency') {
                formattedValue = window.Nirvana.Utils.Currency.format(value);
            } else if (format === 'percentage') {
                formattedValue = `${value}%`;
            }

            let trendClass = 'kpi-trend--flat';
            let trendIcon = '';
            if (trend === 'up') {
                trendClass = 'kpi-trend--up';
                trendIcon = '↑';
            } else if (trend === 'down') {
                trendClass = 'kpi-trend--down';
                trendIcon = '↓';
            }

            let trendHtml = '';
            if (trendValue) {
                trendHtml = `<div class="kpi-trend ${trendClass}">${trendIcon} ${trendValue}</div>`;
            }

            return `
                <div class="kpi-tile card card--elevated">
                    <div class="flex justify-between items-center mb-4">
                        <div class="kpi-label text-secondary">${label}</div>
                        ${icon ? `<div class="kpi-icon kpi-icon--${iconColor || 'blue'}">${icon}</div>` : ''}
                    </div>
                    <div class="kpi-value text-primary" data-value="${value}" data-format="${format || 'number'}">${formattedValue}</div>
                    ${trendHtml}
                </div>
            `;
        },

        renderSkeleton: function() {
            return `
                <div class="kpi-tile card card--elevated skeleton">
                    <div class="flex justify-between items-center mb-4">
                        <div class="skeleton--text" style="width: 60%"></div>
                        <div class="skeleton--circle" style="width: 24px; height: 24px"></div>
                    </div>
                    <div class="skeleton--text" style="width: 80%; height: 2rem; margin-bottom: 0.5rem"></div>
                    <div class="skeleton--text" style="width: 40%"></div>
                </div>
            `;
        },

        animateValue: function(element, start, end, duration, format) {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentVal = Math.floor(progress * (end - start) + start);
                
                let formattedValue = currentVal;
                if (window.Nirvana && window.Nirvana.Utils && window.Nirvana.Utils.Currency && format === 'currency') {
                    formattedValue = window.Nirvana.Utils.Currency.format(currentVal);
                } else if (format === 'percentage') {
                    formattedValue = `${currentVal}%`;
                } else if (format === 'number') {
                    formattedValue = currentVal.toLocaleString('en-IN');
                }

                element.innerHTML = formattedValue;
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    let finalVal = end;
                    if (window.Nirvana && window.Nirvana.Utils && window.Nirvana.Utils.Currency && format === 'currency') {
                        finalVal = window.Nirvana.Utils.Currency.format(end);
                    } else if (format === 'percentage') {
                        finalVal = `${end}%`;
                    } else if (format === 'number') {
                        finalVal = end.toLocaleString('en-IN');
                    }
                    element.innerHTML = finalVal;
                }
            };
            window.requestAnimationFrame(step);
        }
    };

    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Components = window.Nirvana.Components || {};
    window.Nirvana.Components.KPITile = KPITile;
})();
