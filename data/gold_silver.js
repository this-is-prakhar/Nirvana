(function() {
    'use strict';
    window.NirvanaData = window.NirvanaData || {};
    window.NirvanaData.goldSilver = {
        gold: {
            pricePerGram: 7250.0,
            price10g: 72500.0,
            priceTroyOunce: 225500.0,
            sgbYield: 2.5,
            change24h: 150.0,
            changePercent: 0.21
        },
        silver: {
            pricePerKg: 85000.0,
            pricePerGram: 85.0,
            change24h: 500.0,
            changePercent: 0.59
        },
        etfs: [
            { name: 'Nippon India ETF Gold BeES', nav: 62.5, returns1y: 15.4 },
            { name: 'HDFC Gold ETF', nav: 63.1, returns1y: 15.2 },
            { name: 'SBI Gold ETF', nav: 62.8, returns1y: 15.3 },
            { name: 'ICICI Prudential Silver ETF', nav: 82.5, returns1y: 12.8 },
            { name: 'Nippon India Silver ETF', nav: 83.2, returns1y: 12.5 }
        ]
    };
})();
