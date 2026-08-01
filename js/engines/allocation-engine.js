(function() {
    'use strict';
    
    const AllocationEngine = {
        recommend: function(riskScore, age, goals, portfolio) {
            let baseEquity = Math.max(20, 100 - age);
            
            if (riskScore >= 80) baseEquity += 10;
            else if (riskScore >= 60) baseEquity += 5;
            else if (riskScore < 40) baseEquity -= 15;
            else if (riskScore < 60) baseEquity -= 5;
            
            baseEquity = Math.min(80, Math.max(20, baseEquity));
            let debt = 100 - baseEquity - 5 - 5; // 5% gold, 5% cash default
            if (debt < 10) {
                debt = 10;
                baseEquity = 100 - debt - 5 - 5;
            }
            
            const strategic = {
                equity: baseEquity,
                debt: debt,
                gold: 5,
                cash: 5,
                alternatives: 0
            };
            
            const tactical = { ...strategic };
            
            const glidePath = [];
            for (let a = age; a <= 85; a += 5) {
                let eq = Math.max(20, 100 - a);
                if (riskScore >= 60) eq = Math.min(80, eq + 5);
                if (riskScore < 40) eq = Math.max(20, eq - 10);
                glidePath.push({ age: a, equity: eq, debt: 100 - eq });
            }
            
            return {
                strategic: strategic,
                tactical: tactical,
                recommendations: [],
                glidePath: glidePath
            };
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Engines = window.Nirvana.Engines || {};
    window.Nirvana.Engines.AllocationEngine = AllocationEngine;
})();
