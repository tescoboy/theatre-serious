/**
 * Navigation component for handling menu interactions
 */
class Navigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        this.navbarCollapse = document.getElementById('navbarNav');
        this.tableViewLink = document.getElementById('table-view-link');
        this.calendarViewLink = document.getElementById('calendar-view-link');
        this.tableView = document.getElementById('table-view');
        this.calendarView = document.getElementById('calendar-view');
        this.navbarToggler = document.querySelector('.navbar-toggler');
        this.upcomingPlaysLink = document.getElementById('upcoming-plays-link');
        this.upcomingPlaysView = document.getElementById('upcoming-plays-view');
        this.pastPlaysLink = document.getElementById('past-plays-link');
        this.pastPlaysView = document.getElementById('past-plays-view');
        this.unratedPlaysLink = document.getElementById('unrated-plays-link');
        this.unratedPlaysView = document.getElementById('unrated-plays-view');
        this.addPlayLink = document.getElementById('add-play-link');
        this.dashboardLink = document.getElementById('dashboard-link');
        
        // Initialize event listeners
        this.initEventListeners();
        console.log('Navigation component initialized');
    }
    
    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Handle navbar toggler click to only toggle the menu without changing the view
        this.navbarToggler.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Toggle the collapse state
            const isExpanded = this.navbarCollapse.classList.contains('show');
            
            if (isExpanded) {
                // Only close the menu, don't change the view
                this.navbarCollapse.classList.remove('show');
                this.navbarToggler.setAttribute('aria-expanded', 'false');
            } else {
                // Open the menu
                this.navbarCollapse.classList.add('show');
                this.navbarToggler.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Add active state management and page change behavior for nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get the view name from the link ID (remove '-link' suffix)
                const view = link.id.replace('-link', '');
                console.log(`Navigation link clicked: ${link.id}, switching to view: ${view}`);
                
                // Set this link as active
                this.navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close the navbar collapse on mobile
                if (this.navbarToggler && this.navbarCollapse && window.getComputedStyle(this.navbarToggler).display !== 'none') {
                    const bsCollapse = new bootstrap.Collapse(this.navbarCollapse);
                    bsCollapse.hide();
                }
                
                // Dispatch custom event to change the view
                document.dispatchEvent(new CustomEvent('viewChanged', {
                    detail: { view: view }
                }));
            });
        });
        
        // View switching
        if (this.dashboardLink) {
            this.dashboardLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showDashboard();
            });
        }
        

        

        
        if (this.addPlayLink) {
            this.addPlayLink.addEventListener('click', (e) => {
                e.preventDefault();
                // Dispatch event to show add play form
                document.dispatchEvent(new CustomEvent('showAddPlayForm'));
            });
        }
    }
    
    /**
     * Switch to table view
     */
    showTableView() {
        document.getElementById('dashboard-view').classList.add('d-none');
        this.tableView.classList.remove('d-none');
        this.calendarView.classList.add('d-none');
        this.upcomingPlaysView.classList.add('d-none');
        this.pastPlaysView.classList.add('d-none');
        this.unratedPlaysView.classList.add('d-none');
        
        // Dispatch an event to notify that the view has changed
        const event = new CustomEvent('viewChanged', {
            detail: { view: 'table' }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Switch to calendar view
     */
    showCalendarView() {
        document.getElementById('dashboard-view').classList.add('d-none');
        this.tableView.classList.add('d-none');
        this.calendarView.classList.remove('d-none');
        this.upcomingPlaysView.classList.add('d-none');
        this.pastPlaysView.classList.add('d-none');
        this.unratedPlaysView.classList.add('d-none');
        
        // Dispatch an event to notify that the view has changed
        const event = new CustomEvent('viewChanged', {
            detail: { view: 'calendar' }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Switch to upcoming plays view
     */
    showUpcomingPlaysView() {
        document.getElementById('dashboard-view').classList.add('d-none');
        this.tableView.classList.add('d-none');
        this.calendarView.classList.add('d-none');
        this.upcomingPlaysView.classList.remove('d-none');
        this.pastPlaysView.classList.add('d-none');
        this.unratedPlaysView.classList.add('d-none');
        
        // Dispatch an event to notify that the view has changed
        const event = new CustomEvent('viewChanged', {
            detail: { view: 'upcoming' }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Switch to past plays view
     */
    showPastPlaysView() {
        document.getElementById('dashboard-view').classList.add('d-none');
        this.tableView.classList.add('d-none');
        this.calendarView.classList.add('d-none');
        this.upcomingPlaysView.classList.add('d-none');
        this.pastPlaysView.classList.remove('d-none');
        this.unratedPlaysView.classList.add('d-none');
        
        // Dispatch an event to notify that the view has changed
        const event = new CustomEvent('viewChanged', {
            detail: { view: 'past' }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Switch to unrated plays view
     */
    showUnratedPlaysView() {
        document.getElementById('dashboard-view').classList.add('d-none');
        this.tableView.classList.add('d-none');
        this.calendarView.classList.add('d-none');
        this.upcomingPlaysView.classList.add('d-none');
        this.pastPlaysView.classList.add('d-none');
        this.unratedPlaysView.classList.remove('d-none');
        
        // Dispatch an event to notify that the view has changed
        const event = new CustomEvent('viewChanged', {
            detail: { view: 'unrated' }
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Switch to dashboard view
     */
    showDashboard() {
        document.getElementById('dashboard-view').classList.remove('d-none');
        this.tableView.classList.add('d-none');
        this.calendarView.classList.add('d-none');
        this.upcomingPlaysView.classList.add('d-none');
        this.pastPlaysView.classList.add('d-none');
        this.unratedPlaysView.classList.add('d-none');
        
        // Dispatch an event to notify that the view has changed
        const event = new CustomEvent('viewChanged', {
            detail: { view: 'dashboard' }
        });
        document.dispatchEvent(event);
    }

    /**
     * Show Hall of Fame/Shame view
     */
    showHallOfFameShameView() {
        console.log('Showing Hall of Fame/Shame view');
        document.dispatchEvent(new CustomEvent('viewChanged', { 
            detail: { view: 'hall-of-fame-shame' }
        }));
    }
} 