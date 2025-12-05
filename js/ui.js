// UI Helper Functions
const UI = {
    // Show toast notification
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeIn 0.3s reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Format date for display
    formatDate(date) {
        const today = new Date();
        const d = new Date(date);

        if (d.toDateString() === today.toDateString()) return 'Today';

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

        return d.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    },

    // Get date string (YYYY-MM-DD)
    getDateString(date = new Date()) {
        return date.toISOString().split('T')[0];
    },

    // Hide loading screen
    hideLoading() {
        const loader = document.querySelector('.loading-screen');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.3s';
            setTimeout(() => loader.remove(), 300);
        }
    }
};
