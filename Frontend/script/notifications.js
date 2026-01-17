/**
 * Global Notification System
 * Attach showToast and showConfirm to the window object for easy access project-wide.
 */

(function() {
    // Ensure container exists
    function getToastContainer() {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    window.showToast = (message, type = 'info') => {
        const container = getToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'info';
        if (type === 'success') icon = 'check_circle';
        if (type === 'error') icon = 'error';
        if (type === 'warning') icon = 'warning';

        toast.innerHTML = `
            <span class="material-icons-round toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    window.showConfirm = (title, message, options = {}) => {
        const { confirmText = 'Confirm', cancelText = 'Cancel', isDanger = false } = options;
        
        return new Promise((resolve) => {
            const overlay = document.createElement('div');
            overlay.className = 'confirm-modal-overlay';
            
            overlay.innerHTML = `
                <div class="confirm-modal">
                    <div class="confirm-modal-title">${title}</div>
                    <div class="confirm-modal-message">${message}</div>
                    <div class="confirm-modal-actions">
                        <button class="confirm-modal-btn btn-cancel">${cancelText}</button>
                        <button class="confirm-modal-btn ${isDanger ? 'btn-confirm-danger' : 'btn-confirm'}">${confirmText}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
            
            // Animate in
            setTimeout(() => overlay.classList.add('show'), 10);

            const close = (result) => {
                overlay.classList.remove('show');
                setTimeout(() => {
                    overlay.remove();
                    resolve(result);
                }, 300);
            };

            overlay.querySelector('.btn-cancel').onclick = () => close(false);
            overlay.querySelector(`.${isDanger ? 'btn-confirm-danger' : 'btn-confirm'}`).onclick = () => close(true);
            overlay.onclick = (e) => {
                if (e.target === overlay) close(false);
            };
        });
    };
})();
