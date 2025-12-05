// Storage Module - All local storage operations
const Storage = {
    KEYS: {
        USER: 'fitcalo_user',
        MEALS: 'fitcalo_meals',
        API_KEY: 'fitcalo_api_key',
        MODEL: 'fitcalo_model',
        ONBOARDED: 'fitcalo_onboarded'
    },

    // User Profile
    saveUser(userData) {
        localStorage.setItem(this.KEYS.USER, JSON.stringify(userData));
    },

    getUser() {
        const data = localStorage.getItem(this.KEYS.USER);
        return data ? JSON.parse(data) : null;
    },

    // API Key
    saveApiKey(key) {
        localStorage.setItem(this.KEYS.API_KEY, key);
    },

    getApiKey() {
        return localStorage.getItem(this.KEYS.API_KEY);
    },

    // Model Selection
    saveModel(model) {
        localStorage.setItem(this.KEYS.MODEL, model);
    },

    getModel() {
        return localStorage.getItem(this.KEYS.MODEL) || 'gemini-2.0-flash';
    },

    // Onboarding
    setOnboarded(value = true) {
        localStorage.setItem(this.KEYS.ONBOARDED, value.toString());
    },

    isOnboarded() {
        return localStorage.getItem(this.KEYS.ONBOARDED) === 'true';
    },

    // Meals
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
        return meal;
    },

    deleteMeal(date, mealId) {
        const meals = this.getMeals(date);
        const filtered = meals.filter(m => m.id !== mealId);
        this.saveMeals(date, filtered);
    },

    // Daily Summary
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

    // Calculate TDEE
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

    // Clear all data
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('fitcalo_meals_')) {
                localStorage.removeItem(key);
            }
        });
    }
};
