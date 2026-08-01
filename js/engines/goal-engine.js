(function() {
    'use strict';
    
    const GoalEngine = {
        getGoalTypes: function() {
            return [
                { type: 'Retirement', defaultInflation: 0.06 },
                { type: 'ChildEducation', defaultInflation: 0.08 },
                { type: 'House', defaultInflation: 0.06 },
                { type: 'Car', defaultInflation: 0.05 },
                { type: 'Wedding', defaultInflation: 0.06 },
                { type: 'Travel', defaultInflation: 0.05 },
                { type: 'Emergency', defaultInflation: 0.00 },
                { type: 'Custom', defaultInflation: 0.06 }
            ];
        },
        
        calculateGoal: function(goal, profile) {
            const types = this.getGoalTypes();
            const goalTypeInfo = types.find(t => t.type === goal.type) || types[7];
            const inflation = goal.inflationRate !== undefined ? goal.inflationRate : goalTypeInfo.defaultInflation;
            
            const yearsRemaining = Math.max(0, goal.targetYear - new Date().getFullYear());
            const currentCorpus = goal.currentCorpus || 0;
            
            const inflationAdjustedTarget = goal.targetAmount * Math.pow(1 + inflation, yearsRemaining);
            
            const expectedReturn = goal.expectedReturn || 0.10; 
            const expectedCorpus = currentCorpus * Math.pow(1 + expectedReturn, yearsRemaining);
            
            const fundingGap = Math.max(0, inflationAdjustedTarget - expectedCorpus);
            
            let requiredMonthlySIP = 0;
            let monthlyShortfall = 0;
            
            if (yearsRemaining > 0 && fundingGap > 0) {
                const monthlyReturn = expectedReturn / 12;
                const months = yearsRemaining * 12;
                requiredMonthlySIP = (fundingGap * monthlyReturn) / (Math.pow(1 + monthlyReturn, months) - 1) / (1 + monthlyReturn);
                
                const currentMonthlySip = goal.currentMonthlySIP || 0;
                monthlyShortfall = Math.max(0, requiredMonthlySIP - currentMonthlySip);
            }
            
            let probabilityOfSuccess = 0;
            if (inflationAdjustedTarget > 0) {
                const projectedWithSip = expectedCorpus + ((goal.currentMonthlySIP || 0) * (Math.pow(1 + expectedReturn / 12, yearsRemaining * 12) - 1) / (expectedReturn / 12) * (1 + expectedReturn / 12));
                probabilityOfSuccess = Math.min(100, Math.max(0, (projectedWithSip / inflationAdjustedTarget) * 100));
            } else {
                probabilityOfSuccess = 100;
            }
            
            const priorityScore = (goal.priority === 'High' ? 3 : goal.priority === 'Medium' ? 2 : 1) * 10 - (yearsRemaining * 0.5);
            
            return {
                inflationAdjustedTarget: inflationAdjustedTarget,
                currentCorpus: currentCorpus,
                fundingGap: fundingGap,
                requiredMonthlySIP: requiredMonthlySIP,
                expectedCorpus: expectedCorpus,
                probabilityOfSuccess: probabilityOfSuccess,
                priorityScore: priorityScore,
                yearsRemaining: yearsRemaining,
                monthlyShortfall: monthlyShortfall
            };
        },
        
        calculateAllGoals: function(goals, profile) {
            const results = goals.map(goal => ({
                goal: goal,
                calculations: this.calculateGoal(goal, profile)
            }));
            
            return results.sort((a, b) => b.calculations.priorityScore - a.calculations.priorityScore);
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Engines = window.Nirvana.Engines || {};
    window.Nirvana.Engines.GoalEngine = GoalEngine;
})();
