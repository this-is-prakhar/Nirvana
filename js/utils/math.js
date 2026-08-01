(function() {
    'use strict';
    
    // Seeded PRNG for Monte Carlo determinism
    let seed = 12345;
    function random() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    }

    // Box-Muller transform for normal distribution
    function randomNormal(mean, stdDev) {
        let u1 = 0, u2 = 0;
        while(u1 === 0) u1 = random();
        while(u2 === 0) u2 = random();
        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * stdDev + mean;
    }
    
    const MathUtils = {
        cagr: function(beginValue, endValue, years) {
            if (years <= 0 || beginValue <= 0) return 0;
            return (Math.pow(endValue / beginValue, 1 / years) - 1) * 100;
        },
        xirr: function(cashflows, dates, guess = 0.1) {
            if (!cashflows || !dates || cashflows.length !== dates.length || cashflows.length === 0) return 0;
            
            const dateObjects = dates.map(d => new Date(d));
            const startDate = dateObjects[0];
            const yearsArr = dateObjects.map(d => (d - startDate) / (1000 * 60 * 60 * 24 * 365));
            
            let rate = guess;
            let iter = 0;
            let maxIter = 100;
            let tol = 0.00001;
            
            while (iter < maxIter) {
                let npv = 0;
                let npvDerivative = 0;
                
                for (let i = 0; i < cashflows.length; i++) {
                    const factor = Math.pow(1 + rate, yearsArr[i]);
                    npv += cashflows[i] / factor;
                    npvDerivative -= (yearsArr[i] * cashflows[i]) / Math.pow(1 + rate, yearsArr[i] + 1);
                }
                
                if (Math.abs(npv) < tol) return rate * 100;
                if (npvDerivative === 0) break;
                
                const newRate = rate - npv / npvDerivative;
                if (Math.abs(newRate - rate) < tol) return newRate * 100;
                rate = newRate;
                iter++;
            }
            return 0; // Did not converge
        },
        futureValue: function(pv, annualRate, years) {
            return pv * Math.pow(1 + annualRate / 100, years);
        },
        presentValue: function(fv, annualRate, years) {
            return fv / Math.pow(1 + annualRate / 100, years);
        },
        sipFutureValue: function(monthly, annualRate, years) {
            const months = years * 12;
            const r = annualRate / 100 / 12;
            if (r === 0) return monthly * months;
            return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
        },
        sipRequired: function(targetAmount, annualRate, years) {
            const months = years * 12;
            const r = annualRate / 100 / 12;
            if (r === 0) return targetAmount / months;
            return targetAmount / (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
        },
        emi: function(principal, annualRate, tenureMonths) {
            const r = annualRate / 100 / 12;
            if (r === 0) return principal / tenureMonths;
            return principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1);
        },
        loanTotalInterest: function(principal, annualRate, tenureMonths) {
            const emi = this.emi(principal, annualRate, tenureMonths);
            return (emi * tenureMonths) - principal;
        },
        compoundInterest: function(principal, rate, periods, frequency = 12) {
            return principal * Math.pow(1 + (rate / 100) / frequency, frequency * periods);
        },
        inflationAdjust: function(amount, inflationRate, years) {
            return amount * Math.pow(1 + inflationRate / 100, years);
        },
        realReturn: function(nominalReturn, inflationRate) {
            return ((1 + nominalReturn / 100) / (1 + inflationRate / 100) - 1) * 100;
        },
        weightedAverage: function(values, weights) {
            if (values.length !== weights.length || values.length === 0) return 0;
            let sumProduct = 0;
            let sumWeight = 0;
            for (let i = 0; i < values.length; i++) {
                sumProduct += values[i] * weights[i];
                sumWeight += weights[i];
            }
            return sumWeight === 0 ? 0 : sumProduct / sumWeight;
        },
        standardDeviation: function(values) {
            if (values.length === 0) return 0;
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
            return Math.sqrt(variance);
        },
        sharpeRatio: function(returns, riskFreeRate) {
            if (returns.length === 0) return 0;
            const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
            const stdDev = this.standardDeviation(returns);
            if (stdDev === 0) return 0;
            return (meanReturn - riskFreeRate) / stdDev;
        },
        monteCarlo: function(params) {
            const { 
                initialCorpus, 
                annualContribution = 0, 
                expectedReturn, 
                volatility, 
                years, 
                simulations = 10000, 
                seed: paramSeed = 12345 
            } = params;
            
            seed = paramSeed;
            const finalCorpuses = [];
            
            for (let i = 0; i < simulations; i++) {
                let corpus = initialCorpus;
                for (let y = 0; y < years; y++) {
                    const yearlyReturn = randomNormal(expectedReturn / 100, volatility / 100);
                    corpus = corpus * (1 + yearlyReturn) + annualContribution;
                }
                finalCorpuses.push(corpus);
            }
            
            finalCorpuses.sort((a, b) => a - b);
            
            return {
                median: this.percentile(finalCorpuses, 50, true),
                percentile10: this.percentile(finalCorpuses, 10, true),
                percentile25: this.percentile(finalCorpuses, 25, true),
                percentile75: this.percentile(finalCorpuses, 75, true),
                percentile90: this.percentile(finalCorpuses, 90, true),
                simulations: finalCorpuses
            };
        },
        percentile: function(arr, p, sorted = false) {
            if (arr.length === 0) return 0;
            const sortedArr = sorted ? arr : [...arr].sort((a, b) => a - b);
            const index = (p / 100) * (sortedArr.length - 1);
            const lower = Math.floor(index);
            const upper = Math.ceil(index);
            const weight = index % 1;
            if (lower === upper) return sortedArr[lower];
            return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Utils = window.Nirvana.Utils || {};
    window.Nirvana.Utils.Math = MathUtils;
})();
