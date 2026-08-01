(function() {
    'use strict';
    
    const RiskEngine = {
        calculate: function(profile) {
            const breakdown = {
                questionnaireScore: 0,
                ageScore: 0,
                incomeStabilityScore: 0,
                horizonScore: 0,
                liquidityScore: 0
            };
            
            // Age scoring (15%)
            if (profile.age < 30) breakdown.ageScore = 100;
            else if (profile.age <= 45) breakdown.ageScore = 75;
            else if (profile.age <= 55) breakdown.ageScore = 40;
            else breakdown.ageScore = 20;
            
            // Income stability (15%)
            if (profile.incomeStability === 'Stable') breakdown.incomeStabilityScore = 100;
            else if (profile.incomeStability === 'Moderate') breakdown.incomeStabilityScore = 60;
            else breakdown.incomeStabilityScore = 20; // Variable
            
            // Horizon (15%)
            if (profile.investmentHorizon > 15) breakdown.horizonScore = 100;
            else if (profile.investmentHorizon > 7) breakdown.horizonScore = 70;
            else if (profile.investmentHorizon > 3) breakdown.horizonScore = 40;
            else breakdown.horizonScore = 10;
            
            // Liquidity Needs (15%)
            if (profile.liquidityNeeds === 'Low') breakdown.liquidityScore = 100;
            else if (profile.liquidityNeeds === 'Medium') breakdown.liquidityScore = 50;
            else breakdown.liquidityScore = 10; // High
            
            // Questionnaire (40%)
            let qScore = 0;
            if (profile.questionnaireResponses && profile.questionnaireResponses.length > 0) {
                const total = profile.questionnaireResponses.reduce((acc, q) => acc + q.score, 0);
                qScore = total / profile.questionnaireResponses.length;
            } else {
                qScore = 50; // Default
            }
            breakdown.questionnaireScore = qScore;
            
            const score = (breakdown.questionnaireScore * 0.40) +
                    (breakdown.ageScore * 0.15) +
                    (breakdown.incomeStabilityScore * 0.15) +
                    (breakdown.horizonScore * 0.15) +
                    (breakdown.liquidityScore * 0.15);
            
            let category = 'Conservative';
            if (score >= 80) category = 'Very Aggressive';
            else if (score >= 60) category = 'Aggressive';
            else if (score >= 40) category = 'Moderate';
            
            return {
                score: Math.round(score),
                category: category,
                breakdown: breakdown
            };
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Engines = window.Nirvana.Engines || {};
    window.Nirvana.Engines.RiskEngine = RiskEngine;
})();
