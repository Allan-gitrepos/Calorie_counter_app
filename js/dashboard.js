// Dashboard Module - With Swipe Animation and Fixed Tab Navigation
const Dashboard = {
    currentDate: new Date(),
    currentTab: 'home',
    tabs: ['home', 'history', 'settings'],
    touchStartX: 0,
    touchEndX: 0,
    isAnimating: false,

    render() {
        const dateStr = UI.getDateString(this.currentDate);
        const summary = Storage.getDailySummary(dateStr);
        const progress = Math.min(100, Math.round((summary.eaten / summary.goal) * 100));

        return `
        <div id="dashboard-screen" class="screen">
            <!-- Top Tab Navigation -->
            <nav class="top-tabs">
                <button class="tab-item ${this.currentTab === 'home' ? 'active' : ''}" onclick="Dashboard.switchTab('home')">
                    <span>🏠</span> Home
                </button>
                <button class="tab-item ${this.currentTab === 'history' ? 'active' : ''}" onclick="Dashboard.switchTab('history')">
                    <span>📅</span> History
                </button>
                <button class="tab-item ${this.currentTab === 'settings' ? 'active' : ''}" onclick="Dashboard.switchTab('settings')">
                    <span>⚙️</span> Settings
                </button>
            </nav>

            <!-- Tab Content with swipe area -->
            <div class="tab-content" id="tab-content" style="position: relative; overflow: hidden;">
                <div id="tab-inner" style="transition: transform 0.3s ease; width: 100%;">
                    ${this.currentTab === 'home' ? this.renderHome(summary, progress) : ''}
                    ${this.currentTab === 'history' ? History.renderContent() : ''}
                    ${this.currentTab === 'settings' ? this.renderSettings() : ''}
                </div>
            </div>

            <!-- Floating Chat Button -->
            <button class="fab-chat" onclick="Chat.open()">💬</button>
        </div>`;
    },

    renderHome(summary, progress) {
        return `
            <!-- Header -->
            <header class="header">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p class="text-xs text-muted" style="text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">
                            ${UI.formatDate(this.currentDate) === 'Today' ? 'TODAY' : UI.formatDate(this.currentDate).toUpperCase()}
                        </p>
                        <h2 style="font-size: 1.5rem;">${this.formatDateDisplay()}</h2>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-icon" onclick="Dashboard.prevDay()">←</button>
                        <button class="btn-icon" onclick="Dashboard.nextDay()">→</button>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main style="padding: 0 20px; padding-bottom: 100px;">
                
                <!-- Hero Card -->
                <div class="hero-card" style="margin-bottom: 20px;">
                    <div style="position: relative; z-index: 1;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 24px;">
                            <div>
                                <p style="opacity: 0.7; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Calories Left</p>
                                <p style="font-size: 3rem; font-weight: 800; line-height: 1;">${summary.remaining}</p>
                            </div>
                            <div style="text-align: right;">
                                <p style="opacity: 0.7; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Goal</p>
                                <p style="font-size: 1.5rem; font-weight: 700;">${summary.goal}</p>
                            </div>
                        </div>

                        <div class="progress-bar" style="margin-bottom: 20px; background: rgba(255,255,255,0.2);">
                            <div class="progress-fill" style="width: ${progress}%; background: linear-gradient(90deg, #FF5A00, #FF8A50);"></div>
                        </div>

                        <div style="display: flex; gap: 32px;">
                            <div>
                                <p style="opacity: 0.7; font-size: 0.7rem; text-transform: uppercase;">Eaten</p>
                                <p style="font-size: 1.25rem; font-weight: 700;">${summary.eaten}</p>
                            </div>
                            <div>
                                <p style="opacity: 0.7; font-size: 0.7rem; text-transform: uppercase;">Burned</p>
                                <p style="font-size: 1.25rem; font-weight: 700; color: #00C853;">${summary.burned}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Macros -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
                    ${this.renderMacroCard('Carbs', summary.carbs, '#3B82F6')}
                    ${this.renderMacroCard('Protein', summary.protein, '#FF5A00')}
                    ${this.renderMacroCard('Fat', summary.fat, '#EAB308')}
                </div>

                <!-- Meals Section -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3>Today's Log</h3>
                    <button style="background: none; border: none; color: #FF5A00; font-weight: 600; cursor: pointer; font-size: 0.875rem;" onclick="Chat.open()">
                        + Add Item
                    </button>
                </div>

                <div id="meals-list" style="display: flex; flex-direction: column; gap: 12px;">
                    ${this.renderMeals(summary.meals)}
                </div>
            </main>
        `;
    },

    renderSettings() {
        const user = Storage.getUser() || {};
        return `
            <div style="padding: 20px; padding-bottom: 100px;">
                <h2 style="margin-bottom: 24px;">Settings</h2>
                
                <div class="card">
                    <h3 class="text-muted text-sm" style="margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Profile</h3>
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" id="settings-name" value="${user.name || ''}">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Weight (kg)</label>
                            <input type="number" id="settings-weight" value="${user.weight || ''}">
                        </div>
                        <div class="form-group">
                            <label>Height (cm)</label>
                            <input type="number" id="settings-height" value="${user.height || ''}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Daily Calorie Goal</label>
                        <input type="number" id="settings-calories" value="${user.dailyCalories || 2000}">
                    </div>
                </div>

                <div class="card">
                    <h3 class="text-muted text-sm" style="margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">AI Configuration</h3>
                    <div class="form-group">
                        <label>AI Model</label>
                        <select id="settings-model">
                            <option value="gemini-2.0-flash" ${Storage.getModel() === 'gemini-2.0-flash' ? 'selected' : ''}>Gemini 2.0 Flash (Fast)</option>
                            <option value="gemini-1.5-pro" ${Storage.getModel() === 'gemini-1.5-pro' ? 'selected' : ''}>Gemini 1.5 Pro (Smart)</option>
                            <option value="gemini-1.5-flash" ${Storage.getModel() === 'gemini-1.5-flash' ? 'selected' : ''}>Gemini 1.5 Flash</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>API Key</label>
                        <div class="api-input-wrapper">
                            <input type="password" id="settings-api-key" value="${Storage.getApiKey() || ''}">
                            <button type="button" class="btn-icon" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'" style="flex-shrink: 0;">👁️</button>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h3 class="text-muted text-sm" style="margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px;">Data</h3>
                    <div style="display: flex; gap: 12px;">
                        <button class="btn btn-secondary" onclick="App.exportData()" style="flex: 1;">📥 Export</button>
                        <button class="btn btn-danger" onclick="App.clearAllData()" style="flex: 1;">🗑️ Reset</button>
                    </div>
                </div>

                <button class="btn btn-primary" onclick="Dashboard.saveSettings()" style="margin-top: 16px;">
                    💾 Save Changes
                </button>
            </div>
        `;
    },

    saveSettings() {
        const user = Storage.getUser() || {};
        user.name = document.getElementById('settings-name').value;
        user.weight = parseFloat(document.getElementById('settings-weight').value);
        user.height = parseFloat(document.getElementById('settings-height').value);
        user.dailyCalories = parseInt(document.getElementById('settings-calories').value);

        Storage.saveUser(user);
        Storage.saveApiKey(document.getElementById('settings-api-key').value);
        Storage.saveModel(document.getElementById('settings-model').value);

        UI.showToast('Settings saved!', 'success');
    },

    renderMacroCard(name, data, color) {
        const percent = Math.min(100, Math.round((data.current / data.goal) * 100));
        return `
        <div class="macro-card">
            <p class="text-xs text-muted" style="margin-bottom: 4px;">${name}</p>
            <p style="font-weight: 700; font-size: 1.1rem; margin-bottom: 8px;">${data.current}g</p>
            <div class="progress-bar" style="height: 4px;">
                <div class="progress-fill" style="width: ${percent}%; background: ${color};"></div>
            </div>
        </div>`;
    },

    renderMeals(meals) {
        if (!meals || meals.length === 0) {
            return `
            <div style="text-align: center; padding: 48px 20px; background: #F5F5F7; border-radius: 24px;">
                <div style="font-size: 3rem; margin-bottom: 16px;">🍽️</div>
                <p style="color: #6A6A6A; margin-bottom: 20px;">No meals logged yet</p>
                <button class="btn btn-primary" onclick="Chat.open()" style="width: auto; padding: 12px 24px;">
                    Log Your First Meal
                </button>
            </div>`;
        }

        return meals.map((meal, index) => {
            const isFood = meal.type === 'food';
            const icon = isFood ? '🍱' : '🔥';
            const sign = isFood ? '+' : '-';
            const color = isFood ? '#0A0A0A' : '#00C853';

            return `
            <div class="meal-item" style="animation-delay: ${index * 0.1}s;">
                <div class="meal-icon">${icon}</div>
                <div style="flex: 1; min-width: 0;">
                    <p style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${meal.name}</p>
                    <p class="text-xs text-muted">
                        ${isFood ? `C: ${meal.carbs || 0}g · P: ${meal.protein || 0}g · F: ${meal.fat || 0}g` : meal.duration || 'Activity'}
                    </p>
                </div>
                <p style="font-weight: 700; color: ${color}; white-space: nowrap;">${sign}${meal.calories}</p>
                <button class="btn-icon" onclick="event.stopPropagation(); Dashboard.deleteMeal(${meal.id})" 
                    style="width: 36px; height: 36px; color: #FF3D00; font-size: 1.25rem;">×</button>
            </div>`;
        }).join('');
    },

    formatDateDisplay() {
        return this.currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
    },

    // Swipe handling
    initSwipe() {
        const content = document.getElementById('tab-content');
        if (!content || content.dataset.swipeInit) return;

        content.dataset.swipeInit = 'true';

        content.addEventListener('touchstart', (e) => {
            if (this.isAnimating) return;
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        content.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    },

    handleSwipe() {
        const diff = this.touchStartX - this.touchEndX;
        const threshold = 80;

        if (Math.abs(diff) < threshold) return;

        const currentIndex = this.tabs.indexOf(this.currentTab);
        let newIndex = currentIndex;

        if (diff > 0 && currentIndex < this.tabs.length - 1) {
            // Swipe left - next tab
            newIndex = currentIndex + 1;
        } else if (diff < 0 && currentIndex > 0) {
            // Swipe right - previous tab
            newIndex = currentIndex - 1;
        }

        if (newIndex !== currentIndex) {
            this.animateToTab(this.tabs[newIndex], diff > 0 ? 'left' : 'right');
        }
    },

    animateToTab(tab, direction) {
        const inner = document.getElementById('tab-inner');
        if (!inner) {
            this.switchTab(tab);
            return;
        }

        this.isAnimating = true;

        // Animate out
        inner.style.transform = direction === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
        inner.style.opacity = '0';

        setTimeout(() => {
            this.currentTab = tab;
            this.update();

            // Reset and animate in from opposite direction
            const newInner = document.getElementById('tab-inner');
            if (newInner) {
                newInner.style.transition = 'none';
                newInner.style.transform = direction === 'left' ? 'translateX(100%)' : 'translateX(-100%)';
                newInner.style.opacity = '0';

                setTimeout(() => {
                    newInner.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
                    newInner.style.transform = 'translateX(0)';
                    newInner.style.opacity = '1';

                    setTimeout(() => {
                        this.isAnimating = false;
                    }, 300);
                }, 20);
            }
        }, 200);
    },

    switchTab(tab) {
        if (this.currentTab === tab) return;

        const currentIndex = this.tabs.indexOf(this.currentTab);
        const newIndex = this.tabs.indexOf(tab);
        const direction = newIndex > currentIndex ? 'left' : 'right';

        this.animateToTab(tab, direction);
    },

    update() {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = this.render();
            setTimeout(() => this.initSwipe(), 50);
        }
    },

    prevDay() {
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        this.update();
    },

    nextDay() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const current = new Date(this.currentDate);
        current.setHours(0, 0, 0, 0);

        if (current < today) {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
            this.update();
        }
    },

    deleteMeal(mealId) {
        if (confirm('Delete this item?')) {
            const dateStr = UI.getDateString(this.currentDate);
            Storage.deleteMeal(dateStr, mealId);
            UI.showToast('Item deleted', 'success');
            this.update();
        }
    },

    addMeal(mealData) {
        const dateStr = UI.getDateString(this.currentDate);
        Storage.addMeal(dateStr, mealData);
    }
};
