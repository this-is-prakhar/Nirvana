(function() {
    'use strict';
    
    const WealthHealthEngine = {
        calculate: function(profile = {}, portfolio = {}, goals = [], loans = [], insurance = {}) {
            const income = profile.income || 175000;
            const expenses = profile.expenses || 65000;
            const monthlyEMIs = profile.monthlyEMIs || (Array.isArray(loans) ? loans.reduce((s, l) => s + (l.monthlyEMI || 0), 0) : 25000);
            const bankBalance = profile.bankBalance || 350000;
            const emergencyTarget = expenses * (profile.emergencyMonths || 6);

            // 1. Savings Rate Score
            const monthlySurplus = Math.max(0, income - expenses - monthlyEMIs);
            const savingsRatePct = income > 0 ? (monthlySurplus / income) * 100 : 30;
            let savingsScore = 50;
            if (savingsRatePct >= 45) savingsScore = 100;
            else if (savingsRatePct >= 35) savingsScore = 90;
            else if (savingsRatePct >= 25) savingsScore = 75;
            else if (savingsRatePct >= 15) savingsScore = 60;
            else savingsScore = Math.max(20, Math.round(savingsRatePct * 2));

            // 2. Debt Service Ratio Score
            const dti = income > 0 ? (monthlyEMIs / income) * 100 : 15;
            let debtScore = 80;
            if (dti <= 15) debtScore = 100;
            else if (dti <= 30) debtScore = 85;
            else if (dti <= 45) debtScore = 65;
            else if (dti <= 60) debtScore = 45;
            else debtScore = 20;

            // 3. Insurance Adequacy Score
            const targetLife = income * 12 * 10;
            const userLife = profile.lifeCover || (insurance.life ? insurance.life.sumAssured : 10000000);
            const lifeAdequacy = targetLife > 0 ? Math.min(1, userLife / targetLife) : 1;
            const userHealth = profile.healthCover || (insurance.health ? insurance.health.sumAssured : 1000000);
            const healthAdequacy = Math.min(1, userHealth / 1500000);
            const insuranceScore = Math.round((lifeAdequacy * 0.6 + healthAdequacy * 0.4) * 100);

            // 4. Goal Funding Score
            let goalScore = 70;
            if (Array.isArray(goals) && goals.length > 0) {
                const totalTarget = goals.reduce((s, g) => s + (g.targetAmount || 0), 0);
                const totalCurrent = goals.reduce((s, g) => s + (g.currentCorpus || 0), 0);
                goalScore = totalTarget > 0 ? Math.min(100, Math.round((totalCurrent / totalTarget) * 100) + 40) : 75;
            }

            // 5. Emergency Fund Score
            const emScore = emergencyTarget > 0 ? Math.min(100, Math.round((bankBalance / emergencyTarget) * 100)) : 100;

            // 6. Asset Allocation Score
            const alloc = portfolio.allocation || { equity: 65, debt: 25, gold: 5, cash: 5 };
            let allocScore = 85;
            if (alloc.equity >= 50 && alloc.equity <= 75 && alloc.debt >= 15 && alloc.debt <= 35) {
                allocScore = 95;
            } else if (alloc.equity > 85 || alloc.debt > 60) {
                allocScore = 65;
            }

            // 7. Tax Efficiency Score
            let taxScore = 85;
            if (profile.income > 1500000) {
                taxScore = 80;
            }

            // 8. Retirement Readiness Score
            const retCorpus = profile.retCorpus || 650000;
            const retGoal = profile.retirementGoal || 50000000;
            const retYears = Math.max(1, (profile.retirementAge || 55) - (profile.age || 32));
            const projectedRet = retCorpus * Math.pow(1.11, retYears);
            const retScore = retGoal > 0 ? Math.min(100, Math.round((projectedRet / retGoal) * 100)) : 70;

            const dimensions = {
                savingsRate: { score: savingsScore, weight: 15, label: 'Savings Rate' },
                debtRatio: { score: debtScore, weight: 15, label: 'Debt to Income' },
                insuranceAdequacy: { score: insuranceScore, weight: 10, label: 'Insurance Adequacy' },
                goalFunding: { score: Math.min(100, goalScore), weight: 15, label: 'Goal Funding' },
                emergencyFund: { score: emScore, weight: 10, label: 'Emergency Fund' },
                assetAllocation: { score: allocScore, weight: 15, label: 'Asset Allocation' },
                taxEfficiency: { score: taxScore, weight: 10, label: 'Tax Efficiency' },
                retirementReadiness: { score: Math.max(30, retScore), weight: 10, label: 'Retirement Readiness' }
            };
            
            let totalScore = 0;
            let totalWeight = 0;
            for (const key in dimensions) {
                totalScore += dimensions[key].score * dimensions[key].weight;
                totalWeight += dimensions[key].weight;
            }
            
            const overallScore = Math.round(totalScore / totalWeight);
            let category = 'Fair';
            if (overallScore >= 85) category = 'Excellent';
            else if (overallScore >= 70) category = 'Good';
            else if (overallScore < 50) category = 'Poor';
            
            return {
                overallScore: overallScore,
                category: category,
                dimensions: dimensions,
                radarData: Object.keys(dimensions).map(k => ({ axis: dimensions[k].label, value: dimensions[k].score })),
                trend: [
                    { month: '3m ago', score: Math.max(40, overallScore - 4) },
                    { month: '2m ago', score: Math.max(40, overallScore - 2) },
                    { month: 'Last month', score: Math.max(40, overallScore - 1) },
                    { month: 'Current', score: overallScore }
                ]
            };
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Engines = window.Nirvana.Engines || {};
    window.Nirvana.Engines.WealthHealthEngine = WealthHealthEngine;
})();
