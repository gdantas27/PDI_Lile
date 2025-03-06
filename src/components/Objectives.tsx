import React from 'react';
import { EditableField } from './EditableField';
import { Target, BookOpen, Users } from 'lucide-react';

interface ObjectivesProps {
  mainObjective: string;
  setMainObjective: (value: string) => void;
}

export function Objectives({ mainObjective, setMainObjective }: ObjectivesProps) {
  return (
    <section className="px-4 md:px-0">
      <h2 className="text-2xl font-bold text-[#303845] mb-6">1. Objetivos</h2>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md space-y-6">
        <div className="overflow-x-auto">
          <div className="flex items-center gap-2 bg-[#303845] text-white p-3 md:p-4 rounded-t-lg">
            <Target className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            <h3 className="font-semibold text-sm md:text-base">1.1 Objetivo Principal</h3>
          </div>
          <div className="border border-gray-200 rounded-b-lg p-3 md:p-4">
            <EditableField 
              value={mainObjective}
              onChange={setMainObjective}
              multiline={true}
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-4">1.2 Objetivos Específicos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="overflow-x-auto">
              <div className="flex items-center gap-2 bg-[#303845] text-white p-3 md:p-4 rounded-t-lg">
                <BookOpen className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <h4 className="font-semibold text-sm md:text-base">Desenvolvimento Técnico</h4>
              </div>
              <div className="border border-gray-200 rounded-b-lg divide-y">
                <div className="p-3 md:p-4">
                  <EditableField 
                    value="Domínio avançado do CANVA PRO para criação de designs profissionais, incluindo templates personalizados, identidade visual consistente e materiais de alta qualidade para todas as plataformas digitais"
                    onChange={(value) => console.log(value)}
                    multiline={true}
                  />
                </div>
                <div className="p-3 md:p-4">
                  <EditableField 
                    value="Especialização em edição com CAPCUT para produção de vídeos virais, incluindo efeitos especiais, transições profissionais e edição de áudio para maximizar o engajamento"
                    onChange={(value) => console.log(value)}
                    multiline={true}
                  />
                </div>
                <div className="p-3 md:p-4">
                  <EditableField 
                    value="Proficiência avançada em análise de métricas com NINJALITICS, desenvolvendo capacidade de interpretação de dados para otimização contínua de conteúdo e estratégias"
                    onChange={(value) => console.log(value)}
                    multiline={true}
                  />
                </div>
                <div className="p-3 md:p-4">
                  <EditableField 
                    value="Aperfeiçoamento em copywriting estratégico para redes sociais, com foco em storytelling, gatilhos mentais e técnicas de persuasão para maximizar conversões"
                    onChange={(value) => console.log(value)}
                    multiline={true}
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="flex items-center gap-2 bg-[#303845] text-white p-3 md:p-4 rounded-t-lg">
                <Users className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <h4 className="font-semibold text-sm md:text-base">Presença Digital</h4>
              </div>
              <div className="border border-gray-200 rounded-b-lg divide-y">
                <div className="p-3 md:p-4">
                  <EditableField 
                    value="Estabelecer uma identidade visual única e profissional, com padrões consistentes de design, cores e elementos visuais que reflitam autoridade e credibilidade no nicho"
                    onChange={(value) => console.log(value)}
                    multiline={true}
                  />
                </div>
                <div className="p-3 md:p-4">
                  <EditableField 
                    value="Desenvolver e implementar estratégia de conteúdo viral focada em tendências, storytelling e temas relevantes para o público-alvo, visando crescimento orgânico acelerado"
                    onChange={(value) => console.log(value)}
                    multiline={true}
                  />
                </div>
                <div className="p-3 md:p-4">
                  <EditableField 
                    value="Construir uma comunidade engajada através de interação constante, conteúdo de valor e estratégias de relacionamento que promovam conexão autêntica com o público"
                    onChange={(value) => console.log(value)}
                    multiline={true}
                  />
                </div>
                <div className="p-3 md:p-4">
                  <EditableField 
                    value="Atingir a marca de 100 mil seguidores ativos em 6 meses através de estratégias orgânicas, colaborações estratégicas e conteúdo viral de alta qualidade"
                    onChange={(value) => console.log(value)}
                    multiline={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}