/*
  # Add Initial PDI Activities

  1. Changes
    - Add initial activities from the PDF document
    - Each activity includes description and expected results
    - Deadlines and observations are left empty as per original document

  2. Security
    - Activities are associated with the default user
*/

DO $$
DECLARE
  default_user_id uuid;
BEGIN
  -- Get the default user ID (the one we're using for initial login)
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