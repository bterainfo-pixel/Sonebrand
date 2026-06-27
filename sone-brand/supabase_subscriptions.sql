-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (signup)
CREATE POLICY "Allow anonymous inserts" ON subscriptions
    FOR INSERT WITH CHECK (true);

-- Create policy to allow admin to select
-- (For simplicity, we allow all for now, but in production you'd restrict this)
CREATE POLICY "Allow all selects" ON subscriptions
    FOR SELECT USING (true);
