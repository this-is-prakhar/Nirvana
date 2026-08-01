(function() {
    'use strict';
    
    const listeners = {};
    
    const Store = {
        get: function(key) {
            try {
                const item = localStorage.getItem(`nirvana_${key}`);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.error(`Error reading ${key} from localStorage`, e);
                return null;
            }
        },
        
        set: function(key, value) {
            try {
                localStorage.setItem(`nirvana_${key}`, JSON.stringify(value));
                this.notify(key, value);
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    console.error('LocalStorage quota exceeded');
                } else {
                    console.error(`Error setting ${key} in localStorage`, e);
                }
            }
        },
        
        subscribe: function(key, callback) {
            if (!listeners[key]) {
                listeners[key] = [];
            }
            listeners[key].push(callback);
            return () => {
                listeners[key] = listeners[key].filter(cb => cb !== callback);
            };
        },
        
        notify: function(key, value) {
            if (listeners[key]) {
                listeners[key].forEach(cb => cb(value));
            }
        },
        
        getUserProfile: function() { return this.get('user_profile') || {}; },
        setUserProfile: function(data) { this.set('user_profile', data); },
        
        getPortfolio: function() { return this.get('portfolio') || { assets: [], liabilities: [] }; },
        setPortfolio: function(data) { this.set('portfolio', data); },
        
        getGoals: function() { return this.get('goals') || []; },
        setGoals: function(goals) { this.set('goals', goals); },
        
        getRecommendations: function() { return this.get('recommendations') || []; },
        setRecommendations: function(data) { this.set('recommendations', data); },
        
        getSettings: function() { return this.get('settings') || { theme: 'dark' }; },
        setSettings: function(data) { this.set('settings', data); },
        
        getOnboardingDraft: function() { return this.get('onboarding_draft') || {}; },
        setOnboardingDraft: function(data) { this.set('onboarding_draft', data); },
        
        isOnboarded: function() {
            const profile = this.getUserProfile();
            const onboardedFlag = this.get('onboarded');
            return !!((profile && profile.onboarded) || onboardedFlag === true);
        },
        
        getNotifications: function() { return this.get('notifications') || []; },
        addNotification: function(notification) {
            const notifs = this.getNotifications();
            notifs.push({ ...notification, id: Date.now().toString(), read: false, timestamp: new Date().toISOString() });
            this.set('notifications', notifs);
        },
        dismissNotification: function(id) {
            const notifs = this.getNotifications().filter(n => n.id !== id);
            this.set('notifications', notifs);
        },
        
        getActivityLog: function() { return this.get('activity_log') || []; },
        logActivity: function(action, details) {
            const logs = this.getActivityLog();
            logs.unshift({ action, details, timestamp: new Date().toISOString() });
            if (logs.length > 100) logs.length = 100; // keep last 100
            this.set('activity_log', logs);
        },
        
        exportAll: function() {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('nirvana_')) {
                    const storeKey = key.replace('nirvana_', '');
                    data[storeKey] = this.get(storeKey);
                }
            }
            return JSON.stringify(data);
        },
        
        importAll: function(jsonString) {
            try {
                const data = JSON.parse(jsonString);
                for (const key in data) {
                    this.set(key, data[key]);
                }
                return true;
            } catch (e) {
                console.error('Failed to import data', e);
                return false;
            }
        },
        
        clearAll: function() {
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('nirvana_')) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            // Notify all listeners
            Object.keys(listeners).forEach(key => this.notify(key, null));
        }
    };
    
    window.Nirvana = window.Nirvana || {};
    window.Nirvana.Store = Store;
})();
