/**
 * Component for viewing and editing play reviews
 */
class PlayReviewForm {
    constructor() {
        this.modal = null;
        this.modalElement = null;
        this.form = null;
        this.initialized = false;
        this.editMode = false;
        this.currentPlay = null;
        
        console.log('PlayReviewForm component created');
    }
    
    /**
     * Initialize the review form component
     */
    initialize() {
        if (this.initialized) return;
        
        console.log('Initializing PlayReviewForm component');
        
        // Create modal element if it doesn't exist
        if (!document.getElementById('play-review-modal')) {
            this.createModalElement();
        }
        
        this.modalElement = document.getElementById('play-review-modal');
        this.modal = new bootstrap.Modal(this.modalElement);
        this.form = document.getElementById('play-review-form');
        
        // Set up event listeners
        this.setupEventListeners();
        
        this.initialized = true;
    }
    
    /**
     * Create the modal element in the DOM
     */
    createModalElement() {
        const modalElement = document.createElement('div');
        modalElement.className = 'modal fade';
        modalElement.id = 'play-review-modal';
        modalElement.tabIndex = '-1';
        modalElement.setAttribute('aria-labelledby', 'play-review-modal-label');
        modalElement.setAttribute('aria-hidden', 'true');
        
        modalElement.innerHTML = `
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="play-review-modal-label">Play Review</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-0">
                        <div class="row g-0">
                            <div class="col-md-5 d-none d-md-block">
                                <div class="play-review-image-container h-100">
                                    <img id="review-play-image" src="https://placehold.co/600x800/f3e9ea/7D2935?text=No+Image" 
                                         class="img-fluid h-100 w-100 object-fit-cover" alt="Play Poster">
                                </div>
                            </div>
                            <div class="col-12 col-md-7">
                                <div class="p-4">
                                    <h3 id="review-play-title" class="display-6 fw-bold mb-0">Play Title</h3>
                                    <div class="d-flex mb-3">
                                        <div id="review-play-theatre" class="text-muted me-3">Theatre</div>
                                        <div id="review-play-date" class="text-muted">Date</div>
                                    </div>
                                    <div id="review-play-rating" class="mb-4"></div>
                                    
                                    <div id="review-display" class="mb-3">
                                        <h5 class="text-uppercase border-bottom pb-2 mb-3">Your Review</h5>
                                        <p id="review-text" class="lead review-content">No review yet. Add your thoughts about this play.</p>
                                        <small id="review-date" class="text-muted"></small>
                                    </div>
                                    
                                    <form id="play-review-form" class="d-none">
                                        <div class="mb-3">
                                            <label for="play-review" class="form-label">Your Review</label>
                                            <textarea class="form-control" id="play-review" rows="6" placeholder="What did you think of this play?"></textarea>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-between">
                        <button type="button" class="btn btn-link text-decoration-none" id="toggle-edit-review-btn">
                            <i class="bi bi-pencil-square"></i> Edit Review
                        </button>
                        <div>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary d-none" id="save-review-btn">Save Review</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalElement);
    }
    
    /**
     * Set up event listeners for the review form
     */
    setupEventListeners() {
        console.log('Setting up PlayReviewForm event listeners');
        
        // Toggle edit mode
        const toggleButton = document.getElementById('toggle-edit-review-btn');
        toggleButton.addEventListener('click', () => {
            console.log('Toggle edit review button clicked');
            this.toggleEditMode();
        });
        
        // Save button
        const saveButton = document.getElementById('save-review-btn');
        saveButton.addEventListener('click', () => {
            console.log('Save review button clicked');
            this.saveReview();
        });
        
        // Listen for show review events
        document.addEventListener('showPlayReview', (e) => {
            console.log('showPlayReview event received', e.detail);
            const playId = e.detail.playId;
            this.showReview(playId);
        });
        
        // Reset form on modal close
        this.modalElement.addEventListener('hidden.bs.modal', () => {
            console.log('Review modal hidden, resetting form');
            this.resetForm();
        });
    }
    
    /**
     * Show the review for a play
     * @param {number} playId - The ID of the play to show the review for
     */
    async showReview(playId) {
        try {
            if (!this.initialized) {
                this.initialize();
            }
            
            console.log(`Showing review for play ID: ${playId}`);
            
            // Get play data
            const play = await SupabaseService.getPlayById(playId);
            if (!play) {
                console.error('Play not found');
                return;
            }
            
            this.currentPlay = play;
            
            // Update UI with play information
            this.updatePlayInfo(play);
            
            // Exit edit mode
            this.editMode = false;
            this.updateEditMode();
            
            // Show the modal
            this.modal.show();
        } catch (error) {
            console.error('Error showing review:', error);
            alert(`Error showing review: ${error.message}`);
        }
    }
    
    /**
     * Update the play information in the UI
     * @param {Object} play - The play data
     */
    updatePlayInfo(play) {
        console.log('Updating play info in review form:', play);
        
        // Update play details
        document.getElementById('review-play-title').textContent = play.name || 'Untitled Play';
        document.getElementById('review-play-theatre').textContent = play.theatre || 'Theatre not specified';
        
        // Format and update date
        let dateText = 'Date not specified';
        if (play.date) {
            const dateObj = new Date(play.date);
            dateText = dateObj.toLocaleDateString();
        }
        document.getElementById('review-play-date').textContent = dateText;
        
        // Update image
        document.getElementById('review-play-image').src = play.image || 'https://placehold.co/600x800/f3e9ea/7D2935?text=No+Image';
        
        // Update review text
        document.getElementById('review-text').textContent = play.review || 'No review yet. Add your thoughts about this play.';
        document.getElementById('play-review').value = play.review || '';
        
        // Update review date if available
        let reviewDateText = '';
        if (play.review_updated_at) {
            const dateObj = new Date(play.review_updated_at);
            reviewDateText = `Last updated: ${dateObj.toLocaleDateString()}`;
        }
        document.getElementById('review-date').textContent = reviewDateText;
        
        // Update rating display
        const ratingContainer = document.getElementById('review-play-rating');
        if (play.rating) {
            const ratingDisplay = new RatingDisplay(play.rating);
            ratingContainer.innerHTML = ratingDisplay.render();
        } else {
            ratingContainer.innerHTML = '<span class="text-muted">Not rated yet</span>';
        }
    }
    
    /**
     * Toggle edit mode for the review
     */
    toggleEditMode() {
        this.editMode = !this.editMode;
        this.updateEditMode();
    }
    
    /**
     * Update the UI based on the current edit mode
     */
    updateEditMode() {
        console.log('Updating edit mode:', this.editMode);
        
        const reviewDisplay = document.getElementById('review-display');
        const reviewForm = document.getElementById('play-review-form');
        const toggleButton = document.getElementById('toggle-edit-review-btn');
        const saveButton = document.getElementById('save-review-btn');
        
        if (this.editMode) {
            // Switch to edit mode
            reviewDisplay.classList.add('d-none');
            reviewForm.classList.remove('d-none');
            toggleButton.innerHTML = '<i class="bi bi-x-circle"></i> Cancel';
            saveButton.classList.remove('d-none');
        } else {
            // Switch to view mode
            reviewDisplay.classList.remove('d-none');
            reviewForm.classList.add('d-none');
            toggleButton.innerHTML = '<i class="bi bi-pencil-square"></i> Edit Review';
            saveButton.classList.add('d-none');
        }
    }
    
    /**
     * Save the review
     */
    async saveReview() {
        try {
            console.log('saveReview method started');
            
            if (!this.currentPlay) {
                console.error('No play selected for review');
                return;
            }
            
            console.log('Current play before update:', this.currentPlay);
            const review = document.getElementById('play-review').value.trim();
            console.log('New review text:', review);
            
            // Show loading state
            const saveButton = document.getElementById('save-review-btn');
            saveButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
            saveButton.disabled = true;
            
            // Update play with new review
            const updatedPlay = {
                ...this.currentPlay,
                review: review,
                review_updated_at: new Date().toISOString()
            };
            
            console.log('Sending updatedPlay to DB:', updatedPlay);
            console.log('Review field in updatedPlay:', updatedPlay.review);
            console.log('Review field type:', typeof updatedPlay.review);
            console.log('Review field length:', updatedPlay.review ? updatedPlay.review.length : 0);
            
            // Save to database
            const result = await SupabaseService.updatePlay(updatedPlay);
            
            console.log('Review save result from DB:', result);
            console.log('Did the review save correctly?', result.review === review);
            
            // Update UI
            this.currentPlay = result;
            this.updatePlayInfo(result);
            
            // Exit edit mode
            this.editMode = false;
            this.updateEditMode();
            
            // Show success message
            this.showSuccessToast('Review saved successfully!');
            
            // Dispatch event to refresh play cards
            document.dispatchEvent(new CustomEvent('playUpdated', { 
                detail: { play: result } 
            }));
            
            // Navigate to the specific review page
            const year = new Date(result.date || result.review_updated_at).getFullYear();
            const slug = this.slugify(`${result.name} ${result.theatre || ''}`);
            const reviewUrl = `#/reviews/${year}/${slug}`;
            
            console.log('Navigating to review after save:', reviewUrl);
            
            // Simply reload the page with the correct URL
            window.location.hash = reviewUrl;
            window.location.reload();
        } catch (error) {
            console.error('Error saving review:', error);
            alert(`Error saving review: ${error.message}`);
        } finally {
            // Reset button
            const saveButton = document.getElementById('save-review-btn');
            saveButton.innerHTML = 'Save Review';
            saveButton.disabled = false;
        }
    }
    
    /**
     * Reset the form to its initial state
     */
    resetForm() {
        this.editMode = false;
        this.currentPlay = null;
        
        // Reset UI
        document.getElementById('review-play-title').textContent = 'Play Title';
        document.getElementById('review-play-theatre').textContent = 'Theatre';
        document.getElementById('review-play-date').textContent = 'Date';
        document.getElementById('review-play-image').src = 'https://placehold.co/600x800/f3e9ea/7D2935?text=No+Image';
        document.getElementById('review-play-rating').innerHTML = '';
        document.getElementById('review-text').textContent = 'No review yet.';
        document.getElementById('review-date').textContent = '';
        document.getElementById('play-review').value = '';
        
        // Reset edit mode
        this.updateEditMode();
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
     * Show a success toast message
     * @param {string} message - The message to show
     */
    showSuccessToast(message) {
        // Create toast if it doesn't exist
        if (!document.getElementById('review-success-toast')) {
            const toastElement = document.createElement('div');
            toastElement.className = 'toast align-items-center text-white bg-success border-0 position-fixed bottom-0 end-0 m-3';
            toastElement.id = 'review-success-toast';
            toastElement.setAttribute('role', 'alert');
            toastElement.setAttribute('aria-live', 'assertive');
            toastElement.setAttribute('aria-atomic', 'true');
            
            toastElement.innerHTML = `
                <div class="d-flex">
                    <div class="toast-body" id="review-success-toast-message">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            `;
            
            document.body.appendChild(toastElement);
        } else {
            document.getElementById('review-success-toast-message').textContent = message;
        }
        
        // Show the toast
        const toast = new bootstrap.Toast(document.getElementById('review-success-toast'));
        toast.show();
    }
} 