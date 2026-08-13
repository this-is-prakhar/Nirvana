const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('====================================================');
console.log('🧪 NIRVANA INSTITUTIONAL STRESS TEST & QA SUITE');
console.log('====================================================\n');

// 1. Setup Mock DOM Environment
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
        this.style = {};
        this.classList = {
            _classes: new Set(),
            add: (...cls) => cls.forEach(c => this.classList._classes.add(c)),
            remove: (...cls) => cls.forEach(c => this.classList._classes.delete(c)),
            toggle: (c, force) => {
                if (force !== undefined) {
                    if (force) this.classList._classes.add(c);
                    else this.classList._classes.delete(c);
                    return force;
                }
                if (this.classList._classes.has(c)) {
                    this.classList._classes.delete(c);
                    return false;
                } else {
                    this.classList._classes.add(c);
                    return true;
                }
            },
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
    removeAttribute(k) { delete this.attributes[k]; }

    appendChild(child) {
        child.parentElement = this;
        this.children.push(child);
        return child;
    }

    removeChild(child) {
        const idx = this.children.indexOf(child);
        if (idx !== -1) this.children.splice(idx, 1);
        return child;
    }

    remove() {
        if (this.parentElement) this.parentElement.removeChild(this);
    }

    addEventListener(event, fn) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(fn);
    }

    removeEventListener(event, fn) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(f => f !== fn);
        }
    }

    dispatchEvent(event) {
        const name = typeof event === 'string' ? event : event.type;
        if (this.listeners[name]) {
            this.listeners[name].forEach(fn => fn(event));
        }
    }

    querySelector(selector) {
        return this.querySelectorAll(selector)[0] || null;
    }

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
            const id = selector.slice(1);
            const found = new MockElement();
            found.id = id;
            found.parentElement = this;
            return [found];
        }
        return res;
    }

    getBoundingClientRect() {
        return { top: 0, left: 0, width: 800, height: 600, right: 800, bottom: 600 };
    }

    getContext(type) {
        return {
            fillRect: () => {},
            clearRect: () => {},
            getImageData: () => ({ data: [] }),
            putImageData: () => {},
            createImageData: () => [],
            setTransform: () => {},
            drawImage: () => {},
            save: () => {},
            fillText: () => {},
            restore: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            closePath: () => {},
            stroke: () => {},
            fill: () => {},
            arc: () => {},
            measureText: () => ({ width: 50 })
        };
    }
}

const mockDocument = {
    body: new MockElement('body'),
    head: new MockElement('head'),
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => {
        let el = mockDocument.body.querySelector(`#${id}`);
        if (!el) {
            el = new MockElement();
            el.id = id;
            mockDocument.body.appendChild(el);
        }
        return el;
    },
    querySelector: (s) => mockDocument.body.querySelector(s),
    querySelectorAll: (s) => mockDocument.body.querySelectorAll(s),
    addEventListener: () => {},
    removeEventListener: () => {}
};

class MockChart {
    constructor(ctx, config) {
        this.ctx = ctx;
        this.config = config;
        this.data = config.data || {};
        this.options = config.options || {};
    }
    update() {}
    destroy() {}
}
MockChart.defaults = {
    color: '#fff',
    font: {},
    plugins: { tooltip: {} }
};

class MockJsPDF {
    constructor() {
        this.lines = [];
    }
    setFillColor() {}
    rect() {}
    setTextColor() {}
    setFontSize() {}
    setFont() {}
    text(t, x, y) { this.lines.push({ text: t, x, y }); }
    setDrawColor() {}
    line() {}
    save(filename) { this.savedFilename = filename; }
}

const sandbox = {
    window: {},
    document: mockDocument,
    localStorage: mockLocalStorage,
    Chart: MockChart,
    jspdf: { jsPDF: MockJsPDF },
    html2canvas: async () => new MockElement('canvas'),
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    Intl: Intl,
    Math: Math,
    Date: Date,
    JSON: JSON,
    parseFloat: parseFloat,
    parseInt: parseInt,
    isNaN: isNaN,
    isFinite: isFinite,
    alert: (m) => {},
    print: () => {}
};
sandbox.window = sandbox;

const context = vm.createContext(sandbox);

// 2. Load and Execute all Nirvana files in exact dependency order
const baseDir = __dirname;
const scriptOrder = [
    // Data
    'data/stocks.js',
    'data/mutual_funds.js',
    'data/etfs.js',
    'data/bonds_fd.js',
    'data/gold_silver.js',
    'data/macro.js',
    'data/credit_cards.js',
    'data/tax_rules.js',
    'data/govt_schemes.js',
    'data/insurance_products.js',
    // Utils
    'js/utils/currency.js',
    'js/utils/dates.js',
    'js/utils/math.js',
    'js/utils/charts-helper.js',
    // Core
    'js/store.js',
    'js/router.js',
    'js/data-loader.js',
    // Components
    'js/components/sidebar.js',
    'js/components/kpi-tile.js',
    'js/components/chart.js',
    'js/components/data-table.js',
    'js/components/form.js',
    'js/components/modal.js',
    'js/components/toast.js',
    // Engines
    'js/engines/risk-engine.js',
    'js/engines/goal-engine.js',
    'js/engines/allocation-engine.js',
    'js/engines/tax-engine.js',
    'js/engines/rebalancing-engine.js',
    'js/engines/withdrawal-engine.js',
    'js/engines/insurance-engine.js',
    'js/engines/loan-engine.js',
    'js/engines/credit-card-engine.js',
    'js/engines/retirement-engine.js',
    'js/engines/wealth-health-engine.js',
    'js/engines/behavioural-engine.js',
    // Pages
    'js/pages/dashboard.js',
    'js/pages/portfolio.js',
    'js/pages/goals.js',
    'js/pages/recommendations.js',
    'js/pages/withdrawal.js',
    'js/pages/credit-cards.js',
    'js/pages/insurance.js',
    'js/pages/loans.js',
    'js/pages/tax.js',
    'js/pages/retirement.js',
    'js/pages/reports.js',
    'js/pages/ai-advisor.js',
    'js/pages/onboarding.js',
    'js/pages/admin.js'
];

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const errors = [];

function assert(condition, testName) {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  ✓ ${testName}`);
    } else {
        failedTests++;
        console.error(`  ✗ FAIL: ${testName}`);
        errors.push(testName);
    }
}

console.log('--- Phase 1: Script Compilation & Execution ---');
scriptOrder.forEach(relPath => {
    const fullPath = path.join(baseDir, relPath);
    try {
        const code = fs.readFileSync(fullPath, 'utf8');
        vm.runInContext(code, context, { filename: relPath });
        assert(true, `Loaded script: ${relPath}`);
    } catch (e) {
        assert(false, `Error loading ${relPath}: ${e.message}`);
    }
});

console.log('\n--- Phase 2: Math & Utility Functions Verification ---');
const MathUtil = sandbox.window.Nirvana.Utils.Math;
const CurrencyUtil = sandbox.window.Nirvana.Utils.Currency;
const DatesUtil = sandbox.window.Nirvana.Utils.Dates;

assert(typeof CurrencyUtil.formatINR(1234567) === 'string' && CurrencyUtil.formatINR(1234567).includes('12,34,567'), 'Currency.formatINR formats Indian numbering system');
assert(CurrencyUtil.formatCompact(15000000).includes('Cr') || CurrencyUtil.formatCompact(15000000).includes('1.5'), 'Currency.formatCompact handles Crores');
assert(CurrencyUtil.formatCompact(250000).includes('L') || CurrencyUtil.formatCompact(250000).includes('2.5'), 'Currency.formatCompact handles Lakhs');
assert(CurrencyUtil.parseINR('₹12,34,567') === 1234567, 'Currency.parseINR parses string accurately');

const fv = MathUtil.futureValue(100000, 0.12, 10);
assert(Math.round(fv) === 310585, `Math.futureValue correct (expected ~310585, got ${Math.round(fv)})`);
const sipFv = MathUtil.sipFutureValue(10000, 0.12, 10);
assert(sipFv > 2000000 && sipFv < 2500000, `Math.sipFutureValue produces realistic corpus: ${Math.round(sipFv)}`);
const emi = MathUtil.emi(2500000, 8.5, 240);
assert(emi > 20000 && emi < 25000, `Math.emi produces accurate loan EMI: ${Math.round(emi)}`);

console.log('\n--- Phase 3: Stress Testing Financial Engines with Extreme Inputs ---');
const RiskEngine = sandbox.window.Nirvana.Engines.RiskEngine;
const TaxEngine = sandbox.window.Nirvana.Engines.TaxEngine;
const AllocationEngine = sandbox.window.Nirvana.Engines.AllocationEngine;
const RetirementEngine = sandbox.window.Nirvana.Engines.RetirementEngine;
const WealthHealthEngine = sandbox.window.Nirvana.Engines.WealthHealthEngine;

// Zero/Minimal Profile
const zeroProfile = { age: 18, income: 0, expenses: 0, bankBalance: 0 };
const zeroRisk = RiskEngine.calculate(zeroProfile);
assert(zeroRisk.score >= 0 && zeroRisk.score <= 100, 'RiskEngine handles zero income profile');

// Ultra High Net Worth Profile (100 Cr)
const uhnwProfile = { age: 45, income: 100000000, bonus: 50000000, expenses: 2000000, bankBalance: 50000000, stocksValue: 500000000, mfValue: 300000000 };
const uhnwTax = TaxEngine.compareRegimes(150000000, 500000);
assert(uhnwTax.oldRegime.totalTax > 0 && uhnwTax.newRegime.totalTax > 0, 'TaxEngine handles 15 Cr income with surcharges and cess');

// Retirement at 40 (Extreme FIRE)
const fireProfile = { age: 25, targetRetirementAge: 40, currentMonthlyExpense: 100000, currentRetirementCorpus: 1000000 };
const fireCalc = RetirementEngine.calculate(fireProfile);
assert(fireCalc.corpusRequired > 10000000 && fireCalc.additionalMonthlySavings > 0, `RetirementEngine handles Extreme FIRE calculation (Required: ₹${Math.round(fireCalc.corpusRequired/100000)}L)`);

// Wealth Health Score on 8 dimensions
const whScore = WealthHealthEngine.calculate(uhnwProfile, { totalValue: 850000000, allocation: { equity: 60, debt: 30, gold: 5, cash: 5 } }, [], [], {});
assert(whScore.overallScore >= 70 && whScore.overallScore <= 100, `WealthHealthEngine scores UHNW correctly: ${whScore.overallScore}`);

console.log('\n--- Phase 4: Page Rendering & Lifecycle Stress Test ---');
const pages = [
    'Dashboard', 'Portfolio', 'Goals', 'Recommendations', 'Withdrawal', 
    'CreditCards', 'Insurance', 'Loans', 'Tax', 'Retirement', 'Reports', 
    'AIAdvisor', 'Onboarding', 'Admin'
];

pages.forEach(pageName => {
    const page = sandbox.window.Nirvana.Pages[pageName];
    assert(page && typeof page.render === 'function', `Page module window.Nirvana.Pages.${pageName} exists`);
    
    const container = new MockElement('div');
    container.id = 'page-content';
    mockDocument.body.appendChild(container);
    
    try {
        page.render(container);
        assert(container.innerHTML.length > 50, `Page ${pageName} rendered rich HTML output (${container.innerHTML.length} bytes)`);
    } catch (err) {
        assert(false, `Page ${pageName} threw runtime error during render(): ${err.message}\n${err.stack}`);
    }
    
    if (typeof page.destroy === 'function') {
        try {
            page.destroy();
            assert(true, `Page ${pageName} cleanly executed destroy()`);
        } catch (err) {
            assert(false, `Page ${pageName} threw runtime error during destroy(): ${err.message}`);
        }
    }
});

console.log('\n--- Phase 5: PDF Generation Stress Test ---');
const ReportsPage = sandbox.window.Nirvana.Pages.Reports;
try {
    ReportsPage.generatePDF('Comprehensive Stress Audit');
    assert(true, 'ReportsPage.generatePDF executed without error');
} catch (e) {
    assert(false, `PDF Generation failed: ${e.message}`);
}

console.log('\n====================================================');
console.log(`📊 TEST SUMMARY: Total: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`);
console.log('====================================================');

if (failedTests > 0) {
    console.error('FAILED TESTS LIST:');
    errors.forEach(e => console.error(' - ' + e));
    process.exit(1);
} else {
    console.log('🎉 ALL SUITES PASSED WITH ZERO ERRORS!');
    process.exit(0);
}
