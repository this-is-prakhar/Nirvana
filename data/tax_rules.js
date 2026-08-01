(function() {
    'use strict';
    window.NirvanaData = window.NirvanaData || {};
    window.NirvanaData.taxRules = {
        oldRegime: { 
            slabs: [
                { min: 0, max: 250000, rate: 0 },
                { min: 250000, max: 500000, rate: 5 },
                { min: 500000, max: 1000000, rate: 20 },
                { min: 1000000, max: Infinity, rate: 30 }
            ], 
            standardDeduction: 75000, 
            deductions: { 
                sec80C: 150000, 
                sec80D: { self: 25000, parents: 25000, parentsSenior: 50000, selfSenior: 50000 }, 
                sec80E: 'full', 
                sec80G: 'varies', 
                sec24b: 200000, 
                nps80CCD1B: 50000, 
                nps80CCD2: '14%ofBasic' 
            } 
        },
        newRegime: { 
            slabs: [
                { min: 0, max: 300000, rate: 0 },
                { min: 300000, max: 600000, rate: 5 },
                { min: 600000, max: 900000, rate: 10 },
                { min: 900000, max: 1200000, rate: 15 },
                { min: 1200000, max: 1500000, rate: 20 },
                { min: 1500000, max: Infinity, rate: 30 }
            ], 
            standardDeduction: 75000 
        },
        surcharge: [
            { min: 5000000, max: 10000000, rate: 10 },
            { min: 10000000, max: 20000000, rate: 15 },
            { min: 20000000, max: 50000000, rate: 25 },
            { min: 50000000, max: Infinity, rate: 37 }
        ],
        cess: 0.04,
        ltcg: { 
            equity: { exemption: 125000, rate: 12.5 }, 
            debt: { rate: 'slab' }, 
            gold: { rate: 12.5, holdingPeriod: 24 }, 
            property: { rate: 12.5, holdingPeriod: 24 } 
        },
        stcg: { 
            equity: { rate: 20 }, 
            debt: { rate: 'slab' } 
        },
        indexation: false,
        financialYear: 'FY 2025-26',
        assessmentYear: 'AY 2026-27'
    };
})();
