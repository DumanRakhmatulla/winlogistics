// Main JavaScript for Win Logistics

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Animation for counters in admin panel
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.innerText, 10);
        const duration = 1000; // 1 second
        const steps = 50;
        const stepTime = duration / steps;
        const stepValue = target / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            current = Math.ceil(stepValue * step);
            if (current > target) current = target;
            counter.innerText = current;
            if (step >= steps) {
                clearInterval(timer);
                counter.innerText = target;
            }
        }, stepTime);
    });

    // Tracking code search form validation
    const searchForm = document.querySelector('form[action*="search_tracking"]');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const input = this.querySelector('input[name="tracking_code"]');
            if (!input.value.trim()) {
                e.preventDefault();
                input.classList.add('is-invalid');
                
                // Create error message if it doesn't exist
                if (!document.querySelector('.invalid-feedback')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.classList.add('invalid-feedback');
                    errorMessage.textContent = 'Пожалуйста, введите трек-код';
                    input.parentNode.appendChild(errorMessage);
                }
            } else {
                input.classList.remove('is-invalid');
            }
        });
    }

    // Add animation to tracking progress
    const trackingProgress = document.querySelector('.tracking-progress');
    if (trackingProgress) {
        // Add animation delay to each step
        const steps = trackingProgress.querySelectorAll('.tracking-step');
        steps.forEach((step, index) => {
            step.style.opacity = '0';
            setTimeout(() => {
                step.style.transition = 'opacity 0.5s ease-in-out';
                step.style.opacity = '1';
            }, 200 * index);
        });

        // Animate progress line
        const progressLine = trackingProgress.querySelector('.tracking-progress-line-fill');
        if (progressLine) {
            const originalWidth = progressLine.style.width;
            progressLine.style.width = '0';
            setTimeout(() => {
                progressLine.style.transition = 'width 1s ease-in-out';
                progressLine.style.width = originalWidth;
            }, 500);
        }
    }

    // Bulk tracking codes textarea - automatically format on paste
    const bulkTextarea = document.getElementById('id_tracking_codes');
    if (bulkTextarea) {
        bulkTextarea.addEventListener('paste', function(e) {
            // Let the paste happen, then format
            setTimeout(() => {
                // Get text and remove extra whitespace, keeping only one newline between codes
                const text = this.value;
                const formattedText = text
                    .split(/\r?\n/)
                    .map(line => line.trim())
                    .filter(line => line.length > 0)
                    .join('\n');
                this.value = formattedText;
            }, 0);
        });
    }
});