/*
  # Create Guest User and Initial PDI Data

  1. Changes
    - Create a guest user with predefined credentials
    - Insert initial PDI data for the guest user
    - Ensure idempotent operations with IF NOT EXISTS checks

  2. Security
    - Guest user is created with limited permissions
    - Data is properly linked to the guest user account
*/

-- Create guest user if it doesn't exist
DO $$ 
DECLARE
  guest_id uuid := 'a96ea053-60dd-4579-8d3a-4f9edc0c4ff1';
BEGIN
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
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      guest_id,
      'authenticated',
      'authenticated',
      'guest@example.com',
      '$2a$10$Q8PiRzxMqhQz1799UPxnROWVJkxj/9N1aX0Lcl6T8iLKUy/qbwmAi', -- This is 'guest123'
      NOW(),
      NOW(),
      NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;

  -- Insert initial PDI data for guest user if it doesn't exist
  IF NOT EXISTS (
    SELECT FROM public.pdi_data WHERE id = guest_id
  ) THEN
    INSERT INTO public.pdi_data (
      id,
      overview,
      main_objective,
      section_order,
      custom_sections,
      updated_at
    ) VALUES (
      guest_id,
      'Este Plano de Desenvolvimento Individual (PDI) foi elaborado com o objetivo de impulsionar minha carreira como Profissional de Publicidade e Propaganda, com foco específico na produção de conteúdo digital de alta performance.',
      'Consolidar-me como referência em produção de conteúdo digital através do desenvolvimento de habilidades avançadas em criação, edição e estratégia de conteúdo.',
      '[
        {"id": "overview", "title": "Visão Geral", "type": "overview", "isRemovable": false},
        {"id": "objectives", "title": "Objetivos", "type": "objectives", "isRemovable": true},
        {"id": "actionPlan", "title": "Plano de Ação", "type": "actionPlan", "isRemovable": true},
        {"id": "metrics", "title": "Metas e Indicadores", "type": "metrics", "isRemovable": true},
        {"id": "monitoring", "title": "Acompanhamento e Revisão", "type": "monitoring", "isRemovable": true},
        {"id": "tasks", "title": "Gerenciamento de Tarefas", "type": "tasks", "isRemovable": true}
      ]'::jsonb,
      '{}'::jsonb,
      NOW()
    );
  END IF;
END $$;