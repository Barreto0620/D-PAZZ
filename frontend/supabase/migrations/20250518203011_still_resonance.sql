/*
  # Initial Schema Setup

  1. New Tables
    - categories
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - image (text)
      - featured (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)

    - products
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price (numeric)
      - old_price (numeric, nullable)
      - category_id (uuid, foreign key)
      - images (text[])
      - featured (boolean)
      - on_sale (boolean)
      - best_seller (boolean)
      - stock (integer)
      - rating (numeric)
      - review_count (integer)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image text,
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  old_price numeric(10,2) CHECK (old_price >= 0),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  images text[] NOT NULL DEFAULT '{}',
  featured boolean DEFAULT false,
  on_sale boolean DEFAULT false,
  best_seller boolean DEFAULT false,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating numeric(3,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count integer DEFAULT 0 CHECK (review_count >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Allow public read access" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for products
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow admin full access" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();