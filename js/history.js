// History Module - Renders as tab content
const History = {
    currentMonth: new Date(),
    selectedDate: new Date(),

    renderContent() {
        return `
            <div style="padding: 20px; padding-bottom: 100px;">
                <!-- Calendar -->
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3>${this.getMonthName()}</h3>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn-icon" onclick="History.prevMonth()" style="width: 36px; height: 36px;">←</button>
                            <button class="btn-icon" onclick="History.nextMonth()" style="width: 36px; height: 36px;">→</button>
                        </div>
                    </div>
                    
                    <!-- Day Headers -->
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 8px; text-align: center;">
                        ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `<div class="text-xs text-muted" style="font-weight: 600;">${d}</div>`).join('')}
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

        for (let i = 0; i < startDay; i++) {
            html += `<div style="height: 40px;"></div>`;
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
            const hasData = Storage.getMeals(dateStr).length > 0;

            let style = `
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 12px;
                cursor: pointer;
                font-weight: 600;
                font-size: 0.875rem;
                position: relative;
                transition: all 0.2s;
            `;

            if (isSelected) {
                style += 'background: var(--black); color: white;';
            } else if (isToday) {
                style += 'border: 2px solid var(--primary); color: var(--primary);';
            }

            const dot = hasData ? `<div style="position: absolute; bottom: 4px; width: 4px; height: 4px; background: ${isSelected ? 'white' : 'var(--success)'}; border-radius: 50%;"></div>` : '';

            html += `
                <div onclick="History.selectDate(${year}, ${month}, ${day})" style="${style}">
                    ${day}
                    ${dot}
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

        const displayDate = this.selectedDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        if (summary.meals.length === 0) {
            return `
                <div class="card" style="text-align: center; padding: 40px;">
                    <p class="text-muted">No data for ${displayDate}</p>
                </div>
            `;
        }

        return `
            <div class="card">
                <h3 style="margin-bottom: 16px;">${displayDate}</h3>
                
                <div style="display: flex; justify-content: space-around; padding: 16px; background: var(--surface); border-radius: 12px; margin-bottom: 16px;">
                    <div style="text-align: center;">
                        <p class="text-xs text-muted">EATEN</p>
                        <p style="font-weight: 700; font-size: 1.25rem;">${summary.eaten}</p>
                    </div>
                    <div style="text-align: center;">
                        <p class="text-xs text-muted">BURNED</p>
                        <p style="font-weight: 700; font-size: 1.25rem; color: var(--success);">${summary.burned}</p>
                    </div>
                    <div style="text-align: center;">
                        <p class="text-xs text-muted">NET</p>
                        <p style="font-weight: 700; font-size: 1.25rem;">${summary.eaten - summary.burned}</p>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${summary.meals.map(meal => `
                        <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--surface);">
                            <span>${meal.type === 'food' ? '🍱' : '🔥'} ${meal.name}</span>
                            <span style="font-weight: 600;">${meal.type === 'food' ? '+' : '-'}${meal.calories}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
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
