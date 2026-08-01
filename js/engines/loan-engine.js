(function() {
    'use strict';
    
    const LoanEngine = {
        analyzeLoan: function(loan) {
            const p = loan.principal;
            const r = (loan.interestRate / 100) / 12;
            const n = loan.tenureMonths;
            
            const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
            const totalPayment = emi * n;
            const totalInterest = totalPayment - p;
            
            return {
                emi: emi,
                totalInterest: totalInterest,
                amortizationSchedule: [],
                prepaymentSavings: function(amount) { return 0; },
                refinancingBreakeven: function(newRate) { return 0; }
            };
        },
        
        optimizeRepayment: function(loans, availableSurplus) {
            return {
                strategy: 'avalanche',
                order: loans.sort((a, b) => b.interestRate - a.interestRate).map(l => l.id),
                totalInterestSaved: 0,
                debtFreeDate: new Date()
            };
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Engines = window.Nirvana.Engines || {};
    window.Nirvana.Engines.LoanEngine = LoanEngine;
})();
