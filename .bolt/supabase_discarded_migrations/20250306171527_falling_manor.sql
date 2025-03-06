/*
  # Create PDI Activities Table

  1. New Tables
    - `pdi_activities`
      - `id` (uuid, primary key)
      - `activity` (text)
      - `description` (text)
      - `expected_result` (text)
      - `deadline` (date, nullable)
      - `observation` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `user_id` (uuid, foreign key)

  2. Security
    - Enable RLS on `pdi_activities` table
    - Add policies for authenticated users to manage their own activities
*/

-- Create the activities table
CREATE TABLE IF NOT EXISTS pdi_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity text NOT NULL,
  description text NOT NULL,
  expected_result text NOT NULL,
  deadline date,
  observation text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
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

-- Insert initial data
DO $$
DECLARE
  default_user_id uuid;
BEGIN
  -- Get the default user ID
  SELECT id INTO default_user_id FROM auth.users WHERE email = 'tommyarts4@gmail.com' LIMIT 1;

  -- Only proceed if we found the user
  IF default_user_id IS NOT NULL THEN
    -- Insert initial activities
    INSERT INTO pdi_activities (activity, description, expected_result, user_id)
    VALUES
      (
        'Meta Business',
        'Focar em análise de desempenho, métricas, resultados, dados; Agendamento de stories (ou alinhar com a Flap).',
        'Otimizar tempo e estratégias, facilitar o planejamento de ações futuras e ter controle sobre o que não está funcionando bem para ajustes e conhecimento sobre o que está funcionando, visando novas metas.',
        default_user_id
      ),
      (
        'Canva',
        'Estudar e utilizar com mais frequência, gerar e trazer demandas (ex. Roteiros e Stickers).',
        'Melhorar habilidades no Canva e trazer mais demandas criativas.',
        default_user_id
      ),
      (
        'CapCut',
        'Estudar as funções do PRO, melhorar técnicas de edição.',
        'Vídeos com mais qualidade e criativos, aumentar as demandas de vídeos, explorar novas técnicas.',
        default_user_id
      ),
      (
        'Instagram',
        'Planejamento mensal de criativos para stories, além de utilizar o Meta Business.',
        'Informar e engajar nos stories; reter a atenção e interação de clientes e prospects, saber a relevância de cada conteúdo e onde podemos melhorar.',
        default_user_id
      ),
      (
        'YouTube',
        'Postar em Shorts o mesmo conteúdo que é postado em reels do Instagram (foco principal em vídeos informativos).',
        'Alimentar essa seção do YouTube para entregar vídeos curtos para nosso público, além de usar esse meio como atração de prospects.',
        default_user_id
      ),
      (
        'Conhecimento',
        'Cursos, livros, prática, mentorias, networking, pesquisa e autoaprendizado (criar material próprio de aprendizados para consultas).',
        'Melhorar habilidades no Canva, CapCut, Meta Business, Instagram; stories em tempo real e planejamento de criativos para stories.',
        default_user_id
      ),
      (
        'Pesquisas',
        'Equipamentos para vídeo (foco principal em luz e estabilizador) e análise do que outras construtoras (foco nas mais conhecidas) estão fazendo nas redes, filtrando o que faz sentido implementar nas nossas.',
        'Aprimorar conteúdos em vídeo, analisar o que outras construtoras estão fazendo de diferente, e filtrar o que faz sentido implementar nas nossas redes.',
        default_user_id
      )
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;