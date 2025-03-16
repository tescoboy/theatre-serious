/**
 * Main application controller
 */
class App {
    constructor() {
        // Initialize components
        this.navigation = new Navigation();
        this.dashboard = new Dashboard();
        this.tableView = new TableView();
        this.calendarController = new CalendarController();
        this.allPlaysData = [];
        this.upcomingPlaysView = new UpcomingPlaysView();
        this.pastPlaysView = new PastPlaysView();
        this.unratedPlaysView = new UnratedPlaysView();
        this.addPlayForm = new AddPlayForm();
        
        // Listen for view changes
        document.addEventListener('viewChanged', (e) => this.handleViewChanged(e.detail.view));
        
        console.log('App initialized');
    }
    
    /**
     * Initialize the app
     */
    async initialize() {
        try {
            // Initialize components
            this.addPlayForm.initialize();
            this.dashboard.initialize();
            
            // Initialize event listeners
            this.initEventListeners();
            
            // Fetch data
            await this.fetchPlaysData();
            
            // Initialize the starting view (dashboard)
            this.handleViewChanged('dashboard');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
    
    /**
     * Handle view changes
     * @param {string} view - The view to switch to ('table' or 'calendar' or 'upcoming' or 'past' or 'unrated' or 'dashboard')
     */
    handleViewChanged(view) {
        if (view === 'dashboard') {
            this.dashboard.setPlaysData(this.allPlaysData);
            this.dashboard.attachEventListeners();
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
            this.tableView.setPlaysData(this.allPlaysData);
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
     * Initialize event listeners
     */
    initEventListeners() {
        // Listen for play events
        document.addEventListener('playAdded', (e) => {
            console.log('Play added event received', e.detail);
            this.refreshData();
        });
        
        document.addEventListener('playUpdated', (e) => {
            console.log('Play updated event received', e.detail);
            this.refreshData();
        });
        
        document.addEventListener('playDeleted', (e) => {
            console.log('Play deleted event received', e.detail);
            this.refreshData();
        });
        
        // Listen for show add play form event
        document.addEventListener('showAddPlayForm', () => {
            console.log('Show add play form event received');
            this.addPlayForm.showAddForm();
        });
    }

    /**
     * Refresh data after a play is added
     */
    async refreshData() {
        try {
            await this.fetchPlaysData();
            
            // Refresh the current view
            const currentView = document.querySelector('.nav-link.active');
            if (currentView) {
                currentView.click();
            }
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    }
} 