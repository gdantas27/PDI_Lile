/*
  # Create PDI Data Schema

  1. New Tables
    - `pdi_data`
      - `id` (uuid, primary key) - User ID from auth.users
      - `overview` (text) - Overview text
      - `main_objective` (text) - Main objective text
      - `section_order` (jsonb) - Order of sections
      - `custom_sections` (jsonb) - Custom section content
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `pdi_data` table
    - Add policies for authenticated users to:
      - Read their own data
      - Insert their own data
      - Update their own data

  3. Triggers
    - Add trigger to automatically update `updated_at` column
*/

-- Create the function to update the updated_at column if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the pdi_data table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pdi_data') THEN
    CREATE TABLE pdi_data (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      overview text NOT NULL,
      main_objective text NOT NULL,
      section_order jsonb NOT NULL,
      custom_sections jsonb NOT NULL DEFAULT '{}',
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS
ALTER TABLE pdi_data ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'pdi_data' AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data"
      ON pdi_data
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'pdi_data' AND policyname = 'Users can insert own data'
  ) THEN
    CREATE POLICY "Users can insert own data"
      ON pdi_data
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE tablename = 'pdi_data' AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data"
      ON pdi_data
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Create trigger for updating the updated_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'update_pdi_data_updated_at'
  ) THEN
    CREATE TRIGGER update_pdi_data_updated_at
      BEFORE UPDATE ON pdi_data
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;