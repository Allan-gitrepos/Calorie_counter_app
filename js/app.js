// Main App Controller - Enterprise Edition v5
// Enhanced with proper initialization and URL parameter handling

const App = {
    version: '5.0.0',

    init() {
        console.log(`FitCalo v${this.version} initializing...`);

        // Apply saved theme
        const savedTheme = localStorage.getItem('fitcalo_theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        // Small delay for smoother loading experience
        setTimeout(() => {
            UI.hideLoading();

            // Check for URL parameters (for shortcuts)
            this.handleUrlParams();

            // Setup back button handler
            this.setupBackHandler();

            if (Storage.isOnboarded()) {
                this.showDashboard();
            } else {
                Onboarding.init();
            }
        }, 300);
    },

    handleUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');

        if (action === 'log' && Storage.isOnboarded()) {
            // Open chat directly after dashboard loads
            setTimeout(() => Chat.open(), 500);
        } else if (action === 'stats' && Storage.isOnboarded()) {
            // Switch to stats tab
            setTimeout(() => {
                Dashboard.currentTab = 'stats';
                Dashboard.update();
            }, 500);
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
            app: 'FitCalo',
            version: this.version,
            user: Storage.getUser(),
            exportDate: new Date().toISOString(),
            streak: Storage.getStreak(),
            achievements: Storage.getAchievements(),
            weightHistory: Storage.getWeightHistory(),
            meals: {}
        };

        // Collect all meal data
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('fitcalo_meals_')) {
                const date = key.replace('fitcalo_meals_', '');
                data.meals[date] = JSON.parse(localStorage.getItem(key));
            }
        });

        // Collect water data
        data.water = {};
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('fitcalo_water_')) {
                const date = key.replace('fitcalo_water_', '');
                data.water[date] = parseInt(localStorage.getItem(key));
            }
        });

        // Create and download file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fitcalo_backup_${UI.getDateString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        UI.showToast('Data exported successfully! 📥', 'success');
    },

    async importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                const text = await file.text();
                const data = JSON.parse(text);

                if (data.app !== 'FitCalo') {
                    throw new Error('Invalid backup file');
                }

                // Restore user data
                if (data.user) Storage.saveUser(data.user);

                // Restore meals
                if (data.meals) {
                    Object.entries(data.meals).forEach(([date, meals]) => {
                        Storage.saveMeals(date, meals);
                    });
                }

                // Restore water data
                if (data.water) {
                    Object.entries(data.water).forEach(([date, amount]) => {
                        Storage.setWaterIntake(date, amount);
                    });
                }

                // Restore achievements
                if (data.achievements) {
                    localStorage.setItem('fitcalo_achievements', JSON.stringify(data.achievements));
                }

                // Restore weight history
                if (data.weightHistory) {
                    localStorage.setItem('fitcalo_weight_history', JSON.stringify(data.weightHistory));
                }

                // Restore streak
                if (data.streak) {
                    localStorage.setItem('fitcalo_streak', data.streak.toString());
                }

                UI.showToast('Data imported successfully! 🎉', 'success');
                Dashboard.update();

            } catch (error) {
                UI.showToast('Failed to import: ' + error.message, 'error');
            }
        };

        input.click();
    },

    clearAllData() {
        if (confirm('⚠️ Clear all data?\n\nThis will permanently delete:\n• Your profile\n• All meal logs\n• Achievements\n• Streaks\n• API key\n\nThis cannot be undone!')) {
            Storage.clearAll();
            UI.showToast('All data cleared', 'success');
            setTimeout(() => location.reload(), 500);
        }
    },

    // Get app statistics
    getAppStats() {
        const totalMeals = Storage.getTotalMealsLogged();
        const streak = Storage.getStreak();
        const achievements = Storage.getAchievements();
        const weeklyData = Storage.getWeeklyData();

        return {
            totalMeals,
            streak,
            achievementsCount: achievements.length,
            weeklyAvg: weeklyData.avgCalories,
            totalCaloriesTracked: weeklyData.totalCalories
        };
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
