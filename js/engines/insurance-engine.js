(function() {
    'use strict';
    
    const InsuranceEngine = {
        analyzeGap: function(profile) {
            const income = profile.annualIncome || 0;
            const dependents = profile.dependents || 0;
            const lifeNeeded = dependents > 0 ? income * 15 : income * 10;
            
            const existingLife = profile.existingLifeInsurance || 0;
            const lifeGap = Math.max(0, lifeNeeded - existingLife);
            const lifeAdequacy = lifeNeeded > 0 ? Math.min(100, (existingLife / lifeNeeded) * 100) : 100;
            
            const healthNeeded = (profile.cityTier === 1 ? 1500000 : 500000) + (dependents * 500000);
            const existingHealth = profile.existingHealthInsurance || 0;
            const healthGap = Math.max(0, healthNeeded - existingHealth);
            const healthAdequacy = healthNeeded > 0 ? Math.min(100, (existingHealth / healthNeeded) * 100) : 100;
            
            const recommendations = [];
            if (lifeGap > 0) {
                recommendations.push({
                    type: 'Life',
                    coverNeeded: lifeGap,
                    reason: 'Income replacement for dependents',
                    urgency: 'High'
                });
            }
            if (healthGap > 0) {
                recommendations.push({
                    type: 'Health',
                    coverNeeded: healthGap,
                    reason: 'Medical inflation protection',
                    urgency: 'High'
                });
            }
            
            return {
                life: { needed: lifeNeeded, existing: existingLife, gap: lifeGap, adequacyPercent: lifeAdequacy },
                health: { needed: healthNeeded, existing: existingHealth, gap: healthGap, adequacyPercent: healthAdequacy },
                recommendations: recommendations
            };
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Engines = window.Nirvana.Engines || {};
    window.Nirvana.Engines.InsuranceEngine = InsuranceEngine;
})();
