// Storage Module - Enterprise Edition v5
// Enhanced with Water Tracking, Streaks, Achievements, Weight History, Weekly Data

const Storage = {
    KEYS: {
        USER: 'fitcalo_user',
        MEALS: 'fitcalo_meals',
        API_KEY: 'fitcalo_api_key',
        MODEL: 'fitcalo_model',
        ONBOARDED: 'fitcalo_onboarded',
        WATER: 'fitcalo_water',
        STREAK: 'fitcalo_streak',
        LAST_LOG: 'fitcalo_last_log',
        ACHIEVEMENTS: 'fitcalo_achievements',
        WEIGHT_HISTORY: 'fitcalo_weight_history',
        FAVORITES: 'fitcalo_favorites'
    },

    // ===== User Profile =====
    saveUser(userData) {
        localStorage.setItem(this.KEYS.USER, JSON.stringify(userData));
    },

    getUser() {
        const data = localStorage.getItem(this.KEYS.USER);
        return data ? JSON.parse(data) : null;
    },

    // ===== API Key =====
    saveApiKey(key) {
        localStorage.setItem(this.KEYS.API_KEY, key);
    },

    getApiKey() {
        return localStorage.getItem(this.KEYS.API_KEY);
    },

    // ===== Model Selection =====
    saveModel(model) {
        localStorage.setItem(this.KEYS.MODEL, model);
    },

    getModel() {
        return localStorage.getItem(this.KEYS.MODEL) || 'gemini-2.0-flash';
    },

    // ===== Onboarding =====
    setOnboarded(value = true) {
        localStorage.setItem(this.KEYS.ONBOARDED, value.toString());
    },

    isOnboarded() {
        return localStorage.getItem(this.KEYS.ONBOARDED) === 'true';
    },

    // ===== Meals =====
    getMeals(date) {
        const key = `${this.KEYS.MEALS}_${date}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    saveMeals(date, meals) {
        const key = `${this.KEYS.MEALS}_${date}`;
        localStorage.setItem(key, JSON.stringify(meals));
    },

    addMeal(date, meal) {
        const meals = this.getMeals(date);
        meal.id = Date.now();
        meal.timestamp = new Date().toISOString();
        meals.push(meal);
        this.saveMeals(date, meals);

        // Update last log date for streak
        this.updateLastLog(date);

        return meal;
    },

    deleteMeal(date, mealId) {
        const meals = this.getMeals(date);
        const filtered = meals.filter(m => m.id !== mealId);
        this.saveMeals(date, filtered);
    },

    // ===== Daily Summary =====
    getDailySummary(date) {
        const meals = this.getMeals(date);
        const user = this.getUser();

        let eaten = 0, burned = 0;
        let carbs = 0, protein = 0, fat = 0;

        meals.forEach(meal => {
            if (meal.type === 'food') {
                eaten += meal.calories || 0;
                carbs += meal.carbs || 0;
                protein += meal.protein || 0;
                fat += meal.fat || 0;
            } else if (meal.type === 'activity') {
                burned += meal.calories || 0;
            }
        });

        const goal = user?.dailyCalories || 2000;
        const carbsGoal = Math.round(goal * 0.5 / 4);
        const proteinGoal = Math.round(goal * 0.2 / 4);
        const fatGoal = Math.round(goal * 0.3 / 9);

        return {
            eaten,
            burned,
            goal,
            remaining: Math.max(0, goal - eaten + burned),
            carbs: { current: carbs, goal: carbsGoal },
            protein: { current: protein, goal: proteinGoal },
            fat: { current: fat, goal: fatGoal },
            meals
        };
    },

    // ===== Water Tracking =====
    getWaterIntake(date) {
        const key = `${this.KEYS.WATER}_${date}`;
        return parseInt(localStorage.getItem(key)) || 0;
    },

    setWaterIntake(date, amount) {
        const key = `${this.KEYS.WATER}_${date}`;
        localStorage.setItem(key, amount.toString());
    },

    // ===== Streak Management =====
    getStreak() {
        return parseInt(localStorage.getItem(this.KEYS.STREAK)) || 0;
    },

    updateStreak() {
        const today = new Date().toISOString().split('T')[0];
        const lastLog = localStorage.getItem(this.KEYS.LAST_LOG);

        if (!lastLog) {
            // First log ever
            localStorage.setItem(this.KEYS.STREAK, '1');
            return 1;
        }

        const lastDate = new Date(lastLog);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

        let currentStreak = this.getStreak();

        if (diffDays === 0) {
            // Same day, no change
            return currentStreak;
        } else if (diffDays === 1) {
            // Consecutive day
            currentStreak++;
        } else {
            // Streak broken
            currentStreak = 1;
        }

        localStorage.setItem(this.KEYS.STREAK, currentStreak.toString());
        return currentStreak;
    },

    updateLastLog(date) {
        localStorage.setItem(this.KEYS.LAST_LOG, date);
    },

    // ===== Weekly Data =====
    getWeeklyData() {
        const days = [];
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const user = this.getUser() || {};
        const goal = user.dailyCalories || 2000;

        let totalCalories = 0;
        let totalBurned = 0;
        let daysWithData = 0;

        // Get last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const summary = this.getDailySummary(dateStr);

            totalCalories += summary.eaten;
            totalBurned += summary.burned;
            if (summary.eaten > 0) daysWithData++;

            days.push({
                date: dateStr,
                label: dayLabels[date.getDay()],
                eaten: summary.eaten,
                burned: summary.burned,
                percentage: Math.min(100, Math.round((summary.eaten / goal) * 100))
            });
        }

        return {
            days,
            totalCalories,
            totalBurned,
            avgCalories: daysWithData > 0 ? Math.round(totalCalories / daysWithData) : 0
        };
    },

    // ===== Achievements =====
    getAchievements() {
        const data = localStorage.getItem(this.KEYS.ACHIEVEMENTS);
        return data ? JSON.parse(data) : [];
    },

    addAchievement(achievement) {
        const achievements = this.getAchievements();
        if (!achievements.find(a => a.id === achievement.id)) {
            achievements.push({
                ...achievement,
                unlockedAt: new Date().toISOString()
            });
            localStorage.setItem(this.KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
            return true;
        }
        return false;
    },

    checkAchievements() {
        const streak = this.getStreak();
        const weeklyData = this.getWeeklyData();
        const totalMeals = this.getTotalMealsLogged();
        const achievements = [];

        // Streak achievements
        if (streak >= 3) {
            achievements.push({
                id: 'streak_3',
                icon: '🔥',
                title: '3 Day Streak',
                description: 'Logged meals for 3 consecutive days'
            });
        }
        if (streak >= 7) {
            achievements.push({
                id: 'streak_7',
                icon: '⭐',
                title: 'Week Warrior',
                description: 'Logged meals for 7 consecutive days'
            });
        }
        if (streak >= 30) {
            achievements.push({
                id: 'streak_30',
                icon: '🏆',
                title: 'Month Master',
                description: 'Logged meals for 30 consecutive days'
            });
        }

        // Meal count achievements
        if (totalMeals >= 10) {
            achievements.push({
                id: 'meals_10',
                icon: '🍽️',
                title: 'First Steps',
                description: 'Logged 10 meals total'
            });
        }
        if (totalMeals >= 50) {
            achievements.push({
                id: 'meals_50',
                icon: '🥗',
                title: 'Nutrition Enthusiast',
                description: 'Logged 50 meals total'
            });
        }
        if (totalMeals >= 100) {
            achievements.push({
                id: 'meals_100',
                icon: '👨‍🍳',
                title: 'Meal Master',
                description: 'Logged 100 meals total'
            });
        }

        // Add any new achievements
        achievements.forEach(a => {
            if (this.addAchievement(a)) {
                setTimeout(() => {
                    UI.showToast(`🎉 Achievement Unlocked: ${a.title}!`, 'success');
                }, 500);
            }
        });

        return this.getAchievements();
    },

    getTotalMealsLogged() {
        let total = 0;
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('fitcalo_meals_')) {
                const meals = JSON.parse(localStorage.getItem(key));
                total += meals.length;
            }
        });
        return total;
    },

    // ===== Weight History =====
    getWeightHistory() {
        const data = localStorage.getItem(this.KEYS.WEIGHT_HISTORY);
        return data ? JSON.parse(data) : [];
    },

    addWeightEntry(weight) {
        const history = this.getWeightHistory();
        history.push({
            weight,
            date: new Date().toISOString()
        });
        // Keep last 30 entries
        if (history.length > 30) {
            history.shift();
        }
        localStorage.setItem(this.KEYS.WEIGHT_HISTORY, JSON.stringify(history));
    },

    // ===== Favorites =====
    getFavorites() {
        const data = localStorage.getItem(this.KEYS.FAVORITES);
        return data ? JSON.parse(data) : [];
    },

    addFavorite(meal) {
        const favorites = this.getFavorites();
        if (!favorites.find(f => f.name === meal.name)) {
            favorites.push({
                ...meal,
                addedAt: new Date().toISOString()
            });
            localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites));
            return true;
        }
        return false;
    },

    removeFavorite(mealName) {
        const favorites = this.getFavorites();
        const filtered = favorites.filter(f => f.name !== mealName);
        localStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(filtered));
    },

    // ===== Calculate TDEE =====
    calculateTDEE(userData) {
        const { weight, height, age, gender, goal } = userData;
        let activityLevel = userData.activityLevel || 'moderate';

        // Handle numeric activity values from onboarding
        if (!isNaN(parseFloat(activityLevel))) {
            const num = parseFloat(activityLevel);
            if (num <= 1.2) activityLevel = 'sedentary';
            else if (num <= 1.375) activityLevel = 'light';
            else if (num <= 1.55) activityLevel = 'moderate';
            else if (num <= 1.725) activityLevel = 'active';
            else activityLevel = 'very_active';
        }

        // Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
            bmr = 10 * (weight || 70) + 6.25 * (height || 170) - 5 * (age || 25) + 5;
        } else {
            bmr = 10 * (weight || 70) + 6.25 * (height || 170) - 5 * (age || 25) - 161;
        }

        const multipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9
        };

        let tdee = bmr * (multipliers[activityLevel] || 1.55);

        // Goal adjustment
        if (goal === 'lose') tdee -= 500;
        else if (goal === 'gain') tdee += 500;

        return Math.round(tdee);
    },

    // ===== Clear All Data =====
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('fitcalo_')) {
                localStorage.removeItem(key);
            }
        });
    }
};
