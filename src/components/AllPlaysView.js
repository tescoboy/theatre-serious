/**
 * AllPlaysView - Modern table view for displaying all plays
 * Features: Responsive design, advanced filtering, sorting, and actions
 */
class AllPlaysView {
    constructor() {
        this.plays = [];
        this.filteredPlays = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.sortField = 'date';
        this.sortDirection = 'desc';
        this.searchTerm = '';
        this.activeFilters = {};
        
        this.init();
    }
    
    /**
     * Initialize the component
     */
    init() {
        this.container = document.getElementById('all-plays-container');
        this.createView();
        this.bindEvents();
        console.log('AllPlaysView initialized');
    }
    
    /**
     * Create the view structure
     */
    createView() {
        this.container.innerHTML = `
            <div class="all-plays-view">
                <!-- Header Section -->
                <div class="plays-header mb-4">
                    <div class="row align-items-center">
                        <div class="col-12">
                            <h2 class="mb-0" style="color: #7D2935; font-weight: 700; font-family: 'Playfair Display', Georgia, serif;">
                                <i class="bi bi-collection me-2" style="color: #D4AF37;"></i>
                                All Plays
                            </h2>
                            <p class="text-muted mb-0" style="color: #666; font-size: 1rem;">Manage and view all your theatre experiences</p>
                        </div>
                    </div>
                </div>
                
                <!-- Controls Section -->
                <div class="plays-controls mb-4">
                    <div class="row g-3">
                        <div class="col-md-4">
                            <div class="input-group" style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                <span class="input-group-text" style="background-color: #7D2935; color: white; border: none;">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input type="text" class="form-control" id="plays-search" 
                                       placeholder="Search plays, theatres, reviews..." 
                                       style="border: 1px solid #e0e0e0; border-left: none;">
                            </div>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="rating-filter" style="border: 1px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                <option value="">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4+ Stars</option>
                                <option value="3">3+ Stars</option>
                                <option value="standing">Standing Ovation</option>
                                <option value="unrated">Unrated</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" id="year-filter" style="border: 1px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                <option value="">All Years</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" id="page-size-select" style="border: 1px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                <option value="10">10 per page</option>
                                <option value="25">25 per page</option>
                                <option value="50">50 per page</option>
                                <option value="100">100 per page</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <!-- Stats Cards -->
                <div class="plays-stats mb-4" id="plays-stats">
                    <!-- Stats will be populated here -->
                </div>
                
                <!-- Table Section -->
                <div class="plays-table-container">
                    <div class="table-responsive">
                        <table class="table table-hover plays-table" id="plays-table" style="border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
                            <thead style="background: linear-gradient(135deg, #7D2935 0%, #662129 100%); color: white;">
                                <tr>
                                    <th class="sortable" data-field="name" style="border: none; padding: 1rem 0.75rem; font-weight: 600;">
                                        Play Name <i class="bi bi-arrow-down-up" style="color: rgba(255,255,255,0.7);"></i>
                                    </th>
                                    <th class="sortable" data-field="date" style="border: none; padding: 1rem 0.75rem; font-weight: 600;">
                                        Date <i class="bi bi-arrow-down-up" style="color: rgba(255,255,255,0.7);"></i>
                                    </th>
                                    <th class="sortable" data-field="theatre" style="border: none; padding: 1rem 0.75rem; font-weight: 600;">
                                        Theatre <i class="bi bi-arrow-down-up" style="color: rgba(255,255,255,0.7);"></i>
                                    </th>
                                    <th class="sortable" data-field="rating" style="border: none; padding: 1rem 0.75rem; font-weight: 600;">
                                        Rating <i class="bi bi-arrow-down-up" style="color: rgba(255,255,255,0.7);"></i>
                                    </th>
                                    <th style="border: none; padding: 1rem 0.75rem; font-weight: 600;">Review</th>
                                    <th class="text-end" style="border: none; padding: 1rem 0.75rem; font-weight: 600;">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="plays-tbody" style="background-color: white;">
                                <!-- Table rows will be populated here -->
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Pagination -->
                <div class="plays-pagination mt-4" id="plays-pagination">
                    <!-- Pagination will be populated here -->
                </div>
                
                <!-- Empty State -->
                <div class="empty-state d-none" id="empty-state">
                    <div class="text-center py-5">
                        <i class="bi bi-collection display-1 mb-3" style="color: #D4AF37; font-size: 4rem;"></i>
                        <h3 style="color: #7D2935; font-weight: 600; margin-bottom: 1rem;">No plays found</h3>
                        <p style="color: #666; font-size: 1.1rem; margin-bottom: 2rem;">Try adjusting your search or filters</p>
                        <button class="btn btn-primary" id="clear-filters-btn" style="background: linear-gradient(135deg, #7D2935 0%, #662129 100%); border: none; padding: 0.75rem 1.5rem; font-weight: 600; box-shadow: 0 4px 8px rgba(125, 41, 53, 0.3);">
                            <i class="bi bi-x-circle me-2"></i>
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Bind event listeners
     */
    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('plays-search');
        searchInput.addEventListener('input', this.debounce(() => {
            this.searchTerm = searchInput.value;
            this.filterPlays();
        }, 300));
        
        // Filter changes
        document.getElementById('rating-filter').addEventListener('change', () => {
            this.activeFilters.rating = document.getElementById('rating-filter').value;
            this.filterPlays();
        });
        
        document.getElementById('year-filter').addEventListener('change', () => {
            this.activeFilters.year = document.getElementById('year-filter').value;
            this.filterPlays();
        });
        
        // Page size
        document.getElementById('page-size-select').addEventListener('change', () => {
            this.pageSize = parseInt(document.getElementById('page-size-select').value);
            this.currentPage = 1;
            this.renderTable();
        });
        
        // Sort headers
        document.querySelectorAll('.sortable').forEach(th => {
            th.addEventListener('click', () => {
                const field = th.getAttribute('data-field');
                this.handleSort(field);
            });
        });
        

        
        // Clear filters
        document.getElementById('clear-filters-btn').addEventListener('click', () => {
            this.clearFilters();
        });
    }
    
    /**
     * Set plays data and render
     */
    setPlaysData(plays) {
        this.plays = plays;
        this.filteredPlays = [...plays];
        
        this.populateYearFilter();
        this.updateStats();
        this.filterPlays();
        
        console.log(`AllPlaysView: Loaded ${plays.length} plays`);
    }
    
    /**
     * Populate year filter dropdown
     */
    populateYearFilter() {
        const yearFilter = document.getElementById('year-filter');
        const years = [...new Set(this.plays.map(play => {
            return play.date ? new Date(play.date).getFullYear() : null;
        }).filter(year => year))].sort((a, b) => b - a);
        
        let options = '<option value="">All Years</option>';
        years.forEach(year => {
            options += `<option value="${year}">${year}</option>`;
        });
        
        yearFilter.innerHTML = options;
    }
    
    /**
     * Update statistics cards
     */
    updateStats() {
        const statsContainer = document.getElementById('plays-stats');
        
        const totalPlays = this.plays.length;
        const ratedPlays = this.plays.filter(p => p.rating && p.rating !== '').length;
        const standingOvations = this.plays.filter(p => 
            p.rating === 'Standing Ovation' || p.rating === 6 || p.standing_ovation
        ).length;
        const avgRating = this.plays.filter(p => p.rating && p.rating !== '' && p.rating !== 'Standing Ovation')
            .reduce((sum, p) => sum + parseFloat(p.rating), 0) / 
            this.plays.filter(p => p.rating && p.rating !== '' && p.rating !== 'Standing Ovation').length;
        
        statsContainer.innerHTML = `
            <div class="row g-3">
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm" style="background: linear-gradient(135deg, rgba(125, 41, 53, 0.1) 0%, rgba(125, 41, 53, 0.05) 100%); border-left: 4px solid #7D2935;">
                        <div class="card-body text-center">
                            <h3 class="mb-1" style="color: #7D2935; font-weight: 700;">${totalPlays}</h3>
                            <p class="text-muted mb-0" style="font-size: 0.9rem;">Total Plays</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm" style="background: linear-gradient(135deg, rgba(52, 168, 83, 0.1) 0%, rgba(52, 168, 83, 0.05) 100%); border-left: 4px solid #34A853;">
                        <div class="card-body text-center">
                            <h3 class="mb-1" style="color: #34A853; font-weight: 700;">${ratedPlays}</h3>
                            <p class="text-muted mb-0" style="font-size: 0.9rem;">Rated Plays</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm" style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%); border-left: 4px solid #D4AF37;">
                        <div class="card-body text-center">
                            <h3 class="mb-1" style="color: #D4AF37; font-weight: 700;">${standingOvations}</h3>
                            <p class="text-muted mb-0" style="font-size: 0.9rem;">Standing Ovations</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-0 shadow-sm" style="background: linear-gradient(135deg, rgba(58, 123, 137, 0.1) 0%, rgba(58, 123, 137, 0.05) 100%); border-left: 4px solid #3A7B89;">
                        <div class="card-body text-center">
                            <h3 class="mb-1" style="color: #3A7B89; font-weight: 700;">${avgRating ? avgRating.toFixed(1) : 'N/A'}</h3>
                            <p class="text-muted mb-0" style="font-size: 0.9rem;">Avg Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Filter plays based on search and filters
     */
    filterPlays() {
        this.filteredPlays = this.plays.filter(play => {
            // Search term filter
            if (this.searchTerm) {
                const searchLower = this.searchTerm.toLowerCase();
                const searchableText = [
                    play.name,
                    play.theatre,
                    play.review
                ].join(' ').toLowerCase();
                
                if (!searchableText.includes(searchLower)) {
                    return false;
                }
            }
            
            // Rating filter
            if (this.activeFilters.rating) {
                if (this.activeFilters.rating === 'standing') {
                    if (play.rating !== 'Standing Ovation' && play.rating !== 6 && !play.standing_ovation) {
                        return false;
                    }
                } else if (this.activeFilters.rating === 'unrated') {
                    if (play.rating && play.rating !== '') {
                        return false;
                    }
                } else {
                    const rating = parseFloat(play.rating);
                    if (isNaN(rating) || rating < parseFloat(this.activeFilters.rating)) {
                        return false;
                    }
                }
            }
            
            // Year filter
            if (this.activeFilters.year) {
                const playYear = play.date ? new Date(play.date).getFullYear() : null;
                if (playYear !== parseInt(this.activeFilters.year)) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.currentPage = 1;
        this.renderTable();
    }
    
    /**
     * Handle sorting
     */
    handleSort(field) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        
        this.filteredPlays.sort((a, b) => {
            let valueA = a[field];
            let valueB = b[field];
            
            // Handle nulls
            if (valueA === null || valueA === undefined) return 1;
            if (valueB === null || valueB === undefined) return -1;
            
            // Handle dates
            if (field === 'date') {
                valueA = new Date(valueA).getTime();
                valueB = new Date(valueB).getTime();
            }
            
            // Handle ratings (convert to numbers for sorting)
            if (field === 'rating') {
                if (valueA === 'Standing Ovation' || valueA === 6) valueA = 6;
                if (valueB === 'Standing Ovation' || valueB === 6) valueB = 6;
                valueA = parseFloat(valueA) || 0;
                valueB = parseFloat(valueB) || 0;
            }
            
            // String comparison
            if (typeof valueA === 'string') valueA = valueA.toLowerCase();
            if (typeof valueB === 'string') valueB = valueB.toLowerCase();
            
            // Compare
            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        this.renderTable();
        this.updateSortIndicators();
    }
    
    /**
     * Update sort indicators in table headers
     */
    updateSortIndicators() {
        document.querySelectorAll('.sortable').forEach(th => {
            const field = th.getAttribute('data-field');
            const icon = th.querySelector('i');
            
            if (field === this.sortField) {
                icon.className = this.sortDirection === 'asc' 
                    ? 'bi bi-caret-up-fill' 
                    : 'bi bi-caret-down-fill';
                icon.style.color = '#D4AF37';
            } else {
                icon.className = 'bi bi-arrow-down-up';
                icon.style.color = 'rgba(255,255,255,0.7)';
            }
        });
    }
    
    /**
     * Render the table
     */
    renderTable() {
        const tbody = document.getElementById('plays-tbody');
        const emptyState = document.getElementById('empty-state');
        
        if (this.filteredPlays.length === 0) {
            tbody.innerHTML = '';
            document.getElementById('plays-table').classList.add('d-none');
            emptyState.classList.remove('d-none');
            return;
        }
        
        document.getElementById('plays-table').classList.remove('d-none');
        emptyState.classList.add('d-none');
        
        // Pagination
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const paginatedPlays = this.filteredPlays.slice(startIndex, endIndex);
        
        tbody.innerHTML = paginatedPlays.map(play => this.renderPlayRow(play)).join('');
        
        this.renderPagination();
        this.bindRowEvents();
    }
    
    /**
     * Render a single play row
     */
    renderPlayRow(play) {
        const date = play.date ? FormatUtils.formatDate(play.date, 'DD/MM/YYYY') : '';
        const ratingDisplay = play.rating ? new RatingDisplay(play.rating, { size: 'sm' }).render() : '<span class="text-muted">Not rated</span>';
        const reviewPreview = play.review ? 
            (play.review.length > 50 ? play.review.substring(0, 50) + '...' : play.review) : 
            '<span class="text-muted">No review</span>';
        
        return `
            <tr data-play-id="${play.id}" style="border-bottom: 1px solid #f0f0f0; transition: background-color 0.2s ease;">
                <td style="padding: 1rem 0.75rem; vertical-align: middle;">
                    <div class="d-flex align-items-center">
                        <div class="play-name fw-medium" style="color: #333; font-size: 1rem;">${play.name || 'Untitled'}</div>
                        ${play.standing_ovation ? '<i class="bi bi-person-standing ms-2" style="color: #D4AF37; font-size: 1.1rem;" title="Standing Ovation"></i>' : ''}
                    </div>
                </td>
                <td style="padding: 1rem 0.75rem; vertical-align: middle; color: #666; font-size: 0.95rem;">${date}</td>
                <td style="padding: 1rem 0.75rem; vertical-align: middle; color: #666; font-size: 0.95rem;">${play.theatre || '<span style="color: #999;">Unknown</span>'}</td>
                <td style="padding: 1rem 0.75rem; vertical-align: middle;">${ratingDisplay}</td>
                <td style="padding: 1rem 0.75rem; vertical-align: middle;">
                    <div class="review-preview" style="color: #666; font-size: 0.9rem; line-height: 1.4;">
                        ${reviewPreview}
                    </div>
                </td>
                <td class="text-end" style="padding: 1rem 0.75rem; vertical-align: middle;">
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary edit-play-btn" data-play-id="${play.id}" title="Edit Play" style="border-color: #7D2935; color: #7D2935; padding: 0.375rem 0.75rem;">
                            <i class="bi bi-pencil"></i>
                        </button>

                        <button class="btn btn-outline-danger delete-play-btn" data-play-id="${play.id}" title="Delete Play" style="border-color: #EA4335; color: #EA4335; padding: 0.375rem 0.75rem;">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    /**
     * Bind events to table rows
     */
    bindRowEvents() {
        // Edit buttons
        document.querySelectorAll('.edit-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const playId = parseInt(btn.getAttribute('data-play-id'));
                document.dispatchEvent(new CustomEvent('editPlay', { detail: { playId } }));
            });
        });
        

        
        // Delete buttons
        document.querySelectorAll('.delete-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const playId = parseInt(btn.getAttribute('data-play-id'));
                if (confirm('Are you sure you want to delete this play?')) {
                    document.dispatchEvent(new CustomEvent('deletePlay', { detail: { playId } }));
                }
            });
        });
    }
    
    /**
     * Render pagination
     */
    renderPagination() {
        const totalPages = Math.ceil(this.filteredPlays.length / this.pageSize);
        const paginationContainer = document.getElementById('plays-pagination');
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        let paginationHtml = `
            <div class="d-flex justify-content-between align-items-center">
                <div class="pagination-info" style="color: #666; font-size: 0.95rem;">
                    Showing ${(this.currentPage - 1) * this.pageSize + 1} to ${Math.min(this.currentPage * this.pageSize, this.filteredPlays.length)} of ${this.filteredPlays.length} plays
                </div>
                <nav>
                    <ul class="pagination pagination-sm mb-0" style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        `;
        
        // Previous button
        paginationHtml += `
            <li class="page-item ${this.currentPage <= 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage - 1}" style="color: #7D2935; border-color: #e0e0e0;">
                    <i class="bi bi-chevron-left"></i>
                </a>
            </li>
        `;
        
        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible && startPage > 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        if (startPage > 1) {
            paginationHtml += `
                <li class="page-item">
                    <a class="page-link" href="#" data-page="1">1</a>
                </li>
                ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            `;
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}" style="color: ${i === this.currentPage ? 'white' : '#7D2935'}; background-color: ${i === this.currentPage ? '#7D2935' : 'white'}; border-color: #e0e0e0;">${i}</a>
                </li>
            `;
        }
        
        if (endPage < totalPages) {
            paginationHtml += `
                ${endPage < totalPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
                <li class="page-item">
                    <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
                </li>
            `;
        }
        
        // Next button
        paginationHtml += `
            <li class="page-item ${this.currentPage >= totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage + 1}" style="color: #7D2935; border-color: #e0e0e0;">
                    <i class="bi bi-chevron-right"></i>
                </a>
            </li>
        `;
        
        paginationHtml += `
                    </ul>
                </nav>
            </div>
        `;
        
        paginationContainer.innerHTML = paginationHtml;
        
        // Bind pagination events
        document.querySelectorAll('.pagination .page-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.getAttribute('data-page'));
                if (page >= 1 && page <= totalPages) {
                    this.currentPage = page;
                    this.renderTable();
                }
            });
        });
    }
    
    /**
     * Clear all filters
     */
    clearFilters() {
        this.searchTerm = '';
        this.activeFilters = {};
        
        document.getElementById('plays-search').value = '';
        document.getElementById('rating-filter').value = '';
        document.getElementById('year-filter').value = '';
        
        this.filteredPlays = [...this.plays];
        this.currentPage = 1;
        this.renderTable();
    }
    
    /**
     * Debounce function for search
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
} 