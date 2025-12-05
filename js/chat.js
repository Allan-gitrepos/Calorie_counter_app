// Chat Module - Mobile Optimized with all bug fixes
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
            background: #F5F5F7;
            display: flex;
            flex-direction: column;
            animation: slideUp 0.3s ease;
        ">
            <!-- Header - with safe area padding for status bar -->
            <header style="
                padding: 16px 20px;
                padding-top: calc(16px + env(safe-area-inset-top, 24px));
                background: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(0,0,0,0.05);
                flex-shrink: 0;
                min-height: 70px;
            ">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <button onclick="Chat.close()" style="
                        width: 40px; height: 40px; 
                        border-radius: 50%; 
                        background: #F5F5F7; 
                        border: none; 
                        font-size: 1.2rem; 
                        cursor: pointer;
                        display: flex; align-items: center; justify-content: center;
                    ">←</button>
                    <div>
                        <p style="font-weight: 700; font-size: 1rem;">FitCalo AI</p>
                        <p style="font-size: 0.75rem; color: #6A6A6A;">Online</p>
                    </div>
                </div>
                <button onclick="Chat.clearMessages()" style="
                    width: 40px; height: 40px; 
                    border-radius: 50%; 
                    background: #F5F5F7; 
                    border: none; 
                    font-size: 1.2rem; 
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                ">🗑️</button>
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
            ">
                <div class="chat-bubble ai">
                    <p><strong>Hi! I'm FitCalo AI 👋</strong></p>
                    <p class="text-sm text-muted" style="margin-top: 8px;">
                        Snap a photo 📸 or tell me what you ate!
                    </p>
                </div>
            </main>

            <!-- Input Area -->
            <div style="
                padding: 12px 16px;
                padding-bottom: max(16px, env(safe-area-inset-bottom));
                background: white;
                border-top: 1px solid rgba(0,0,0,0.08);
                flex-shrink: 0;
            ">
                <!-- Image Preview -->
                <div id="image-preview" style="display: none; margin-bottom: 12px; padding: 8px; background: #F5F5F7; border-radius: 12px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <img id="preview-image" style="height: 60px; border-radius: 8px; object-fit: cover;">
                        <button onclick="Chat.removeImage()" style="background: #FF3D00; color: white; border: none; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 1rem;">×</button>
                    </div>
                </div>
                
                <div style="display: flex; align-items: center; gap: 10px;">
                    <!-- Camera Button -->
                    <button onclick="Chat.openCamera()" style="
                        width: 44px; height: 44px; 
                        border-radius: 50%; 
                        background: #F5F5F7; 
                        border: none; 
                        font-size: 1.3rem; 
                        cursor: pointer;
                        display: flex; align-items: center; justify-content: center;
                        flex-shrink: 0;
                    ">📷</button>
                    
                    <!-- Gallery Button -->
                    <button onclick="Chat.openGallery()" style="
                        width: 44px; height: 44px; 
                        border-radius: 50%; 
                        background: #F5F5F7; 
                        border: none; 
                        font-size: 1.3rem; 
                        cursor: pointer;
                        display: flex; align-items: center; justify-content: center;
                        flex-shrink: 0;
                    ">🖼️</button>
                    
                    <!-- Text Input Container -->
                    <div style="
                        flex: 1; 
                        background: #F5F5F7; 
                        border-radius: 24px; 
                        display: flex; 
                        align-items: center; 
                        padding: 4px 4px 4px 16px;
                        min-width: 0;
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
                                color: #0A0A0A;
                            "
                            onkeydown="Chat.handleKeydown(event)"
                            autocomplete="off"
                            autocorrect="on"
                            autocapitalize="sentences">
                        
                        <!-- Send Button -->
                        <button onclick="Chat.send()" style="
                            background: linear-gradient(135deg, #FF5A00, #FF8A50); 
                            color: white; 
                            border: none; 
                            width: 40px; 
                            height: 40px; 
                            border-radius: 50%; 
                            cursor: pointer; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-size: 1.1rem; 
                            flex-shrink: 0;
                            box-shadow: 0 2px 8px rgba(255, 90, 0, 0.3);
                        ">▶</button>
                    </div>
                </div>
            </div>
        </div>`;
    },

    open() {
        const existing = document.getElementById('chat-screen');
        if (existing) existing.remove();

        // Create fresh file inputs each time
        this.createFileInputs();

        document.body.insertAdjacentHTML('beforeend', this.render());

        // Push state for back button handling
        history.pushState({ screen: 'chat' }, '');

        setTimeout(() => {
            const input = document.getElementById('chat-input');
            if (input) input.focus();
        }, 300);
    },

    createFileInputs() {
        // Clean up any existing inputs
        this.removeFileInputs();
    },

    removeFileInputs() {
        const inputs = document.querySelectorAll('.temp-file-input');
        inputs.forEach(input => input.remove());
    },

    close() {
        // Clean up file inputs
        this.removeFileInputs();

        const screen = document.getElementById('chat-screen');
        if (screen) {
            screen.style.animation = 'fadeIn 0.2s reverse';
            setTimeout(() => {
                screen.remove();
                // Refresh dashboard to show new meals
                Dashboard.currentTab = 'home';
                Dashboard.update();
            }, 180);
        }
    },

    openCamera() {
        // Remove any existing temp inputs
        this.removeFileInputs();

        // Create a FRESH input element each time
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // Opens camera
        input.className = 'temp-file-input';
        input.style.cssText = 'position: fixed; top: -1000px; left: -1000px;';

        input.addEventListener('change', (e) => {
            this.handleImageSelect(e);
            // Remove after use
            setTimeout(() => input.remove(), 100);
        });

        document.body.appendChild(input);

        // Small delay then click
        setTimeout(() => input.click(), 50);
    },

    openGallery() {
        // Remove any existing temp inputs
        this.removeFileInputs();

        // Create a FRESH input element each time - NO capture attribute for gallery
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        // NO capture attribute - this opens gallery/file picker
        input.className = 'temp-file-input';
        input.style.cssText = 'position: fixed; top: -1000px; left: -1000px;';

        input.addEventListener('change', (e) => {
            this.handleImageSelect(e);
            // Remove after use
            setTimeout(() => input.remove(), 100);
        });

        document.body.appendChild(input);

        // Small delay then click
        setTimeout(() => input.click(), 50);
    },

    handleImageSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Reset input value immediately to allow reselection
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
            html += `<img src="${imageUrl}" style="max-width: 100%; border-radius: 12px; margin-bottom: 8px;">`;
        }
        html += content;

        div.innerHTML = html;
        container.appendChild(div);

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
            <div style="display: flex; gap: 6px; padding: 4px 0;">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
            <style>
                .typing-dot {
                    width: 8px; height: 8px; 
                    background: #9A9A9A; 
                    border-radius: 50%; 
                    animation: typingBounce 1.4s infinite ease-in-out;
                }
                .typing-dot:nth-child(1) { animation-delay: 0s; }
                .typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .typing-dot:nth-child(3) { animation-delay: 0.4s; }
                @keyframes typingBounce {
                    0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
                    40% { transform: translateY(-6px); opacity: 1; }
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
            this.addMessage(`<span style="color: #FF3D00;">Error: ${error.message}</span>`);
        }
    },

    addMealCard(meal) {
        if (!meal || !meal.items) return;

        const container = document.getElementById('chat-messages');
        if (!container) return;

        const id = 'meal-' + Date.now();
        this.currentMeal = { id, ...meal };

        const itemsHtml = meal.items.map(item => `
            <div style="display: flex; justify-content: space-between; padding: 12px; background: #F5F5F7; border-radius: 12px; margin-bottom: 8px;">
                <div style="flex: 1; min-width: 0;">
                    <p style="font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</p>
                    <p style="font-size: 0.75rem; color: #6A6A6A;">C: ${item.carbs || 0}g · P: ${item.protein || 0}g · F: ${item.fat || 0}g</p>
                </div>
                <p style="font-weight: 700; margin-left: 12px; white-space: nowrap;">${item.calories} cal</p>
            </div>
        `).join('');

        const totalCal = meal.items.reduce((sum, i) => sum + (i.calories || 0), 0);

        const div = document.createElement('div');
        div.style = 'align-self: stretch; width: 100%;';
        div.innerHTML = `
            <div class="card" id="${id}" style="border: 2px solid #FF5A00; margin: 0;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <span style="font-size: 2rem;">🍱</span>
                    <div style="flex: 1;">
                        <p style="font-weight: 700;">${meal.name || 'Your Meal'}</p>
                        <p style="font-size: 0.75rem; color: #6A6A6A;">Total: ${totalCal} cal</p>
                    </div>
                </div>
                ${itemsHtml}
                <div style="display: flex; gap: 12px; margin-top: 16px;">
                    <button class="btn btn-secondary" onclick="document.getElementById('${id}').parentElement.remove()" style="flex: 1;">Discard</button>
                    <button class="btn btn-primary" onclick="Chat.logMeal('${id}')" style="flex: 1;">Log Meal ✓</button>
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
            <div class="card" id="${id}" style="border: 2px solid #00C853; margin: 0;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <span style="font-size: 2rem;">🔥</span>
                    <div style="flex: 1;">
                        <p style="font-weight: 700;">${activity.name}</p>
                        <p style="font-size: 0.75rem; color: #6A6A6A;">${activity.duration || 'Activity'}</p>
                    </div>
                    <p style="font-weight: 700; color: #00C853;">-${activity.calories} cal</p>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-secondary" onclick="document.getElementById('${id}').parentElement.remove()" style="flex: 1;">Discard</button>
                    <button class="btn btn-primary" onclick="Chat.logActivity('${id}', '${activity.name}', ${activity.calories}, '${activity.duration || ''}')" style="flex: 1;">Log ✓</button>
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
            card.innerHTML = `<div style="text-align: center; color: #00C853; font-weight: 700; padding: 24px;">
                <div style="font-size: 2rem; margin-bottom: 8px;">✓</div>
                Meal Logged!
            </div>`;
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
            card.innerHTML = `<div style="text-align: center; color: #00C853; font-weight: 700; padding: 24px;">
                <div style="font-size: 2rem; margin-bottom: 8px;">✓</div>
                Activity Logged!
            </div>`;
        }

        UI.showToast('Activity logged! 💪', 'success');
    },

    clearMessages() {
        const container = document.getElementById('chat-messages');
        if (container) {
            container.innerHTML = `
                <div class="chat-bubble ai">
                    <p><strong>Chat cleared!</strong></p>
                    <p class="text-sm text-muted" style="margin-top: 8px;">What would you like to log?</p>
                </div>
            `;
        }
    }
};
