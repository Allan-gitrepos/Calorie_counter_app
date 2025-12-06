// Chat Module - Enterprise Edition v5
// Enhanced with premium styling, favorites, and better UX

const Chat = {
    messages: [],
    pendingImage: null,
    currentMeal: null,

    render() {
        return `
        <div id="chat-screen" style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1000;
            background: var(--surface);
            display: flex;
            flex-direction: column;
            animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        ">
            <!-- Header -->
            <header style="
                padding: 16px 20px;
                padding-top: calc(16px + env(safe-area-inset-top, 24px));
                background: var(--white);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--gray-200);
                flex-shrink: 0;
                min-height: 70px;
            ">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button onclick="Chat.close()" class="btn-icon btn-icon-sm">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 40px; height: 40px; background: var(--primary-gradient); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center;">
                            <span style="font-size: 1.25rem;">🤖</span>
                        </div>
                        <div>
                            <p style="font-weight: 700; font-size: 1rem; color: var(--black);">FitCalo AI</p>
                            <div style="display: flex; align-items: center; gap: 6px;">
                                <span style="width: 8px; height: 8px; background: var(--success); border-radius: 50%;"></span>
                                <span style="font-size: 0.75rem; color: var(--gray-500);">Online</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button onclick="Chat.clearMessages()" class="btn-icon btn-icon-sm" style="color: var(--gray-500);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
            </header>

            <!-- Messages Area -->
            <main id="chat-messages" style="
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                -webkit-overflow-scrolling: touch;
                background: var(--surface);
            ">
                <div class="chat-bubble ai">
                    <p style="font-weight: 600; margin-bottom: 8px; color: var(--black);">Hey there! 👋</p>
                    <p class="text-sm" style="color: var(--gray-600); line-height: 1.6;">
                        I'm your AI nutrition assistant. You can:
                    </p>
                    <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: var(--gray-100); border-radius: var(--radius-sm);">
                            <span>📸</span>
                            <span class="text-sm" style="color: var(--gray-700);">Take a photo of your food</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: var(--gray-100); border-radius: var(--radius-sm);">
                            <span>✍️</span>
                            <span class="text-sm" style="color: var(--gray-700);">Describe what you ate</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px; padding: 10px 12px; background: var(--gray-100); border-radius: var(--radius-sm);">
                            <span>🏃</span>
                            <span class="text-sm" style="color: var(--gray-700);">Log your workouts</span>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Quick Suggestions -->
            <div id="quick-suggestions" style="
                padding: 0 16px 8px;
                display: flex;
                gap: 8px;
                overflow-x: auto;
                -webkit-overflow-scrolling: touch;
                background: var(--surface);
            ">
                ${this.renderQuickSuggestions()}
            </div>

            <!-- Input Area -->
            <div style="
                padding: 12px 16px;
                padding-bottom: max(16px, env(safe-area-inset-bottom));
                background: var(--white);
                border-top: 1px solid var(--gray-200);
                flex-shrink: 0;
            ">
                <!-- Image Preview -->
                <div id="image-preview" style="display: none; margin-bottom: 12px; padding: 10px; background: var(--gray-100); border-radius: var(--radius-md);">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img id="preview-image" style="height: 56px; width: 56px; border-radius: var(--radius-sm); object-fit: cover;">
                        <div style="flex: 1;">
                            <p class="text-sm" style="font-weight: 500; color: var(--black);">Image attached</p>
                            <p class="text-xs text-muted">Ready to analyze</p>
                        </div>
                        <button onclick="Chat.removeImage()" class="btn-icon btn-icon-sm" style="background: var(--error-soft); color: var(--error);">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 10px;">
                    <!-- Camera Button -->
                    <button onclick="Chat.openCamera()" class="btn-icon" style="background: var(--gray-100);">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gray-600)" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    </button>
                    
                    <!-- Gallery Button -->
                    <button onclick="Chat.openGallery()" class="btn-icon" style="background: var(--gray-100);">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gray-600)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </button>
                    
                    <!-- Text Input Container -->
                    <div style="
                        flex: 1; 
                        background: var(--gray-100); 
                        border-radius: var(--radius-full); 
                        display: flex; 
                        align-items: center; 
                        padding: 4px 4px 4px 18px;
                        min-width: 0;
                        transition: all 0.2s ease;
                    ">
                        <input type="text" id="chat-input" placeholder="Type a message..." 
                            style="
                                flex: 1; 
                                border: none; 
                                background: transparent; 
                                padding: 10px 8px 10px 0; 
                                outline: none; 
                                font-size: 16px; 
                                min-width: 0;
                                color: var(--black);
                            "
                            onkeydown="Chat.handleKeydown(event)"
                            autocomplete="off"
                            autocorrect="on"
                            autocapitalize="sentences">
                        
                        <!-- Send Button -->
                        <button onclick="Chat.send()" style="
                            background: var(--primary-gradient); 
                            color: white; 
                            border: none; 
                            width: 40px; 
                            height: 40px; 
                            border-radius: 50%; 
                            cursor: pointer; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            flex-shrink: 0;
                            box-shadow: var(--shadow-primary);
                            transition: all 0.2s ease;
                        ">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    },

    renderQuickSuggestions() {
        const suggestions = [
            { text: 'I had breakfast', icon: '🍳' },
            { text: 'I went for a run', icon: '🏃' },
            { text: 'I ate a snack', icon: '🍎' },
            { text: 'I had lunch', icon: '🥗' }
        ];

        return suggestions.map(s => `
            <button onclick="Chat.useSuggestion('${s.text}')" style="
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 14px;
                background: var(--white);
                border: 1px solid var(--gray-200);
                border-radius: var(--radius-full);
                font-size: 0.8125rem;
                font-weight: 500;
                color: var(--gray-700);
                white-space: nowrap;
                cursor: pointer;
                transition: all 0.2s ease;
            ">
                <span>${s.icon}</span>
                ${s.text}
            </button>
        `).join('');
    },

    useSuggestion(text) {
        const input = document.getElementById('chat-input');
        if (input) {
            input.value = text + ': ';
            input.focus();
        }
    },

    open() {
        const existing = document.getElementById('chat-screen');
        if (existing) existing.remove();

        this.createFileInputs();
        document.body.insertAdjacentHTML('beforeend', this.render());
        history.pushState({ screen: 'chat' }, '');

        setTimeout(() => {
            const input = document.getElementById('chat-input');
            if (input) input.focus();
        }, 350);
    },

    createFileInputs() {
        this.removeFileInputs();
    },

    removeFileInputs() {
        const inputs = document.querySelectorAll('.temp-file-input');
        inputs.forEach(input => input.remove());
    },

    close() {
        this.removeFileInputs();

        const screen = document.getElementById('chat-screen');
        if (screen) {
            screen.style.animation = 'slideUp 0.25s reverse ease-in';
            setTimeout(() => {
                screen.remove();
                Dashboard.currentTab = 'home';
                Dashboard.update();
            }, 220);
        }
    },

    openCamera() {
        this.removeFileInputs();

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment';
        input.className = 'temp-file-input';
        input.style.cssText = 'position: fixed; top: -1000px; left: -1000px;';

        input.addEventListener('change', (e) => {
            this.handleImageSelect(e);
            setTimeout(() => input.remove(), 100);
        });

        document.body.appendChild(input);
        setTimeout(() => input.click(), 50);
    },

    openGallery() {
        this.removeFileInputs();

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.className = 'temp-file-input';
        input.style.cssText = 'position: fixed; top: -1000px; left: -1000px;';

        input.addEventListener('change', (e) => {
            this.handleImageSelect(e);
            setTimeout(() => input.remove(), 100);
        });

        document.body.appendChild(input);
        setTimeout(() => input.click(), 50);
    },

    handleImageSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        event.target.value = '';

        this.compressImage(file, (compressedDataUrl) => {
            this.pendingImage = compressedDataUrl;
            const previewImg = document.getElementById('preview-image');
            const previewDiv = document.getElementById('image-preview');
            if (previewImg && previewDiv) {
                previewImg.src = compressedDataUrl;
                previewDiv.style.display = 'block';
            }
        });
    },

    compressImage(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const maxWidth = 1024;
                const maxHeight = 1024;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                callback(compressedDataUrl);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },

    removeImage() {
        this.pendingImage = null;
        const previewDiv = document.getElementById('image-preview');
        if (previewDiv) previewDiv.style.display = 'none';
    },

    handleKeydown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.send();
        }
    },

    addMessage(content, isUser = false, imageUrl = null) {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        const div = document.createElement('div');
        div.className = `chat-bubble ${isUser ? 'user' : 'ai'}`;

        let html = '';
        if (imageUrl) {
            html += `<img src="${imageUrl}" style="max-width: 100%; border-radius: var(--radius-sm); margin-bottom: 8px;">`;
        }
        html += content;

        div.innerHTML = html;
        container.appendChild(div);

        // Hide quick suggestions after first message
        const suggestions = document.getElementById('quick-suggestions');
        if (suggestions) suggestions.style.display = 'none';

        setTimeout(() => {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        }, 100);
    },

    showTyping() {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        const div = document.createElement('div');
        div.id = 'typing-indicator';
        div.className = 'chat-bubble ai';
        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="display: flex; gap: 4px;">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
                <span class="text-xs text-muted">Analyzing...</span>
            </div>
            <style>
                .typing-dot {
                    width: 6px; height: 6px; 
                    background: var(--gray-400); 
                    border-radius: 50%; 
                    animation: typingBounce 1.4s infinite ease-in-out;
                }
                .typing-dot:nth-child(1) { animation-delay: 0s; }
                .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                @keyframes typingBounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                    40% { transform: translateY(-4px); opacity: 1; }
                }
            </style>
        `;
        container.appendChild(div);
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    },

    hideTyping() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    },

    async send() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        const image = this.pendingImage;

        if (!message && !image) return;

        this.addMessage(message || 'Analyzing image...', true, image);
        input.value = '';
        this.removeImage();
        this.showTyping();

        try {
            const response = await Gemini.sendMessage(message, image);
            this.hideTyping();

            if (response.text) {
                this.addMessage(response.text);
            }

            if (response.meal) {
                this.addMealCard(response.meal);
            }

            if (response.activity) {
                this.addActivityCard(response.activity);
            }
        } catch (error) {
            this.hideTyping();
            this.addMessage(`<span style="color: var(--error);">Error: ${error.message}</span>`);
        }
    },

    addMealCard(meal) {
        if (!meal || !meal.items) return;

        const container = document.getElementById('chat-messages');
        if (!container) return;

        const id = 'meal-' + Date.now();
        this.currentMeal = { id, ...meal };

        const totalCal = meal.items.reduce((sum, i) => sum + (i.calories || 0), 0);
        const totalCarbs = meal.items.reduce((sum, i) => sum + (i.carbs || 0), 0);
        const totalProtein = meal.items.reduce((sum, i) => sum + (i.protein || 0), 0);
        const totalFat = meal.items.reduce((sum, i) => sum + (i.fat || 0), 0);

        const itemsHtml = meal.items.map(item => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--gray-100); border-radius: var(--radius-sm); margin-bottom: 8px;">
                <div style="flex: 1; min-width: 0;">
                    <p style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--black);">${item.name}</p>
                    <p style="font-size: 0.75rem; color: var(--gray-500);">C: ${item.carbs || 0}g · P: ${item.protein || 0}g · F: ${item.fat || 0}g</p>
                </div>
                <p style="font-weight: 700; margin-left: 12px; white-space: nowrap; color: var(--black);">${item.calories} cal</p>
            </div>
        `).join('');

        const div = document.createElement('div');
        div.style = 'align-self: stretch; width: 100%;';
        div.innerHTML = `
            <div class="card" id="${id}" style="border: 2px solid var(--primary); margin: 0; background: var(--white);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 48px; height: 48px; background: var(--primary-soft); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🍱</div>
                    <div style="flex: 1;">
                        <p style="font-weight: 700; color: var(--black);">${meal.name || 'Your Meal'}</p>
                        <p style="font-size: 0.75rem; color: var(--gray-500);">${meal.items.length} item${meal.items.length > 1 ? 's' : ''} · ${totalCal} kcal</p>
                    </div>
                </div>
                
                ${itemsHtml}
                
                <!-- Macro Summary -->
                <div style="display: flex; justify-content: space-around; padding: 12px; background: var(--gray-100); border-radius: var(--radius-sm); margin: 12px 0;">
                    <div style="text-align: center;">
                        <p style="font-weight: 700; color: var(--carbs-color);">${totalCarbs}g</p>
                        <p class="text-xs text-muted">Carbs</p>
                    </div>
                    <div style="text-align: center;">
                        <p style="font-weight: 700; color: var(--protein-color);">${totalProtein}g</p>
                        <p class="text-xs text-muted">Protein</p>
                    </div>
                    <div style="text-align: center;">
                        <p style="font-weight: 700; color: var(--fat-color);">${totalFat}g</p>
                        <p class="text-xs text-muted">Fat</p>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 16px;">
                    <button class="btn btn-secondary" onclick="document.getElementById('${id}').parentElement.remove()" style="flex: 1; padding: 12px;">
                        Discard
                    </button>
                    <button class="btn btn-primary" onclick="Chat.logMeal('${id}')" style="flex: 1; padding: 12px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                        Log Meal
                    </button>
                </div>
            </div>
        `;

        container.appendChild(div);
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    },

    addActivityCard(activity) {
        if (!activity) return;

        const container = document.getElementById('chat-messages');
        if (!container) return;

        const id = 'activity-' + Date.now();

        const div = document.createElement('div');
        div.style = 'align-self: stretch; width: 100%;';
        div.innerHTML = `
            <div class="card" id="${id}" style="border: 2px solid var(--success); margin: 0; background: var(--white);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 48px; height: 48px; background: var(--success-soft); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">🔥</div>
                    <div style="flex: 1;">
                        <p style="font-weight: 700; color: var(--black);">${activity.name}</p>
                        <p style="font-size: 0.75rem; color: var(--gray-500);">${activity.duration || 'Activity'}</p>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-weight: 800; font-size: 1.25rem; color: var(--success);">-${activity.calories}</p>
                        <p class="text-xs text-muted">calories</p>
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-secondary" onclick="document.getElementById('${id}').parentElement.remove()" style="flex: 1; padding: 12px;">
                        Discard
                    </button>
                    <button class="btn btn-success" onclick="Chat.logActivity('${id}', '${activity.name}', ${activity.calories}, '${activity.duration || ''}')" style="flex: 1; padding: 12px;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                        Log Activity
                    </button>
                </div>
            </div>
        `;

        container.appendChild(div);
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    },

    logMeal(id) {
        if (!this.currentMeal) return;

        this.currentMeal.items.forEach(item => {
            Dashboard.addMeal({
                type: 'food',
                name: item.name,
                calories: item.calories || 0,
                carbs: item.carbs || 0,
                protein: item.protein || 0,
                fat: item.fat || 0
            });
        });

        const card = document.getElementById(id);
        if (card) {
            card.innerHTML = `
                <div style="text-align: center; padding: 32px;">
                    <div style="width: 56px; height: 56px; background: var(--success-soft); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <p style="font-weight: 700; color: var(--success);">Meal Logged Successfully!</p>
                </div>
            `;
        }

        UI.showToast('Meal logged! 🎉', 'success');
        this.currentMeal = null;
    },

    logActivity(id, name, calories, duration) {
        Dashboard.addMeal({
            type: 'activity',
            name: name,
            calories: calories,
            duration: duration
        });

        const card = document.getElementById(id);
        if (card) {
            card.innerHTML = `
                <div style="text-align: center; padding: 32px;">
                    <div style="width: 56px; height: 56px; background: var(--success-soft); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <p style="font-weight: 700; color: var(--success);">Activity Logged!</p>
                </div>
            `;
        }

        UI.showToast('Activity logged! 💪', 'success');
    },

    clearMessages() {
        const container = document.getElementById('chat-messages');
        if (container) {
            container.innerHTML = `
                <div class="chat-bubble ai">
                    <p style="font-weight: 600; margin-bottom: 4px; color: var(--black);">Chat cleared! ✨</p>
                    <p class="text-sm" style="color: var(--gray-600);">What would you like to log?</p>
                </div>
            `;
        }
        // Show suggestions again
        const suggestions = document.getElementById('quick-suggestions');
        if (suggestions) suggestions.style.display = 'flex';
    }
};
