/**
 * Component for displaying all play reviews
 */
class ReviewsView {
    constructor() {
        this.playsData = [];
        this.currentReviewIndex = 0;
        this.initialized = false;
        
        console.log('ReviewsView component created');
    }
    
    /**
     * Initialize the reviews view
     */
    initialize() {
        if (this.initialized) return;
        
        console.log('ReviewsView initialized');
        this.initialized = true;
    }
    
    /**
     * Set plays data
     * @param {Array} playsData - Array of play data
     */
    setPlaysData(playsData) {
        console.log(`Setting plays data in ReviewsView: ${playsData.length} plays`);
        this.playsData = playsData;
        this.render();
    }
    
    /**
     * Render the reviews view
     */
    render() {
        const container = document.getElementById('reviews-view');
        if (!container) return;
        
        // Filter plays that have reviews
        const playsWithReviews = this.playsData.filter(play => play.review && play.review.trim() !== '');
        
        if (playsWithReviews.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info mt-4" role="alert">
                    <i class="bi bi-info-circle me-2"></i>
                    No reviews found. Add reviews to your plays to see them here.
                </div>
            `;
            return;
        }
        
        console.log(`Rendering ${playsWithReviews.length} play reviews`);
        
        // Sort by review date (newest first)
        playsWithReviews.sort((a, b) => {
            const dateA = a.review_updated_at ? new Date(a.review_updated_at) : new Date(0);
            const dateB = b.review_updated_at ? new Date(b.review_updated_at) : new Date(0);
            return dateB - dateA;
        });
        
        // Create a list of reviews with links to individual review pages
        const reviewsList = playsWithReviews.map(play => {
            // Format the review date
            let reviewDate = 'Date not specified';
            if (play.review_updated_at) {
                const dateObj = new Date(play.review_updated_at);
                reviewDate = dateObj.toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric'
                });
            }
            
            // Format the play date
            let playDate = 'Date not specified';
            if (play.date) {
                const dateObj = new Date(play.date);
                playDate = dateObj.toLocaleDateString('en-GB', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric'
                });
            }
            
            // Get rating display
            const ratingDisplay = play.rating === 'Standing Ovation' ? 
                '<span class="badge bg-warning text-dark"><i class="bi bi-person-standing"></i> Standing Ovation</span>' :
                RatingDisplay.createStars(play.rating);
            
            // Get first paragraph of review for preview
            const firstParagraph = play.review.split('\n')[0].substring(0, 150) + (play.review.length > 150 ? '...' : '');
            
            return `
                <div class="col-lg-6 col-xl-4 mb-4">
                    <div class="card h-100 shadow-sm review-card" style="border: none; border-radius: 12px; overflow: hidden;">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h5 class="card-title mb-2" style="color: #7D2935; font-family: 'Playfair Display', Georgia, serif;">
                                        ${play.name}
                                    </h5>
                                    <p class="text-muted mb-1 small">
                                        <i class="bi bi-calendar-event me-1"></i>
                                        ${playDate}
                                    </p>
                                    ${play.theatre ? `
                                        <p class="text-muted mb-2 small">
                                            <i class="bi bi-building me-1"></i>
                                            ${play.theatre}
                                        </p>
                                    ` : ''}
                                </div>
                                <div class="text-end">
                                    ${ratingDisplay}
                                </div>
                            </div>
                            
                            <div class="review-preview mb-3" style="color: #666; line-height: 1.5;">
                                ${firstParagraph}
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">
                                    <i class="bi bi-clock me-1"></i>
                                    Review: ${reviewDate}
                                </small>
                                <a href="/review/${play.id}" class="btn btn-outline-primary btn-sm">
                                    <i class="bi bi-bookmark-star me-1"></i>
                                    Read Full Review
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Create the reviews list HTML
        container.innerHTML = `
            <div class="row mb-4">
                <div class="col-12">
                    <h2 class="h3 mb-3" style="color: #7D2935; font-family: 'Playfair Display', Georgia, serif;">
                        <i class="bi bi-bookmark-star me-2" style="color: #D4AF37;"></i>
                        All Reviews
                    </h2>
                    <p class="text-muted mb-4">Click on any review to read the full version with sharing options.</p>
                </div>
            </div>
            
            <div class="row">
                ${reviewsList}
            </div>
        `;
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        console.log('Attaching review event listeners');
        
        // No event listeners needed for the new list view
        // Each review card links directly to /review/{id}
    }
}