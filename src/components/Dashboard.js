/**
 * Dashboard component for displaying summary statistics and upcoming plays
 */
class Dashboard {
    constructor() {
        this.container = document.getElementById('dashboard-view');
        this.initialized = false;
        this.playsData = [];
        this.statsAnimated = false;
        
        console.log('Dashboard component initialized');
    }
    
    /**
     * Initialize the dashboard
     */
    initialize() {
        if (this.initialized) return;
        
        this.initialized = true;
        console.log('Dashboard initialized');
    }
    
    /**
     * Set plays data and update the dashboard
     * @param {Array} playsData - All plays data
     */
    setPlaysData(playsData) {
        this.playsData = playsData;
        this.updateDashboard();
    }
    
    /**
     * Update the dashboard with current stats and upcoming plays
     */
    updateDashboard() {
        if (!this.container) {
            console.error('Dashboard container not found');
            return;
        }
        
        // Calculate stats
        const stats = this.calculateStats();
        
        // Get next play
        const nextPlay = this.getNextPlay();
        
        // Create dashboard HTML
        let dashboardHtml = `
            <div class="row mb-4">
                <div class="col-12">
                    <h2 class="h4 mb-3">
                        <i class="bi bi-speedometer2 me-2 text-primary"></i>Dashboard
                    </h2>
                </div>
            </div>
            
            <div class="row mb-4">
                <!-- Stat Cards -->
                <div class="col-md-4 mb-3">
                    <div class="card shadow-sm border-0 h-100 dashboard-card">
                        <div class="card-body text-center">
                            <i class="bi bi-collection-play mb-3 text-primary" style="font-size: 2rem;"></i>
                            <h5 class="card-title text-muted">Total Plays</h5>
                            <p class="display-4 counter-value" data-target="${stats.totalPlays}">0</p>
                            <p class="text-muted">All time</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4 mb-3">
                    <div class="card shadow-sm border-0 h-100 dashboard-card">
                        <div class="card-body text-center">
                            <i class="bi bi-calendar-check mb-3 text-primary" style="font-size: 2rem;"></i>
                            <h5 class="card-title text-muted">Plays This Year</h5>
                            <p class="display-4 counter-value" data-target="${stats.playsThisYear}">0</p>
                            <p class="text-muted">${new Date().getFullYear()}</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4 mb-3">
                    <div class="card shadow-sm border-0 h-100 dashboard-card">
                        <div class="card-body text-center">
                            <i class="bi bi-calendar-week mb-3 text-primary" style="font-size: 2rem;"></i>
                            <h5 class="card-title text-muted">Plays This Month</h5>
                            <p class="display-4 counter-value" data-target="${stats.playsThisMonth}">0</p>
                            <p class="text-muted">${this.getMonthName(new Date().getMonth())}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row">
                <!-- Next Play Card -->
                <div class="col-12">
                    <div class="card shadow-sm border-0 mb-4">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">
                                <i class="bi bi-calendar-event me-2"></i>Next Upcoming Play
                            </h5>
                        </div>
                        <div class="card-body">
                            ${nextPlay ? this.renderNextPlay(nextPlay) : '<p class="text-center"><i class="bi bi-calendar-x me-2"></i>No upcoming plays scheduled.</p>'}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Set the HTML content
        this.container.innerHTML = dashboardHtml;
        
        // Animate counters after a short delay
        setTimeout(() => this.animateCounters(), 300);
    }
    
    /**
     * Calculate stats from the plays data
     * @returns {Object} - Stats object
     */
    calculateStats() {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        
        // Count plays for different periods
        let totalPlays = this.playsData.length;
        let playsThisYear = 0;
        let playsThisMonth = 0;
        
        this.playsData.forEach(play => {
            if (!play.date) return;
            
            const playDate = new Date(play.date);
            
            if (playDate.getFullYear() === currentYear) {
                playsThisYear++;
                
                if (playDate.getMonth() === currentMonth) {
                    playsThisMonth++;
                }
            }
        });
        
        return {
            totalPlays,
            playsThisYear,
            playsThisMonth
        };
    }
    
    /**
     * Get the next upcoming play
     * @returns {Object|null} - Next play or null if none
     */
    getNextPlay() {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        // Filter for future plays
        const futurePlays = this.playsData.filter(play => {
            if (!play.date) return false;
            
            const playDate = new Date(play.date);
            return playDate >= now;
        });
        
        // Sort by date (ascending)
        futurePlays.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
        });
        
        // Return the first one (closest upcoming)
        return futurePlays.length > 0 ? futurePlays[0] : null;
    }
    
    /**
     * Render the next play with countdown
     * @param {Object} play - The next play
     * @returns {string} - HTML for the next play card
     */
    renderNextPlay(play) {
        const playDate = new Date(play.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Calculate days until the play
        const timeDiff = playDate.getTime() - today.getTime();
        const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        // Format date for display
        const formattedDate = FormatUtils.formatDate(play.date);
        
        // Create countdown text only for special cases (today/tomorrow)
        let countdownText = '';
        if (daysUntil === 0) {
            countdownText = '<span class="badge bg-success">Today!</span>';
        } else if (daysUntil === 1) {
            countdownText = '<span class="badge bg-warning">Tomorrow!</span>';
        }
        
        return `
            <div class="row align-items-center">
                <div class="col-md-3 text-center">
                    <div class="next-play-countdown">
                        <div class="display-1 text-primary fw-bold">${daysUntil}</div>
                        <div class="text-muted">days until</div>
                    </div>
                </div>
                <div class="col-md-9">
                    <h3 class="mb-2">${play.name}</h3>
                    <div class="mb-2">
                        <i class="bi bi-calendar-event text-primary me-2"></i>
                        <span>${formattedDate}</span> ${countdownText}
                    </div>
                    ${play.theatre ? `
                    <div class="mb-2">
                        <i class="bi bi-building text-primary me-2"></i>
                        <span>${play.theatre}</span>
                    </div>` : ''}
                </div>
            </div>
        `;
    }
    
    /**
     * Animate counter values
     */
    animateCounters() {
        if (!this.container || this.container.classList.contains('d-none')) {
            return; // Don't animate if dashboard is hidden
        }
        
        const counterElements = this.container.querySelectorAll('.counter-value');
        
        counterElements.forEach(el => {
            const target = parseInt(el.getAttribute('data-target'), 10) || 0;
            let current = 0;
            const increment = target / 20; // Faster animation
            el.textContent = '0';
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    // Ensure we don't exceed the target
                    if (current > target) current = target;
                    el.textContent = Math.round(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    /**
     * Get month name from month index
     * @param {number} monthIndex - Month index (0-11)
     * @returns {string} - Month name
     */
    getMonthName(monthIndex) {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
    }
    
    /**
     * Attach event listeners after rendering
     */
    attachEventListeners() {
        // Find edit buttons
        const editButtons = this.container.querySelectorAll('.edit-play-btn');
        
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get play ID and dispatch edit event
                const playId = button.getAttribute('data-play-id');
                console.log(`Edit button clicked for play ID: ${playId}`);
                
                // Dispatch event to edit the play
                document.dispatchEvent(new CustomEvent('editPlay', { 
                    detail: { playId: parseInt(playId) }
                }));
            });
        });
    }
    
    /**
     * Initialize dashboard event listeners
     */
    initEventListeners() {
        // Listen for view change events
        document.addEventListener('viewChanged', (e) => {
            if (e.detail.view === 'dashboard') {
                this.updateDashboard();
                // Force the counters to animate with proper values
                setTimeout(() => this.animateCounters(), 100);
            }
        });
        
        // Also listen for play data changes to update dashboard
        document.addEventListener('playAdded', () => {
            this.updateDashboard();
        });
        
        document.addEventListener('playDeleted', () => {
            this.updateDashboard();
        });
        
        document.addEventListener('playUpdated', () => {
            this.updateDashboard();
        });
    }
} 