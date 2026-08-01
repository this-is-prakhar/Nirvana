(function() {
    'use strict';
    
    const Currency = {
        formatINR: function(amount) {
            if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
            const num = Number(amount);
            return new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(num);
        },
        formatCompact: function(amount) {
            if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
            const num = Number(amount);
            const absNum = Math.abs(num);
            const sign = num < 0 ? '-' : '';
            if (absNum >= 10000000) {
                return `${sign}₹${(absNum / 10000000).toFixed(2).replace(/\.00$/, '')}Cr`;
            } else if (absNum >= 100000) {
                return `${sign}₹${(absNum / 100000).toFixed(2).replace(/\.00$/, '')}L`;
            } else {
                return `${sign}₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(absNum)}`;
            }
        },
        parseINR: function(string) {
            if (!string) return 0;
            const cleaned = string.replace(/[^0-9.-]+/g, '');
            const parsed = parseFloat(cleaned);
            return isNaN(parsed) ? 0 : parsed;
        },
        formatPercentage: function(value, decimals = 2) {
            if (value === null || value === undefined || isNaN(value)) return '0.00%';
            const num = Number(value);
            const sign = num > 0 ? '+' : '';
            return `${sign}${num.toFixed(decimals)}%`;
        },
        formatChange: function(value) {
            if (value === null || value === undefined || isNaN(value)) {
                return { text: '₹0', class: 'text-muted' };
            }
            const num = Number(value);
            const absNum = Math.abs(num);
            const formatted = this.formatCompact(absNum);
            if (num > 0) {
                return { text: `+${formatted}`, class: 'text-gain' };
            } else if (num < 0) {
                return { text: `-${formatted}`, class: 'text-loss' };
            }
            return { text: formatted, class: 'text-muted' };
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Utils = window.Nirvana.Utils || {};
    window.Nirvana.Utils.Currency = Currency;
})();
