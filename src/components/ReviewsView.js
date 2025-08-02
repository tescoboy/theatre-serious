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
        
        // Handle case when no specific review was found
        if (this.currentReviewIndex === -1) {
            container.innerHTML = `
                <div class="alert alert-warning" role="alert">
                    <h4 class="alert-heading">Review Not Found</h4>
                    <p>The requested review doesn't exist or has been removed.</p>
                    <hr>
                    <a href="/reviews" class="btn btn-primary">Back to All Reviews</a>
                </div>
            `;
            return;
        }
        
        // Ensure current index is valid
        if (this.currentReviewIndex >= playsWithReviews.length) {
            this.currentReviewIndex = 0;
        }
        
        // Sort by review date (newest first)
        playsWithReviews.sort((a, b) => {
            const dateA = a.review_updated_at ? new Date(a.review_updated_at) : new Date(0);
            const dateB = b.review_updated_at ? new Date(b.review_updated_at) : new Date(0);
            return dateB - dateA;
        });
        
        // Get current review
        const currentPlay = playsWithReviews[this.currentReviewIndex];
        
        // Format the review date
        let reviewDate = 'Date not specified';
        if (currentPlay.review_updated_at) {
            const dateObj = new Date(currentPlay.review_updated_at);
            reviewDate = dateObj.toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric'
            });
        }
        
        // Format the play date
        let playDate = 'Date not specified';
        if (currentPlay.date) {
            const dateObj = new Date(currentPlay.date);
            playDate = dateObj.toLocaleDateString('en-GB', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric'
            });
        }
        
        // Format review paragraphs
        const formattedReview = currentPlay.review
            .split('\n')
            .filter(p => p.trim() !== '')
            .map(p => `<p>${p}</p>`)
            .join('');
        
        // Create the review HTML with premium magazine-style layout
        container.innerHTML = `
            <div class="review-container">
                <!-- Navigation and counter -->
                <div class="review-navigation mb-4">
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn ${this.currentReviewIndex === 0 ? 'btn-outline-secondary' : 'btn-outline-primary'} review-nav-btn" 
                                id="prev-review-btn" ${this.currentReviewIndex === 0 ? 'disabled' : ''}>
                            <i class="bi bi-arrow-left"></i> Previous
                        </button>
                        <div class="review-counter">Review ${this.currentReviewIndex + 1} of ${playsWithReviews.length}</div>
                        <button class="btn ${this.currentReviewIndex === playsWithReviews.length - 1 ? 'btn-outline-secondary' : 'btn-outline-primary'} review-nav-btn" 
                                id="next-review-btn" ${this.currentReviewIndex === playsWithReviews.length - 1 ? 'disabled' : ''}>
                            Next <i class="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Play title and rating -->
                <div class="review-header mb-4">
                    <h1 class="display-4 fw-bold mb-3">${currentPlay.name}</h1>
                    
                    ${currentPlay.rating ? `
                    <div class="review-rating my-4">
                        <div class="rating-display-large">
                            ${new RatingDisplay(currentPlay.rating, { size: 'lg' }).render()}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="review-meta d-flex align-items-center text-muted mb-4">
                        <div class="venue me-4">
                            <i class="bi bi-building me-2"></i> ${currentPlay.theatre || 'Theatre not specified'}
                        </div>
                        <div class="date">
                            <i class="bi bi-calendar3 me-2"></i> ${playDate}
                        </div>
                    </div>
                </div>
                
                <!-- Hero image -->
                <div class="review-hero mb-5">
                    <img src="${currentPlay.image || 'https://placehold.co/1200x500/f3e9ea/7D2935?text=No+Image'}" 
                         class="img-fluid rounded shadow-lg" alt="${currentPlay.name}">
                </div>
                
                <!-- Review content -->
                <div class="review-content-wrapper">
                    <div class="review-content">
                        ${formattedReview}
                    </div>
                    
                    <div class="review-footer mt-5 pt-4 border-top d-flex justify-content-between align-items-center">
                        <div class="text-muted">
                            <small><i class="bi bi-pen me-1"></i> Review written: ${reviewDate}</small>
                        </div>
                        <button class="btn btn-primary edit-review-btn" data-play-id="${currentPlay.id}">
                            <i class="bi bi-pencil"></i> Edit Review
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        this.attachEventListeners();
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        console.log('Attaching review navigation event listeners');
        
        // Previous review button
        const prevButton = document.getElementById('prev-review-btn');
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                console.log('Previous review button clicked');
                if (this.currentReviewIndex > 0) {
                    this.currentReviewIndex--;
                    const playsWithReviews = this.playsData.filter(play => play.review && play.review.trim() !== '');
                    const prevPlay = playsWithReviews[this.currentReviewIndex];
                    const prevPlayUrl = `/review/${prevPlay.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                    window.history.pushState({}, '', prevPlayUrl);
                    this.render();
                }
            });
        } else {
            console.error('Previous review button not found');
        }
        
        // Next review button
        const nextButton = document.getElementById('next-review-btn');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                console.log('Next review button clicked');
                const playsWithReviews = this.playsData.filter(play => play.review && play.review.trim() !== '');
                if (this.currentReviewIndex < playsWithReviews.length - 1) {
                    this.currentReviewIndex++;
                    const nextPlay = playsWithReviews[this.currentReviewIndex];
                    const nextPlayUrl = `/review/${nextPlay.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                    window.history.pushState({}, '', nextPlayUrl);
                    this.render();
                }
            });
        } else {
            console.error('Next review button not found');
        }
        
        // Edit review button
        const editButton = document.querySelector('.edit-review-btn');
        if (editButton) {
            editButton.addEventListener('click', () => {
                const playId = parseInt(editButton.getAttribute('data-play-id'));
                document.dispatchEvent(new CustomEvent('showPlayReview', { 
                    detail: { playId: playId }
                }));
            });
        }
    }
}