(function() {
    'use strict';
    
    const RebalancingEngine = {
        analyze: function(currentAllocation, targetAllocation, holdings) {
            let needsRebalancing = false;
            let totalDrift = 0;
            const driftByAsset = {};
            const trades = [];
            
            for (const asset in targetAllocation) {
                const target = targetAllocation[asset];
                const current = currentAllocation[asset] || 0;
                const drift = Math.abs(current - target);
                
                driftByAsset[asset] = {
                    current: current,
                    target: target,
                    drift: drift
                };
                
                if (drift > 5) {
                    needsRebalancing = true;
                }
                totalDrift += drift;
            }
            
            return {
                drift: totalDrift / Object.keys(targetAllocation).length,
                needsRebalancing: needsRebalancing,
                trades: trades,
                driftByAsset: driftByAsset
            };
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Engines = window.Nirvana.Engines || {};
    window.Nirvana.Engines.RebalancingEngine = RebalancingEngine;
})();
