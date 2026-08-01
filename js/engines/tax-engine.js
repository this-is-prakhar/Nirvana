(function() {
    'use strict';
    
    const TaxEngine = {
        calculateTax: function(income, deductions, regime) {
            let taxableIncome = regime === 'Old' ? Math.max(0, income - deductions) : income;
            let tax = 0;
            
            if (regime === 'Old') {
                if (taxableIncome > 1000000) {
                    tax += (taxableIncome - 1000000) * 0.30 + 112500;
                } else if (taxableIncome > 500000) {
                    tax += (taxableIncome - 500000) * 0.20 + 12500;
                } else if (taxableIncome > 250000) {
                    tax += (taxableIncome - 250000) * 0.05;
                }
            } else {
                if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.30 + 150000;
                else if (taxableIncome > 1200000) tax += (taxableIncome - 1200000) * 0.20 + 90000;
                else if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.15 + 60000;
                else if (taxableIncome > 700000) tax += (taxableIncome - 700000) * 0.10 + 30000;
                else if (taxableIncome > 300000) tax += (taxableIncome - 300000) * 0.05;
            }
            
            // Rebate under 87A (Simplified)
            if (regime === 'Old' && taxableIncome <= 500000) tax = 0;
            if (regime === 'New' && taxableIncome <= 700000) tax = 0;
            
            const surcharge = taxableIncome > 5000000 ? tax * 0.10 : 0;
            const cess = (tax + surcharge) * 0.04;
            const totalTax = tax + surcharge + cess;
            
            return {
                taxableIncome: taxableIncome,
                tax: tax,
                cess: cess,
                surcharge: surcharge,
                totalTax: totalTax,
                effectiveRate: taxableIncome > 0 ? (totalTax / income) * 100 : 0,
                marginalRate: 0 
            };
        },
        
        compareRegimes: function(income, deductions) {
            const oldR = this.calculateTax(income, deductions, 'Old');
            const newR = this.calculateTax(income, 50000, 'New'); // Standard deduction in new regime typically allowed
            
            const recommendation = oldR.totalTax <= newR.totalTax ? 'Old' : 'New';
            const savings = Math.abs(oldR.totalTax - newR.totalTax);
            
            return {
                oldRegime: oldR,
                newRegime: newR,
                recommendation: recommendation,
                savings: savings
            };
        },
        
        optimizeDeductions: function(income, currentDeductions) {
            return {
                optimal: { sec80C: 150000, sec80D: 25000 },
                additionalSavings: 0,
                recommendations: []
            };
        },
        
        calculateCapitalGains: function(holdings, sales) {
            return {
                stcg: 0, ltcg: 0, taxOnSTCG: 0, taxOnLTCG: 0, totalTax: 0
            };
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Engines = window.Nirvana.Engines || {};
    window.Nirvana.Engines.TaxEngine = TaxEngine;
})();
