/**
 * Calendar view component for displaying plays by date
 */
class CalendarView {
    /**
     * Creates a new CalendarView
     * @param {string} containerId - ID of the container element
     */
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            console.error(`Calendar container not found: ${containerId}`);
            return;
        }
        
        // Set initial date to current month
        const now = new Date();
        this.currentMonth = now.getMonth();
        this.currentYear = now.getFullYear();
        
        console.log('Calendar component initialized');
    }
    
    /**
     * Initialize the calendar grid
     */
    initCalendar() {
        if (!this.container) {
            console.error('Calendar container not available for initialization');
            return;
        }
        this.generateCalendarGrid();
    }
    
    /**
     * Move to the previous month
     */
    previousMonth() {
        if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.currentYear--;
        } else {
            this.currentMonth--;
        }
        this.generateCalendarGrid();
    }
    
    /**
     * Move to the next month
     */
    nextMonth() {
        if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else {
            this.currentMonth++;
        }
        this.generateCalendarGrid();
    }
    
    /**
     * Generate the calendar grid for the current month/year
     */
    generateCalendarGrid() {
        if (!this.container) {
            console.error('Calendar container not available for grid generation');
            return;
        }
        
        // Get the first day of the month
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        // Get the last day of the month
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        
        // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
        const firstDayOfWeek = firstDay.getDay();
        
        // Get the number of days in the month
        const daysInMonth = lastDay.getDate();
        
        // Create the calendar header (days of the week)
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        let calendarHTML = `
            <div class="calendar">
                <div class="calendar-header row">
                    ${daysOfWeek.map(day => `<div class="col calendar-header-cell">${day}</div>`).join('')}
                </div>
                <div class="calendar-body">
        `;
        
        // Start with empty cells for days before the first day of the month
        let dayCount = 1;
        let calendarRow = '<div class="row calendar-row">';
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfWeek; i++) {
            calendarRow += '<div class="col calendar-cell calendar-cell-empty"></div>';
        }
        
        // Fill in the days of the month
        for (let i = firstDayOfWeek; i < 7; i++) {
            if (dayCount <= daysInMonth) {
                calendarRow += `
                    <div class="col calendar-cell" data-date="${this.currentYear}-${(this.currentMonth+1).toString().padStart(2, '0')}-${dayCount.toString().padStart(2, '0')}">
                        <div class="calendar-date">${dayCount}</div>
                        <div class="calendar-events"></div>
                    </div>
                `;
                dayCount++;
            } else {
                calendarRow += '<div class="col calendar-cell calendar-cell-empty"></div>';
            }
        }
        calendarRow += '</div>';
        calendarHTML += calendarRow;
        
        // Continue with remaining weeks
        while (dayCount <= daysInMonth) {
            calendarRow = '<div class="row calendar-row">';
            
            for (let i = 0; i < 7; i++) {
                if (dayCount <= daysInMonth) {
                    calendarRow += `
                        <div class="col calendar-cell" data-date="${this.currentYear}-${(this.currentMonth+1).toString().padStart(2, '0')}-${dayCount.toString().padStart(2, '0')}">
                            <div class="calendar-date">${dayCount}</div>
                            <div class="calendar-events"></div>
                        </div>
                    `;
                    dayCount++;
                } else {
                    calendarRow += '<div class="col calendar-cell calendar-cell-empty"></div>';
                }
            }
            
            calendarRow += '</div>';
            calendarHTML += calendarRow;
        }
        
        calendarHTML += `
                </div>
            </div>
        `;
        
        this.container.innerHTML = calendarHTML;
    }
    
    /**
     * Populate the calendar with plays
     * @param {Array} playsData - Array of play objects
     */
    populateCalendar(playsData) {
        if (!playsData || playsData.length === 0) {
            console.log('No plays data to display in calendar');
            return;
        }
        
        console.log('Populating calendar with plays:', playsData);
        
        // Reset all event containers
        const eventContainers = this.container.querySelectorAll('.calendar-events');
        eventContainers.forEach(container => {
            container.innerHTML = '';
        });
        
        // Get current date for past/future comparison
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
        
        // Process each play
        playsData.forEach(play => {
            // Find the date field (assuming it's called "date" or "performance_date")
            // We'll need to check which field contains date information
            let playDate = null;
            
            // Check common date field names
            const possibleDateFields = ['date', 'performance_date', 'play_date', 'viewed_date', 'created_at'];
            
            for (const field of possibleDateFields) {
                if (play[field] && typeof play[field] === 'string') {
                    try {
                        // Try to parse the date
                        const date = new Date(play[field]);
                        if (!isNaN(date.getTime())) {
                            playDate = date;
                            break;
                        }
                    } catch (e) {
                        console.log(`Field ${field} is not a valid date:`, play[field]);
                    }
                }
            }
            
            if (!playDate) {
                console.log('Could not find a valid date for play:', play);
                return; // Skip this play
            }
            
            // Check if the play date is in the current month
            if (playDate.getMonth() !== this.currentMonth || playDate.getFullYear() !== this.currentYear) {
                return; // Skip plays not in the current month/year
            }
            
            // Format the date to match our data-date attribute format
            const dateString = `${playDate.getFullYear()}-${(playDate.getMonth()+1).toString().padStart(2, '0')}-${playDate.getDate().toString().padStart(2, '0')}`;
            
            // Find the corresponding calendar cell
            const cell = this.container.querySelector(`.calendar-cell[data-date="${dateString}"]`);
            
            if (cell) {
                const eventsContainer = cell.querySelector('.calendar-events');
                
                // Create event element for the play
                const playName = play.name || play.title || 'Unnamed Play';
                const theatre = play.theatre || play.venue || '';
                const rating = play.rating || play.score || '';
                
                // Determine if the play is in the past or future
                const timeClass = playDate > now ? 'future-event' : 'past-event';
                
                let eventHTML = `
                    <div class="calendar-event ${timeClass}">
                        <div class="event-title">${playName}</div>
                `;
                
                if (theatre) {
                    eventHTML += `<div class="event-location">${theatre}</div>`;
                }
                
                if (rating) {
                    eventHTML += `<div class="event-rating">
                        ${new RatingDisplay(rating, { size: 'sm' }).render()}
                    </div>`;
                }
                
                eventHTML += `</div>`;
                
                eventsContainer.innerHTML += eventHTML;
            }
        });
    }
} 