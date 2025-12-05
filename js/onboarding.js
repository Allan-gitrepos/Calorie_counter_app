// Onboarding Module - With copy-paste link for API key
const Onboarding = {
    currentStep: 1,
    userData: {},

    init() {
        UI.hideLoading();
        document.getElementById('app').innerHTML = this.render();
    },

    render() {
        const apiLink = 'https://aistudio.google.com/app/apikey';

        return `
        <div id="onboarding-screen" class="screen" style="padding: 24px; justify-content: center;">
            
            <!-- Step 1: Welcome -->
            <div id="step-1" class="onboarding-step" style="text-align: center;">
                <div style="font-size: 5rem; margin-bottom: 24px; animation: float 3s ease-in-out infinite;">🥗</div>
                <h1 style="margin-bottom: 16px; font-size: 2rem;">Welcome to FitCalo</h1>
                <p class="text-muted" style="margin-bottom: 48px; font-size: 1.1rem;">
                    Your AI-powered nutritionist.<br>
                    Track calories effortlessly.
                </p>
                <button class="btn btn-primary" onclick="Onboarding.next(2)">
                    Get Started →
                </button>
            </div>

            <!-- Step 2: Goal -->
            <div id="step-2" class="onboarding-step hidden">
                <h2 style="margin-bottom: 8px;">What's your goal?</h2>
                <p class="text-muted" style="margin-bottom: 32px;">We'll personalize your experience.</p>
                
                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px;">
                    <div class="card goal-card" onclick="Onboarding.selectGoal('lose', this)" style="cursor: pointer; margin: 0; display: flex; align-items: center; gap: 16px;">
                        <span style="font-size: 2rem;">📉</span>
                        <div>
                            <div style="font-weight: 600;">Lose Weight</div>
                            <div class="text-xs text-muted">Calorie deficit mode</div>
                        </div>
                    </div>
                    <div class="card goal-card" onclick="Onboarding.selectGoal('maintain', this)" style="cursor: pointer; margin: 0; display: flex; align-items: center; gap: 16px;">
                        <span style="font-size: 2rem;">⚖️</span>
                        <div>
                            <div style="font-weight: 600;">Maintain Weight</div>
                            <div class="text-xs text-muted">Balanced intake</div>
                        </div>
                    </div>
                    <div class="card goal-card" onclick="Onboarding.selectGoal('gain', this)" style="cursor: pointer; margin: 0; display: flex; align-items: center; gap: 16px;">
                        <span style="font-size: 2rem;">💪</span>
                        <div>
                            <div style="font-weight: 600;">Build Muscle</div>
                            <div class="text-xs text-muted">Calorie surplus mode</div>
                        </div>
                    </div>
                </div>
                <button id="btn-step-2" class="btn btn-primary" disabled onclick="Onboarding.next(3)">Continue</button>
            </div>

            <!-- Step 3: Profile -->
            <div id="step-3" class="onboarding-step hidden">
                <h2 style="margin-bottom: 24px;">About You</h2>
                <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
                    <div class="form-group">
                        <label>Your Name</label>
                        <input type="text" id="user-name" placeholder="Enter your name" oninput="Onboarding.validateStep3()">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Age</label>
                            <input type="number" id="user-age" placeholder="25" oninput="Onboarding.validateStep3()">
                        </div>
                        <div class="form-group">
                            <label>Gender</label>
                            <select id="user-gender" onchange="Onboarding.validateStep3()">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Weight (kg)</label>
                            <input type="number" id="user-weight" placeholder="70" oninput="Onboarding.validateStep3()">
                        </div>
                        <div class="form-group">
                            <label>Height (cm)</label>
                            <input type="number" id="user-height" placeholder="170" oninput="Onboarding.validateStep3()">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Activity Level</label>
                        <select id="user-activity">
                            <option value="sedentary">Sedentary (Office job)</option>
                            <option value="light">Light (1-3 days/week)</option>
                            <option value="moderate" selected>Moderate (3-5 days/week)</option>
                            <option value="active">Active (6-7 days/week)</option>
                            <option value="very_active">Very Active (Athlete)</option>
                        </select>
                    </div>
                </div>
                <button id="btn-step-3" class="btn btn-primary" disabled onclick="Onboarding.next(4)">Continue</button>
            </div>

            <!-- Step 4: API Key -->
            <div id="step-4" class="onboarding-step hidden">
                <h2 style="margin-bottom: 8px;">Connect AI</h2>
                <p class="text-muted" style="margin-bottom: 24px;">Get your free Gemini API key.</p>
                
                <!-- Step-by-step guide with copy link -->
                <div class="card" style="background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border: none; margin-bottom: 20px;">
                    <h4 style="color: #1565C0; margin-bottom: 16px;">📋 How to Get Your API Key</h4>
                    
                    <div style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 16px;">
                        <p style="font-weight: 600; margin-bottom: 8px;">1. Copy this link:</p>
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <input type="text" id="api-link" value="${apiLink}" readonly 
                                style="font-size: 12px; padding: 10px; background: #F5F5F7; flex: 1;">
                            <button onclick="Onboarding.copyLink()" class="btn btn-primary" 
                                style="padding: 10px 16px; white-space: nowrap; width: auto;">
                                📋 Copy
                            </button>
                        </div>
                        <p style="font-size: 0.75rem; color: #6A6A6A; margin-top: 8px;">
                            Paste in your browser (Chrome) where you're logged into Google
                        </p>
                    </div>
                    
                    <div style="font-size: 0.9rem; color: #1565C0;">
                        <p style="margin-bottom: 6px;"><strong>2.</strong> Sign in with Google</p>
                        <p style="margin-bottom: 6px;"><strong>3.</strong> Click "Create API Key"</p>
                        <p><strong>4.</strong> Copy and paste the key below</p>
                    </div>
                </div>

                <div class="form-group">
                    <label>AI Model</label>
                    <select id="api-model">
                        <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fast & Free)</option>
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Smarter)</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Paste Your API Key</label>
                    <div class="api-input-wrapper">
                        <input type="password" id="api-key" placeholder="AIza..." oninput="Onboarding.validateStep4()">
                        <button type="button" class="btn-icon" onclick="Onboarding.toggleApiKey()" style="flex-shrink: 0;">👁️</button>
                    </div>
                </div>

                <button id="btn-step-4" class="btn btn-primary" disabled onclick="Onboarding.complete()">
                    Start Tracking 🚀
                </button>
            </div>
        </div>`;
    },

    copyLink() {
        const input = document.getElementById('api-link');
        input.select();
        input.setSelectionRange(0, 99999);

        try {
            document.execCommand('copy');
            UI.showToast('Link copied! Paste in your browser', 'success');
        } catch (err) {
            // Fallback
            navigator.clipboard.writeText(input.value).then(() => {
                UI.showToast('Link copied!', 'success');
            }).catch(() => {
                UI.showToast('Please copy the link manually', 'error');
            });
        }
    },

    next(step) {
        document.querySelectorAll('.onboarding-step').forEach(el => {
            el.classList.add('hidden');
        });

        const nextStep = document.getElementById(`step-${step}`);
        if (nextStep) {
            nextStep.classList.remove('hidden');
            nextStep.style.animation = 'fadeIn 0.5s ease';
            this.currentStep = step;
        }
    },

    selectGoal(goal, element) {
        this.userData.goal = goal;

        document.querySelectorAll('.goal-card').forEach(card => {
            card.style.border = '1px solid rgba(0,0,0,0.04)';
            card.style.background = 'white';
        });
        element.style.border = '2px solid #FF5A00';
        element.style.background = 'rgba(255, 90, 0, 0.1)';

        document.getElementById('btn-step-2').disabled = false;
    },

    validateStep3() {
        const name = document.getElementById('user-name').value.trim();
        const weight = document.getElementById('user-weight').value;
        const height = document.getElementById('user-height').value;

        const isValid = name && weight && height;
        document.getElementById('btn-step-3').disabled = !isValid;

        if (isValid) {
            this.userData.name = name;
            this.userData.weight = parseFloat(weight);
            this.userData.height = parseFloat(height);
            this.userData.age = parseInt(document.getElementById('user-age').value) || 25;
            this.userData.gender = document.getElementById('user-gender').value;
            this.userData.activityLevel = document.getElementById('user-activity').value;
        }
    },

    validateStep4() {
        const key = document.getElementById('api-key').value.trim();
        document.getElementById('btn-step-4').disabled = !key;
    },

    toggleApiKey() {
        const input = document.getElementById('api-key');
        input.type = input.type === 'password' ? 'text' : 'password';
    },

    complete() {
        const apiKey = document.getElementById('api-key').value.trim();
        const model = document.getElementById('api-model').value;

        if (!apiKey) return;

        this.userData.dailyCalories = Storage.calculateTDEE(this.userData);

        Storage.saveUser(this.userData);
        Storage.saveApiKey(apiKey);
        Storage.saveModel(model);
        Storage.setOnboarded(true);

        UI.showToast('Welcome to FitCalo! 🎉', 'success');

        setTimeout(() => {
            App.showDashboard();
        }, 500);
    }
};
