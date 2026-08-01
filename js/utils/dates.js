(function() {
    'use strict';
    
    const Dates = {
        formatDate: function(dateStr, format = 'DD MMM YYYY') {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return '';
            
            const day = d.getDate();
            const monthStrShort = d.toLocaleString('en-US', { month: 'short' });
            const monthStrLong = d.toLocaleString('en-US', { month: 'long' });
            const monthNum = String(d.getMonth() + 1).padStart(2, '0');
            const dayNum = String(day).padStart(2, '0');
            const year = d.getFullYear();
            
            switch (format) {
                case 'DD MMM YYYY': return `${dayNum} ${monthStrShort} ${year}`;
                case 'MMM YYYY': return `${monthStrShort} ${year}`;
                case 'DD/MM/YYYY': return `${dayNum}/${monthNum}/${year}`;
                default: return `${dayNum} ${monthStrShort} ${year}`;
            }
        },
        getAge: function(dob) {
            if (!dob) return 0;
            const birthDate = new Date(dob);
            if (isNaN(birthDate.getTime())) return 0;
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        },
        getFinancialYear: function(dateInput) {
            const date = dateInput ? new Date(dateInput) : new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            if (month >= 4) {
                return `FY ${year}-${String(year + 1).slice(-2)}`;
            } else {
                return `FY ${year - 1}-${String(year).slice(-2)}`;
            }
        },
        getDaysBetween: function(start, end) {
            const startDate = new Date(start);
            const endDate = new Date(end);
            const diffTime = Math.abs(endDate - startDate);
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        },
        getMonthsBetween: function(start, end) {
            const startDate = new Date(start);
            const endDate = new Date(end);
            return (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
        },
        addMonths: function(date, months) {
            const result = new Date(date);
            result.setMonth(result.getMonth() + months);
            return result;
        },
        addYears: function(date, years) {
            const result = new Date(date);
            result.setFullYear(result.getFullYear() + years);
            return result;
        },
        getYearsUntilRetirement: function(dob, retirementAge) {
            const age = this.getAge(dob);
            return Math.max(0, retirementAge - age);
        },
        isValidPAN: function(pan) {
            if (!pan) return false;
            const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
            return regex.test(pan.toUpperCase());
        },
        isValidPhone: function(phone) {
            if (!phone) return false;
            const regex = /^[6-9]\d{9}$/;
            const cleaned = String(phone).replace(/\D/g, '').slice(-10);
            return regex.test(cleaned);
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Utils = window.Nirvana.Utils || {};
    window.Nirvana.Utils.Dates = Dates;
})();
