/**
 * Utility functions for formatting data
 */
class FormatUtils {
    /**
     * Format date to UK format (DD/MM/YYYY)
     * @param {string} dateString - Date string to format
     * @param {string} format - Format string (optional, defaults to DD/MM/YYYY)
     * @returns {string} - Formatted date
     */
    static formatDate(dateString, format = 'DD/MM/YYYY') {
        if (!dateString) return 'Date not specified';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date)) return 'Invalid date';
            
            // Format as DD/MM/YYYY (UK format)
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            
            return `${day}/${month}/${year}`;
        } catch (e) {
            console.error('Error formatting date:', e);
            return 'Date error';
        }
    }
    
    /**
     * Format currency value
     * @param {number} value - Value to format
     * @returns {string} - Formatted currency string
     */
    static formatCurrency(value) {
        if (value === null || value === undefined) return '';
        return new Intl.NumberFormat('en-GB', { 
            style: 'currency', 
            currency: 'GBP' 
        }).format(value);
    }
} 