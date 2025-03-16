/**
 * PastPlaysView component for displaying past plays
 */
class PastPlaysView {
    constructor() {
        this.container = document.getElementById('past-plays-container');
        this.initialized = false;
        this.plays = [];
        
        console.log('PastPlaysView component initialized');
    }
    
    /**
     * Initialize the past plays view
     */
    initialize() {
        if (this.initialized) return;
        
        // Set the initialized flag to prevent multiple initializations
        this.initialized = true;
        
        console.log('PastPlaysView initialized');
    }
    
    /**
     * Set plays data and update the display
     * @param {Array} allPlays - All plays data
     */
    setPlaysData(allPlays) {
        // Filter to get only past plays
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        this.plays = allPlays.filter(play => {
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
            
            // Keep only past plays
            return playDate && playDate <= now;
        });
        
        // Sort by date (descending - most recent first)
        this.plays.sort((a, b) => {
            const dateA = new Date(a.date || a.performance_date || a.created_at);
            const dateB = new Date(b.date || b.performance_date || b.created_at);
            return dateB - dateA; // Note the reversed order for descending sort
        });
        
        this.updateView();
    }
    
    /**
     * Update the view with current plays data
     */
    updateView() {
        // Show loading state if no container
        if (!this.container) {
            console.error('Past plays container not found');
            return;
        }
        
        console.log(`Rendering ${this.plays.length} past plays`);
        
        // Render play cards grid
        this.container.innerHTML = PlayCard.createGrid(this.plays);
        
        // Attach event listeners to the play cards
        PlayCard.attachEventListeners(this.container);
    }
} 