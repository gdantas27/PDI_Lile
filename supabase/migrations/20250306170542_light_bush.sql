/*
  # Create PDI Activities Table

  1. New Tables
    - `pdi_activities`
      - `id` (uuid, primary key)
      - `activity` (text) - Name of the activity
      - `description` (text) - Detailed description
      - `expected_result` (text) - Expected outcome
      - `deadline` (date) - Target completion date
      - `observation` (text) - Additional notes
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `user_id` (uuid) - Reference to auth.users

  2. Security
    - Enable RLS on `pdi_activities` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS pdi_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity text NOT NULL,
  description text NOT NULL,
  expected_result text NOT NULL,
  deadline date,
  observation text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE pdi_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own activities"
  ON pdi_activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own activities"
  ON pdi_activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own activities"
  ON pdi_activities
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own activities"
  ON pdi_activities
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pdi_activities_updated_at
  BEFORE UPDATE ON pdi_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();