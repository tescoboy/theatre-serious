/**
 * Component for displaying all play reviews
 */
class ReviewsView {
    constructor() {
        this.playsData = [];
        this.currentReviewIndex = 0;
        this.initialized = false;
        this.router = null; // Will be set by router integration
        this.currentReview = null; // Added to store specific review for URL navigation
        this.sortedReviewsCache = null; // Cache for sorted reviews
        this.lastPlaysDataLength = 0; // Track if data changed
        
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
     * Set router instance for navigation
     */
    setRouter(router) {
        this.router = router;
    }
    
    /**
     * Generate pretty URL for a review
     */
    generateReviewUrl(review) {
        const slug = this.slugify(`${review.name} ${review.theatre || ''}`);
        const year = new Date(review.date || review.review_updated_at).getFullYear();
        return `#/reviews/${year}/${slug}`;
    }
    
    /**
     * Simple slugify function
     */
    slugify(text) {
        return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
            .toLowerCase().replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "").replace(/-+/g, "-");
    }
    
    /**
     * Get sorted plays with reviews (cached for performance)
     */
    getSortedReviews() {
        // Check if cache is still valid
        if (this.sortedReviewsCache && this.lastPlaysDataLength === this.playsData.length) {
            console.log('Using cached sorted reviews');
            return this.sortedReviewsCache;
        }
        
        console.log('Regenerating sorted reviews cache');
        // Filter and sort
        const playsWithReviews = this.playsData.filter(play => play.review && play.review.trim() !== '');
        this.sortPlaysWithReviews(playsWithReviews);
        
        // Cache the result
        this.sortedReviewsCache = playsWithReviews;
        this.lastPlaysDataLength = this.playsData.length;
        
        return playsWithReviews;
    }
    
    /**
     * Sort plays with reviews by date (newest first)
     */
    sortPlaysWithReviews(playsWithReviews) {
        return playsWithReviews.sort((a, b) => {
            const dateA = a.review_updated_at ? new Date(a.review_updated_at) : new Date(0);
            const dateB = b.review_updated_at ? new Date(b.review_updated_at) : new Date(0);
            return dateB - dateA;
        });
    }
    
    /**
     * Set plays data
     * @param {Array} playsData - Array of play data
     */
    setPlaysData(playsData) {
        console.log(`Setting plays data in ReviewsView: ${playsData.length} plays`);
        this.playsData = playsData;
        // Invalidate cache when data changes
        this.sortedReviewsCache = null; 
        this.lastPlaysDataLength = 0;
        this.render();
    }
    
    /**
     * Find review by slug and year
     */
    findReviewBySlug(slug, year) {
        console.log(`Finding review by slug: ${slug}, year: ${year}`);
        const playsWithReviews = this.getSortedReviews();
        console.log(`Total plays with reviews: ${playsWithReviews.length}`);
        
        // Use findIndex for better performance (stops on first match)
        const foundIndex = playsWithReviews.findIndex(play => {
            const playSlug = this.slugify(`${play.name} ${play.theatre || ''}`);
            const playYear = new Date(play.date || play.review_updated_at).getFullYear();
            return playSlug === slug && playYear.toString() === year;
        });
        
        if (foundIndex !== -1) {
            console.log(`Found matching review: ${playsWithReviews[foundIndex].name} at index ${foundIndex}`);
            this.currentReviewIndex = foundIndex;
            return playsWithReviews[foundIndex];
        }
        
        console.log('No matching review found');
        return null;
    }
    
    /**
     * Show specific review by slug and year
     */
    showReviewBySlug(slug, year) {
        const review = this.findReviewBySlug(slug, year);
        if (review) {
            // Store the specific review to show
            this.currentReview = review;
            this.render();
            return true;
        }
        return false;
    }
    
    /**
     * Render the reviews view
     */
    render() {
        const container = document.getElementById('reviews-view');
        if (!container) return;
        
        // Get sorted plays with reviews (cached)
        const playsWithReviews = this.getSortedReviews();
        
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
        
        // If we have a specific review to show (from URL), use it and find its position
        let currentPlay;
        if (this.currentReview) {
            currentPlay = this.currentReview;
            // Find the position of this review in the sorted array
            const reviewIndex = playsWithReviews.findIndex(play => 
                play.id === this.currentReview.id
            );
            if (reviewIndex !== -1) {
                this.currentReviewIndex = reviewIndex;
            }
            // Clear the currentReview so next renders work normally
            this.currentReview = null;
        } else {
            // Get current review
            currentPlay = playsWithReviews[this.currentReviewIndex];
        }
        
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
        
        // Debug: Log current review and navigation URLs
        console.log('=== NAVIGATION DEBUG ===');
        console.log('Current review index:', this.currentReviewIndex);
        console.log('Current review:', currentPlay.name);
        console.log('Current review URL:', this.generateReviewUrl(currentPlay));
        
        if (this.currentReviewIndex > 0) {
            const prevReview = playsWithReviews[this.currentReviewIndex - 1];
            console.log('Previous review:', prevReview.name);
            console.log('Previous review URL:', this.generateReviewUrl(prevReview));
        }
        
        if (this.currentReviewIndex < playsWithReviews.length - 1) {
            const nextReview = playsWithReviews[this.currentReviewIndex + 1];
            console.log('Next review:', nextReview.name);
            console.log('Next review URL:', this.generateReviewUrl(nextReview));
        }
        console.log('=== END DEBUG ===');

        // Create the review HTML with premium magazine-style layout
        container.innerHTML = `
            <div class="review-container">
                
                <!-- Navigation and counter -->
                <div class="review-navigation mb-4">
                    <div class="d-flex justify-content-between align-items-center">
                        ${this.currentReviewIndex > 0 ? `
                            <a href="${this.generateReviewUrl(playsWithReviews[this.currentReviewIndex - 1])}" 
                               class="btn btn-outline-primary review-nav-btn" data-nav="spa">
                                <i class="bi bi-arrow-left"></i> Previous
                            </a>
                        ` : `
                            <button class="btn btn-outline-secondary review-nav-btn" disabled>
                                <i class="bi bi-arrow-left"></i> Previous
                            </button>
                        `}
                        <div class="review-counter">Review ${this.currentReviewIndex + 1} of ${playsWithReviews.length}</div>
                        ${this.currentReviewIndex < playsWithReviews.length - 1 ? `
                            <a href="${this.generateReviewUrl(playsWithReviews[this.currentReviewIndex + 1])}" 
                               class="btn btn-outline-primary review-nav-btn" data-nav="spa">
                                Next <i class="bi bi-arrow-right"></i>
                            </a>
                        ` : `
                            <button class="btn btn-outline-secondary review-nav-btn" disabled>
                                Next <i class="bi bi-arrow-right"></i>
                            </button>
                        `}
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
                        <div class="d-flex gap-2">
                            <button class="btn btn-success copy-link-btn">
                                <i class="bi bi-link-45deg"></i> Copy link
                            </button>
                            <button class="btn btn-primary edit-review-btn" data-play-id="${currentPlay.id}">
                                <i class="bi bi-pencil"></i> Edit Review
                            </button>
                        </div>
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
        
        // Copy link button
        const copyLinkButton = document.querySelector('.copy-link-btn');
        if (copyLinkButton) {
            copyLinkButton.addEventListener('click', () => {
                const playsWithReviews = this.playsData.filter(play => play.review && play.review.trim() !== '');
                // Sort the array the same way as in render() and findReviewBySlug()
                this.sortPlaysWithReviews(playsWithReviews);
                const currentPlay = playsWithReviews[this.currentReviewIndex];
                this.shareReview(currentPlay);
            });
        }
    }
    
    /**
     * Copy review URL to clipboard (hash-based)
     */
    shareReview(review) {
        const slug = this.slugify(`${review.name} ${review.theatre || ''}`);
        const year = new Date(review.date || review.review_updated_at).getFullYear();
        const url = location.origin + location.pathname + `#/reviews/${year}/${slug}`;
        
        console.log('Copying review URL to clipboard:', url);
        
        // Copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            // Show a temporary success message
            const copyButton = document.querySelector('.copy-link-btn');
            if (copyButton) {
                const originalText = copyButton.innerHTML;
                copyButton.innerHTML = '<i class="bi bi-check"></i> Copied!';
                copyButton.classList.remove('btn-success');
                copyButton.classList.add('btn-outline-success');
                
                setTimeout(() => {
                    copyButton.innerHTML = originalText;
                    copyButton.classList.remove('btn-outline-success');
                    copyButton.classList.add('btn-success');
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy URL to clipboard:', err);
            // Fallback: show the URL in an alert
            alert(`Review URL: ${url}`);
        });
    }
}