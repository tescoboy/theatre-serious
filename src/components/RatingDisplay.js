/**
 * RatingDisplay component
 * Displays ratings using moon icons and standing ovation animation
 */
class RatingDisplay {
    /**
     * Create a rating display
     * @param {string|number} rating - The rating value (1-5 or "Standing Ovation")
     * @param {Object} options - Optional configuration
     * @param {string} options.size - Size of the icons ('sm', 'md', 'lg') 
     * @param {boolean} options.showText - Whether to show the numeric rating
     * @param {string} options.containerClass - Additional CSS class for the container
     */
    constructor(rating, options = {}) {
        this.rating = rating;
        this.options = {
            size: options.size || 'md',
            showText: options.showText !== undefined ? options.showText : false,
            containerClass: options.containerClass || ''
        };
    }
    
    /**
     * Render the rating display
     * @returns {string} HTML string for the rating display
     */
    render() {
        // Normalize the rating value
        let numericRating = 0;
        let isStandingOvation = false;
        
        if (typeof this.rating === 'string') {
            if (this.rating.toLowerCase().includes('standing') || 
                this.rating.toLowerCase().includes('ovation') ||
                this.rating === '6' || this.rating === '6.0') {
                isStandingOvation = true;
            } else {
                numericRating = parseFloat(this.rating) || 0;
            }
        } else if (typeof this.rating === 'number') {
            numericRating = this.rating;
            if (numericRating >= 6) {
                isStandingOvation = true;
            }
        }
        
        // Limit to valid range
        numericRating = Math.max(0, Math.min(5, numericRating));
        
        // Create size class
        const sizeClass = this.options.size === 'sm' ? 'rating-sm' : 
                          this.options.size === 'lg' ? 'rating-lg' : '';
        
        // Build HTML
        let html = `<div class="rating-display ${sizeClass} ${this.options.containerClass}">`;
        
        // For standing ovation, only show the standing person icon
        if (isStandingOvation) {
            html += `<i class="bi bi-person-standing standing-ovation-icon"></i>`;
            
            // Add text if showText is true
            if (this.options.showText) {
                html += `<span class="rating-text">Standing Ovation</span>`;
            }
        } else {
            // For regular ratings, show only the filled/half moons (no empty ones)
            
            // Determine full and half moons
            const fullMoons = Math.floor(numericRating);
            const hasHalfMoon = numericRating % 1 >= 0.5;
            
            // Add full moons
            for (let i = 0; i < fullMoons; i++) {
                html += `<i class="bi bi-circle-fill moon-icon"></i>`;
            }
            
            // Add half moon if needed
            if (hasHalfMoon) {
                html += `<i class="bi bi-moon moon-icon"></i>`;
            }
            
            // Add text rating if showText is true
            if (this.options.showText) {
                html += `<span class="rating-text">${numericRating}</span>`;
            }
        }
        
        html += `</div>`;
        
        return html;
    }
    
    /**
     * Create rating display and insert into element
     * @param {HTMLElement|string} element - Element or selector to insert rating into
     * @returns {RatingDisplay} This instance for chaining
     */
    insertInto(element) {
        const container = typeof element === 'string' ? 
            document.querySelector(element) : element;
            
        if (container) {
            container.innerHTML = this.render();
        }
        
        return this;
    }
    
    /**
     * Static method to create a rating display and insert it into an element
     * @param {string|number} rating - The rating value
     * @param {HTMLElement|string} element - Element or selector to insert rating into
     * @param {Object} options - Optional configuration
     * @returns {RatingDisplay} New RatingDisplay instance
     */
    static create(rating, element, options = {}) {
        const ratingDisplay = new RatingDisplay(rating, options);
        ratingDisplay.insertInto(element);
        return ratingDisplay;
    }
} 