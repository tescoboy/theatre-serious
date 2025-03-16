/**
 * TableView component for managing the table view functionality
 */
class TableView {
    constructor() {
        // DOM elements
        this.dataTable = new DataTable('data-container');
        this.messageContainer = document.getElementById('message-container');
        this.paginationContainer = document.getElementById('pagination-container');
        this.pageSizeSelect = document.getElementById('page-size');
        this.searchBtn = document.getElementById('search-btn');
        this.searchInput = document.getElementById('search-input');
        this.prevPageBtn = document.getElementById('prev-page');
        this.nextPageBtn = document.getElementById('next-page');
        
        // State
        this.allPlaysData = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.pageSize = parseInt(this.pageSizeSelect.value, 10);
        this.sortColumn = null;
        this.sortDirection = 'asc';
        
        // Initialize event listeners
        this.initEventListeners();
        console.log('TableView component initialized');
    }
    
    /**
     * Initialize event listeners
     */
    initEventListeners() {
        this.pageSizeSelect.addEventListener('change', () => this.handlePageSizeChange());
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        
        this.prevPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateTable();
            }
        });
        
        this.nextPageBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.updateTable();
            }
        });
    }
    
    /**
     * Set plays data and update the view
     * @param {Array} plays - Array of play objects
     */
    setPlaysData(plays) {
        console.log('Setting plays data in TableView:', plays.length, 'plays');
        
        this.allPlaysData = plays;
        this.filteredData = [...plays];
        
        // Generate table data with our custom formatter
        this.tableData = this.generateTableData(plays);
        
        // Use our new initializeTable method instead of updateTable
        this.initializeTable();
        
        // Hide the loading message
        const messageContainer = document.getElementById('message-container');
        if (messageContainer) {
            messageContainer.classList.add('d-none');
        }
        
        // Show summary
        this.updateSummary();
        
        // Show pagination if needed
        if (plays.length > 0) {
            this.paginationContainer.classList.remove('d-none');
        } else {
            this.paginationContainer.classList.add('d-none');
        }
    }
    
    /**
     * Filter table data by search term
     * @param {string} searchTerm - Term to search for
     */
    filterBySearchTerm(searchTerm) {
        console.log('Filtering by search term:', searchTerm);
        
        // If search term is empty, reset filter
        if (!searchTerm.trim()) {
            this.filteredData = [...this.allPlaysData];
        } else {
            // Filter data
            this.filteredData = this.allPlaysData.filter(play => {
                return Object.values(play).some(value => {
                    if (value === null || value === undefined) return false;
                    return String(value).toLowerCase().includes(searchTerm.toLowerCase());
                });
            });
        }
        
        // Reset pagination
        this.currentPage = 1;
        
        // Generate new table data with formatted dates and edit buttons
        this.tableData = this.generateTableData(this.filteredData);
        
        // Update table
        this.initializeTable();
        
        // Update pagination
        this.updatePagination();
    }
    
    /**
     * Handle search button click
     */
    handleSearch() {
        const searchTerm = document.getElementById('search-input').value;
        this.filterBySearchTerm(searchTerm);
    }
    
    /**
     * Handle page size change
     */
    handlePageSizeChange() {
        this.pageSize = parseInt(this.pageSizeSelect.value, 10);
        this.currentPage = 1;
        this.updateTable();
    }
    
    /**
     * Handle column sorting
     * @param {string} column - Column to sort by
     */
    handleSort(column) {
        console.log(`Sorting by column: ${column}`);
        
        if (this.sortColumn === column) {
            // Toggle direction if clicking the same column
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // Default to ascending for a new column
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        // Sort the actual data (not just the table display)
        this.filteredData.sort((a, b) => {
            let valueA = a[column];
            let valueB = b[column];
            
            // Handle nulls
            if (valueA === null || valueA === undefined) return -1;
            if (valueB === null || valueB === undefined) return 1;
            
            // Convert to lowercase strings for case-insensitive comparison if strings
            if (typeof valueA === 'string') valueA = valueA.toLowerCase();
            if (typeof valueB === 'string') valueB = valueB.toLowerCase();
            
            // For dates
            if (column === 'date') {
                valueA = new Date(valueA).getTime();
                valueB = new Date(valueB).getTime();
            }
            
            // Compare values
            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        // Re-generate table data
        this.tableData = this.generateTableData(this.filteredData);
        
        // Refresh the table
        this.initializeTable();
    }
    
    /**
     * Update the table display
     */
    updateTable() {
        // Apply sorting if needed
        if (this.sortColumn) {
            this.filteredData.sort((a, b) => {
                const valA = a[this.sortColumn];
                const valB = b[this.sortColumn];
                
                // Handle null/undefined values
                if (valA === null || valA === undefined) return this.sortDirection === 'asc' ? -1 : 1;
                if (valB === null || valB === undefined) return this.sortDirection === 'asc' ? 1 : -1;
                
                // Handle different data types
                if (typeof valA === 'number' && typeof valB === 'number') {
                    return this.sortDirection === 'asc' ? valA - valB : valB - valA;
                }
                
                // Convert both values to strings for comparison
                const strA = String(valA).toLowerCase();
                const strB = String(valB).toLowerCase();
                
                return this.sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
            });
        }
        
        // Apply pagination
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const paginatedData = this.filteredData.slice(startIndex, endIndex);
        
        // Update table with RatingDisplay for rating column
        this.dataTable.displayData(paginatedData, {
            onSort: (column) => this.handleSort(column),
            excludeColumns: ['id', 'image'],
            currentSortColumn: this.sortColumn,
            currentSortDirection: this.sortDirection,
            formatters: {
                'rating': (value) => {
                    if (!value) return '';
                    return new RatingDisplay(value, { size: 'sm' }).render();
                }
            }
        });
        
        // Update pagination UI
        this.updatePagination();
    }
    
    /**
     * Update pagination controls
     */
    updatePagination() {
        const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        
        // Enable/disable prev/next buttons
        this.prevPageBtn.classList.toggle('disabled', this.currentPage <= 1);
        this.nextPageBtn.classList.toggle('disabled', this.currentPage >= totalPages);
        
        // Update page number display
        const paginationElement = document.querySelector('.pagination');
        let paginationHtml = `
            <li class="page-item ${this.currentPage <= 1 ? 'disabled' : ''}" id="prev-page">
                <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `;
        
        // Determine which page numbers to show
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // First page link if not starting at 1
        if (startPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`;
            if (startPage > 2) {
                paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }
        
        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `;
        }
        
        // Last page link if not ending at totalPages
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            paginationHtml += `<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`;
        }
        
        paginationHtml += `
            <li class="page-item ${this.currentPage >= totalPages ? 'disabled' : ''}" id="next-page">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `;
        
        paginationElement.innerHTML = paginationHtml;
        
        // Add event listeners to page number links
        document.querySelectorAll('.pagination .page-link[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(link.getAttribute('data-page'), 10);
                if (page !== this.currentPage) {
                    this.currentPage = page;
                    this.updateTable();
                }
            });
        });
        
        // Re-add event listeners for next/prev
        document.getElementById('prev-page').addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateTable();
            }
        });
        
        document.getElementById('next-page').addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.updateTable();
            }
        });
        
        // Show summary
        const start = Math.min((this.currentPage - 1) * this.pageSize + 1, this.filteredData.length);
        const end = Math.min(start + this.pageSize - 1, this.filteredData.length);
        const summaryText = `Showing ${start} to ${end} of ${this.filteredData.length} entries${
            this.filteredData.length !== this.allPlaysData.length ? ` (filtered from ${this.allPlaysData.length} total entries)` : ''
        }`;
        
        // Update or create summary element
        let summaryElement = document.getElementById('table-summary');
        if (!summaryElement) {
            summaryElement = document.createElement('div');
            summaryElement.id = 'table-summary';
            summaryElement.className = 'text-muted small mt-2';
            this.paginationContainer.appendChild(summaryElement);
        }
        summaryElement.textContent = summaryText;
    }

    /**
     * Generate play data for the table
     * @param {array} plays - Array of play objects
     * @returns {array} - Array of data for the table
     */
    generateTableData(plays) {
        // Map plays data for the table
        return plays.map(play => {
            // Format date as dd/mm/yyyy
            const date = play.date ? FormatUtils.formatDate(play.date, 'DD/MM/YYYY') : '';
            
            // Create rating display
            const ratingDisplay = play.rating ? new RatingDisplay(play.rating).render() : '';
            
            // Create actions column with edit button
            const actions = `
                <button class="btn btn-sm btn-primary edit-play-btn" data-play-id="${play.id}" title="Edit Play">
                    <i class="bi bi-pencil"></i> Edit
                </button>
            `;
            
            return [
                play.name || '',
                date,
                play.theatre || '',
                ratingDisplay,
                actions // Add actions column
            ];
        });
    }

    /**
     * Initialize the table
     */
    initializeTable() {
        // Get the data container
        const container = document.getElementById('data-container');
        
        // Create a proper table structure
        let tableHtml = `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th class="sortable" data-column="0">
                                Play Name ${this.sortColumn === 0 ? (this.sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th class="sortable" data-column="1">
                                Date ${this.sortColumn === 1 ? (this.sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th class="sortable" data-column="2">
                                Theatre ${this.sortColumn === 2 ? (this.sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th class="sortable" data-column="3">
                                Rating ${this.sortColumn === 3 ? (this.sortDirection === 'asc' ? '↑' : '↓') : ''}
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        // Add rows
        this.tableData.forEach(row => {
            tableHtml += '<tr>';
            row.forEach(cell => {
                tableHtml += `<td>${cell}</td>`;
            });
            tableHtml += '</tr>';
        });
        
        tableHtml += `
                    </tbody>
                </table>
            </div>
        `;
        
        // Set the HTML content
        container.innerHTML = tableHtml;
        
        // Add sort event listeners to headers
        const headers = container.querySelectorAll('th.sortable');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = parseInt(header.getAttribute('data-column'));
                this.handleColumnSort(column);
            });
        });
        
        // Add event listeners to edit buttons
        setTimeout(() => {
            const editButtons = container.querySelectorAll('.edit-play-btn');
            console.log(`Found ${editButtons.length} edit buttons in table view`);
            
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
        }, 100);
    }

    /**
     * Handle sorting by column number in the table
     * @param {number} column - Column index to sort by (0-based)
     */
    handleColumnSort(column) {
        console.log(`Sorting by column index: ${column}`);
        
        if (this.sortColumn === column) {
            // Toggle direction if clicking the same column
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // Default to ascending for a new column
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        
        // Create a mapping to the underlying data properties based on column index
        const columnMapping = {
            0: 'name',    // Play Name
            1: 'date',    // Date
            2: 'theatre', // Theatre
            3: 'rating'   // Rating
        };
        
        // Get the actual property name to sort by
        const property = columnMapping[column];
        
        // Sort the data
        this.filteredData.sort((a, b) => {
            let valueA = a[property];
            let valueB = b[property];
            
            // Handle nulls
            if (valueA === null || valueA === undefined) return -1;
            if (valueB === null || valueB === undefined) return 1;
            
            // Convert to lowercase strings for case-insensitive comparison if strings
            if (typeof valueA === 'string') valueA = valueA.toLowerCase();
            if (typeof valueB === 'string') valueB = valueB.toLowerCase();
            
            // For dates
            if (property === 'date') {
                valueA = new Date(valueA).getTime();
                valueB = new Date(valueB).getTime();
            }
            
            // Compare values
            if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        // Re-generate table data and refresh
        this.tableData = this.generateTableData(this.filteredData);
        this.initializeTable();
    }

    /**
     * Update pagination summary
     */
    updateSummary() {
        const start = 1;
        const end = Math.min(this.pageSize, this.filteredData.length);
        const summaryText = `Showing ${start} to ${end} of ${this.filteredData.length} entries${
            this.filteredData.length !== this.allPlaysData.length ? ` (filtered from ${this.allPlaysData.length} total entries)` : ''
        }`;
        
        // Update or create summary element
        let summaryElement = document.getElementById('table-summary');
        if (!summaryElement) {
            summaryElement = document.createElement('div');
            summaryElement.id = 'table-summary';
            summaryElement.className = 'text-muted small mt-2';
            this.paginationContainer.appendChild(summaryElement);
        }
        summaryElement.textContent = summaryText;
    }
} 