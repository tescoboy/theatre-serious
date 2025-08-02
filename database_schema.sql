-- Database Schema for Vibes2 Theatre App
-- This creates the plays table with all necessary fields

-- Create the plays table
CREATE TABLE IF NOT EXISTS plays (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    theatre VARCHAR(255),
    image TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    review_updated_at TIMESTAMP WITH TIME ZONE,
    standing_ovation BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_plays_date ON plays(date DESC);
CREATE INDEX IF NOT EXISTS idx_plays_rating ON plays(rating);
CREATE INDEX IF NOT EXISTS idx_plays_standing_ovation ON plays(standing_ovation);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_plays_updated_at 
    BEFORE UPDATE ON plays 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add some sample data (optional - you can remove this if you want to add data manually)
INSERT INTO plays (name, date, theatre, rating, review, standing_ovation) VALUES
('Hamlet', '2024-01-15', 'Royal Shakespeare Company', 5, 'Absolutely stunning performance. The modern interpretation brought new life to this classic.', TRUE),
('Romeo and Juliet', '2024-02-20', 'Globe Theatre', 4, 'Beautiful staging and excellent acting. The balcony scene was particularly moving.', FALSE),
('Macbeth', '2024-03-10', 'National Theatre', 5, 'Dark and powerful production. The witches were particularly haunting.', TRUE),
('A Midsummer Night''s Dream', '2024-04-05', 'Open Air Theatre', 4, 'Magical outdoor production. Perfect for a summer evening.', FALSE),
('King Lear', '2024-05-12', 'Old Vic', 3, 'Solid performance but felt a bit long. Some scenes could have been trimmed.', FALSE);

-- Enable Row Level Security (RLS) for future use
ALTER TABLE plays ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (you can modify this later for security)
CREATE POLICY "Allow all operations on plays" ON plays
    FOR ALL USING (true); 