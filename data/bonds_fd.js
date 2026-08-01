(function() {
    'use strict';
    window.NirvanaData = window.NirvanaData || {};
    window.NirvanaData.bondsFD = {
        fixedDeposits: [
            { id: 'FD001', bank: 'SBI', tenure: '1 Year', generalRate: 6.8, seniorRate: 7.3, taxTreatment: 'Taxable as per slab' },
            { id: 'FD002', bank: 'SBI', tenure: '2 Years', generalRate: 7.0, seniorRate: 7.5, taxTreatment: 'Taxable as per slab' },
            { id: 'FD003', bank: 'HDFC Bank', tenure: '1 Year', generalRate: 7.1, seniorRate: 7.6, taxTreatment: 'Taxable as per slab' },
            { id: 'FD004', bank: 'HDFC Bank', tenure: '2 Years', generalRate: 7.15, seniorRate: 7.65, taxTreatment: 'Taxable as per slab' },
            { id: 'FD005', bank: 'ICICI Bank', tenure: '1 Year', generalRate: 7.1, seniorRate: 7.6, taxTreatment: 'Taxable as per slab' },
            { id: 'FD006', bank: 'ICICI Bank', tenure: '2 Years', generalRate: 7.2, seniorRate: 7.7, taxTreatment: 'Taxable as per slab' },
            { id: 'FD007', bank: 'Kotak Mahindra Bank', tenure: '1 Year', generalRate: 7.1, seniorRate: 7.6, taxTreatment: 'Taxable as per slab' },
            { id: 'FD008', bank: 'Kotak Mahindra Bank', tenure: '2 Years', generalRate: 7.2, seniorRate: 7.7, taxTreatment: 'Taxable as per slab' },
            { id: 'FD009', bank: 'Axis Bank', tenure: '1 Year', generalRate: 7.1, seniorRate: 7.6, taxTreatment: 'Taxable as per slab' },
            { id: 'FD010', bank: 'Axis Bank', tenure: '2 Years', generalRate: 7.15, seniorRate: 7.65, taxTreatment: 'Taxable as per slab' },
            { id: 'FD011', bank: 'Punjab National Bank (PNB)', tenure: '1 Year', generalRate: 6.75, seniorRate: 7.25, taxTreatment: 'Taxable as per slab' },
            { id: 'FD012', bank: 'Punjab National Bank (PNB)', tenure: '2 Years', generalRate: 6.8, seniorRate: 7.3, taxTreatment: 'Taxable as per slab' },
            { id: 'FD013', bank: 'Bank of Baroda', tenure: '1 Year', generalRate: 6.85, seniorRate: 7.35, taxTreatment: 'Taxable as per slab' },
            { id: 'FD014', bank: 'Bank of Baroda', tenure: '2 Years', generalRate: 7.05, seniorRate: 7.55, taxTreatment: 'Taxable as per slab' },
            { id: 'FD015', bank: 'IndusInd Bank', tenure: '1 Year', generalRate: 7.5, seniorRate: 8.0, taxTreatment: 'Taxable as per slab' },
            { id: 'FD016', bank: 'IndusInd Bank', tenure: '2 Years', generalRate: 7.75, seniorRate: 8.25, taxTreatment: 'Taxable as per slab' }
        ],
        bonds: [
            { id: 'BND001', name: 'NHAI 54EC Capital Gain Bond', issuer: 'NHAI', rating: 'AAA', coupon: 5.25, maturityDate: '2029-03-31', yield: 5.25, taxTreatment: 'Tax Free (Sec 54EC)' },
            { id: 'BND002', name: 'REC 54EC Capital Gain Bond', issuer: 'REC', rating: 'AAA', coupon: 5.25, maturityDate: '2029-03-31', yield: 5.25, taxTreatment: 'Tax Free (Sec 54EC)' },
            { id: 'BND003', name: 'SBI Infrastructure Bond', issuer: 'SBI', rating: 'AAA', coupon: 7.5, maturityDate: '2033-01-15', yield: 7.45, taxTreatment: 'Taxable as per slab' },
            { id: 'BND004', name: 'HDFC Bank Tier II Bond', issuer: 'HDFC Bank', rating: 'AAA', coupon: 7.8, maturityDate: '2032-12-10', yield: 7.75, taxTreatment: 'Taxable as per slab' },
            { id: 'BND005', name: 'IRFC Tax Free Bond', issuer: 'IRFC', rating: 'AAA', coupon: 8.1, maturityDate: '2027-02-23', yield: 5.8, taxTreatment: 'Tax Free' },
            { id: 'BND006', name: 'PFC Tax Free Bond', issuer: 'PFC', rating: 'AAA', coupon: 8.2, maturityDate: '2028-10-15', yield: 5.9, taxTreatment: 'Tax Free' }
        ]
    };
})();
