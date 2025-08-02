/**
 * Component for adding and editing plays
 */
class AddPlayForm {
    constructor() {
        this.modal = null;
        this.modalElement = null;
        this.theatres = [];
        this.form = null;
        this.initialized = false;
        this.editMode = false;
        this.currentPlayId = null;
        
        console.log('AddPlayForm component created');
    }
    
    /**
     * Initialize the form component
     */
    initialize() {
        if (this.initialized) return;
        
        console.log('Initializing AddPlayForm component');
        
        // Create modal element if it doesn't exist
        if (!document.getElementById('add-play-modal')) {
            this.createModalElement();
        }
        
        this.modalElement = document.getElementById('add-play-modal');
        this.modal = new bootstrap.Modal(this.modalElement);
        this.form = document.getElementById('add-play-form');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Create rating input after the form is rendered
        console.log('AddPlayForm: Creating RatingInput with options object');
        this.ratingInput = new RatingInput({
            containerId: 'play-rating-container',
            onChange: (value) => {
                console.log('Rating changed:', value, 'type:', typeof value);
                console.log('Rating changed (stringified):', JSON.stringify(value));
                document.getElementById('play-rating').value = value;
                console.log('Hidden input value after setting:', document.getElementById('play-rating').value);
            }
        });
        console.log('AddPlayForm: RatingInput created successfully:', this.ratingInput);
        
        this.initialized = true;
    }
    
    /**
     * Create the modal element in the DOM
     */
    createModalElement() {
        const modalElement = document.createElement('div');
        modalElement.className = 'modal fade';
        modalElement.id = 'add-play-modal';
        modalElement.tabIndex = '-1';
        modalElement.setAttribute('aria-labelledby', 'add-play-modal-label');
        modalElement.setAttribute('aria-hidden', 'true');
        
        modalElement.innerHTML = `
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="add-play-modal-label">Add New Play</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="add-play-form" novalidate>
                            <input type="hidden" id="play-id">
                            <div class="mb-3">
                                <label for="play-name" class="form-label">Play Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="play-name" required>
                                <div class="invalid-feedback">Please enter a play name</div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="play-date" class="form-label">Date <span class="text-danger">*</span></label>
                                <input type="date" class="form-control" id="play-date" required>
                                <div class="invalid-feedback">Please select a date</div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="play-theatre" class="form-label">Theatre</label>
                                <input type="text" class="form-control" id="play-theatre" list="theatre-suggestions">
                                <datalist id="theatre-suggestions"></datalist>
                            </div>
                            
                            <div class="mb-3">
                                <label for="play-rating" class="form-label">Rating</label>
                                <input type="hidden" id="play-rating" name="rating" />
                                <div id="play-rating-container"></div>
                            </div>
                            
                            <div class="mb-3">
                                <label for="play-image" class="form-label">Image URL</label>
                                <input type="url" class="form-control" id="play-image">
                                <div class="form-text">Enter a URL for the play's image</div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer d-flex justify-content-between">
                        <div class="edit-buttons d-none">
                            <button type="button" class="btn btn-danger" id="delete-play-btn">
                                <i class="bi bi-trash"></i> Delete
                            </button>
                            <button type="button" class="btn btn-warning" id="reset-rating-btn">
                                Reset Rating
                            </button>
                        </div>
                        <div class="ms-auto">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="save-play-btn">Save Play</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modalElement);
    }
    
    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        console.log('Setting up AddPlayForm event listeners');
        
        // Save button
        const saveButton = document.getElementById('save-play-btn');
        saveButton.addEventListener('click', () => {
            this.savePlay();
        });
        
        // Form submit
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePlay();
        });
        
        // Modal events - COMPLETE RECREATION APPROACH
        this.modalElement.addEventListener('hidden.bs.modal', () => {
            console.log('Modal hidden, destroying and recreating modal');
            
            // Reset state variables first
            this.editMode = false;
            this.currentPlayId = null;
            
            // Completely destroy the modal instance
            this.modal.dispose();
            
            // Remove the modal element
            this.modalElement.remove();
            
            // Recreate the modal element
            this.createModalElement();
            
            // Reinitialize
            this.modalElement = document.getElementById('add-play-modal');
            this.modal = new bootstrap.Modal(this.modalElement);
            this.form = document.getElementById('add-play-form');
            
            // Reattach event listeners
            this.setupEventListeners();
            
            console.log('Modal recreated with fresh state');
        });
        
        // Delete button
        const deleteButton = document.getElementById('delete-play-btn');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => this.confirmDeletePlay());
        }
        
        // Reset rating button - MODIFIED
        document.getElementById('reset-rating-btn').addEventListener('click', () => {
            // Just reset the rating input locally without showing a toast
            this.ratingInput.clear();
            document.getElementById('play-rating').value = '';
            console.log('Rating cleared. Changes will be saved when you click Update Play');
            
            // Show a message that indicates it's not saved yet
            const warningToast = new bootstrap.Toast(document.getElementById('warning-toast') || this.createWarningToast());
            document.getElementById('warning-toast-message').textContent = 'Rating reset. Click Update Play to save changes.';
            warningToast.show();
        });
        
        // Listen for edit play events
        document.addEventListener('editPlay', (e) => {
            const playId = e.detail.playId;
            this.editPlay(playId);
        });
        
        // Listen for add play events
        document.addEventListener('showAddPlayForm', () => {
            this.showAddForm();
        });
    }
    
    /**
     * Show the form in add mode
     */
    showAddForm() {
        if (!this.initialized) {
            this.initialize();
        }
        
        // Ensure we're not in edit mode
        this.editMode = false;
        this.currentPlayId = null;
        
        // Reset form in case it was previously used
        this.resetForm();
        
        // Load theatre suggestions
        this.loadTheatres();
        
        // Show the modal
        this.modal.show();
    }
    
    /**
     * Edit an existing play
     * @param {number} playId - The ID of the play to edit
     */
    async editPlay(playId) {
        try {
            if (!this.initialized) {
                this.initialize();
            }
            
            console.log(`Editing play with ID: ${playId}`);
            console.log('Previous play ID:', this.currentPlayId);
            console.log('Is this a different play than last time?', playId !== this.currentPlayId);
            
            // Get play data
            const play = await SupabaseService.getPlayById(playId);
            console.log('Play data fetched:', play);
            console.log('Rating from database (raw):', play.rating, 'type:', typeof play.rating);
            
            if (!play) {
                console.error('Play not found');
                return;
            }
            
            // Set edit mode
            this.editMode = true;
            this.currentPlayId = playId;
            
            // Reset the form first to clear previous data
            this.resetForm();
            console.log('Form reset, now loading new play data');
            
            // Update UI for edit mode
            document.getElementById('add-play-modal-label').textContent = 'Edit Play';
            document.getElementById('save-play-btn').textContent = 'Update Play';
            
            // Show edit-specific buttons
            const editButtons = document.querySelector('.edit-buttons');
            if (editButtons) {
                editButtons.classList.remove('d-none');
            }
            
            // Load play data into form
            this.loadPlayData(play);
            
            // Load theatre suggestions
            this.loadTheatres();
            
            // Show the modal
            this.modal.show();
            
            // Recreate the rating input to ensure it's fresh
            const ratingContainer = document.getElementById('play-rating-container');
            if (ratingContainer) {
                // Clear the container first
                ratingContainer.innerHTML = '';
                
                // Create a new rating input
                this.ratingInput = new RatingInput({
                    containerId: 'play-rating-container',
                    onChange: (value) => {
                        console.log('Rating changed:', value);
                        document.getElementById('play-rating').value = value;
                    }
                });
                
                console.log('Rating input recreated');
            }
            
            // Parse the rating value properly for the rating input
            let ratingValue = null;
            if (play.rating !== null && play.rating !== undefined && play.rating !== '') {
                // Parse the string rating to a number if it's a numeric string
                if (typeof play.rating === 'string' && !isNaN(parseFloat(play.rating))) {
                    ratingValue = parseFloat(play.rating);
                    console.log(`Parsed string rating "${play.rating}" to number:`, ratingValue);
                } else {
                    ratingValue = play.rating;
                    console.log(`Using rating as-is:`, ratingValue);
                }
            }
            
            // Set the rating input value after parsing
            console.log('Setting rating input value to:', ratingValue);
            
            // Add a small delay to let the new rating input initialize
            setTimeout(() => {
                this.ratingInput.setValue(ratingValue);
                console.log('Rating value set after delay');
            }, 100);
            
        } catch (error) {
            console.error('Error editing play:', error);
            alert(`Error editing play: ${error.message}`);
        }
    }
    
    /**
     * Load play data into the form
     * @param {Object} play - The play data
     */
    loadPlayData(play) {
        console.log('Loading play data into form:', play);
        
        // Set basic fields
        document.getElementById('play-id').value = play.id;
        document.getElementById('play-name').value = play.name || '';
        
        // Format date for the input
        if (play.date) {
            const date = new Date(play.date);
            if (!isNaN(date.getTime())) {
                const formattedDate = date.toISOString().split('T')[0];
                document.getElementById('play-date').value = formattedDate;
            }
        }
        
        document.getElementById('play-theatre').value = play.theatre || '';
        
        // Set rating
        const ratingSelect = document.getElementById('play-rating');
        if (play.rating !== null && play.rating !== undefined) {
            console.log(`Setting rating select to: ${play.rating}`);
            // Convert "Standing Ovation" to "standing" for the RatingInput component
            if (play.rating === 'Standing Ovation') {
                ratingSelect.value = 'standing';
            } else {
                ratingSelect.value = play.rating.toString();
            }
        } else {
            ratingSelect.value = '';
        }
        
        document.getElementById('play-image').value = play.image || '';
    }
    
    /**
     * Reset the form to its initial state
     */
    resetForm() {
        console.log('Resetting form');
        
        // Reset form validation
        this.form.classList.remove('was-validated');
        
        // Clear form fields
        document.getElementById('play-id').value = '';
        document.getElementById('play-name').value = '';
        document.getElementById('play-date').value = '';
        document.getElementById('play-theatre').value = '';
        document.getElementById('play-rating').value = '';
        document.getElementById('play-image').value = '';
        
        // Clear the rating input
        this.ratingInput.clear();
        
        console.log('Form fields have been cleared');
    }
    
    /**
     * Save or update a play
     */
    async savePlay() {
        console.log('savePlay called, editMode =', this.editMode);
        
        // Validate form
        this.form.classList.add('was-validated');
        if (!this.form.checkValidity()) {
            console.log('Form validation failed');
            return;
        }
        
        try {
            // Get form values
            const name = document.getElementById('play-name').value.trim();
            const date = document.getElementById('play-date').value;
            const theatre = document.getElementById('play-theatre').value.trim();
            const rating = document.getElementById('play-rating').value;
            
            console.log('Rating from form (raw):', rating, 'type:', typeof rating);
            console.log('Rating from form (stringified):', JSON.stringify(rating));
            console.log('Rating from form (length):', rating ? rating.length : 'null/undefined');
            
            // Handle rating value - support both numbers and "Standing Ovation"
            let parsedRating = null;
            if (rating !== null && rating !== '' && rating !== undefined) {
                if (rating === 'standing') {
                    parsedRating = 'Standing Ovation'; // Convert to the expected database format
                } else {
                    parsedRating = parseFloat(rating); // Use parseFloat to preserve decimals
                }
                console.log('Parsed rating:', parsedRating, 'type:', typeof parsedRating);
            }
            
            const image = document.getElementById('play-image').value.trim();
            
            // Create play object
            const play = {
                name: name,
                date: date,
                theatre: theatre || null,
                rating: parsedRating, // Use the properly parsed rating
                image: image || null
            };
            
            console.log('Saving play with rating:', play.rating, 'type:', typeof play.rating);
            console.log('Full play object being saved:', JSON.stringify(play, null, 2));
            
            // Add ID if editing
            if (this.editMode) {
                play.id = this.currentPlayId;
            }
            
            // Show loading state
            const saveButton = document.getElementById('save-play-btn');
            saveButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> ${this.editMode ? 'Updating...' : 'Saving...'}`;
            saveButton.disabled = true;
            
            // Save to database
            let result;
            if (this.editMode) {
                result = await SupabaseService.updatePlay(play);
            } else {
                result = await SupabaseService.addPlay(play);
            }
            
            console.log('Save result with rating:', result.rating, 'type:', typeof result.rating);
            console.log('Full result object from database:', JSON.stringify(result, null, 2));
            
            // Hide modal
            this.modal.hide();
            
            // Show success message
            this.showSuccessToast(this.editMode ? 'Play updated successfully!' : 'Play added successfully!');
            
            // Dispatch event to refresh data
            const eventName = this.editMode ? 'playUpdated' : 'playAdded';
            document.dispatchEvent(new CustomEvent(eventName, { detail: { play: result } }));
        } catch (error) {
            console.error('Error saving play:', error);
            alert(`Error saving play: ${error.message}`);
            
            // Reset button
            const saveButton = document.getElementById('save-play-btn');
            saveButton.innerHTML = this.editMode ? 'Update Play' : 'Save Play';
            saveButton.disabled = false;
        }
    }
    
    /**
     * Confirm and delete the current play
     */
    confirmDeletePlay() {
        if (!this.editMode || !this.currentPlayId) return;
        
        if (confirm('Are you sure you want to delete this play? This action cannot be undone.')) {
            this.deletePlay();
        }
    }
    
    /**
     * Delete the current play
     */
    async deletePlay() {
        try {
            console.log(`Deleting play ID: ${this.currentPlayId}`);
            
            // Show loading state
            const deleteButton = document.getElementById('delete-play-btn');
            deleteButton.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Deleting...`;
            deleteButton.disabled = true;
            
            // Delete from database
            await SupabaseService.deletePlay(this.currentPlayId);
            
            // Hide modal
            this.modal.hide();
            
            // Show success message
            this.showSuccessToast('Play deleted successfully!');
            
            // Dispatch event to refresh data
            document.dispatchEvent(new CustomEvent('playDeleted', { 
                detail: { playId: this.currentPlayId } 
            }));
        } catch (error) {
            console.error('Error deleting play:', error);
            alert(`Error deleting play: ${error.message}`);
            
            // Reset button
            const deleteButton = document.getElementById('delete-play-btn');
            deleteButton.innerHTML = '<i class="bi bi-trash"></i> Delete';
            deleteButton.disabled = false;
        }
    }
    
    /**
     * Show a success toast message
     * @param {string} message - The message to display
     */
    showSuccessToast(message) {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast
        const toastId = 'toast-' + Date.now();
        const toastElement = document.createElement('div');
        toastElement.className = 'toast';
        toastElement.id = toastId;
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');
        
        toastElement.innerHTML = `
            <div class="toast-header bg-success text-white">
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong class="me-auto">Success</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;
        
        // Add to container and show
        toastContainer.appendChild(toastElement);
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();
        
        // Remove after hidden
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
    
    /**
     * Load theatre suggestions for autocomplete
     */
    async loadTheatres() {
        try {
            console.log('Loading theatres...');
            
            // Create a fallback solution by using existing SupabaseService methods
            // Since SupabaseService has other methods, we'll use it to query plays
            const plays = await SupabaseService.fetchPlays();
            console.log('Fetched plays for theatre extraction:', plays.length);
            
            // Extract unique theatre names from the plays we already have
            const theatres = [...new Set(plays
                .map(play => play.theatre)
                .filter(theatre => theatre && theatre.trim() !== '')
            )].sort();
            
            console.log(`Extracted ${theatres.length} unique theatres from plays`);
            
            // Update the datalist
            const datalist = document.getElementById('theatre-suggestions');
            if (datalist) {
                datalist.innerHTML = '';
                
                // Add each theatre as an option
                theatres.forEach(theatre => {
                    const option = document.createElement('option');
                    option.value = theatre;
                    datalist.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading theatres:', error);
        }
    }
    
    /**
     * Create warning toast element
     * @returns {HTMLElement} The warning toast element
     */
    createWarningToast() {
        const toastElement = document.createElement('div');
        toastElement.className = 'toast align-items-center text-white bg-warning border-0 position-fixed bottom-0 end-0 m-3';
        toastElement.id = 'warning-toast';
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');
        
        toastElement.innerHTML = `
            <div class="d-flex">
                <div class="toast-body" id="warning-toast-message">
                    Warning message here
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        document.body.appendChild(toastElement);
        return toastElement;
    }
} 