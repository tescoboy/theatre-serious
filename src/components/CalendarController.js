/**
 * CalendarController - Manages the calendar view
 */
class CalendarController {
    constructor() {
        this.calendar = new CalendarView('calendar-grid');
        this.currentMonthButton = document.getElementById('current-month');
        this.prevMonthButton = document.getElementById('prev-month');
        this.nextMonthButton = document.getElementById('next-month');
        this.months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        this.playsData = [];
        this.initialized = false;
        
        console.log('CalendarController initialized');
    }
    
    /**
     * Initialize the calendar
     */
    initialize() {
        if (this.initialized) return;
        
        this.calendar.initCalendar();
        this.updateMonthDisplay();
        
        // Add event listeners for calendar navigation
        this.prevMonthButton.addEventListener('click', () => {
            this.calendar.previousMonth();
            this.updateMonthDisplay();
            this.calendar.populateCalendar(this.playsData);
        });
        
        this.nextMonthButton.addEventListener('click', () => {
            this.calendar.nextMonth();
            this.updateMonthDisplay();
            this.calendar.populateCalendar(this.playsData);
        });
        
        this.initialized = true;
    }
    
    /**
     * Set plays data
     * @param {Array} data - Array of play objects
     */
    setPlaysData(data) {
        this.playsData = data;
        if (this.initialized) {
            this.calendar.populateCalendar(data);
        }
    }
    
    /**
     * Update the month display
     */
    updateMonthDisplay() {
        this.currentMonthButton.textContent = `${this.months[this.calendar.currentMonth]} ${this.calendar.currentYear}`;
    }
} 