/*
  # Fix Guest User Authentication

  1. Changes
    - Create guest user with proper credentials
    - Set up initial PDI data
    - Add proper error handling

  2. Security
    - Enable RLS
    - Add appropriate policies
*/

-- Create the pdi_data table if it doesn't exist
CREATE TABLE IF NOT EXISTS pdi_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  overview text NOT NULL,
  main_objective text NOT NULL,
  section_order jsonb NOT NULL,
  custom_sections jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pdi_data ENABLE ROW LEVEL SECURITY;

-- Create policies (using DO block to handle existing policies)
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can read own data" ON pdi_data;
  DROP POLICY IF EXISTS "Users can insert own data" ON pdi_data;
  DROP POLICY IF EXISTS "Users can update own data" ON pdi_data;

  -- Create new policies
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
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger
DROP TRIGGER IF EXISTS update_pdi_data_updated_at ON pdi_data;
CREATE TRIGGER update_pdi_data_updated_at
  BEFORE UPDATE ON pdi_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create guest user and initial data
DO $$
DECLARE
  guest_id uuid := 'a96ea053-60dd-4579-8d3a-4f9edc0c4ff1';
BEGIN
  -- Insert guest user if not exists
  IF NOT EXISTS (
    SELECT FROM auth.users WHERE id = guest_id
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      guest_id,
      'authenticated',
      'authenticated',
      'guest@example.com',
      crypt('guest123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '',
      ''
    );
  END IF;

  -- Insert initial PDI data if not exists
  IF NOT EXISTS (
    SELECT FROM public.pdi_data WHERE id = guest_id
  ) THEN
    INSERT INTO public.pdi_data (
      id,
      overview,
      main_objective,
      section_order,
      custom_sections
    ) VALUES (
      guest_id,
      'Este Plano de Desenvolvimento Individual (PDI) foi elaborado com o objetivo de impulsionar minha carreira como Profissional de Publicidade e Propaganda.',
      'Consolidar-me como referência em produção de conteúdo digital através do desenvolvimento de habilidades avançadas.',
      '[
        {"id": "overview", "title": "Visão Geral", "type": "overview", "isRemovable": false},
        {"id": "objectives", "title": "Objetivos", "type": "objectives", "isRemovable": true},
        {"id": "actionPlan", "title": "Plano de Ação", "type": "actionPlan", "isRemovable": true},
        {"id": "metrics", "title": "Metas e Indicadores", "type": "metrics", "isRemovable": true},
        {"id": "monitoring", "title": "Acompanhamento e Revisão", "type": "monitoring", "isRemovable": true},
        {"id": "tasks", "title": "Gerenciamento de Tarefas", "type": "tasks", "isRemovable": true}
      ]'::jsonb,
      '{}'::jsonb
    );
  END IF;
END $$;