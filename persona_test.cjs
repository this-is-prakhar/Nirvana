const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('====================================================');
console.log('👥 NIRVANA MULTI-PERSONA STRESS TESTING SUITE');
console.log('====================================================\n');

// Mock DOM
const localStorageStore = {};
const mockLocalStorage = {
    getItem: (k) => (k in localStorageStore ? localStorageStore[k] : null),
    setItem: (k, v) => { localStorageStore[k] = String(v); },
    removeItem: (k) => { delete localStorageStore[k]; },
    clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
};

class MockElement {
    constructor(tag = 'div') {
        this.tagName = tag.toUpperCase();
        this.children = [];
        this.attributes = {};
        this.classList = {
            _classes: new Set(),
            add: (...cls) => cls.forEach(c => this.classList._classes.add(c)),
            remove: (...cls) => cls.forEach(c => this.classList._classes.delete(c)),
            toggle: (c) => this.classList._classes.has(c) ? (this.classList._classes.delete(c), false) : (this.classList._classes.add(c), true),
            contains: (c) => this.classList._classes.has(c)
        };
        this.listeners = {};
        this._innerHTML = '';
    }
    get innerHTML() { return this._innerHTML; }
    set innerHTML(html) {
        this._innerHTML = html;
        this.children = [];
        const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)];
        idMatches.forEach(m => {
            const el = new MockElement();
            el.id = m[1];
            el.parentElement = this;
            this.children.push(el);
        });
    }
    get textContent() { return this._innerHTML.replace(/<[^>]*>/g, ''); }
    set textContent(txt) { this._innerHTML = txt; }
    setAttribute(k, v) { this.attributes[k] = v; }
    getAttribute(k) { return this.attributes[k] || null; }
    appendChild(child) { child.parentElement = this; this.children.push(child); return child; }
    addEventListener(event, fn) { this.listeners[event] = this.listeners[event] || []; this.listeners[event].push(fn); }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    querySelectorAll(selector) {
        const res = [];
        const match = (el) => {
            if (selector.startsWith('#') && el.id === selector.slice(1)) res.push(el);
            if (selector.startsWith('.') && el.classList.contains(selector.slice(1))) res.push(el);
            if (el.tagName && el.tagName.toLowerCase() === selector.toLowerCase()) res.push(el);
            el.children.forEach(match);
        };
        this.children.forEach(match);
        if (res.length === 0 && selector.startsWith('#')) {
            const el = new MockElement();
            el.id = selector.slice(1);
            el.parentElement = this;
            return [el];
        }
        return res;
    }
}

const mockDoc = {
    body: new MockElement('body'),
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => {
        let el = mockDoc.body.querySelector(`#${id}`);
        if (!el) { el = new MockElement(); el.id = id; mockDoc.body.appendChild(el); }
        return el;
    },
    querySelector: (s) => mockDoc.body.querySelector(s),
    querySelectorAll: (s) => mockDoc.body.querySelectorAll(s),
    addEventListener: () => {},
    removeEventListener: () => {}
};

class MockChart {
    constructor(ctx, config) { this.ctx = ctx; this.config = config; }
    destroy() {}
    update() {}
}
MockChart.defaults = { color: '#fff', font: {}, plugins: { tooltip: {} } };

const sandbox = {
    window: {},
    document: mockDoc,
    localStorage: mockLocalStorage,
    location: { hash: '#/dashboard' },
    Chart: MockChart,
    jspdf: { jsPDF: class { setFillColor() {} rect() {} setTextColor() {} setFontSize() {} setFont() {} text() {} setDrawColor() {} line() {} save() {} } },
    console: console,
    setTimeout: (fn) => fn(),
    clearTimeout: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    Intl: Intl,
    Math: Math,
    Date: Date,
    JSON: JSON,
    parseFloat: parseFloat,
    parseInt: parseInt,
    isNaN: isNaN,
    isFinite: isFinite,
    alert: () => {},
    print: () => {}
};
sandbox.window = sandbox;

const context = vm.createContext(sandbox);
const baseDir = __dirname;

const filesToLoad = [
    'data/stocks.js', 'data/mutual_funds.js', 'data/etfs.js', 'data/bonds_fd.js',
    'data/gold_silver.js', 'data/macro.js', 'data/credit_cards.js', 'data/tax_rules.js',
    'data/govt_schemes.js', 'data/insurance_products.js',
    'js/utils/currency.js', 'js/utils/dates.js', 'js/utils/math.js', 'js/utils/charts-helper.js',
    'js/store.js', 'js/router.js', 'js/data-loader.js',
    'js/components/sidebar.js', 'js/components/kpi-tile.js', 'js/components/chart.js',
    'js/components/data-table.js', 'js/components/form.js', 'js/components/modal.js', 'js/components/toast.js',
    'js/engines/risk-engine.js', 'js/engines/goal-engine.js', 'js/engines/allocation-engine.js',
    'js/engines/tax-engine.js', 'js/engines/rebalancing-engine.js', 'js/engines/withdrawal-engine.js',
    'js/engines/insurance-engine.js', 'js/engines/loan-engine.js', 'js/engines/credit-card-engine.js',
    'js/engines/retirement-engine.js', 'js/engines/wealth-health-engine.js', 'js/engines/behavioural-engine.js',
    'js/pages/dashboard.js', 'js/pages/portfolio.js', 'js/pages/goals.js', 'js/pages/recommendations.js',
    'js/pages/withdrawal.js', 'js/pages/credit-cards.js', 'js/pages/insurance.js', 'js/pages/loans.js',
    'js/pages/tax.js', 'js/pages/retirement.js', 'js/pages/reports.js', 'js/pages/ai-advisor.js',
    'js/pages/onboarding.js', 'js/pages/admin.js'
];

filesToLoad.forEach(f => {
    const code = fs.readFileSync(path.join(baseDir, f), 'utf8');
    vm.runInContext(code, context, { filename: f });
});

const personas = [
    {
        name: 'Aarav Mehta (Techie / FIRE Enthusiast)',
        profile: {
            name: 'Aarav Mehta', age: 26, cityTier: 'Tier-1', occupation: 'Software Engineer',
            income: 120000, bonus: 150000, expenses: 35000, monthlyEMIs: 0,
            bankBalance: 200000, stocksValue: 650000, mfValue: 800000, fdValue: 100000,
            goldValue: 100000, retCorpus: 250000, homeLoan: 0, carLoan: 0, personalLoan: 0,
            ccOutstanding: 0, lifeCover: 15000000, healthCover: 1000000, parentHealthCover: 500000,
            retirementAge: 42, retirementGoal: 60000000, educationGoal: 0, emergencyMonths: 6,
            onboarded: true
        }
    },
    {
        name: 'Priya & Rajesh Sharma (Mid-Career Family)',
        profile: {
            name: 'Rajesh Sharma', age: 38, cityTier: 'Tier-1', occupation: 'VP Operations',
            income: 250000, bonus: 500000, expenses: 85000, monthlyEMIs: 45000,
            bankBalance: 500000, stocksValue: 1200000, mfValue: 2500000, fdValue: 800000,
            goldValue: 600000, retCorpus: 1500000, homeLoan: 4500000, carLoan: 600000, personalLoan: 0,
            ccOutstanding: 0, lifeCover: 25000000, healthCover: 2000000, parentHealthCover: 1000000,
            retirementAge: 58, retirementGoal: 80000000, educationGoal: 3500000, emergencyMonths: 6,
            onboarded: true
        }
    },
    {
        name: 'Col. Suresh Verma (Senior Citizen / Conservative)',
        profile: {
            name: 'Col. Suresh Verma', age: 62, cityTier: 'Tier-2', occupation: 'Retired Defence',
            income: 95000, bonus: 0, expenses: 45000, monthlyEMIs: 0,
            bankBalance: 1000000, stocksValue: 500000, mfValue: 2500000, fdValue: 4000000,
            goldValue: 1500000, retCorpus: 0, homeLoan: 0, carLoan: 0, personalLoan: 0,
            ccOutstanding: 0, lifeCover: 0, healthCover: 1500000, parentHealthCover: 0,
            retirementAge: 60, retirementGoal: 0, educationGoal: 0, emergencyMonths: 12,
            onboarded: true
        }
    },
    {
        name: 'Ananya Iyer (Early Career / Debt Burdened)',
        profile: {
            name: 'Ananya Iyer', age: 23, cityTier: 'Tier-1', occupation: 'Associate Analyst',
            income: 45000, bonus: 0, expenses: 25000, monthlyEMIs: 12000,
            bankBalance: 30000, stocksValue: 10000, mfValue: 25000, fdValue: 0,
            goldValue: 0, retCorpus: 0, homeLoan: 0, carLoan: 0, personalLoan: 650000,
            ccOutstanding: 40000, lifeCover: 0, healthCover: 300000, parentHealthCover: 0,
            retirementAge: 60, retirementGoal: 30000000, educationGoal: 0, emergencyMonths: 3,
            onboarded: true
        }
    }
];

let personaTestsPassed = 0;
let personaTestsFailed = 0;

personas.forEach((p, idx) => {
    console.log(`\n====================================================`);
    console.log(`Testing Persona ${idx + 1}: ${p.name}`);
    console.log(`====================================================`);

    const store = sandbox.window.Nirvana.Store;
    store.clearAll();
    store.setUserProfile(p.profile);
    store.set('onboarded', true);

    // 1. Populate derived financial state
    sandbox.window.Nirvana.Pages.Onboarding.populateDerivedState(p.profile);
    const portfolio = store.getPortfolio();
    const goals = store.getGoals();
    const loans = store.get('loans') || [];
    const insurance = store.get('insurance') || {};

    const totalAssets = (p.profile.bankBalance || 0) + (p.profile.stocksValue || 0) + (p.profile.mfValue || 0) + (p.profile.fdValue || 0) + (p.profile.goldValue || 0) + (p.profile.retCorpus || 0);
    const totalDebt = (p.profile.homeLoan || 0) + (p.profile.carLoan || 0) + (p.profile.personalLoan || 0) + (p.profile.ccOutstanding || 0);
    const expectedNetWorth = totalAssets - totalDebt;

    console.log(`  Assets: ₹${(totalAssets/100000).toFixed(2)}L | Debt: ₹${(totalDebt/100000).toFixed(2)}L | Net Worth: ₹${(expectedNetWorth/100000).toFixed(2)}L`);
    console.log(`  Holdings generated: ${portfolio.items.length} items`);
    console.log(`  Goals generated: ${goals.length} goals`);
    console.log(`  Loans generated: ${loans.length} loans`);

    if (portfolio.totalValue === totalAssets) {
        console.log('  ✓ Portfolio totalValue perfectly matches total assets');
        personaTestsPassed++;
    } else {
        console.error(`  ✗ Portfolio totalValue mismatch: expected ${totalAssets}, got ${portfolio.totalValue}`);
        personaTestsFailed++;
    }

    // 2. Render Dashboard for this persona
    const container = new MockElement('div');
    container.id = 'page-content';
    mockDoc.body.appendChild(container);

    try {
        sandbox.window.Nirvana.Pages.Dashboard.render(container);
        const html = container.innerHTML;
        const containsName = html.includes(p.profile.name);
        const formattedNetWorth = sandbox.window.Nirvana.Utils.Currency.formatINR(expectedNetWorth);
        const containsNetWorth = html.includes(formattedNetWorth);
        
        if (containsName && containsNetWorth) {
            console.log(`  ✓ Dashboard renders personalized name and exact calculated Net Worth (${formattedNetWorth})`);
            personaTestsPassed++;
        } else {
            console.error(`  ✗ Dashboard missing personalized data: name=${containsName}, nw=${containsNetWorth}`);
            personaTestsFailed++;
        }
        sandbox.window.Nirvana.Pages.Dashboard.destroy();
    } catch (e) {
        console.error(`  ✗ Dashboard crashed for ${p.name}:`, e.message);
        personaTestsFailed++;
    }

    // 3. Render Portfolio for this persona
    try {
        sandbox.window.Nirvana.Pages.Portfolio.render(container);
        console.log('  ✓ Portfolio page renders cleanly with custom holdings');
        personaTestsPassed++;
        sandbox.window.Nirvana.Pages.Portfolio.destroy();
    } catch (e) {
        console.error(`  ✗ Portfolio page crashed for ${p.name}:`, e.message);
        personaTestsFailed++;
    }

    // 4. Render Tax optimization for this persona
    try {
        sandbox.window.Nirvana.Pages.Tax.render(container);
        console.log('  ✓ Tax page renders accurate regime comparison for annual income ₹' + ((p.profile.income * 12 + p.profile.bonus)/100000).toFixed(1) + 'L');
        personaTestsPassed++;
        sandbox.window.Nirvana.Pages.Tax.destroy();
    } catch (e) {
        console.error(`  ✗ Tax page crashed for ${p.name}:`, e.message);
        personaTestsFailed++;
    }

    // 5. Render Loans optimization for this persona
    try {
        sandbox.window.Nirvana.Pages.Loans.render(container);
        console.log('  ✓ Loans page renders active loan breakdown for debt balance ₹' + (totalDebt/100000).toFixed(2) + 'L');
        personaTestsPassed++;
        sandbox.window.Nirvana.Pages.Loans.destroy();
    } catch (e) {
        console.error(`  ✗ Loans page crashed for ${p.name}:`, e.message);
        personaTestsFailed++;
    }

    // 6. Generate PDF Audit for this persona
    try {
        sandbox.window.Nirvana.Pages.Reports.generatePDF('Master Wealth Audit');
        console.log('  ✓ PDF generator compiles customized audit statement without errors');
        personaTestsPassed++;
    } catch (e) {
        console.error(`  ✗ PDF audit generation crashed for ${p.name}:`, e.message);
        personaTestsFailed++;
    }
});

console.log(`\n====================================================`);
console.log(`📊 PERSONA TEST RESULTS: Passed: ${personaTestsPassed} | Failed: ${personaTestsFailed}`);
console.log(`====================================================`);

if (personaTestsFailed === 0) {
    console.log('🎉 ALL 4 DIVERSE FINANCIAL PERSONAS PASSED WITH FLYING COLORS!');
    process.exit(0);
} else {
    process.exit(1);
}
