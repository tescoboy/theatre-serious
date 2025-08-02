/**
 * UnratedPlaysView component for displaying past plays without ratings
 */
class UnratedPlaysView {
    constructor() {
        this.container = document.getElementById('unrated-plays-container');
        this.initialized = false;
        this.plays = [];
        this.hasUnratedPlays = false;
        
        console.log('UnratedPlaysView component initialized');
    }
    
    /**
     * Initialize the unrated plays view
     */
    initialize() {
        if (this.initialized) return;
        
        // Set the initialized flag to prevent multiple initializations
        this.initialized = true;
        
        console.log('UnratedPlaysView initialized');
    }
    
    /**
     * Set plays data and update the display
     * @param {Array} allPlays - All plays data
     * @returns {boolean} Whether there are any unrated plays
     */
    setPlaysData(allPlays) {
        // Filter to get only past plays without ratings
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        this.plays = allPlays.filter(play => {
            // Check if it has no rating or rating is empty
            // A play is considered unrated if rating is null, undefined, empty string, or 0
            const hasNoRating = !play.rating || play.rating === '' || play.rating === 0;
            
            // Debug: Log plays that might be incorrectly categorized
            if (play.rating === 'Standing Ovation') {
                console.log('UnratedPlaysView: Found play with Standing Ovation rating:', play.name, 'rating:', play.rating);
                console.log('UnratedPlaysView: hasNoRating for Standing Ovation play:', hasNoRating);
                console.log('UnratedPlaysView: !play.rating:', !play.rating);
                console.log('UnratedPlaysView: play.rating === "":', play.rating === '');
                console.log('UnratedPlaysView: play.rating === 0:', play.rating === 0);
            }
            
            // Find the date field
            const dateFields = ['date', 'performance_date', 'play_date', 'viewed_date'];
            let playDate = null;
            
            for (const field of dateFields) {
                if (play[field] && typeof play[field] === 'string') {
                    try {
                        const date = new Date(play[field]);
                        if (!isNaN(date.getTime())) {
                            playDate = date;
                            break;
                        }
                    } catch (e) {
                        console.log(`Field ${field} is not a valid date:`, play[field]);
                    }
                }
            }
            
            // Keep only past plays without ratings
            const shouldInclude = playDate && playDate <= now && hasNoRating;
            
            // Debug: Log plays being included in unrated
            if (shouldInclude && play.rating) {
                console.log('UnratedPlaysView: Including play in unrated despite having rating:', play.name, 'rating:', play.rating, 'type:', typeof play.rating);
            }
            
            return shouldInclude;
        });
        
        // Sort by date (descending - most recent first)
        this.plays.sort((a, b) => {
            const dateA = new Date(a.date || a.performance_date || a.created_at);
            const dateB = new Date(b.date || b.performance_date || b.created_at);
            return dateB - dateA;
        });
        
        this.hasUnratedPlays = this.plays.length > 0;
        this.updateView();
        
        return this.hasUnratedPlays;
    }
    
    /**
     * Update the view with current plays data
     */
    updateView() {
        // Show loading state if no container
        if (!this.container) {
            console.error('Unrated plays container not found');
            return;
        }
        
        console.log(`Rendering ${this.plays.length} unrated plays`);
        
        // Render play cards grid
        this.container.innerHTML = PlayCard.createGrid(this.plays);
        
        // Attach event listeners to the play cards
        PlayCard.attachEventListeners(this.container);
    }
} 