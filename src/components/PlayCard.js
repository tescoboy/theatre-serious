/**
 * PlayCard component for displaying individual play information
 */
class PlayCard {
    /**
     * Create a play card
     * @param {Object} play - The play data object
     */
    constructor(play) {
        this.play = play;
    }
    
    /**
     * Render the play card
     * @returns {string} HTML for the play card
     */
    render() {
        // Get play data with fallbacks
        const title = this.play.name || this.play.title || 'Untitled Play';
        const theatre = this.play.theatre || this.play.venue || '';
        const date = this.play.date || this.play.performance_date || this.play.created_at;
        // Change the placeholder image URL to use our burgundy color scheme
        const imageUrl = this.play.image || 'https://placehold.co/600x400/f3e9ea/7D2935?text=No+Image';
        const rating = this.play.rating || '';
        const playId = this.play.id;
        
        // Format date for display
        const formattedDate = date ? FormatUtils.formatDate(date) : 'Date not specified';
        
        return `
            <div class="play-card card h-100 shadow-sm">
                <div class="play-card-image-container">
                    <img src="${imageUrl}" class="card-img-top play-card-image" alt="${title}" loading="lazy">
                    <div class="play-card-actions">
                        <button class="btn btn-sm btn-light edit-play-btn" data-play-id="${playId}" title="Edit Play">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <div class="card-text">
                        <div class="mb-2">
                            <i class="bi bi-calendar-event text-primary me-2"></i>
                            <span>${formattedDate}</span>
                        </div>
                        ${theatre ? `
                        <div class="mb-2">
                            <i class="bi bi-building text-primary me-2"></i>
                            <span>${theatre}</span>
                        </div>` : ''}
                        ${rating ? `
                        <div class="mt-3">
                            ${new RatingDisplay(rating, { size: 'sm' }).render()}
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Attach event listeners to play cards after they're rendered
     * @param {HTMLElement} container - The container with play cards
     */
    static attachEventListeners(container) {
        // Find all edit buttons within the container
        const editButtons = container.querySelectorAll('.edit-play-btn');
        console.log(`Found ${editButtons.length} edit buttons to attach event listeners to`);
        
        // Add click handler to each edit button - use a simpler approach
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Get the play ID from the button's data attribute
                const playId = button.getAttribute('data-play-id');
                console.log(`Edit button clicked for play ID: ${playId}`);
                
                // Dispatch event to edit the play
                document.dispatchEvent(new CustomEvent('editPlay', { 
                    detail: { playId: parseInt(playId) }
                }));
            });
        });
        
        // For mobile: Add click handlers to play cards to toggle edit button visibility
        const playCards = container.querySelectorAll('.play-card');
        console.log(`Found ${playCards.length} play cards for mobile tap events`);
        
        playCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Only handle this for mobile devices
                if (window.innerWidth <= 768) {
                    // Toggle the 'tapped' class to show/hide edit button
                    this.classList.toggle('tapped');
                    console.log('Play card tapped on mobile, showing edit button');
                    
                    // Auto-hide after 3 seconds
                    setTimeout(() => {
                        this.classList.remove('tapped');
                    }, 3000);
                }
            });
        });
    }
    
    /**
     * Static method to create a grid of play cards
     * @param {Array} plays - Array of play objects
     * @returns {string} HTML for a responsive grid of play cards
     */
    static createGrid(plays) {
        if (!plays || plays.length === 0) {
            return `<div class="alert alert-info">No plays to display.</div>`;
        }
        
        return `
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 play-card-grid">
                ${plays.map(play => `
                    <div class="col">
                        ${new PlayCard(play).render()}
                    </div>
                `).join('')}
            </div>
        `;
    }
}