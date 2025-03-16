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
        const hasReview = this.play.review ? true : false;
        
        // Check if the play is in the future (upcoming)
        const isUpcoming = date ? new Date(date) > new Date() : false;
        
        // Format date directly using UK format instead of relying on FormatUtils
        let formattedDate = 'Date not specified';
        if (date) {
            try {
                const dateObj = new Date(date);
                if (!isNaN(dateObj)) {
                    const day = dateObj.getDate().toString().padStart(2, '0');
                    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                    const year = dateObj.getFullYear();
                    formattedDate = `${day}/${month}/${year}`;
                } else {
                    formattedDate = 'Invalid date';
                }
            } catch (e) {
                console.error('Error formatting date:', e);
                formattedDate = 'Date error';
            }
        }
        
        // Create footer with review button only for past plays
        const footerHtml = !isUpcoming ? `
            <div class="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center">
                ${hasReview ? `
                    <button class="btn btn-sm btn-link text-primary review-play-btn" data-play-id="${playId}" title="Read Review">
                        <i class="bi bi-bookmark-star-fill"></i>
                        <span class="ms-1 small">Read Review</span>
                    </button>
                ` : `
                    <button class="btn btn-sm btn-link text-muted review-play-btn" data-play-id="${playId}" title="Add Review">
                        <i class="bi bi-journal-plus"></i>
                        <span class="ms-1 small">Add Review</span>
                    </button>
                `}
            </div>
        ` : '';
        
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
                ${footerHtml}
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