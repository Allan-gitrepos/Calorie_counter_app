// Main App Controller - With proper back button handling
const App = {
    init() {
        UI.hideLoading();

        // Setup back button handler
        this.setupBackHandler();

        if (Storage.isOnboarded()) {
            this.showDashboard();
        } else {
            Onboarding.init();
        }
    },

    setupBackHandler() {
        // Clear any existing listeners
        window.onpopstate = null;

        // Handle Android back button / browser back
        window.addEventListener('popstate', (e) => {
            e.preventDefault();

            const chatScreen = document.getElementById('chat-screen');

            if (chatScreen) {
                // If chat is open, close it
                Chat.close();
                history.pushState({ app: true }, '');
            } else if (Dashboard.currentTab !== 'home') {
                // If not on home tab, go to home
                Dashboard.currentTab = 'home';
                Dashboard.update();
                history.pushState({ app: true }, '');
            } else {
                // On home tab - ask to exit
                if (confirm('Exit FitCalo?')) {
                    // Try to exit app (works in some WebView apps)
                    if (navigator.app && navigator.app.exitApp) {
                        navigator.app.exitApp();
                    } else if (window.close) {
                        window.close();
                    }
                } else {
                    history.pushState({ app: true }, '');
                }
            }
        });

        // Initial state
        history.pushState({ app: true }, '');
    },

    showDashboard() {
        Dashboard.currentTab = 'home';
        Dashboard.currentDate = new Date();
        Dashboard.update();
    },

    exportData() {
        const data = {
            user: Storage.getUser(),
            exportDate: new Date().toISOString(),
            meals: {}
        };

        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('fitcalo_meals_')) {
                const date = key.replace('fitcalo_meals_', '');
                data.meals[date] = JSON.parse(localStorage.getItem(key));
            }
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fitcalo_backup_${UI.getDateString()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        UI.showToast('Data exported!', 'success');
    },

    clearAllData() {
        if (confirm('Clear all data?\n\nThis will delete your profile, all meal logs, and API key.\n\nThis cannot be undone!')) {
            Storage.clearAll();
            UI.showToast('All data cleared', 'success');
            setTimeout(() => location.reload(), 500);
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
