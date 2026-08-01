(function() {
    'use strict';
    
    const DataLoader = {
        init: function() {
            const stats = this.getDataStats();
            console.log('Nirvana Data Loaded Successfully.');
            console.log('Data stats:', stats);
        },
        
        getStocks: function() {
            return (window.NirvanaData && window.NirvanaData.stocks) || [];
        },
        
        getMutualFunds: function() {
            return (window.NirvanaData && window.NirvanaData.mutualFunds) || [];
        },
        
        getETFs: function() {
            return (window.NirvanaData && window.NirvanaData.etfs) || [];
        },
        
        getBondsFD: function() {
            return (window.NirvanaData && window.NirvanaData.bondsFD) || [];
        },
        
        getGoldSilver: function() {
            return (window.NirvanaData && window.NirvanaData.goldSilver) || [];
        },
        
        getMacroData: function() {
            return (window.NirvanaData && window.NirvanaData.macro) || {};
        },
        
        getCreditCards: function() {
            return (window.NirvanaData && window.NirvanaData.creditCards) || [];
        },
        
        getTaxRules: function() {
            return (window.NirvanaData && window.NirvanaData.taxRules) || {};
        },
        
        getGovtSchemes: function() {
            return (window.NirvanaData && window.NirvanaData.govtSchemes) || [];
        },
        
        getInsuranceProducts: function() {
            return (window.NirvanaData && window.NirvanaData.insuranceProducts) || [];
        },
        
        search: function(query, categories = ['all']) {
            if (!query) return [];
            query = query.toLowerCase().trim();
            const results = [];
            
            const searchCollection = (type, collection, fields) => {
                if (!collection) return;
                collection.forEach(item => {
                    let match = false;
                    let matchField = '';
                    let matchText = '';
                    
                    for (const field of fields) {
                        if (item[field] && String(item[field]).toLowerCase().includes(query)) {
                            match = true;
                            matchField = field;
                            matchText = String(item[field]);
                            break;
                        }
                    }
                    
                    if (match) {
                        results.push({ type, item, matchField, matchText });
                    }
                });
            };
            
            const cats = categories.includes('all') ? 
                ['stocks', 'mutualFunds', 'etfs', 'bondsFD', 'govtSchemes', 'creditCards'] : 
                categories;
            
            if (cats.includes('stocks')) searchCollection('stock', this.getStocks(), ['name', 'symbol', 'isin', 'sector']);
            if (cats.includes('mutualFunds')) searchCollection('mutualFund', this.getMutualFunds(), ['name', 'amc', 'category']);
            if (cats.includes('etfs')) searchCollection('etf', this.getETFs(), ['name', 'symbol', 'underlying']);
            if (cats.includes('bondsFD')) searchCollection('bond', this.getBondsFD(), ['name', 'issuer']);
            if (cats.includes('govtSchemes')) searchCollection('scheme', this.getGovtSchemes(), ['name', 'shortName']);
            if (cats.includes('creditCards')) searchCollection('creditCard', this.getCreditCards(), ['name', 'issuer']);
            
            return results;
        },
        
        getProductById: function(type, id) {
            let collection = [];
            switch (type) {
                case 'stock': collection = this.getStocks(); break;
                case 'mutualFund': collection = this.getMutualFunds(); break;
                case 'etf': collection = this.getETFs(); break;
                case 'bond': collection = this.getBondsFD(); break;
                case 'scheme': collection = this.getGovtSchemes(); break;
                case 'creditCard': collection = this.getCreditCards(); break;
                case 'insurance': collection = this.getInsuranceProducts(); break;
            }
            return collection.find(item => item.id === id || item.symbol === id || item.isin === id) || null;
        },
        
        getLastUpdated: function() {
            return (window.NirvanaData && window.NirvanaData.metadata && window.NirvanaData.metadata.lastUpdated) || new Date().toISOString();
        },
        
        getDataStats: function() {
            return {
                stocks: this.getStocks().length,
                mutualFunds: this.getMutualFunds().length,
                etfs: this.getETFs().length,
                bondsFD: this.getBondsFD().length,
                govtSchemes: this.getGovtSchemes().length,
                creditCards: this.getCreditCards().length,
                insuranceProducts: this.getInsuranceProducts().length
            };
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.DataLoader = DataLoader;
})();
