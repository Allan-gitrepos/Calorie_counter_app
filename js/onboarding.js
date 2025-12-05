// Onboarding Module - With default API key and multiple options
const Onboarding = {
    currentStep: 1,
    userData: {},
    defaultApiKey: 'AIzaSyDoO9mAClXQGcWy8GMgqKTprlSthf5pwVI',

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
                <h2 style="margin-bottom: 8px;">AI Setup</h2>
                <p class="text-muted" style="margin-bottom: 20px;">Choose how to connect to AI.</p>
                
                <!-- Default API Key Option -->
                <div class="card" style="background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%); border: 2px solid #4CAF50; margin-bottom: 16px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        <span style="font-size: 1.5rem;">⚡</span>
                        <div>
                            <h4 style="color: #2E7D32; margin: 0;">Quick Start (Recommended)</h4>
                            <p style="font-size: 0.75rem; color: #558B2F; margin: 0;">Use default key - limited daily usage</p>
                        </div>
                    </div>
                    <button onclick="Onboarding.useDefaultKey()" class="btn btn-primary" style="background: #4CAF50; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);">
                        ✓ Use Default Key (Start Now)
                    </button>
                </div>

                <!-- Divider -->
                <div style="text-align: center; margin: 20px 0; color: #9A9A9A; font-size: 0.875rem;">
                    — OR get your own unlimited key —
                </div>

                <!-- Custom API Key Guide -->
                <div class="card" style="background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border: none; margin-bottom: 20px;">
                    <h4 style="color: #1565C0; margin-bottom: 16px;">🔑 Get Your Own Free API Key</h4>
                    
                    <div style="background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
                        <p style="font-weight: 600; margin-bottom: 12px;">Open in browser:</p>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <button onclick="Onboarding.openLink()" class="btn btn-secondary" 
                                style="flex: 1; min-width: 120px; padding: 10px;">
                                🌐 Open Link
                            </button>
                            <button onclick="Onboarding.copyLink()" class="btn btn-secondary" 
                                style="flex: 1; min-width: 120px; padding: 10px;">
                                📋 Copy Link
                            </button>
                        </div>
                        <input type="text" id="api-link" value="${apiLink}" readonly 
                            style="font-size: 11px; padding: 8px; background: #F5F5F7; margin-top: 10px; text-align: center;">
                    </div>
                    
                    <div style="font-size: 0.85rem; color: #1565C0;">
                        <p style="margin-bottom: 4px;">1. Sign in with Google</p>
                        <p style="margin-bottom: 4px;">2. Click "Create API Key"</p>
                        <p>3. Paste your key below</p>
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
                    <label>Your API Key <span style="font-weight: 400; color: #9A9A9A;">(or use default above)</span></label>
                    <div class="api-input-wrapper">
                        <input type="password" id="api-key" placeholder="AIza..." oninput="Onboarding.validateStep4()">
                        <button type="button" class="btn-icon" onclick="Onboarding.toggleApiKey()" style="flex-shrink: 0;">👁️</button>
                    </div>
                </div>

                <button id="btn-step-4" class="btn btn-primary" disabled onclick="Onboarding.complete()" style="background: #1976D2;">
                    Use My Key & Start 🚀
                </button>
            </div>
        </div>`;
    },

    useDefaultKey() {
        // Use the default API key
        this.userData.dailyCalories = Storage.calculateTDEE(this.userData);

        Storage.saveUser(this.userData);
        Storage.saveApiKey(this.defaultApiKey);
        Storage.saveModel('gemini-2.0-flash');
        Storage.setOnboarded(true);

        UI.showToast('Quick start enabled! 🎉', 'success');

        setTimeout(() => {
            App.showDashboard();
        }, 500);
    },

    openLink() {
        const url = 'https://aistudio.google.com/app/apikey';
        window.open(url, '_blank');
        UI.showToast('Opening in browser...', 'success');
    },

    copyLink() {
        const input = document.getElementById('api-link');
        input.select();
        input.setSelectionRange(0, 99999);

        try {
            document.execCommand('copy');
            UI.showToast('Link copied! Paste in Chrome', 'success');
        } catch (err) {
            navigator.clipboard.writeText(input.value).then(() => {
                UI.showToast('Link copied!', 'success');
            }).catch(() => {
                UI.showToast('Please copy manually', 'error');
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
