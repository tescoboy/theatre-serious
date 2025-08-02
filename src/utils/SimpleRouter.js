/**
 * Simple Router - A clean, templated approach to URL routing
 */
class SimpleRouter {
    constructor() {
        this.routes = new Map();
        this.currentView = null;
        this.init();
    }

    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname);
        });

        // Handle initial route
        this.handleRoute(window.location.pathname);
    }

    /**
     * Register a route
     */
    register(path, handler) {
        this.routes.set(path, handler);
    }

    /**
     * Navigate to a URL
     */
    navigate(path, pushState = true) {
        if (pushState) {
            window.history.pushState({}, '', path);
        }
        this.handleRoute(path);
    }

    /**
     * Handle the current route
     */
    handleRoute(path) {
        console.log('SimpleRouter: Handling route:', path);

        // Check for review routes
        const reviewMatch = path.match(/^\/review\/(.+)$/);
        if (reviewMatch) {
            const playName = reviewMatch[1];
            this.showReview(playName);
            return;
        }

        // Check for main routes
        const handler = this.routes.get(path);
        if (handler) {
            handler();
        } else {
            // Default to dashboard
            this.showDashboard();
        }
    }

    /**
     * Show a specific review
     */
    showReview(playName) {
        console.log('SimpleRouter: Showing review for:', playName);
        
        // Show reviews view
        this.showView('reviews');
        
        // Find the play by URL name
        if (window.app && window.app.allPlaysData) {
            const playsWithReviews = window.app.allPlaysData.filter(play => 
                play.review && play.review.trim() !== ''
            );
            
            const reviewIndex = playsWithReviews.findIndex(play => {
                const urlName = play.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                return urlName === playName;
            });
            
            if (reviewIndex !== -1) {
                window.reviewsView.currentReviewIndex = reviewIndex;
                window.reviewsView.render();
            } else {
                // Show error if review not found
                this.showReviewNotFound(playName);
            }
        }
    }

    /**
     * Show review not found error
     */
    showReviewNotFound(playName) {
        const container = document.getElementById('reviews-view');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-warning" role="alert">
                    <h4 class="alert-heading">Review Not Found</h4>
                    <p>The review for "${playName}" doesn't exist.</p>
                    <hr>
                    <a href="/" class="btn btn-primary">Back to Dashboard</a>
                </div>
            `;
        }
    }

    /**
     * Show a view
     */
    showView(viewName) {
        // Hide all views
        const views = ['dashboard-view', 'table-view', 'calendar-view', 'upcoming-plays-view', 
                      'past-plays-view', 'unrated-plays-view', 'reviews-view', 'hall-of-fame-shame-view'];
        
        views.forEach(viewId => {
            const element = document.getElementById(viewId);
            if (element) {
                element.classList.add('d-none');
            }
        });

        // Show the requested view
        const viewElement = document.getElementById(`${viewName}-view`);
        if (viewElement) {
            viewElement.classList.remove('d-none');
            this.currentView = viewName;
        }
    }

    /**
     * Show dashboard
     */
    showDashboard() {
        this.showView('dashboard');
    }

    /**
     * Show all plays
     */
    showAllPlays() {
        this.showView('table');
    }

    /**
     * Show calendar
     */
    showCalendar() {
        this.showView('calendar');
    }

    /**
     * Show upcoming plays
     */
    showUpcomingPlays() {
        this.showView('upcoming-plays');
    }

    /**
     * Show past plays
     */
    showPastPlays() {
        this.showView('past-plays');
    }

    /**
     * Show unrated plays
     */
    showUnratedPlays() {
        this.showView('unrated-plays');
    }

    /**
     * Show hall of fame
     */
    showHallOfFame() {
        this.showView('hall-of-fame-shame');
    }

    /**
     * Show reviews (go to first review)
     */
    showReviews() {
        if (window.app && window.app.allPlaysData) {
            const playsWithReviews = window.app.allPlaysData.filter(play => 
                play.review && play.review.trim() !== ''
            );
            
            if (playsWithReviews.length > 0) {
                const firstReview = playsWithReviews[0];
                const urlName = firstReview.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                this.navigate(`/review/${urlName}`);
            } else {
                this.showView('reviews');
            }
        }
    }
}

// Create global router instance
window.simpleRouter = new SimpleRouter();

// Register routes
window.simpleRouter.register('/', () => window.simpleRouter.showDashboard());
window.simpleRouter.register('/plays', () => window.simpleRouter.showAllPlays());
window.simpleRouter.register('/calendar', () => window.simpleRouter.showCalendar());
window.simpleRouter.register('/upcoming', () => window.simpleRouter.showUpcomingPlays());
window.simpleRouter.register('/past', () => window.simpleRouter.showPastPlays());
window.simpleRouter.register('/unrated', () => window.simpleRouter.showUnratedPlays());
window.simpleRouter.register('/reviews', () => window.simpleRouter.showReviews());
window.simpleRouter.register('/hall-of-fame', () => window.simpleRouter.showHallOfFame()); 