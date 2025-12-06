// Onboarding Module - Enterprise Edition v5
// Premium onboarding with better visuals and animations

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
        <div id="onboarding-screen" class="screen" style="padding: 24px; justify-content: center; position: relative; overflow: hidden;">
            
            <!-- Background Decoration -->
            <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: radial-gradient(circle, var(--primary-soft) 0%, transparent 70%); pointer-events: none;"></div>
            <div style="position: absolute; bottom: -100px; left: -100px; width: 250px; height: 250px; background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%); pointer-events: none;"></div>
            
            <!-- Step 1: Welcome -->
            <div id="step-1" class="onboarding-step" style="text-align: center; position: relative; z-index: 1;">
                <div style="margin-bottom: 32px;">
                    <div style="
                        width: 120px; 
                        height: 120px; 
                        background: var(--primary-gradient); 
                        border-radius: 32px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        margin: 0 auto 24px;
                        box-shadow: var(--shadow-primary);
                        animation: float 3s ease-in-out infinite;
                    ">
                        <span style="font-size: 3.5rem;">🥗</span>
                    </div>
                    <h1 style="font-size: 2rem; margin-bottom: 12px; color: var(--black);">Welcome to FitCalo</h1>
                    <p style="color: var(--gray-500); font-size: 1rem; line-height: 1.6; max-width: 280px; margin: 0 auto;">
                        Your AI-powered nutrition assistant. Track calories effortlessly with photos & chat.
                    </p>
                </div>
                
                <!-- Features Preview -->
                <div style="display: flex; justify-content: center; gap: 16px; margin-bottom: 40px;">
                    <div style="text-align: center;">
                        <div style="width: 52px; height: 52px; background: var(--success-soft); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 1.5rem;">📸</div>
                        <p class="text-xs text-muted">Photo AI</p>
                    </div>
                    <div style="text-align: center;">
                        <div style="width: 52px; height: 52px; background: var(--info-soft); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 1.5rem;">📊</div>
                        <p class="text-xs text-muted">Track Macros</p>
                    </div>
                    <div style="text-align: center;">
                        <div style="width: 52px; height: 52px; background: var(--warning-soft); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-size: 1.5rem;">🎯</div>
                        <p class="text-xs text-muted">Set Goals</p>
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="Onboarding.next(2)" style="max-width: 320px; margin: 0 auto;">
                    Get Started
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
                
                <p style="margin-top: 16px; font-size: 0.75rem; color: var(--gray-400);">Free · No account required</p>
            </div>

            <!-- Step 2: Goal -->
            <div id="step-2" class="onboarding-step hidden" style="position: relative; z-index: 1;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <h2 style="margin-bottom: 8px; color: var(--black);">What's your goal?</h2>
                    <p class="text-muted">We'll personalize your calorie targets.</p>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px;">
                    <div class="card goal-card" onclick="Onboarding.selectGoal('lose', this)" style="cursor: pointer; margin: 0; display: flex; align-items: center; gap: 16px; padding: 20px; transition: all 0.2s ease;">
                        <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #FEE2E2, #FECACA); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.75rem;">📉</div>
                        <div style="flex: 1;">
                            <p style="font-weight: 700; color: var(--black); margin-bottom: 2px;">Lose Weight</p>
                            <p class="text-sm text-muted">Calorie deficit to burn fat</p>
                        </div>
                        <div class="goal-check" style="width: 24px; height: 24px; border: 2px solid var(--gray-300); border-radius: 50%; transition: all 0.2s ease;"></div>
                    </div>
                    
                    <div class="card goal-card" onclick="Onboarding.selectGoal('maintain', this)" style="cursor: pointer; margin: 0; display: flex; align-items: center; gap: 16px; padding: 20px; transition: all 0.2s ease;">
                        <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #DBEAFE, #BFDBFE); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.75rem;">⚖️</div>
                        <div style="flex: 1;">
                            <p style="font-weight: 700; color: var(--black); margin-bottom: 2px;">Maintain Weight</p>
                            <p class="text-sm text-muted">Balanced calorie intake</p>
                        </div>
                        <div class="goal-check" style="width: 24px; height: 24px; border: 2px solid var(--gray-300); border-radius: 50%; transition: all 0.2s ease;"></div>
                    </div>
                    
                    <div class="card goal-card" onclick="Onboarding.selectGoal('gain', this)" style="cursor: pointer; margin: 0; display: flex; align-items: center; gap: 16px; padding: 20px; transition: all 0.2s ease;">
                        <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #D1FAE5, #A7F3D0); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.75rem;">💪</div>
                        <div style="flex: 1;">
                            <p style="font-weight: 700; color: var(--black); margin-bottom: 2px;">Build Muscle</p>
                            <p class="text-sm text-muted">Calorie surplus for gains</p>
                        </div>
                        <div class="goal-check" style="width: 24px; height: 24px; border: 2px solid var(--gray-300); border-radius: 50%; transition: all 0.2s ease;"></div>
                    </div>
                </div>
                
                <button id="btn-step-2" class="btn btn-primary" disabled onclick="Onboarding.next(3)">
                    Continue
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
            </div>

            <!-- Step 3: Profile -->
            <div id="step-3" class="onboarding-step hidden" style="position: relative; z-index: 1;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="margin-bottom: 8px; color: var(--black);">About You</h2>
                    <p class="text-muted">Help us calculate your daily needs.</p>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Your Name</label>
                        <input type="text" id="user-name" placeholder="Enter your name" oninput="Onboarding.validateStep3()">
                    </div>
                    <div class="form-row">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Age</label>
                            <input type="number" id="user-age" placeholder="25" oninput="Onboarding.validateStep3()">
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Gender</label>
                            <select id="user-gender" onchange="Onboarding.validateStep3()">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Weight (kg)</label>
                            <input type="number" id="user-weight" placeholder="70" oninput="Onboarding.validateStep3()">
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Height (cm)</label>
                            <input type="number" id="user-height" placeholder="170" oninput="Onboarding.validateStep3()">
                        </div>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
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
                
                <button id="btn-step-3" class="btn btn-primary" disabled onclick="Onboarding.next(4)">
                    Continue
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
            </div>

            <!-- Step 4: API Key -->
            <div id="step-4" class="onboarding-step hidden" style="position: relative; z-index: 1;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h2 style="margin-bottom: 8px; color: var(--black);">AI Setup</h2>
                    <p class="text-muted">Connect to Google's Gemini AI.</p>
                </div>
                
                <!-- Quick Start Option -->
                <div class="card" style="background: linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%); border: 2px solid var(--success); margin-bottom: 16px; padding: 20px;">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                        <div style="width: 48px; height: 48px; background: var(--success); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        </div>
                        <div>
                            <p style="font-weight: 700; color: #166534;">Quick Start</p>
                            <p style="font-size: 0.75rem; color: #15803D;">Use shared key · Limited daily usage</p>
                        </div>
                    </div>
                    <button onclick="Onboarding.useDefaultKey()" class="btn" style="background: var(--success); color: white; box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        Start Now (Recommended)
                    </button>
                </div>

                <!-- Divider -->
                <div class="divider-text" style="margin: 24px 0;">or get your own unlimited key</div>

                <!-- Custom API Key -->
                <div class="card" style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border: none; margin-bottom: 20px;">
                    <h4 style="color: #1E40AF; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>
                        Get Your Free API Key
                    </h4>
                    
                    <div style="background: white; border-radius: var(--radius-sm); padding: 14px; margin-bottom: 14px;">
                        <p style="font-weight: 600; margin-bottom: 10px; font-size: 0.875rem; color: var(--black);">Open in browser:</p>
                        <div style="display: flex; gap: 8px;">
                            <button onclick="Onboarding.openLink()" class="btn btn-secondary" style="flex: 1; padding: 10px; font-size: 0.875rem;">
                                🌐 Open Link
                            </button>
                            <button onclick="Onboarding.copyLink()" class="btn btn-secondary" style="flex: 1; padding: 10px; font-size: 0.875rem;">
                                📋 Copy Link
                            </button>
                        </div>
                        <input type="text" id="api-link" value="${apiLink}" readonly 
                            style="font-size: 10px; padding: 8px; background: var(--gray-100); margin-top: 10px; text-align: center;">
                    </div>
                    
                    <div style="font-size: 0.8125rem; color: #1E40AF; display: flex; flex-direction: column; gap: 6px;">
                        <p>1. Sign in with Google</p>
                        <p>2. Click "Create API Key"</p>
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
                    <label>Your API Key <span style="font-weight: 400; color: var(--gray-400);">(optional)</span></label>
                    <div class="api-input-wrapper">
                        <input type="password" id="api-key" placeholder="AIza..." oninput="Onboarding.validateStep4()">
                        <button type="button" class="btn-icon btn-icon-sm" onclick="Onboarding.toggleApiKey()" style="flex-shrink: 0;">👁️</button>
                    </div>
                </div>

                <button id="btn-step-4" class="btn btn-primary" disabled onclick="Onboarding.complete()" style="background: #2563EB;">
                    Use My Key & Start
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                </button>
            </div>
        </div>`;
    },

    useDefaultKey() {
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
        UI.showToast('Opening in browser...', 'info');
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
        // Animate current step out
        document.querySelectorAll('.onboarding-step').forEach(el => {
            if (!el.classList.contains('hidden')) {
                el.style.animation = 'fadeIn 0.3s reverse';
            }
        });

        setTimeout(() => {
            document.querySelectorAll('.onboarding-step').forEach(el => {
                el.classList.add('hidden');
            });

            const nextStep = document.getElementById(`step-${step}`);
            if (nextStep) {
                nextStep.classList.remove('hidden');
                nextStep.style.animation = 'scaleIn 0.4s ease';
                this.currentStep = step;
            }
        }, 250);
    },

    selectGoal(goal, element) {
        this.userData.goal = goal;

        document.querySelectorAll('.goal-card').forEach(card => {
            card.style.border = '1px solid var(--gray-200)';
            card.style.background = 'var(--white)';
            const check = card.querySelector('.goal-check');
            if (check) {
                check.style.background = 'transparent';
                check.style.borderColor = 'var(--gray-300)';
                check.innerHTML = '';
            }
        });

        element.style.border = '2px solid var(--primary)';
        element.style.background = 'var(--primary-soft)';
        const check = element.querySelector('.goal-check');
        if (check) {
            check.style.background = 'var(--primary)';
            check.style.borderColor = 'var(--primary)';
            check.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" style="margin: 3px;"><polyline points="20 6 9 17 4 12"/></svg>';
        }

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
