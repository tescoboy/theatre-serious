/**
 * Update a play in the database
 * @param {Object} play - The play data to update
 * @returns {Promise<Object>} - The updated play
 */
async updatePlay(play) {
    console.log('Updating play in database:', play);
    console.log('Rating type:', typeof play.rating, 'Value:', play.rating);
    
    try {
        // Make sure we have valid data
        if (!play || !play.id) {
            throw new Error('Invalid play data for update');
        }
        
        // Make the Supabase update
        const { data, error } = await this.supabase
            .from('plays')
            .update({
                name: play.name,
                date: play.date,
                theatre: play.theatre,
                image: play.image,
                rating: play.rating, // Ensure this is explicitly included
                updated_at: new Date().toISOString()
            })
            .eq('id', play.id)
            .select()
            .single();
        
        if (error) throw error;
        
        console.log('Successfully updated play:', data);
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