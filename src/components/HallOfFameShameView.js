/**
 * Component for displaying Hall of Fame and Hall of Shame plays
 */
class HallOfFameShameView {
    constructor() {
        this.playsData = [];
        this.showShame = false; // Default to Hall of Fame
        
        console.log('HallOfFameShameView component created');
    }
    
    /**
     * Initialize the component
     */
    initialize() {
        console.log('Initializing HallOfFameShameView component');
        this.render();
        console.log('Plays with standing ovation:', this.playsData.filter(p => p.standing_ovation).map(p => ({ 
            name: p.name, 
            standing_ovation: p.standing_ovation, 
            type: typeof p.standing_ovation 
        })));
    }
    
    /**
     * Set the plays data
     * @param {Array} playsData 
     */
    setPlaysData(playsData) {
        console.log(`Setting plays data for HallOfFameShameView (${playsData.length} plays)`);
        this.playsData = playsData;
        
        // Debug standing ovation data
        const standingOvationTest = playsData.filter(p => 
            p.standing_ovation === "Standing Ovation"
        );
        console.log('Plays with exact "Standing Ovation" value:', standingOvationTest);
        
        // Try without any filtering to see all values
        console.log('All standing_ovation values:', 
            playsData.map(p => ({ id: p.id, name: p.name, so: p.standing_ovation }))
                .filter(p => p.so !== null && p.so !== undefined)
        );
        
        this.render();
    }
    
    /**
     * Toggle between Hall of Fame and Hall of Shame
     */
    toggleHallOfFameShame() {
        this.showShame = !this.showShame;
        console.log(`Switched to ${this.showShame ? 'Hall of Shame' : 'Hall of Fame'}`);
        this.render();
    }
    
    /**
     * Render the view
     */
    render() {
        const container = document.getElementById('hall-of-fame-shame-view');
        if (!container) return;
        
        // Filter plays based on current mode
        let filteredPlays = [];
        
        if (this.showShame) {
            // Hall of Shame: Plays with ratings between 1 and 2.5
            filteredPlays = this.playsData.filter(play => 
                play.rating && 
                typeof play.rating === 'string' &&
                !isNaN(parseFloat(play.rating)) &&
                parseFloat(play.rating) >= 1 && 
                parseFloat(play.rating) <= 2.5
            );
        } else {
            // Hall of Fame: Plays with ratings 5 or standing ovation in the rating field
            filteredPlays = this.playsData.filter(play => 
                (play.rating && typeof play.rating === 'string' && parseFloat(play.rating) === 5) ||
                (play.rating === "Standing Ovation")
            );
        }
        
        // Sort by date (least recent first for both Hall of Fame and Hall of Shame)
        filteredPlays.sort((a, b) => {
            // Convert dates to comparable values (timestamps)
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            
            // Sort ascending (oldest/least recent first)
            return dateA - dateB;
        });
        
        console.log(`Rendering ${filteredPlays.length} plays in ${this.showShame ? 'Hall of Shame' : 'Hall of Fame'}, sorted by date (oldest first)`);
        
        // Generate HTML
        let html = `
            <div class="row mb-4">
                <div class="col-md-6">
                    <h2 class="h4 mb-3">
                        <i class="${this.showShame ? 'bi bi-emoji-frown text-danger' : 'bi bi-trophy-fill text-warning'}"></i> 
                        Hall of ${this.showShame ? 'Shame' : 'Fame'}
                    </h2>
                </div>
                <div class="col-md-6 text-md-end">
                    <button id="toggle-hall-btn" class="btn ${this.showShame ? 'btn-success' : 'btn-danger'}">
                        Switch to Hall of ${this.showShame ? 'Fame' : 'Shame'}
                    </button>
                </div>
            </div>
            
            <div class="row hall-of-fame-shame-container">
        `;
        
        if (filteredPlays.length === 0) {
            html += `
                <div class="col-12">
                    <div class="alert alert-info" role="alert">
                        <i class="bi bi-info-circle me-2"></i>
                        No plays found for the Hall of ${this.showShame ? 'Shame' : 'Fame'}.
                        ${!this.showShame ? 'Rate a play 5 stars or give it a standing ovation to see it here!' : 
                                         'Fortunately, you haven\'t rated any plays below 2.5 stars!'}
                    </div>
                </div>
            `;
        } else {
            // Create cards for each play
            filteredPlays.forEach(play => {
                const cardClass = this.showShame ? 'border-danger' : 'border-warning';
                const dateText = play.date ? new Date(play.date).toLocaleDateString() : 'Date not specified';
                const hasStandingOvation = this.hasStandingOvation(play);
                
                html += `
                    <div class="col-md-6 col-lg-4 mb-4">
                        <div class="card h-100 ${cardClass} shadow-sm hall-card">
                            <div class="position-relative">
                                <img src="${play.image || 'https://placehold.co/600x400/f3e9ea/7D2935?text=No+Image'}" 
                                     class="card-img-top" alt="${play.name}" style="height: 200px; object-fit: cover;">
                                <div class="position-absolute top-0 end-0 p-2">
                                    ${hasStandingOvation ? 
                                        '<span class="badge bg-warning text-dark standing-ovation-badge"><i class="bi bi-people-fill"></i> Standing Ovation</span>' : ''}
                                </div>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${play.name}</h5>
                                <p class="card-text text-muted">
                                    <small><i class="bi bi-building"></i> ${play.theatre || 'Theatre not specified'}</small><br>
                                    <small><i class="bi bi-calendar3"></i> ${dateText}</small>
                                </p>
                                <div class="mb-3">
                                    ${new RatingDisplay(play.rating || 0).render()}
                                </div>
                                ${play.review ? 
                                    `<p class="card-text review-preview">${this.truncateReview(play.review)}</p>` : 
                                    '<p class="card-text text-muted fst-italic">No review</p>'}
                            </div>
                            <div class="card-footer bg-transparent border-0">
                                <button class="btn btn-sm btn-outline-primary review-play-btn" data-play-id="${play.id}">
                                    Read Review
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }
        
        html += `
            </div>
        `;
        
        container.innerHTML = html;
        this.attachEventListeners();
    }
    
    /**
     * Truncate review text for preview
     * @param {string} reviewText 
     * @returns {string}
     */
    truncateReview(reviewText) {
        if (!reviewText) return '';
        const maxLength = 100;
        if (reviewText.length <= maxLength) return reviewText;
        return reviewText.substring(0, maxLength) + '...';
    }
    
    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Toggle between Hall of Fame and Hall of Shame
        const toggleButton = document.getElementById('toggle-hall-btn');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggleHallOfFameShame());
        }
    }
    
    /**
     * Check if a play has standing ovation
     * @param {Object} play - The play to check
     * @returns {boolean} - Whether the play has standing ovation
     */
    hasStandingOvation(play) {
        return play.rating === "Standing Ovation";
    }
} 