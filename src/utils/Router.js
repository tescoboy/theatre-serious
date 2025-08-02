/**
 * URL Router for the Theatre App
 * Handles browser history and unique URLs for each view and review
 */
class Router {
    constructor() {
        this.routes = {
            '/': 'dashboard',
            '/plays': 'table',
            '/calendar': 'calendar',
            '/upcoming': 'upcoming-plays',
            '/past': 'past-plays',
            '/unrated': 'unrated-plays',
            '/reviews': 'reviews',
            '/hall-of-fame': 'hall-of-fame-shame'
        };
        this.currentView = null;
        this.init();
    }
    
    init() {
        // Listen for browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            this.handleRoute(window.location.pathname);
        });
        
        // Handle initial route
        this.handleRoute(window.location.pathname);
    }
    
    /**
     * Navigate to a new route
     * @param {string} path - URL path
     * @param {boolean} pushState - Whether to add to browser history
     */
    navigate(path, pushState = true) {
        if (pushState) {
            window.history.pushState({}, '', path);
        }
        this.handleRoute(path);
    }
    
    /**
     * Handle the current route
     * @param {string} path - URL path
     */
    handleRoute(path) {
        console.log('Router: Handling route:', path);
        
        // Check for play-specific route (e.g., /play/123)
        const playMatch = path.match(/^\/play\/(\d+)$/);
        if (playMatch) {
            const playId = parseInt(playMatch[1]);
            this.showPlayDetails(playId);
            return;
        }
        
        // Check for review-specific route (e.g., /review/123)
        const reviewMatch = path.match(/^\/review\/(\d+)$/);
        if (reviewMatch) {
            const playId = parseInt(reviewMatch[1]);
            this.showReviewDetails(playId);
            return;
        }
        
        // Handle main app routes
        const viewName = this.routes[path] || 'dashboard';
        this.showView(viewName);
    }
    
    /**
     * Show a specific view
     * @param {string} viewName - Name of the view to show
     */
    showView(viewName) {
        console.log('Router: Showing view:', viewName);
        
        // Hide all views
        this.hideAllViews();
        
        // Show the requested view
        const viewElement = document.getElementById(`${viewName}-view`);
        if (viewElement) {
            viewElement.classList.remove('d-none');
            this.currentView = viewName;
            
            // Update navigation active state
            this.updateNavigationActiveState(viewName);
            
            // Trigger data refresh if needed
            this.refreshViewData(viewName);
        } else {
            console.error('View not found:', viewName);
            // Fallback to dashboard
            this.showView('dashboard');
        }
    }
    
    /**
     * Show play details view
     * @param {number} playId - ID of the play to show
     */
    async showPlayDetails(playId) {
        console.log('Router: Showing play details for ID:', playId);
        
        // Hide all main app views
        this.hideAllViews();
        
        // Create play details container if it doesn't exist
        let playDetailsContainer = document.getElementById('play-details-container');
        if (!playDetailsContainer) {
            playDetailsContainer = document.createElement('div');
            playDetailsContainer.id = 'play-details-container';
            playDetailsContainer.className = 'container mt-4';
            document.body.appendChild(playDetailsContainer);
        }
        
        // Show loading state
        playDetailsContainer.innerHTML = `
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading play details...</p>
            </div>
        `;
        playDetailsContainer.style.display = 'block';
        
        try {
            // Fetch play data from Supabase
            const play = await SupabaseService.getPlayById(playId);
            
            if (!play) {
                playDetailsContainer.innerHTML = `
                    <div class="alert alert-warning" role="alert">
                        <h4 class="alert-heading">Play Not Found</h4>
                        <p>The play you're looking for doesn't exist or has been removed.</p>
                        <hr>
                        <a href="/" class="btn btn-primary">Back to All Plays</a>
                    </div>
                `;
                return;
            }
            
            // Render play details
            this.renderPlayDetails(play, playDetailsContainer);
            
        } catch (error) {
            console.error('Error loading play details:', error);
            playDetailsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Error Loading Play</h4>
                    <p>There was an error loading the play details. Please try again.</p>
                    <hr>
                    <a href="/" class="btn btn-primary">Back to All Plays</a>
                </div>
            `;
        }
    }
    
    /**
     * Show review details view
     * @param {number} playId - ID of the play to show review for
     */
    async showReviewDetails(playId) {
        console.log('Router: Showing review details for ID:', playId);
        
        // Hide all main app views
        this.hideAllViews();
        
        // Create review details container if it doesn't exist
        let reviewDetailsContainer = document.getElementById('review-details-container');
        if (!reviewDetailsContainer) {
            reviewDetailsContainer = document.createElement('div');
            reviewDetailsContainer.id = 'review-details-container';
            reviewDetailsContainer.className = 'container mt-4';
            document.body.appendChild(reviewDetailsContainer);
        }
        
        // Show loading state
        reviewDetailsContainer.innerHTML = `
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading review...</p>
            </div>
        `;
        reviewDetailsContainer.style.display = 'block';
        
        try {
            // Fetch play data from Supabase
            const play = await SupabaseService.getPlayById(playId);
            
            if (!play) {
                reviewDetailsContainer.innerHTML = `
                    <div class="alert alert-warning" role="alert">
                        <h4 class="alert-heading">Review Not Found</h4>
                        <p>The review you're looking for doesn't exist or has been removed.</p>
                        <hr>
                        <a href="/" class="btn btn-primary">Back to All Plays</a>
                    </div>
                `;
                return;
            }
            
            // Render review details
            this.renderReviewDetails(play, reviewDetailsContainer);
            
        } catch (error) {
            console.error('Error loading review details:', error);
            reviewDetailsContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Error Loading Review</h4>
                    <p>There was an error loading the review. Please try again.</p>
                    <hr>
                    <a href="/" class="btn btn-primary">Back to All Plays</a>
                </div>
            `;
        }
    }
    
    /**
     * Render play details view
     * @param {Object} play - Play data
     * @param {HTMLElement} container - Container to render in
     */
    renderPlayDetails(play, container) {
        const ratingDisplay = play.rating === 'Standing Ovation' ? 
            '<span class="badge bg-warning text-dark"><i class="bi bi-person-standing"></i> Standing Ovation</span>' :
            new RatingDisplay(play.rating).render();
        
        const formattedDate = FormatUtils.formatDate(play.date);
        
        container.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="/" class="text-decoration-none">Dashboard</a></li>
                            <li class="breadcrumb-item"><a href="/plays" class="text-decoration-none">All Plays</a></li>
                            <li class="breadcrumb-item active" aria-current="page">${play.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>
            
            <div class="row">
                <div class="col-lg-8">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h1 class="card-title mb-2" style="color: #7D2935; font-family: 'Playfair Display', Georgia, serif;">
                                        ${play.name}
                                    </h1>
                                    <p class="text-muted mb-2">
                                        <i class="bi bi-calendar-event me-2"></i>
                                        ${formattedDate}
                                    </p>
                                    ${play.theatre ? `
                                        <p class="text-muted mb-3">
                                            <i class="bi bi-building me-2"></i>
                                            ${play.theatre}
                                        </p>
                                    ` : ''}
                                </div>
                                <div class="text-end">
                                    ${ratingDisplay}
                                </div>
                            </div>
                            
                            ${play.review ? `
                                <div class="mt-4">
                                    <h5 class="mb-3" style="color: #7D2935;">Review</h5>
                                    <div class="review-content" style="line-height: 1.6; color: #333;">
                                        ${play.review.replace(/\n/g, '<br>')}
                                    </div>
                                </div>
                            ` : `
                                <div class="mt-4">
                                    <p class="text-muted fst-italic">No review written yet.</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-4">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title mb-3" style="color: #7D2935;">Share This Play</h5>
                            
                            <div class="d-grid gap-2">
                                <button class="btn btn-success" onclick="shareToWhatsApp(${play.id}, '${play.name}')">
                                    <i class="bi bi-whatsapp me-2"></i>
                                    Share on WhatsApp
                                </button>
                                
                                <button class="btn btn-primary" onclick="copyPlayLink(${play.id})">
                                    <i class="bi bi-link-45deg me-2"></i>
                                    Copy Link
                                </button>
                                
                                ${play.review ? `
                                    <a href="/review/${play.id}" class="btn btn-info">
                                        <i class="bi bi-bookmark-star me-2"></i>
                                        View Review
                                    </a>
                                ` : ''}
                                
                                <button class="btn btn-outline-secondary" onclick="window.print()">
                                    <i class="bi bi-printer me-2"></i>
                                    Print Review
                                </button>
                            </div>
                            
                            <hr class="my-3">
                            
                            <div class="text-center">
                                <a href="/plays" class="btn btn-outline-primary">
                                    <i class="bi bi-arrow-left me-2"></i>
                                    Back to All Plays
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render review details view
     * @param {Object} play - Play data
     * @param {HTMLElement} container - Container to render in
     */
    renderReviewDetails(play, container) {
        const ratingDisplay = play.rating === 'Standing Ovation' ? 
            '<span class="badge bg-warning text-dark"><i class="bi bi-person-standing"></i> Standing Ovation</span>' :
            new RatingDisplay(play.rating).render();
        
        const formattedDate = FormatUtils.formatDate(play.date);
        
        container.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="/" class="text-decoration-none">Dashboard</a></li>
                            <li class="breadcrumb-item"><a href="/plays" class="text-decoration-none">All Plays</a></li>
                            <li class="breadcrumb-item"><a href="/play/${play.id}" class="text-decoration-none">${play.name}</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Review</li>
                        </ol>
                    </nav>
                </div>
            </div>
            
            <div class="row">
                <div class="col-lg-8">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h1 class="card-title mb-2" style="color: #7D2935; font-family: 'Playfair Display', Georgia, serif;">
                                        Review: ${play.name}
                                    </h1>
                                    <p class="text-muted mb-2">
                                        <i class="bi bi-calendar-event me-2"></i>
                                        ${formattedDate}
                                    </p>
                                    ${play.theatre ? `
                                        <p class="text-muted mb-3">
                                            <i class="bi bi-building me-2"></i>
                                            ${play.theatre}
                                        </p>
                                    ` : ''}
                                </div>
                                <div class="text-end">
                                    ${ratingDisplay}
                                </div>
                            </div>
                            
                            ${play.review ? `
                                <div class="mt-4">
                                    <h5 class="mb-3" style="color: #7D2935;">My Review</h5>
                                    <div class="review-content" style="line-height: 1.6; color: #333; font-size: 1.1rem;">
                                        ${play.review.replace(/\n/g, '<br>')}
                                    </div>
                                </div>
                            ` : `
                                <div class="mt-4">
                                    <p class="text-muted fst-italic">No review written yet.</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-4">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title mb-3" style="color: #7D2935;">Share This Review</h5>
                            
                            <div class="d-grid gap-2">
                                <button class="btn btn-success" onclick="shareReviewToWhatsApp(${play.id}, '${play.name}')">
                                    <i class="bi bi-whatsapp me-2"></i>
                                    Share on WhatsApp
                                </button>
                                
                                <button class="btn btn-primary" onclick="copyReviewLink(${play.id})">
                                    <i class="bi bi-link-45deg me-2"></i>
                                    Copy Review Link
                                </button>
                                
                                <button class="btn btn-outline-secondary" onclick="window.print()">
                                    <i class="bi bi-printer me-2"></i>
                                    Print Review
                                </button>
                            </div>
                            
                            <hr class="my-3">
                            
                            <div class="text-center">
                                <a href="/play/${play.id}" class="btn btn-outline-primary">
                                    <i class="bi bi-arrow-left me-2"></i>
                                    Back to Play Details
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Hide all main app views
     */
    hideAllViews() {
        // Hide play details container
        const playDetailsContainer = document.getElementById('play-details-container');
        if (playDetailsContainer) {
            playDetailsContainer.style.display = 'none';
        }
        
        // Hide review details container
        const reviewDetailsContainer = document.getElementById('review-details-container');
        if (reviewDetailsContainer) {
            reviewDetailsContainer.style.display = 'none';
        }
        
        // Hide main app container
        const mainAppContainer = document.getElementById('app-container');
        if (mainAppContainer) {
            mainAppContainer.style.display = 'block';
        }
    }
    
    /**
     * Update navigation active state
     * @param {string} viewName - Name of the active view
     */
    updateNavigationActiveState(viewName) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current nav link
        const activeLink = document.querySelector(`[data-view="${viewName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    /**
     * Refresh view data if needed
     * @param {string} viewName - Name of the view
     */
    refreshViewData(viewName) {
        // Trigger data refresh for the current view
        document.dispatchEvent(new CustomEvent('viewChanged', { 
            detail: { view: viewName } 
        }));
    }
}

// Global functions for sharing
window.shareToWhatsApp = function(playId, playName) {
    const url = `${window.location.origin}/play/${playId}`;
    const text = `Check out this play: ${playName}\n\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
};

window.shareReviewToWhatsApp = function(playId, playName) {
    const url = `${window.location.origin}/review/${playId}`;
    const text = `Check out my review of: ${playName}\n\n${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
};

window.copyPlayLink = function(playId) {
    const url = `${window.location.origin}/play/${playId}`;
    navigator.clipboard.writeText(url).then(() => {
        this.showToast('Link copied to clipboard!', 'success');
    });
};

window.copyReviewLink = function(playId) {
    const url = `${window.location.origin}/review/${playId}`;
    navigator.clipboard.writeText(url).then(() => {
        this.showToast('Review link copied to clipboard!', 'success');
    });
};

window.showToast = function(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 position-fixed`;
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-check-circle me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    document.body.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => {
        document.body.removeChild(toast);
    });
};

// Initialize router after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.router = new Router();
    console.log('Router initialized');
}); 