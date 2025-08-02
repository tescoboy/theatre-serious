/**
 * Main application controller
 */
class App {
    constructor() {
        // Initialize components
        this.navigation = new Navigation();
        this.dashboard = new Dashboard();
        this.allPlaysView = new AllPlaysView();
        this.calendarController = new CalendarController();
        this.allPlaysData = [];
        this.upcomingPlaysView = new UpcomingPlaysView();
        this.pastPlaysView = new PastPlaysView();
        this.unratedPlaysView = new UnratedPlaysView();
        this.addPlayForm = new AddPlayForm();
        this.playReviewForm = new PlayReviewForm();
        this.reviewsView = new ReviewsView();
        this.hallOfFameShameView = new HallOfFameShameView();
        
        // Listen for view changes
        document.addEventListener('viewChanged', (e) => this.handleViewChanged(e.detail.view));
        
        console.log('App initialized');
    }
    
    /**
     * Initialize the app
     */
    async initialize() {
        console.log('Initializing app...');
        
        try {
            // Initialize components
            this.addPlayForm.initialize();
            this.dashboard.initialize();
            this.pastPlaysView.initialize();
            
            // Initialize the review form
            this.playReviewForm.initialize();
            
            // Set up global event listeners
            this.setupEventListeners();
            
            // Fetch data
            await this.fetchPlaysData();
            
            // Initialize the starting view (dashboard)
            this.handleViewChanged('dashboard');
            
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
    
    /**
     * Handle view changes
     * @param {string} view - The view to switch to
     */
    handleViewChanged(view) {
        console.log(`Switching to view: ${view}`);
        
        // Create a mapping for special view cases
        const viewIdMap = {
            'past': 'past-plays-view',
            'upcoming': 'upcoming-plays-view',
            'unrated': 'unrated-plays-view',
            'table': 'table-view',
            'calendar': 'calendar-view'
        };
        
        // Get the correct element ID using the mapping or default format
        const elementId = viewIdMap[view] || `${view}-view`;
        
        // Hide all views - add specific view IDs
        document.getElementById('dashboard-view').classList.add('d-none');
        document.getElementById('table-view').classList.add('d-none');
        document.getElementById('calendar-view').classList.add('d-none');
        document.getElementById('upcoming-plays-view').classList.add('d-none');
        document.getElementById('past-plays-view').classList.add('d-none');
        document.getElementById('unrated-plays-view').classList.add('d-none');
        document.getElementById('reviews-view').classList.add('d-none');
        document.getElementById('hall-of-fame-shame-view').classList.add('d-none');
        
        // Show the selected view
        const viewEl = document.getElementById(elementId);
        if (viewEl) {
            viewEl.classList.remove('d-none');
            console.log(`Now showing view: ${elementId}`);
        } else {
            console.error(`View element not found: ${elementId}`);
        }
        
        // Initialize the appropriate view
        if (view === 'dashboard') {
            this.dashboard.setPlaysData(this.allPlaysData);
            this.dashboard.attachEventListeners();
        } else if (view === 'table') {
            // AllPlaysView already initialized
            this.allPlaysView.setPlaysData(this.allPlaysData);
        } else if (view === 'calendar') {
            this.calendarController.initialize();
            this.calendarController.setPlaysData(this.allPlaysData);
        } else if (view === 'upcoming') {
            this.upcomingPlaysView.initialize();
            this.upcomingPlaysView.setPlaysData(this.allPlaysData);
        } else if (view === 'past') {
            this.pastPlaysView.initialize();
            this.pastPlaysView.setPlaysData(this.allPlaysData);
        } else if (view === 'unrated') {
            this.unratedPlaysView.initialize();
            this.unratedPlaysView.setPlaysData(this.allPlaysData);
        } else if (view === 'reviews') {
            this.reviewsView.initialize();
            this.reviewsView.setPlaysData(this.allPlaysData);
        } else if (view === 'hall-of-fame-shame') {
            this.hallOfFameShameView.initialize();
            this.hallOfFameShameView.setPlaysData(this.allPlaysData);
        }
    }
    
    /**
     * Fetch plays data from Supabase
     */
    async fetchPlaysData() {
        try {
            // Show loading state
            const messageContainer = document.getElementById('message-container');
            messageContainer.innerHTML = `
                <div class="d-flex align-items-center">
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Loading plays data...
                </div>
            `;
            messageContainer.classList.remove('d-none', 'alert-danger');
            messageContainer.classList.add('alert-info');
            
            // Fetch data
            this.allPlaysData = await SupabaseService.fetchPlays();
            console.log('Plays data fetched:', this.allPlaysData);
            
            // Update views with data
            this.allPlaysView.setPlaysData(this.allPlaysData);
            this.upcomingPlaysView.setPlaysData(this.allPlaysData);
            this.pastPlaysView.setPlaysData(this.allPlaysData);
            
            // Check for unrated plays and conditionally show the menu item
            const hasUnratedPlays = this.unratedPlaysView.setPlaysData(this.allPlaysData);
            this.showUnratedMenuIfNeeded(hasUnratedPlays);
            
            return this.allPlaysData;
        } catch (error) {
            console.error('Error fetching plays:', error.message);
            const messageContainer = document.getElementById('message-container');
            messageContainer.innerHTML = `
                <div class="d-flex align-items-center">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    Error: ${error.message}
                </div>
            `;
            messageContainer.classList.remove('alert-info');
            messageContainer.classList.add('alert-danger');
            throw error;
        }
    }

    /**
     * Show or hide the unrated plays menu item based on if there are unrated plays
     * @param {boolean} show - Whether to show the menu item
     */
    showUnratedMenuIfNeeded(show) {
        const unratedMenuItem = document.getElementById('unrated-plays-menu-item');
        if (unratedMenuItem) {
            if (show) {
                unratedMenuItem.classList.remove('d-none');
            } else {
                unratedMenuItem.classList.add('d-none');
            }
        }
    }

    /**
     * Set up global event listeners
     */
    setupEventListeners() {
        console.log('Setting up App event listeners');
        
        // Listen for play events
        document.addEventListener('playAdded', (e) => {
            console.log('Play added event received:', e.detail.play);
            this.refreshData();
        });
        
        document.addEventListener('playUpdated', (e) => {
            console.log('Play updated event received:', e.detail.play);
            this.refreshData();
        });
        
        document.addEventListener('playDeleted', (e) => {
            console.log('Play deleted event received:', e.detail.playId);
            this.refreshData();
        });
        
        // Click event for review buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.review-play-btn')) {
                const button = e.target.closest('.review-play-btn');
                const playId = button.getAttribute('data-play-id');
                console.log(`Review button clicked for play ID: ${playId}`);
                
                // Dispatch event to show review
                document.dispatchEvent(new CustomEvent('showPlayReview', { 
                    detail: { playId: parseInt(playId) }
                }));
            }
        });
    }

    /**
     * Refresh all data
     */
    async refreshData() {
        console.log('Refreshing data...');
        
        try {
            await this.fetchPlaysData();
            
            // Update current view with new data
            const currentView = document.querySelector('.nav-link.active');
            if (currentView) {
                const view = currentView.id.replace('-link', '');
                this.handleViewChanged(view);
            }
            
            console.log('Data refreshed successfully');
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    }
} 