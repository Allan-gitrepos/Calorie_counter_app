// History Module - Enterprise Edition v5
// Enhanced calendar with better styling and animations

const History = {
    currentMonth: new Date(),
    selectedDate: new Date(),

    renderContent() {
        return `
            <div style="padding: 20px; padding-bottom: 100px;">
                <!-- Month Header -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2>History</h2>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-icon btn-icon-sm" onclick="History.goToToday()">
                            Today
                        </button>
                    </div>
                </div>
                
                <!-- Calendar Card -->
                <div class="card" style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <button class="btn-icon btn-icon-sm" onclick="History.prevMonth()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <h3 style="font-size: 1.125rem;">${this.getMonthName()}</h3>
                        <button class="btn-icon btn-icon-sm" onclick="History.nextMonth()">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                    </div>
                    
                    <!-- Day Headers -->
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 8px; text-align: center;">
                        ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `
                            <div style="font-size: 0.6875rem; font-weight: 600; color: var(--gray-400); padding: 8px 0; text-transform: uppercase;">${d}</div>
                        `).join('')}
                    </div>
                    
                    <!-- Calendar Days -->
                    <div id="calendar-days" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;">
                        ${this.renderCalendarDays()}
                    </div>
                </div>

                <!-- Day Summary -->
                <div id="day-summary">
                    ${this.renderDaySummary()}
                </div>

                <!-- Monthly Stats -->
                <div class="card" style="margin-top: 20px;">
                    <h6 style="color: var(--gray-500); margin-bottom: 16px;">Monthly Summary</h6>
                    ${this.renderMonthlySummary()}
                </div>
            </div>
        `;
    },

    getMonthName() {
        return this.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    },

    renderCalendarDays() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay();

        let html = '';

        // Empty cells for days before month starts
        for (let i = 0; i < startDay; i++) {
            html += `<div style="height: 44px;"></div>`;
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            date.setHours(12, 0, 0, 0);

            const dateStr = this.formatDateKey(year, month, day);
            const selectedDateStr = this.formatDateKey(
                this.selectedDate.getFullYear(),
                this.selectedDate.getMonth(),
                this.selectedDate.getDate()
            );
            const todayStr = this.formatDateKey(today.getFullYear(), today.getMonth(), today.getDate());

            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDateStr;
            const meals = Storage.getMeals(dateStr);
            const hasData = meals.length > 0;
            const totalCals = meals.reduce((sum, m) => sum + (m.type === 'food' ? m.calories : 0), 0);

            let bgStyle = 'background: transparent;';
            let textColor = 'color: var(--black);';
            let borderStyle = 'border: 2px solid transparent;';

            if (isSelected) {
                bgStyle = 'background: var(--primary-gradient);';
                textColor = 'color: white;';
            } else if (isToday) {
                borderStyle = 'border: 2px solid var(--primary);';
                textColor = 'color: var(--primary);';
            }

            // Intensity indicator based on calorie intake
            let intensityColor = 'transparent';
            if (hasData && !isSelected) {
                const user = Storage.getUser() || {};
                const goal = user.dailyCalories || 2000;
                const percent = Math.min(100, (totalCals / goal) * 100);
                if (percent >= 80) intensityColor = 'var(--success)';
                else if (percent >= 50) intensityColor = 'var(--warning)';
                else intensityColor = 'var(--primary-soft)';
            }

            html += `
                <div onclick="History.selectDate(${year}, ${month}, ${day})" 
                    style="
                        height: 44px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        border-radius: var(--radius-md);
                        cursor: pointer;
                        font-weight: 600;
                        font-size: 0.875rem;
                        position: relative;
                        transition: all 0.2s ease;
                        ${bgStyle}
                        ${textColor}
                        ${borderStyle}
                    ">
                    ${day}
                    ${hasData ? `<div style="position: absolute; bottom: 4px; width: 4px; height: 4px; background: ${isSelected ? 'rgba(255,255,255,0.8)' : intensityColor}; border-radius: 50%;"></div>` : ''}
                </div>
            `;
        }

        return html;
    },

    formatDateKey(year, month, day) {
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
    },

    renderDaySummary() {
        const dateStr = this.formatDateKey(
            this.selectedDate.getFullYear(),
            this.selectedDate.getMonth(),
            this.selectedDate.getDate()
        );
        const summary = Storage.getDailySummary(dateStr);
        const waterIntake = Storage.getWaterIntake(dateStr);

        const displayDate = this.selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
        });

        if (summary.meals.length === 0) {
            return `
                <div class="card" style="text-align: center; padding: 32px;">
                    <div style="font-size: 2.5rem; margin-bottom: 12px; opacity: 0.5;">📅</div>
                    <p style="font-weight: 600; color: var(--black); margin-bottom: 4px;">${displayDate}</p>
                    <p class="text-sm text-muted">No data recorded for this day</p>
                </div>
            `;
        }

        const netCalories = summary.eaten - summary.burned;
        const user = Storage.getUser() || {};
        const goal = user.dailyCalories || 2000;
        const percent = Math.round((summary.eaten / goal) * 100);

        return `
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <div>
                        <p class="text-xs text-muted" style="text-transform: uppercase; letter-spacing: 0.5px;">Selected Date</p>
                        <h4>${displayDate}</h4>
                    </div>
                    <span class="pill ${percent >= 80 && percent <= 110 ? 'pill-success' : percent > 110 ? 'pill-warning' : 'pill-info'}">
                        ${percent}% of goal
                    </span>
                </div>
                
                <!-- Quick Stats -->
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding: 16px; background: var(--gray-100); border-radius: var(--radius-md); margin-bottom: 16px;">
                    <div style="text-align: center;">
                        <p style="font-size: 1.125rem; font-weight: 700; color: var(--black);">${summary.eaten}</p>
                        <p class="text-xs text-muted">Eaten</p>
                    </div>
                    <div style="text-align: center;">
                        <p style="font-size: 1.125rem; font-weight: 700; color: var(--success);">${summary.burned}</p>
                        <p class="text-xs text-muted">Burned</p>
                    </div>
                    <div style="text-align: center;">
                        <p style="font-size: 1.125rem; font-weight: 700; color: ${netCalories > goal ? 'var(--warning)' : 'var(--black)'};">${netCalories}</p>
                        <p class="text-xs text-muted">Net</p>
                    </div>
                    <div style="text-align: center;">
                        <p style="font-size: 1.125rem; font-weight: 700; color: var(--water-color);">${waterIntake}</p>
                        <p class="text-xs text-muted">Water 💧</p>
                    </div>
                </div>

                <!-- Macros -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
                    <div style="text-align: center; padding: 12px; background: var(--gray-100); border-radius: var(--radius-sm);">
                        <div style="width: 8px; height: 8px; background: var(--carbs-color); border-radius: 50%; margin: 0 auto 8px;"></div>
                        <p style="font-weight: 700; color: var(--black);">${summary.carbs.current}g</p>
                        <p class="text-xs text-muted">Carbs</p>
                    </div>
                    <div style="text-align: center; padding: 12px; background: var(--gray-100); border-radius: var(--radius-sm);">
                        <div style="width: 8px; height: 8px; background: var(--protein-color); border-radius: 50%; margin: 0 auto 8px;"></div>
                        <p style="font-weight: 700; color: var(--black);">${summary.protein.current}g</p>
                        <p class="text-xs text-muted">Protein</p>
                    </div>
                    <div style="text-align: center; padding: 12px; background: var(--gray-100); border-radius: var(--radius-sm);">
                        <div style="width: 8px; height: 8px; background: var(--fat-color); border-radius: 50%; margin: 0 auto 8px;"></div>
                        <p style="font-weight: 700; color: var(--black);">${summary.fat.current}g</p>
                        <p class="text-xs text-muted">Fat</p>
                    </div>
                </div>

                <!-- Meal List -->
                <div class="divider-text" style="margin-bottom: 16px;">Logged Items</div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${summary.meals.map(meal => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background: var(--gray-100); border-radius: var(--radius-sm);">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span style="font-size: 1.25rem;">${meal.type === 'food' ? '🍱' : '🔥'}</span>
                                <span style="font-weight: 500; color: var(--black);">${meal.name}</span>
                            </div>
                            <span style="font-weight: 600; color: ${meal.type === 'food' ? 'var(--black)' : 'var(--success)'};">
                                ${meal.type === 'food' ? '+' : '-'}${meal.calories}
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    renderMonthlySummary() {
        const year = this.currentMonth.getFullYear();
        const month = this.currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let totalCalories = 0;
        let totalBurned = 0;
        let daysLogged = 0;
        let bestDay = { date: null, calories: 0 };

        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = this.formatDateKey(year, month, day);
            const summary = Storage.getDailySummary(dateStr);

            if (summary.meals.length > 0) {
                daysLogged++;
                totalCalories += summary.eaten;
                totalBurned += summary.burned;

                if (summary.eaten > bestDay.calories) {
                    bestDay = {
                        date: new Date(year, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        calories: summary.eaten
                    };
                }
            }
        }

        const avgCalories = daysLogged > 0 ? Math.round(totalCalories / daysLogged) : 0;

        return `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                <div style="text-align: center; padding: 16px; background: var(--gray-100); border-radius: var(--radius-md);">
                    <p style="font-size: 1.5rem; font-weight: 700; color: var(--black);">${daysLogged}</p>
                    <p class="text-xs text-muted">Days Logged</p>
                </div>
                <div style="text-align: center; padding: 16px; background: var(--gray-100); border-radius: var(--radius-md);">
                    <p style="font-size: 1.5rem; font-weight: 700; color: var(--black);">${avgCalories}</p>
                    <p class="text-xs text-muted">Avg Daily Cal</p>
                </div>
                <div style="text-align: center; padding: 16px; background: var(--gray-100); border-radius: var(--radius-md);">
                    <p style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${totalCalories.toLocaleString()}</p>
                    <p class="text-xs text-muted">Total Eaten</p>
                </div>
                <div style="text-align: center; padding: 16px; background: var(--gray-100); border-radius: var(--radius-md);">
                    <p style="font-size: 1.5rem; font-weight: 700; color: var(--success);">${totalBurned.toLocaleString()}</p>
                    <p class="text-xs text-muted">Total Burned</p>
                </div>
            </div>
        `;
    },

    goToToday() {
        this.currentMonth = new Date();
        this.selectedDate = new Date();
        Dashboard.update();
    },

    prevMonth() {
        this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
        Dashboard.update();
    },

    nextMonth() {
        this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
        Dashboard.update();
    },

    selectDate(year, month, day) {
        this.selectedDate = new Date(year, month, day, 12, 0, 0);
        Dashboard.update();
    }
};
