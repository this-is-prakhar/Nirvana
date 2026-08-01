(function() {
    'use strict';
    
    const colors = [
        '#6366f1', // Indigo
        '#10b981', // Emerald
        '#f59e0b', // Amber
        '#ef4444', // Red
        '#8b5cf6', // Violet
        '#0ea5e9', // Sky
        '#ec4899', // Pink
        '#14b8a6', // Teal
        '#f97316', // Orange
        '#84cc16'  // Lime
    ];
    
    const ChartsHelper = {
        palette: colors,
        
        initDefaultConfig: function() {
            if (typeof Chart === 'undefined') {
                console.warn('Chart.js is not loaded. Nirvana charts cannot be rendered.');
                return;
            }
            
            Chart.defaults.color = '#94a3b8'; // text-muted equivalent
            Chart.defaults.font.family = 'Inter, system-ui, -apple-system, sans-serif';
            Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(15, 23, 42, 0.9)'; // Dark slate
            Chart.defaults.plugins.tooltip.titleColor = '#f8fafc';
            Chart.defaults.plugins.tooltip.bodyColor = '#e2e8f0';
            Chart.defaults.plugins.tooltip.padding = 10;
            Chart.defaults.plugins.tooltip.cornerRadius = 8;
            Chart.defaults.plugins.tooltip.displayColors = true;
        },
        
        formatTooltipValue: function(value, type) {
            if (type === 'currency' && window.Nirvana && window.Nirvana.Utils && window.Nirvana.Utils.Currency) {
                return window.Nirvana.Utils.Currency.formatINR(value);
            } else if (type === 'percentage' && window.Nirvana && window.Nirvana.Utils && window.Nirvana.Utils.Currency) {
                return window.Nirvana.Utils.Currency.formatPercentage(value);
            }
            return new Intl.NumberFormat('en-IN').format(value);
        },
        
        createDonutChart: function(canvasId, { labels, data, colors: customColors }) {
            this.initDefaultConfig();
            const ctx = document.getElementById(canvasId);
            if (!ctx) return null;
            
            return new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: customColors || colors.slice(0, data.length),
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const val = context.raw;
                                    let formattedVal = val;
                                    if(window.Nirvana && window.Nirvana.Utils && window.Nirvana.Utils.Currency) {
                                        formattedVal = window.Nirvana.Utils.Currency.formatCompact(val);
                                    }
                                    return ` ${context.label}: ${formattedVal}`;
                                }
                            }
                        }
                    }
                }
            });
        },
        
        createLineChart: function(canvasId, { labels, datasets }) {
            this.initDefaultConfig();
            const ctx = document.getElementById(canvasId);
            if (!ctx) return null;
            
            return new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: datasets.map((ds, i) => ({
                        ...ds,
                        borderColor: ds.borderColor || colors[i % colors.length],
                        backgroundColor: ds.backgroundColor || 'transparent',
                        borderWidth: ds.borderWidth || 2,
                        tension: 0.4, // smooth curves
                        pointRadius: ds.pointRadius || 0,
                        pointHoverRadius: 6
                    }))
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    scales: {
                        x: { grid: { display: false }, border: { display: false } },
                        y: { 
                            grid: { color: 'rgba(255, 255, 255, 0.05)' }, 
                            border: { display: false },
                            ticks: {
                                callback: function(value) {
                                    if(window.Nirvana && window.Nirvana.Utils && window.Nirvana.Utils.Currency) {
                                        return window.Nirvana.Utils.Currency.formatCompact(value);
                                    }
                                    return value;
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let formattedVal = context.raw;
                                    if(window.Nirvana && window.Nirvana.Utils && window.Nirvana.Utils.Currency) {
                                        formattedVal = window.Nirvana.Utils.Currency.formatINR(context.raw);
                                    }
                                    return ` ${context.dataset.label}: ${formattedVal}`;
                                }
                            }
                        }
                    }
                }
            });
        },
        
        createBarChart: function(canvasId, { labels, datasets, stacked = false }) {
            this.initDefaultConfig();
            const ctx = document.getElementById(canvasId);
            if (!ctx) return null;
            
            return new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets.map((ds, i) => ({
                        ...ds,
                        backgroundColor: ds.backgroundColor || colors[i % colors.length],
                        borderWidth: 0,
                        borderRadius: 4
                    }))
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { stacked, grid: { display: false }, border: { display: false } },
                        y: { 
                            stacked, 
                            grid: { color: 'rgba(255, 255, 255, 0.05)' }, 
                            border: { display: false },
                            ticks: {
                                callback: function(value) {
                                    if(window.Nirvana && window.Nirvana.Utils && window.Nirvana.Utils.Currency) {
                                        return window.Nirvana.Utils.Currency.formatCompact(value);
                                    }
                                    return value;
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let formattedVal = context.raw;
                                    if(window.Nirvana && window.Nirvana.Utils && window.Nirvana.Utils.Currency) {
                                        formattedVal = window.Nirvana.Utils.Currency.formatINR(context.raw);
                                    }
                                    return ` ${context.dataset.label}: ${formattedVal}`;
                                }
                            }
                        }
                    }
                }
            });
        },
        
        createRadarChart: function(canvasId, { labels, data }) {
            this.initDefaultConfig();
            const ctx = document.getElementById(canvasId);
            if (!ctx) return null;
            
            return new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        borderColor: '#6366f1',
                        borderWidth: 2,
                        pointBackgroundColor: '#6366f1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            pointLabels: { color: '#94a3b8' },
                            ticks: { display: false }
                        }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        },
        
        createHorizontalBarChart: function(canvasId, { labels, data, colors: customColors }) {
            this.initDefaultConfig();
            const ctx = document.getElementById(canvasId);
            if (!ctx) return null;
            
            return new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: customColors || colors.slice(0, data.length),
                        borderWidth: 0,
                        borderRadius: 4
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { 
                            grid: { color: 'rgba(255, 255, 255, 0.05)' }, 
                            border: { display: false },
                            ticks: {
                                callback: function(value) {
                                    if(window.Nirvana && window.Nirvana.Utils && window.Nirvana.Utils.Currency) {
                                        return window.Nirvana.Utils.Currency.formatCompact(value);
                                    }
                                    return value;
                                }
                            }
                        },
                        y: { grid: { display: false }, border: { display: false } }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let formattedVal = context.raw;
                                    if(window.Nirvana && window.Nirvana.Utils && window.Nirvana.Utils.Currency) {
                                        formattedVal = window.Nirvana.Utils.Currency.formatINR(context.raw);
                                    }
                                    return ` ${context.label}: ${formattedVal}`;
                                }
                            }
                        }
                    }
                }
            });
        },
        
        destroyChart: function(chart) {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        },
        
        updateChart: function(chart, newData) {
            if (chart) {
                chart.data = newData;
                chart.update();
            }
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Charts = ChartsHelper;
})();
