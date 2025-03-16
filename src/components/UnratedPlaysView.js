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
            const hasNoRating = !play.rating || play.rating === '';
            
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
            return playDate && playDate <= now && hasNoRating;
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