/*
  # Initial Schema Setup

  1. New Tables
    - `pdi_data`
      - `id` (uuid, primary key)
      - `overview` (text)
      - `main_objective` (text)
      - `section_order` (jsonb)
      - `custom_sections` (jsonb)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `pdi_data` table
    - Add policy for authenticated users to read/write their own data
*/

CREATE TABLE IF NOT EXISTS pdi_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  overview text NOT NULL,
  main_objective text NOT NULL,
  section_order jsonb NOT NULL,
  custom_sections jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE pdi_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON pdi_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON pdi_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON pdi_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);