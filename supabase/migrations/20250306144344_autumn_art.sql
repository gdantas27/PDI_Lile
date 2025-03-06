/*
  # PDI Data Schema with Safe Operations

  1. New Tables
    - `pdi_data`
      - `id` (uuid, primary key) - User ID from auth.users
      - `overview` (text) - Overview text
      - `main_objective` (text) - Main objective text
      - `section_order` (jsonb) - Order and configuration of sections
      - `custom_sections` (jsonb) - Custom section content
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `pdi_data` table
    - Add policies for authenticated users to:
      - Read their own data
      - Insert their own data
      - Update their own data

  3. Changes
    - Safe table creation with IF NOT EXISTS
    - Safe policy creation with DO blocks
    - Safe trigger creation with IF NOT EXISTS
*/

-- Create the pdi_data table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pdi_data') THEN
    CREATE TABLE public.pdi_data (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      overview text NOT NULL,
      main_objective text NOT NULL,
      section_order jsonb NOT NULL,
      custom_sections jsonb NOT NULL,
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'pdi_data' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.pdi_data ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Safely create policies
DO $$ 
BEGIN
  -- Select policy
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'pdi_data' 
    AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data"
      ON public.pdi_data
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  -- Insert policy
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'pdi_data' 
    AND policyname = 'Users can insert own data'
  ) THEN
    CREATE POLICY "Users can insert own data"
      ON public.pdi_data
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'pdi_data' 
    AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data"
      ON public.pdi_data
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Safely create the trigger
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'update_pdi_data_updated_at'
  ) THEN
    CREATE TRIGGER update_pdi_data_updated_at
      BEFORE UPDATE ON public.pdi_data
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;