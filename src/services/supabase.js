/**
 * Supabase service for handling data fetching and API calls
 */
const SupabaseService = (function() {
    // Supabase credentials
    const SUPABASE_URL = 'https://egyoysnqyyqkiylrncqt.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVneW95c25xeXlxa2l5bHJuY3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNDIxMzEsImV4cCI6MjA2OTcxODEzMX0.SzeFB6aWi0oabzmXmHAmLcoE4bQyLpv1jmHQseGMFfM';
    
    // Initialize Supabase client - use the global supabase object
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Public methods
    return {
        /**
         * Fetches plays data from Supabase
         * @param {number} limit - Maximum number of records to fetch
         * @returns {Promise<Array>} - Array of play objects
         */
        fetchPlays: async function(limit = 100) {
            console.log(`Fetching up to ${limit} plays from Supabase...`);
            
            try {
                const { data, error } = await supabaseClient
                    .from('plays')
                    .select('*')
                    .limit(limit)
                    .order('date', { ascending: false });
                
                if (error) {
                    console.error('Supabase error:', error);
                    throw new Error(error.message);
                }
                
                console.log(`Successfully fetched ${data ? data.length : 0} plays`);
                
                // Debug the standing ovation data
                const standingOvationPlays = data.filter(p => p.standing_ovation);
                console.log('Plays with standing ovation from DB:', standingOvationPlays.map(p => ({
                    id: p.id,
                    name: p.name,
                    standing_ovation: p.standing_ovation
                })));
                
                return data || [];
            } catch (error) {
                console.error('Error in fetchPlays:', error);
                throw error;
            }
        },
        /**
         * Add a new play to the database
         * @param {Object} play - The play data to add
         * @returns {Promise<Object>} The saved play data
         */
        addPlay: async function(play) {
            // Validate required fields
            if (!play.name || !play.date) {
                throw new Error('Play name and date are required');
            }
            
            try {
                const { data, error } = await supabaseClient
                    .from('plays')
                    .insert([play])
                    .select();
                
                if (error) {
                    throw error;
                }
                
                console.log('Play added successfully:', data);
                return data[0];
            } catch (error) {
                console.error('Error adding play:', error);
                throw error;
            }
        },
        /**
         * Get a play by ID
         * @param {number} id - The ID of the play to get
         * @returns {Promise<Object>} The play data
         */
        getPlayById: async function(id) {
            try {
                const { data, error } = await supabaseClient
                    .from('plays')
                    .select('*')
                    .eq('id', id)
                    .single();
                
                if (error) {
                    throw error;
                }
                
                console.log('Play retrieved:', data);
                return data;
            } catch (error) {
                console.error('Error getting play by ID:', error);
                throw error;
            }
        },
        /**
         * Update an existing play
         * @param {Object} play - The play data to update
         * @returns {Promise<Object>} The updated play data
         */
        updatePlay: async function(play) {
            console.log('supabase.js: Updating play with all fields:', play);
            
            try {
                // Show all fields we're updating
                const updateFields = {
                    name: play.name,
                    date: play.date,
                    theatre: play.theatre,
                    image: play.image,
                    rating: play.rating,
                    review: play.review,
                    review_updated_at: play.review_updated_at,
                    updated_at: new Date().toISOString()
                };
                
                console.log('supabase.js: Fields being updated:', updateFields);
                
                // Use the existing supabaseClient
                const { data, error } = await supabaseClient
                    .from('plays')
                    .update(updateFields)
                    .eq('id', play.id)
                    .select('*')
                    .single();
                
                if (error) throw error;
                
                console.log('supabase.js: Play updated successfully:', data);
                console.log('supabase.js: Review field present in response?', data.hasOwnProperty('review'));
                console.log('supabase.js: Review value:', data.review);
                console.log('supabase.js: Rating field present in response?', data.hasOwnProperty('rating'));
                console.log('supabase.js: Rating value:', data.rating);
                console.log('supabase.js: Rating type:', typeof data.rating);
                
                return data;
            } catch (error) {
                console.error('Error updating play:', error);
                throw error;
            }
        },
        /**
         * Delete a play
         * @param {number} id - The ID of the play to delete
         * @returns {Promise<void>}
         */
        deletePlay: async function(id) {
            if (!id) {
                throw new Error('Play ID is required');
            }
            
            try {
                const { error } = await supabaseClient
                    .from('plays')
                    .delete()
                    .eq('id', id);
                
                if (error) {
                    throw error;
                }
                
                console.log('Play deleted successfully');
            } catch (error) {
                console.error('Error deleting play:', error);
                throw error;
            }
        }
    };
})(); 