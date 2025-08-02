/**
 * RatingInput component for selecting ratings with moons and standing ovation
 * Supports full moons, half moons, and standing ovation selection
 */
class RatingInput {
    /**
     * Create a new rating input component
     * @param {Object} options - Configuration options
     * @param {string} options.containerId - ID of container element
     * @param {number|string} options.initialValue - Initial rating value (1-5, "half-1" to "half-5", or "standing")
     * @param {Function} options.onChange - Callback when rating changes
     */
    constructor(options = {}) {
        this.containerId = options.containerId;
        this.container = document.getElementById(this.containerId);
        this.initialValue = options.initialValue || 0;
        this.onChange = options.onChange || function() {};
        
        this.currentRating = 0;
        this.isHalfStar = false;
        this.isStandingOvation = false;
        this.clickTimers = [null, null, null, null, null];
        
        this.init();
        
        console.log('RatingInput component initialized');
    }
    
    /**
     * Initialize the rating input
     */
    init() {
        if (!this.container) {
            console.error(`Container with ID ${this.containerId} not found`);
            return;
        }
        
        // Create the rating container
        this.container.innerHTML = `
            <div class="rating-input-container">
                <div class="moons-container">
                    ${Array(5).fill().map((_, i) => `
                        <i class="rating-icon bi bi-circle" data-index="${i+1}"></i>
                    `).join('')}
                </div>
                <div class="standing-ovation-container ms-3">
                    <i class="rating-icon bi bi-person-standing" data-special="standing"></i>
                    <span class="ms-1 small">Standing Ovation</span>
                </div>
                <button type="button" class="btn btn-sm btn-link text-muted clear-rating ms-3">
                    <i class="bi bi-x-circle"></i> Clear
                </button>
                <small class="d-block mt-2 text-muted">
                    <i class="bi bi-info-circle"></i> Double-tap any icon for half-moon
                </small>
            </div>
        `;
        
        // Add event listeners
        this.addEventListeners();
        
        // Set initial value
        this.setValue(this.initialValue);
    }
    
    /**
     * Add event listeners to the rating elements
     */
    addEventListeners() {
        const moonIcons = this.container.querySelectorAll('.moons-container .rating-icon');
        const standingIcon = this.container.querySelector('.standing-ovation-container .rating-icon');
        const clearButton = this.container.querySelector('.clear-rating');
        
        // Moon click events
        moonIcons.forEach((icon, index) => {
            // Make tap area larger for mobile
            icon.style.padding = '10px 5px';
            
            // Single click handler
            icon.addEventListener('click', () => {
                // Check if this is potentially part of a double-click
                if (this.clickTimers[index] !== null) {
                    // This is the second click (double-click)
                    clearTimeout(this.clickTimers[index]);
                    this.clickTimers[index] = null;
                    this.handleHalfMoonSelection(index + 1);
                } else {
                    // This is the first click - wait to see if there's a second click
                    icon.classList.add('waiting-for-double');
                    this.clickTimers[index] = setTimeout(() => {
                        this.clickTimers[index] = null;
                        icon.classList.remove('waiting-for-double');
                        this.handleFullMoonSelection(index + 1);
                    }, 500); // Increased from 300ms to 500ms for easier double-tap on mobile
                }
            });
            
            // Add hover effects
            icon.addEventListener('mouseenter', () => {
                if (!this.isStandingOvation) {
                    this.hoverRating(index + 1);
                }
            });
        });
        
        // Make standing ovation icon larger for mobile
        standingIcon.style.padding = '10px 5px';
        
        // Handle mouse leaving the moons container
        this.container.querySelector('.moons-container').addEventListener('mouseleave', () => {
            if (!this.isStandingOvation) {
                this.resetHoverState();
            }
        });
        
        // Standing ovation click event
        standingIcon.addEventListener('click', () => {
            this.handleStandingOvationSelection();
        });
        
        // Clear rating
        clearButton.addEventListener('click', () => {
            this.clear();
        });
    }
    
    /**
     * Handle selection of a full moon
     * @param {number} index - Moon index (1-5)
     */
    handleFullMoonSelection(index) {
        this.isStandingOvation = false;
        this.isHalfStar = false;
        this.currentRating = index;
        this.updateDisplay();
        this.triggerChange();
    }
    
    /**
     * Handle selection of a half moon
     * @param {number} index - Moon index (1-5)
     */
    handleHalfMoonSelection(index) {
        this.isStandingOvation = false;
        
        // If already a half moon at this position, convert to full moon
        if (this.isHalfStar && this.currentRating === index - 0.5) {
            this.isHalfStar = false;
            this.currentRating = index;
        } else {
            this.isHalfStar = true;
            this.currentRating = index - 0.5;
        }
        
        this.updateDisplay();
        this.triggerChange();
    }
    
    /**
     * Handle selection of standing ovation
     */
    handleStandingOvationSelection() {
        console.log('RatingInput: Standing ovation clicked, current state:', this.isStandingOvation);
        
        // Toggle standing ovation
        this.isStandingOvation = !this.isStandingOvation;
        
        console.log('RatingInput: Standing ovation toggled to:', this.isStandingOvation);
        
        if (this.isStandingOvation) {
            // Reset moon rating
            this.currentRating = 0;
            this.isHalfStar = false;
            console.log('RatingInput: Reset moon rating, current rating:', this.currentRating);
        }
        
        this.updateDisplay();
        this.triggerChange();
    }
    
    /**
     * Show hover state for moons
     * @param {number} index - Hover index (1-5)
     */
    hoverRating(index) {
        const moonIcons = this.container.querySelectorAll('.moons-container .rating-icon');
        
        moonIcons.forEach((icon, i) => {
            if (i < index) {
                icon.classList.add('hover');
            } else {
                icon.classList.remove('hover');
            }
        });
    }
    
    /**
     * Reset hover state to current selection
     */
    resetHoverState() {
        this.updateDisplay();
    }
    
    /**
     * Update the visual display based on current state
     */
    updateDisplay() {
        const moonIcons = this.container.querySelectorAll('.moons-container .rating-icon');
        const standingIcon = this.container.querySelector('.standing-ovation-container .rating-icon');
        
        // Reset all icons first
        moonIcons.forEach(icon => {
            icon.className = 'rating-icon bi bi-circle';
            icon.style.padding = '10px 5px';
        });
        
        standingIcon.className = 'rating-icon bi bi-person-standing';
        standingIcon.classList.remove('selected', 'bounce-animation');
        
        if (this.isStandingOvation) {
            // Show standing ovation as selected
            standingIcon.classList.add('selected', 'bounce-animation');
        } else {
            // Fill in moons based on rating
            const fullMoons = Math.floor(this.currentRating);
            const hasHalfMoon = this.isHalfStar;
            
            moonIcons.forEach((icon, i) => {
                if (i < fullMoons) {
                    // Full moon
                    icon.classList.remove('bi-circle');
                    icon.classList.add('bi-circle-fill', 'selected');
                } else if (hasHalfMoon && i === fullMoons) {
                    // Half moon
                    icon.classList.remove('bi-circle');
                    icon.classList.add('bi-moon', 'half-selected');
                }
            });
        }
    }
    
    /**
     * Clear the rating 
     */
    clear() {
        this.currentRating = 0;
        this.isHalfStar = false;
        this.isStandingOvation = false;
        this.updateDisplay();
        this.triggerChange();
    }
    
    /**
     * Set the rating value
     * @param {number|string} value - Rating value to set
     */
    setValue(value) {
        if (!value || value === 0) {
            this.clear();
            return;
        }
        
        if (value === 'standing') {
            this.isStandingOvation = true;
            this.isHalfStar = false;
            this.currentRating = 0;
        } else if (typeof value === 'number') {
            this.isStandingOvation = false;
            
            if (value % 1 !== 0) {
                // It's a half star
                this.isHalfStar = true;
                this.currentRating = value;
            } else {
                this.isHalfStar = false;
                this.currentRating = value;
            }
        } else if (typeof value === 'string' && value.startsWith('half-')) {
            this.isStandingOvation = false;
            this.isHalfStar = true;
            this.currentRating = parseInt(value.replace('half-', '')) - 0.5;
        }
        
        this.updateDisplay();
    }
    
    /**
     * Get the current rating value
     * @returns {number|string} - Rating value (number or 'standing')
     */
    getValue() {
        if (this.isStandingOvation) {
            return 'standing';
        }
        return this.currentRating;
    }
    
    /**
     * Trigger the change callback
     */
    triggerChange() {
        const value = this.getValue();
        console.log('RatingInput: triggerChange called with value:', value, 'type:', typeof value);
        console.log('RatingInput: onChange function exists:', typeof this.onChange === 'function');
        
        if (typeof this.onChange === 'function') {
            console.log('RatingInput: Calling onChange with value:', value);
            this.onChange(value);
        }
    }
} 