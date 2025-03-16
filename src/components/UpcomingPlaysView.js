/**
 * UpcomingPlaysView component for displaying upcoming plays
 */
class UpcomingPlaysView {
    constructor() {
        this.container = document.getElementById('upcoming-plays-container');
        this.initialized = false;
        this.plays = [];
        
        console.log('UpcomingPlaysView component initialized');
    }
    
    /**
     * Initialize the upcoming plays view
     */
    initialize() {
        if (this.initialized) return;
        
        // Set the initialized flag to prevent multiple initializations
        this.initialized = true;
        
        console.log('UpcomingPlaysView initialized');
    }
    
    /**
     * Set plays data and update the display
     * @param {Array} allPlays - All plays data
     */
    setPlaysData(allPlays) {
        // Filter to get only upcoming plays
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
            
            // Keep only future plays
            return playDate && playDate > now;
        });
        
        // Sort by date (ascending)
        this.plays.sort((a, b) => {
            const dateA = new Date(a.date || a.performance_date || a.created_at);
            const dateB = new Date(b.date || b.performance_date || b.created_at);
            return dateA - dateB;
        });
        
        this.updateView();
    }
    
    /**
     * Update the view with current plays data
     */
    updateView() {
        // Show loading state if no container
        if (!this.container) {
            console.error('Upcoming plays container not found');
            return;
        }
        
        console.log(`Rendering ${this.plays.length} upcoming plays`);
        
        // Render play cards grid
        this.container.innerHTML = PlayCard.createGrid(this.plays);
        
        // Attach event listeners to the play cards
        PlayCard.attachEventListeners(this.container);
    }
} 