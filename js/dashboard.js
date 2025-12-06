// Dashboard Module - Enterprise Edition v5
// Premium design with new features: Water Tracker, Weekly Stats, Streaks, Quick Actions, Insights

const Dashboard = {
    currentDate: new Date(),
    currentTab: 'home',
    tabs: ['home', 'stats', 'history', 'settings'],
    touchStartX: 0,
    touchEndX: 0,
    isAnimating: false,
    waterGoal: 8, // 8 glasses
    theme: localStorage.getItem('fitcalo_theme') || 'light',

    init() {
        this.applyTheme();
    },

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
    },

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('fitcalo_theme', this.theme);
        this.applyTheme();
        UI.showToast(`${this.theme === 'dark' ? '🌙' : '☀️'} ${this.theme.charAt(0).toUpperCase() + this.theme.slice(1)} mode enabled`);
    },

    render() {
        const dateStr = UI.getDateString(this.currentDate);
        const summary = Storage.getDailySummary(dateStr);
        const progress = Math.min(100, Math.round((summary.eaten / summary.goal) * 100));

        return `
        <div id="dashboard-screen" class="screen">
            <!-- Mesh Gradient Background -->
            <div class="mesh-gradient"></div>
            
            <!-- Top Tab Navigation -->
            <nav class="top-tabs">
                <button class="tab-item ${this.currentTab === 'home' ? 'active' : ''}" onclick="Dashboard.switchTab('home')">
                    <span>🏠</span><span>Home</span>
                </button>
                <button class="tab-item ${this.currentTab === 'stats' ? 'active' : ''}" onclick="Dashboard.switchTab('stats')">
                    <span>📊</span><span>Stats</span>
                </button>
                <button class="tab-item ${this.currentTab === 'history' ? 'active' : ''}" onclick="Dashboard.switchTab('history')">
                    <span>📅</span><span>History</span>
                </button>
                <button class="tab-item ${this.currentTab === 'settings' ? 'active' : ''}" onclick="Dashboard.switchTab('settings')">
                    <span>⚙️</span><span>Settings</span>
                </button>
            </nav>

            <!-- Tab Content -->
            <div class="tab-content" id="tab-content" style="position: relative; overflow: hidden;">
                <div id="tab-inner" style="transition: transform 0.3s ease, opacity 0.3s ease; width: 100%;">
                    ${this.currentTab === 'home' ? this.renderHome(summary, progress) : ''}
                    ${this.currentTab === 'stats' ? this.renderStats() : ''}
                    ${this.currentTab === 'history' ? History.renderContent() : ''}
                    ${this.currentTab === 'settings' ? this.renderSettings() : ''}
                </div>
            </div>

            <!-- Floating Chat Button -->
            <button class="fab-chat" onclick="Chat.open()" aria-label="Open AI Chat">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
            </button>
        </div>`;
    },

    renderHome(summary, progress) {
        const user = Storage.getUser() || {};
        const greeting = this.getGreeting();
        const waterIntake = Storage.getWaterIntake(UI.getDateString(this.currentDate));
        const streak = Storage.getStreak();

        return `
            <!-- Header -->
            <header class="header" style="padding-bottom: 0;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                    <div>
                        <p class="text-sm text-muted" style="margin-bottom: 4px;">${greeting}</p>
                        <h2 style="font-size: 1.5rem;">${user.name || 'Welcome'} 👋</h2>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${streak > 0 ? `<div class="streak-badge"><span>🔥</span> ${streak} day${streak > 1 ? 's' : ''}</div>` : ''}
                    </div>
                </div>
                
                <!-- Date Navigator -->
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: var(--gray-100); border-radius: var(--radius-md);">
                    <button class="btn-icon btn-icon-sm" onclick="Dashboard.prevDay()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <div style="text-align: center;">
                        <p class="text-xs text-muted" style="text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                            ${UI.formatDate(this.currentDate) === 'Today' ? 'TODAY' : UI.formatDate(this.currentDate).toUpperCase()}
                        </p>
                        <p style="font-weight: 600; color: var(--black);">${this.formatDateDisplay()}</p>
                    </div>
                    <button class="btn-icon btn-icon-sm" onclick="Dashboard.nextDay()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                </div>
            </header>

            <!-- Main Content -->
            <main style="padding: 16px 20px; padding-bottom: 100px;">
                
                <!-- Hero Card with Progress Ring -->
                <div class="hero-card" style="margin-bottom: 20px;">
                    <div style="position: relative; z-index: 1; display: flex; align-items: center; gap: 24px;">
                        
                        <!-- Progress Ring -->
                        <div class="progress-ring">
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                <circle class="progress-ring-bg" cx="60" cy="60" r="52" stroke-width="12"/>
                                <circle class="progress-ring-fill" cx="60" cy="60" r="52" stroke-width="12"
                                    stroke="url(#progressGradient)"
                                    stroke-dasharray="326.73"
                                    stroke-dashoffset="${326.73 - (326.73 * progress / 100)}"/>
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stop-color="#FF6B35"/>
                                        <stop offset="100%" stop-color="#F7931E"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div class="progress-ring-text" style="color: white;">
                                <p style="font-size: 1.75rem; font-weight: 800; line-height: 1;">${progress}%</p>
                                <p style="font-size: 0.625rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.5px;">of goal</p>
                            </div>
                        </div>
                        
                        <!-- Stats -->
                        <div style="flex: 1;">
                            <div style="margin-bottom: 16px;">
                                <p style="opacity: 0.6; font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.5px;">Remaining</p>
                                <p style="font-size: 2rem; font-weight: 800; line-height: 1.1;">${summary.remaining}</p>
                                <p style="font-size: 0.75rem; opacity: 0.6;">kcal</p>
                            </div>
                            <div style="display: flex; gap: 20px;">
                                <div>
                                    <p style="opacity: 0.6; font-size: 0.625rem; text-transform: uppercase;">Eaten</p>
                                    <p style="font-size: 1rem; font-weight: 700;">${summary.eaten}</p>
                                </div>
                                <div>
                                    <p style="opacity: 0.6; font-size: 0.625rem; text-transform: uppercase;">Burned</p>
                                    <p style="font-size: 1rem; font-weight: 700; color: #4ADE80;">${summary.burned}</p>
                                </div>
                                <div>
                                    <p style="opacity: 0.6; font-size: 0.625rem; text-transform: uppercase;">Goal</p>
                                    <p style="font-size: 1rem; font-weight: 700;">${summary.goal}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Macros -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                    ${this.renderMacroCard('Carbs', summary.carbs, 'var(--carbs-color)')}
                    ${this.renderMacroCard('Protein', summary.protein, 'var(--protein-color)')}
                    ${this.renderMacroCard('Fat', summary.fat, 'var(--fat-color)')}
                </div>

                <!-- Water Tracker -->
                <div class="card" style="margin-bottom: 20px;">
                    <div class="section-header" style="margin-bottom: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 1.25rem;">💧</span>
                            <h4>Water Intake</h4>
                        </div>
                        <span class="pill pill-info">${waterIntake}/${this.waterGoal} glasses</span>
                    </div>
                    <div class="water-tracker">
                        ${Array.from({ length: this.waterGoal }, (_, i) => `
                            <div class="water-drop ${i < waterIntake ? 'filled' : ''}" 
                                onclick="Dashboard.toggleWater(${i + 1})">
                                💧
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="section-header">
                    <h4>Quick Add</h4>
                </div>
                <div class="quick-actions" style="margin-bottom: 20px;">
                    <div class="quick-action" onclick="Dashboard.quickAdd('breakfast')">
                        <span class="quick-action-icon">🍳</span>
                        <span class="quick-action-label">Breakfast</span>
                    </div>
                    <div class="quick-action" onclick="Dashboard.quickAdd('lunch')">
                        <span class="quick-action-icon">🥗</span>
                        <span class="quick-action-label">Lunch</span>
                    </div>
                    <div class="quick-action" onclick="Dashboard.quickAdd('dinner')">
                        <span class="quick-action-icon">🍽️</span>
                        <span class="quick-action-label">Dinner</span>
                    </div>
                    <div class="quick-action" onclick="Dashboard.quickAdd('snack')">
                        <span class="quick-action-icon">🍎</span>
                        <span class="quick-action-label">Snack</span>
                    </div>
                </div>

                <!-- Today's AI Insight -->
                ${this.renderInsight(summary)}

                <!-- Meals Section -->
                <div class="section-header">
                    <h4>Today's Log</h4>
                    <button class="section-link" onclick="Chat.open()">+ Add Meal</button>
                </div>

                <div id="meals-list" style="display: flex; flex-direction: column; gap: 10px;">
                    ${this.renderMeals(summary.meals)}
                </div>
            </main>
        `;
    },

    renderStats() {
        const weeklyData = Storage.getWeeklyData();
        const achievements = Storage.getAchievements();
        const user = Storage.getUser() || {};

        return `
            <div style="padding: 20px; padding-bottom: 100px;">
                <h2 style="margin-bottom: 24px;">Your Stats</h2>
                
                <!-- Weekly Overview -->
                <div class="card" style="margin-bottom: 20px;">
                    <div class="section-header" style="margin-bottom: 16px;">
                        <h4>This Week</h4>
                        <span class="pill pill-success">+${weeklyData.avgCalories > 0 ? 'On Track' : 'Getting Started'}</span>
                    </div>
                    
                    <!-- Weekly Chart -->
                    <div class="weekly-chart">
                        ${weeklyData.days.map((day, i) => `
                            <div class="chart-bar">
                                <div class="chart-bar-fill ${day.percentage > 0 ? 'active' : ''}" 
                                    style="height: ${Math.max(8, day.percentage)}px;"></div>
                                <span class="chart-bar-label">${day.label}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="divider"></div>
                    
                    <!-- Week Summary -->
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                        <div>
                            <p class="text-2xl font-bold" style="color: var(--black);">${weeklyData.totalCalories.toLocaleString()}</p>
                            <p class="text-xs text-muted">Total Calories</p>
                        </div>
                        <div>
                            <p class="text-2xl font-bold" style="color: var(--success);">${weeklyData.totalBurned.toLocaleString()}</p>
                            <p class="text-xs text-muted">Burned</p>
                        </div>
                        <div>
                            <p class="text-2xl font-bold" style="color: var(--primary);">${weeklyData.avgCalories}</p>
                            <p class="text-xs text-muted">Daily Avg</p>
                        </div>
                    </div>
                </div>

                <!-- Body Metrics -->
                <div class="card" style="margin-bottom: 20px;">
                    <div class="section-header" style="margin-bottom: 16px;">
                        <h4>Body Metrics</h4>
                        <button class="section-link" onclick="Dashboard.updateWeight()">Update</button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                        <div class="stat-card">
                            <div class="stat-card-icon" style="background: var(--primary-soft); color: var(--primary);">⚖️</div>
                            <div class="stat-card-value">${user.weight || '--'}</div>
                            <div class="stat-card-label">Current Weight (kg)</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-icon" style="background: var(--info-soft); color: var(--info);">📐</div>
                            <div class="stat-card-value">${user.height || '--'}</div>
                            <div class="stat-card-label">Height (cm)</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-icon" style="background: var(--success-soft); color: var(--success);">🎯</div>
                            <div class="stat-card-value">${user.dailyCalories || 2000}</div>
                            <div class="stat-card-label">Daily Goal</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-card-icon" style="background: var(--warning-soft); color: var(--warning);">📊</div>
                            <div class="stat-card-value">${this.calculateBMI(user)}</div>
                            <div class="stat-card-label">BMI</div>
                        </div>
                    </div>
                </div>

                <!-- Achievements -->
                <div class="card">
                    <div class="section-header" style="margin-bottom: 16px;">
                        <h4>Achievements</h4>
                        <span class="pill pill-warning">${achievements.length} unlocked</span>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 12px;">
                        ${achievements.length > 0 ? achievements.map(a => `
                            <div class="achievement-badge">
                                <span class="achievement-icon">${a.icon}</span>
                                <div class="achievement-content">
                                    <p class="achievement-title">${a.title}</p>
                                    <p class="achievement-subtitle">${a.description}</p>
                                </div>
                            </div>
                        `).join('') : `
                            <div style="text-align: center; padding: 24px; color: var(--gray-500);">
                                <p style="font-size: 2rem; margin-bottom: 8px;">🏆</p>
                                <p class="text-sm">Keep logging to unlock achievements!</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
    },

    renderSettings() {
        const user = Storage.getUser() || {};
        return `
            <div style="padding: 20px; padding-bottom: 100px;">
                <h2 style="margin-bottom: 24px;">Settings</h2>
                
                <!-- Theme Toggle -->
                <div class="card" style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <span style="font-size: 1.5rem;">${this.theme === 'dark' ? '🌙' : '☀️'}</span>
                            <div>
                                <p style="font-weight: 600; color: var(--black);">Dark Mode</p>
                                <p class="text-xs text-muted">Toggle dark theme</p>
                            </div>
                        </div>
                        <div class="toggle-switch ${this.theme === 'dark' ? 'active' : ''}" onclick="Dashboard.toggleTheme()"></div>
                    </div>
                </div>
                
                <div class="card">
                    <h6 style="color: var(--gray-500); margin-bottom: 16px;">Profile</h6>
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
                    <h6 style="color: var(--gray-500); margin-bottom: 16px;">AI Configuration</h6>
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
                            <button type="button" class="btn-icon btn-icon-sm" onclick="this.previousElementSibling.type = this.previousElementSibling.type === 'password' ? 'text' : 'password'" style="flex-shrink: 0;">👁️</button>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h6 style="color: var(--gray-500); margin-bottom: 16px;">Data Management</h6>
                    <div style="display: flex; gap: 12px; margin-bottom: 12px;">
                        <button class="btn btn-secondary" onclick="App.exportData()" style="flex: 1;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Export
                        </button>
                        <button class="btn btn-danger" onclick="App.clearAllData()" style="flex: 1;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            Reset
                        </button>
                    </div>
                </div>

                <button class="btn btn-primary" onclick="Dashboard.saveSettings()" style="margin-top: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    Save Changes
                </button>
                
                <!-- App Info -->
                <div style="text-align: center; margin-top: 32px; padding: 16px;">
                    <p class="text-sm" style="color: var(--gray-400);">FitCalo v5.0 Enterprise</p>
                    <p class="text-xs" style="color: var(--gray-400); margin-top: 4px;">Powered by Gemini AI</p>
                </div>
            </div>
        `;
    },

    renderMacroCard(name, data, color) {
        const percent = Math.min(100, Math.round((data.current / data.goal) * 100));
        return `
        <div class="macro-card">
            <p class="text-xs text-muted" style="margin-bottom: 4px;">${name}</p>
            <p style="font-weight: 700; font-size: 1.125rem; margin-bottom: 4px; color: var(--black);">${data.current}g</p>
            <p class="text-xs text-muted" style="margin-bottom: 8px;">/ ${data.goal}g</p>
            <div class="progress-bar" style="height: 6px;">
                <div class="progress-fill" style="width: ${percent}%; background: ${color};"></div>
            </div>
        </div>`;
    },

    renderMeals(meals) {
        if (!meals || meals.length === 0) {
            return `
            <div class="empty-state">
                <div class="empty-state-icon">🍽️</div>
                <p class="empty-state-title">No meals logged yet</p>
                <p class="empty-state-text">Start tracking by adding your first meal</p>
                <button class="btn btn-primary" onclick="Chat.open()" style="width: auto; padding: 12px 24px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                    Log Your First Meal
                </button>
            </div>`;
        }

        return meals.map((meal, index) => {
            const isFood = meal.type === 'food';
            const icon = isFood ? '🍱' : '🔥';
            const sign = isFood ? '+' : '-';
            const color = isFood ? 'var(--black)' : 'var(--success)';

            return `
            <div class="meal-item" style="animation-delay: ${index * 0.05}s;">
                <div class="meal-icon">${icon}</div>
                <div style="flex: 1; min-width: 0;">
                    <p style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--black);">${meal.name}</p>
                    <p class="text-xs text-muted">
                        ${isFood ? `C: ${meal.carbs || 0}g · P: ${meal.protein || 0}g · F: ${meal.fat || 0}g` : meal.duration || 'Activity'}
                    </p>
                </div>
                <p style="font-weight: 700; color: ${color}; white-space: nowrap;">${sign}${meal.calories}</p>
                <button class="btn-icon btn-icon-sm" onclick="event.stopPropagation(); Dashboard.deleteMeal(${meal.id})" 
                    style="color: var(--error);">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>`;
        }).join('');
    },

    renderInsight(summary) {
        const insights = this.generateInsights(summary);
        if (!insights) return '';

        return `
            <div class="insight-card" style="margin-bottom: 20px;">
                <div class="insight-icon">💡</div>
                <div class="insight-content">
                    <p class="insight-title">${insights.title}</p>
                    <p class="insight-text">${insights.text}</p>
                </div>
            </div>
        `;
    },

    generateInsights(summary) {
        const percent = Math.round((summary.eaten / summary.goal) * 100);
        const hour = new Date().getHours();

        if (summary.meals.length === 0 && hour < 12) {
            return { title: 'Good Morning!', text: 'Start your day right with a balanced breakfast. Tap to log your first meal!' };
        }

        if (percent > 100) {
            return { title: 'Over your goal', text: `You've exceeded your daily target by ${summary.eaten - summary.goal} kcal. Consider a light workout!` };
        }

        if (percent >= 80 && percent <= 100) {
            return { title: 'Almost there!', text: `You have ${summary.remaining} kcal left. Great job staying on track today!` };
        }

        if (hour >= 18 && percent < 50) {
            return { title: 'Reminder', text: 'You still have plenty of calories left today. Make sure to eat enough!' };
        }

        if (summary.protein.current < summary.protein.goal * 0.5 && hour > 12) {
            return { title: 'Protein Tip', text: 'Try to include more protein in your remaining meals for better satiety.' };
        }

        return { title: 'Keep it up!', text: 'You\'re doing great tracking your nutrition today. Consistency is key!' };
    },

    getGreeting() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    },

    calculateBMI(user) {
        if (!user.weight || !user.height) return '--';
        const heightM = user.height / 100;
        return (user.weight / (heightM * heightM)).toFixed(1);
    },

    formatDateDisplay() {
        return this.currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });
    },

    // Water tracking
    toggleWater(level) {
        const dateStr = UI.getDateString(this.currentDate);
        const current = Storage.getWaterIntake(dateStr);
        const newLevel = current === level ? level - 1 : level;
        Storage.setWaterIntake(dateStr, newLevel);
        this.update();

        if (newLevel === this.waterGoal) {
            UI.showToast('💧 Great job! Water goal achieved!', 'success');
        }
    },

    // Quick add shortcuts
    quickAdd(mealType) {
        Chat.open();
        setTimeout(() => {
            const input = document.getElementById('chat-input');
            if (input) {
                const prompts = {
                    breakfast: 'I had breakfast: ',
                    lunch: 'I had lunch: ',
                    dinner: 'I had dinner: ',
                    snack: 'I had a snack: '
                };
                input.value = prompts[mealType] || '';
                input.focus();
            }
        }, 400);
    },

    updateWeight() {
        const newWeight = prompt('Enter your current weight (kg):');
        if (newWeight && !isNaN(parseFloat(newWeight))) {
            const user = Storage.getUser() || {};
            user.weight = parseFloat(newWeight);
            Storage.saveUser(user);
            Storage.addWeightEntry(parseFloat(newWeight));
            UI.showToast('Weight updated!', 'success');
            this.update();
        }
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
            newIndex = currentIndex + 1;
        } else if (diff < 0 && currentIndex > 0) {
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

        inner.style.transform = direction === 'left' ? 'translateX(-100%)' : 'translateX(100%)';
        inner.style.opacity = '0';

        setTimeout(() => {
            this.currentTab = tab;
            this.update();

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
        Storage.updateStreak();
        Storage.checkAchievements();
    }
};

// Initialize theme on load
Dashboard.init();
