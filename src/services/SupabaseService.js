/**
 * Update a play in the database
 * @param {Object} play - The play data to update
 * @returns {Promise<Object>} - The updated play
 */
async updatePlay(play) {
    console.log('Updating play in database:', play);
    console.log('Review in play object:', play.review);
    console.log('Review updated at:', play.review_updated_at);
    
    try {
        // Make sure we have valid data
        if (!play || !play.id) {
            throw new Error('Invalid play data for update');
        }
        
        // Create update object with all fields explicitly
        const updateData = {
            name: play.name,
            date: play.date,
            theatre: play.theatre,
            image: play.image,
            rating: play.rating,
            review: play.review,
            review_updated_at: play.review_updated_at,
            updated_at: new Date().toISOString()
        };
        
        console.log('Update data being sent to Supabase:', updateData);
        
        // Make the Supabase update
        const { data, error } = await this.supabase
            .from('plays')
            .update(updateData)
            .eq('id', play.id)
            .select()
            .single();
        
        if (error) {
            console.error('Supabase update error:', error);
            throw error;
        }
        
        console.log('Successfully updated play with review:', data);
        console.log('Review in returned data:', data.review);
        return data;
    } catch (error) {
        console.error('Error updating play:', error);
        throw error;
    }
}

/**
 * Get distinct theatre names from plays table
 * @returns {Promise<Array>} - Array of theatre names
 */
async getTheatres() {
    console.log('Fetching theatres list');
    
    try {
        // Get all plays and extract distinct theatre names
        const { data, error } = await this.supabase
            .from('plays')
            .select('theatre')
            .not('theatre', 'is', null)
            .order('theatre');
        
        if (error) throw error;
        
        // Extract unique theatre names
        const theatres = [...new Set(data.map(play => play.theatre))]
            .filter(Boolean) // Remove null/empty values
            .sort();
        
        console.log(`Found ${theatres.length} unique theatres`);
        return theatres;
    } catch (error) {
        console.error('Error fetching theatres:', error);
        return [];
    }
}