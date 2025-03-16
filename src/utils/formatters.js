/**
 * Utility functions for formatting data
 */
const FormatUtils = {
    /**
     * Formats a value for display in the table
     * @param {*} value - Value to format
     * @returns {string} Formatted value
     */
    formatValue: function(value) {
        // Handle null values
        if (value === null) {
            return '<span class="text-muted">null</span>';
        }
        
        // Handle objects (including arrays)
        if (typeof value === 'object') {
            try {
                return `<code>${JSON.stringify(value)}</code>`;
            } catch (e) {
                return String(value);
            }
        }
        
        // Handle booleans
        if (typeof value === 'boolean') {
            return value ? 
                '<span class="badge bg-success">true</span>' : 
                '<span class="badge bg-danger">false</span>';
        }
        
        // Handle dates
        if (value instanceof Date || (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/))) {
            try {
                const date = new Date(value);
                return date.toLocaleString();
            } catch (e) {
                return value;
            }
        }
        
        // Return as string for all other types
        return String(value);
    },

    /**
     * Format a date string
     * @param {string} dateString - The date string to format
     * @param {string} format - Optional format (default is 'MMM D, YYYY')
     * @returns {string} Formatted date string
     */
    formatDate: function(dateString, format = 'MMM D, YYYY') {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Return original if invalid
        
        // DD/MM/YYYY format
        if (format === 'DD/MM/YYYY') {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
        
        // Default format (MMM D, YYYY)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        
        return `${month} ${day}, ${year}`;
    }
}; 