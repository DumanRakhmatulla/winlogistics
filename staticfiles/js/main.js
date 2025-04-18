// Enhanced JavaScript for Win Logistics

document.addEventListener('DOMContentLoaded', function() {
    // Add loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading';
    document.body.prepend(loadingIndicator);
    
    // Hide loading indicator after page load
    window.addEventListener('load', function() {
        loadingIndicator.style.display = 'none';
    });

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            delay: { show: 100, hide: 100 }
        });
    });

    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(alert => {
        // Add fade-in animation
        alert.classList.add('fade-in');
        
        setTimeout(() => {
            if (alert) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    });

    // Animation for counters in admin panel
    animateCounters();

    // Tracking code search form validation
    initSearchFormValidation();

    // Add animation to tracking progress
    animateTrackingProgress();

    // Bulk tracking codes textarea - automatically format on paste
    initBulkTextareaHandler();
    
    // Add animations to elements as they scroll into view
    initScrollAnimations();
    
    // Initialize back to top button
    initBackToTop();
    
    // Make table rows clickable if they have data-href
    initClickableTableRows();
});

// Function to animate counters
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.innerText, 10);
        const duration = 1500; // 1.5 seconds
        const steps = 60;
        const stepTime = duration / steps;
        const stepValue = target / steps;
        let current = 0;
        let step = 0;

        counter.innerText = '0';

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
}

// Function to initialize form validation
function initSearchFormValidation() {
    const searchForm = document.querySelector('form[action*="search_tracking"]');
    if (searchForm) {
        const input = searchForm.querySelector('input[name="tracking_code"]');
        
        // Add icon to input if not exists
        if (input && !input.parentNode.classList.contains('input-with-icon')) {
            const inputParent = input.parentNode;
            const inputWithIcon = document.createElement('div');
            inputWithIcon.className = 'input-with-icon';
            inputParent.insertBefore(inputWithIcon, input);
            inputWithIcon.appendChild(input);
            
            const icon = document.createElement('i');
            icon.className = 'fas fa-search';
            inputWithIcon.appendChild(icon);
        }
        
        searchForm.addEventListener('submit', function(e) {
            if (!input.value.trim()) {
                e.preventDefault();
                input.classList.add('is-invalid');
                
                // Create error message if it doesn't exist
                if (!document.querySelector('.invalid-feedback')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.classList.add('invalid-feedback');
                    errorMessage.textContent = 'Пожалуйста, введите трек-код';
                    input.parentNode.appendChild(errorMessage);
                    
                    // Shake animation for error
                    input.parentNode.classList.add('shake');
                    setTimeout(() => {
                        input.parentNode.classList.remove('shake');
                    }, 500);
                }
            } else {
                input.classList.remove('is-invalid');
                
                // Add subtle loading effect
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Поиск...';
                    submitBtn.disabled = true;
                    
                    // Reset button after timeout (in case form submission fails)
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }
            }
        });
        
        // Remove invalid class on input
        if (input) {
            input.addEventListener('input', function() {
                this.classList.remove('is-invalid');
            });
        }
    }
}

// Function to animate tracking progress
function animateTrackingProgress() {
    const trackingProgress = document.querySelector('.tracking-progress');
    if (trackingProgress) {
        // Add animation delay to each step
        const steps = trackingProgress.querySelectorAll('.tracking-step');
        steps.forEach((step, index) => {
            step.style.opacity = '0';
            setTimeout(() => {
                step.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
                step.style.opacity = '1';
                step.style.transform = 'translateY(0)';
            }, 200 * index);
        });

        // Animate progress line
        const progressLine = trackingProgress.querySelector('.tracking-progress-line-fill');
        if (progressLine) {
            const originalWidth = progressLine.classList[0];
            progressLine.classList.remove(originalWidth);
            setTimeout(() => {
                progressLine.classList.add(originalWidth);
            }, 500);
        }
    }
}

// Function to handle bulk textarea
function initBulkTextareaHandler() {
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
        
        // Add counter for characters and lines
        const counterDiv = document.createElement('div');
        counterDiv.className = 'text-muted small mt-2';
        counterDiv.innerHTML = 'Строк: 0';
        bulkTextarea.parentNode.appendChild(counterDiv);
        
        bulkTextarea.addEventListener('input', function() {
            const lines = this.value.split('\n').filter(line => line.trim().length > 0);
            counterDiv.innerHTML = `Строк: ${lines.length}`;
        });
    }
}

// Function to add animations to elements as they scroll into view
function initScrollAnimations() {
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Function to add animation class to element if in viewport
    function animateOnScroll() {
        // Animate cards
        document.querySelectorAll('.card:not(.animated)').forEach(card => {
            if (isInViewport(card)) {
                card.classList.add('animated', 'fade-in');
            }
        });
        
        // Animate feature icons
        document.querySelectorAll('.feature-icon:not(.animated)').forEach(icon => {
            if (isInViewport(icon)) {
                icon.classList.add('animated');
                icon.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                icon.style.opacity = '0';
                setTimeout(() => {
                    icon.style.opacity = '1';
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                    setTimeout(() => {
                        icon.style.transform = 'scale(1) rotate(0deg)';
                    }, 300);
                }, 300);
            }
        });
        
        // Animate step numbers
        document.querySelectorAll('.step-number:not(.animated)').forEach((step, index) => {
            if (isInViewport(step)) {
                step.classList.add('animated');
                step.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
                step.style.opacity = '0';
                setTimeout(() => {
                    step.style.opacity = '1';
                    step.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        step.style.transform = 'scale(1)';
                    }, 300);
                }, 300 + index * 200);
            }
        });
    }
    
    // Run once on page load
    animateOnScroll();
    
    // Run on scroll
    window.addEventListener('scroll', animateOnScroll);
}

// Function to initialize back to top button
function initBackToTop() {
    // Create back to top button
    const backToTop = document.createElement('a');
    backToTop.href = '#';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);
    
    // Style it
    backToTop.style.position = 'fixed';
    backToTop.style.bottom = '20px';
    backToTop.style.right = '20px';
    backToTop.style.width = '40px';
    backToTop.style.height = '40px';
    backToTop.style.backgroundColor = 'var(--primary-color)';
    backToTop.style.color = 'white';
    backToTop.style.borderRadius = '50%';
    backToTop.style.display = 'flex';
    backToTop.style.alignItems = 'center';
    backToTop.style.justifyContent = 'center';
    backToTop.style.textDecoration = 'none';
    backToTop.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    backToTop.style.opacity = '0';
    backToTop.style.visibility = 'hidden';
    backToTop.style.transition = 'opacity 0.3s, visibility 0.3s';
    backToTop.style.zIndex = '1000';
    
    // Show/hide on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // Smooth scroll to top on click
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Function to make table rows clickable
function initClickableTableRows() {
    document.querySelectorAll('tr[data-href]').forEach(row => {
        row.classList.add('clickable-row');
        row.style.cursor = 'pointer';
        
        row.addEventListener('click', function() {
            window.location.href = this.dataset.href;
        });
    });
}

// Add keyframe animation for shake
if (!document.getElementById('shake-animation')) {
    const style = document.createElement('style');
    style.id = 'shake-animation';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
    `;
    document.head.appendChild(style);
}