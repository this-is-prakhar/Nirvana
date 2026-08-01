(function() {
    'use strict';
    window.NirvanaData = window.NirvanaData || {};
    window.NirvanaData.insuranceProducts = {
        termLife: [
            { id: 'INS001', insurer: 'LIC of India', planName: 'Tech Term', coverAmount: 10000000, premiumAnnual: 12500, premiumMonthly: 1060, maxAge: 65, claimSettlementRatio: 98.5, features: ['Pure term plan', 'Trusted brand', 'Offline/Online available'] },
            { id: 'INS002', insurer: 'HDFC Life', planName: 'Click 2 Protect Super', coverAmount: 10000000, premiumAnnual: 11200, premiumMonthly: 950, maxAge: 85, claimSettlementRatio: 99.4, features: ['Life stage benefit', 'Terminal illness cover', 'Waiver of premium'] },
            { id: 'INS003', insurer: 'ICICI Prudential', planName: 'iProtect Smart', coverAmount: 10000000, premiumAnnual: 10800, premiumMonthly: 920, maxAge: 99, claimSettlementRatio: 99.1, features: ['Critical illness rider', 'Accidental death benefit', 'Whole life cover option'] },
            { id: 'INS004', insurer: 'SBI Life', planName: 'eShield Next', coverAmount: 10000000, premiumAnnual: 11500, premiumMonthly: 980, maxAge: 80, claimSettlementRatio: 98.8, features: ['Increasing cover option', 'Better half benefit', 'Customizable riders'] },
            { id: 'INS005', insurer: 'Max Life', planName: 'Smart Secure Plus', coverAmount: 10000000, premiumAnnual: 10200, premiumMonthly: 870, maxAge: 85, claimSettlementRatio: 99.5, features: ['Return of premium option', 'Special exit value', 'Joint life cover'] },
            { id: 'INS006', insurer: 'Tata AIA', planName: 'Sampoorna Raksha Supreme', coverAmount: 10000000, premiumAnnual: 11800, premiumMonthly: 1000, maxAge: 100, claimSettlementRatio: 99.1, features: ['Life plus benefit', 'In-built health riders', 'Flexible payouts'] }
        ],
        health: [
            { id: 'HLT001', insurer: 'Star Health', planName: 'Comprehensive Insurance', coverAmount: 1000000, premiumAnnual: 15500, roomRent: 'No Limit', copay: '0%', waitingPeriod: '2 years for pre-existing', features: ['Outpatient cover', 'Maternity benefit', 'Automatic restoration'] },
            { id: 'HLT002', insurer: 'HDFC ERGO', planName: 'Optima Secure', coverAmount: 1000000, premiumAnnual: 16200, roomRent: 'Single Private Room', copay: '0%', waitingPeriod: '3 years for pre-existing', features: ['4X coverage from day 1', 'No capping on diseases', 'Preventive health check-up'] },
            { id: 'HLT003', insurer: 'ICICI Lombard', planName: 'Health AdvantEdge', coverAmount: 1000000, premiumAnnual: 14800, roomRent: 'No Limit', copay: '0%', waitingPeriod: '2 years for pre-existing', features: ['Worldwide cover', 'Teleconsultation', 'Wellness program'] },
            { id: 'HLT004', insurer: 'Niva Bupa', planName: 'ReAssure 2.0', coverAmount: 1000000, premiumAnnual: 15100, roomRent: 'Any Room', copay: '0%', waitingPeriod: '3 years for pre-existing', features: ['Unlimited teleconsultation', 'Booster+ benefit', 'Lock the clock age'] }
        ]
    };
})();
