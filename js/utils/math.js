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

    function normalizeRate(rate) {
        if (!rate || isNaN(rate)) return 0;
        return rate > 1 ? rate / 100 : rate;
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
            const r = normalizeRate(annualRate);
            return pv * Math.pow(1 + r, years);
        },
        presentValue: function(fv, annualRate, years) {
            const r = normalizeRate(annualRate);
            return fv / Math.pow(1 + r, years);
        },
        sipFutureValue: function(monthly, annualRate, years) {
            const months = years * 12;
            const r = normalizeRate(annualRate) / 12;
            if (r === 0) return monthly * months;
            return monthly * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
        },
        sipRequired: function(targetAmount, annualRate, years) {
            const months = years * 12;
            const r = normalizeRate(annualRate) / 12;
            if (r === 0) return targetAmount / months;
            return targetAmount / (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
        },
        emi: function(principal, annualRate, tenureMonths) {
            const r = normalizeRate(annualRate) / 12;
            if (r === 0) return principal / tenureMonths;
            return principal * r * Math.pow(1 + r, tenureMonths) / (Math.pow(1 + r, tenureMonths) - 1);
        },
        loanTotalInterest: function(principal, annualRate, tenureMonths) {
            const emi = this.emi(principal, annualRate, tenureMonths);
            return (emi * tenureMonths) - principal;
        },
        compoundInterest: function(principal, rate, periods, frequency = 12) {
            const r = normalizeRate(rate);
            return principal * Math.pow(1 + r / frequency, frequency * periods);
        },
        inflationAdjust: function(amount, inflationRate, years) {
            const r = normalizeRate(inflationRate);
            return amount * Math.pow(1 + r, years);
        },
        realReturn: function(nominalReturn, inflationRate) {
            const n = normalizeRate(nominalReturn);
            const i = normalizeRate(inflationRate);
            return ((1 + n) / (1 + i) - 1) * 100;
        },
        weightedAverage: function(values, weights) {
            if (!values || !weights || values.length !== weights.length || values.length === 0) return 0;
            let sumVal = 0;
            let sumWeight = 0;
            for (let i = 0; i < values.length; i++) {
                sumVal += values[i] * weights[i];
                sumWeight += weights[i];
            }
            return sumWeight > 0 ? sumVal / sumWeight : 0;
        },
        standardDeviation: function(values) {
            if (!values || values.length === 0) return 0;
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
            return Math.sqrt(variance);
        },
        sharpeRatio: function(returns, riskFreeRate) {
            if (!returns || returns.length === 0) return 0;
            const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
            const std = this.standardDeviation(returns);
            if (std === 0) return 0;
            return (mean - riskFreeRate) / std;
        },
        monteCarlo: function(params) {
            const { initialCorpus = 0, annualContribution = 0, expectedReturn = 12, volatility = 15, years = 10, simulations = 1000, seed: userSeed } = params;
            if (userSeed) seed = userSeed;
            
            const results = [];
            const rMean = normalizeRate(expectedReturn);
            const rStd = normalizeRate(volatility);
            
            for (let s = 0; s < simulations; s++) {
                let corpus = initialCorpus;
                for (let y = 0; y < years; y++) {
                    const ret = randomNormal(rMean, rStd);
                    corpus = corpus * (1 + ret) + annualContribution;
                }
                results.push(Math.max(0, corpus));
            }
            
            results.sort((a, b) => a - b);
            
            return {
                median: this.percentile(results, 50),
                percentile10: this.percentile(results, 10),
                percentile25: this.percentile(results, 25),
                percentile75: this.percentile(results, 75),
                percentile90: this.percentile(results, 90),
                simulations: results
            };
        },
        percentile: function(arr, p) {
            if (!arr || arr.length === 0) return 0;
            const index = (p / 100) * (arr.length - 1);
            const lower = Math.floor(index);
            const upper = Math.ceil(index);
            const weight = index - lower;
            if (lower === upper) return arr[lower];
            return arr[lower] * (1 - weight) + arr[upper] * weight;
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Utils = window.Nirvana.Utils || {};
    window.Nirvana.Utils.Math = MathUtils;
})();
