/**
 * DataTable component for displaying tabular data with sorting and filtering
 */
class DataTable {
    /**
     * Creates a DataTable instance
     * @param {string} containerId - ID of the container element
     */
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        console.log('DataTable component initialized');
    }
    
    /**
     * Displays data in a table format
     * @param {Array} data - Array of objects to display
     * @param {Object} options - Display options
     * @param {Function} options.onSort - Callback function when a column is sorted
     * @param {Array} options.excludeColumns - Columns to exclude from the table
     * @param {string} options.currentSortColumn - Currently sorted column
     * @param {string} options.currentSortDirection - Current sort direction ('asc' or 'desc')
     * @param {Object} options.formatters - Column formatters {columnName: formatterFunction}
     */
    displayData(data, options = {}) {
        const { 
            onSort = null,
            excludeColumns = [],
            currentSortColumn = null,
            currentSortDirection = 'asc',
            formatters = {}
        } = options;
        
        console.log(`Displaying ${data.length} rows of data`);
        
        if (!data || data.length === 0) {
            this.container.innerHTML = `
                <div class="card-body">
                    <p class="card-text text-center">No data available</p>
                </div>
            `;
            return;
        }
        
        // Get columns (excluding any specified in options.excludeColumns)
        const columns = Object.keys(data[0]).filter(col => !excludeColumns.includes(col));
        
        // Build the table header
        let tableHtml = `
            <div class="table-responsive">
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            ${this.buildTableHeader(columns, options)}
                        </tr>
                    </thead>
                    <tbody>
                        ${this.buildTableRows(data, columns, options)}
                    </tbody>
                </table>
            </div>
        `;
        
        this.container.innerHTML = tableHtml;
        
        // Add event listeners for sorting
        if (onSort) {
            this.container.querySelectorAll('th.sortable').forEach(th => {
                th.addEventListener('click', () => {
                    const column = th.getAttribute('data-column');
                    onSort(column);
                });
            });
        }
    }
    
    /**
     * Build table header HTML
     * @param {Array} columns - Array of column names
     * @param {Object} options - Display options
     * @returns {string} HTML for table header
     */
    buildTableHeader(columns, options) {
        return columns.map(column => {
            const isSorted = column === options.currentSortColumn;
            const sortIcon = isSorted 
                ? options.currentSortDirection === 'asc' 
                    ? '<i class="bi bi-caret-up-fill ms-1"></i>' 
                    : '<i class="bi bi-caret-down-fill ms-1"></i>'
                : '<i class="bi bi-arrow-down-up ms-1 text-muted opacity-25"></i>';
            
            return `
                <th scope="col" class="sortable" data-column="${column}">
                    ${this.formatColumnName(column)}
                    ${options.onSort ? sortIcon : ''}
                </th>
            `;
        }).join('');
    }
    
    /**
     * Build table rows HTML
     * @param {Array} data - Array of objects
     * @param {Array} columns - Array of column names
     * @param {Object} options - Display options
     * @returns {string} HTML for table rows
     */
    buildTableRows(data, columns, options = {}) {
        const formatters = options.formatters || {};
        
        return data.map(row => `
            <tr>
                ${columns.map(column => {
                    const value = row[column];
                    // Use formatter if provided, otherwise format value
                    const displayValue = formatters[column] ? 
                        formatters[column](value, row) : 
                        FormatUtils.formatValue(value);
                    return `<td>${displayValue}</td>`;
                }).join('')}
            </tr>
        `).join('');
    }
    
    /**
     * Formats column name for display (converts snake_case to Title Case)
     * @param {string} columnName - Original column name
     * @returns {string} Formatted column name
     */
    formatColumnName(columnName) {
        return columnName
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
} 