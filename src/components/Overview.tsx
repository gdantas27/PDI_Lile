import React from 'react';
import { EditableField } from './EditableField';
import { Calendar, Target, Crosshair } from 'lucide-react';

interface OverviewProps {
  overview: string;
  setOverview: (value: string) => void;
}

export function Overview({ overview, setOverview }: OverviewProps) {
  return (
    <section className="px-4 md:px-0">
      <h2 className="text-2xl font-bold text-[#303845] mb-6">Visão Geral</h2>
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md space-y-6">
        <div className="overflow-x-auto">
          <div className="bg-[#303845] text-white p-3 md:p-4 rounded-t-lg">
            <h3 className="font-semibold text-sm md:text-base">Descrição do PDI</h3>
          </div>
          <div className="border border-gray-200 rounded-b-lg p-4 md:p-6">
            <EditableField 
              value={overview}
              onChange={setOverview}
              multiline={true}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2 text-[#303845]">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <h4 className="font-semibold text-sm md:text-base">Período</h4>
            </div>
            <EditableField 
              value="6 meses"
              onChange={(value) => console.log(value)}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2 text-[#303845]">
              <Target className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <h4 className="font-semibold text-sm md:text-base">Meta Principal</h4>
            </div>
            <EditableField 
              value="800k visualizações"
              onChange={(value) => console.log(value)}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-2 text-[#303845]">
              <Crosshair className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <h4 className="font-semibold text-sm md:text-base">Foco</h4>
            </div>
            <EditableField 
              value="Produção de Conteúdo Digital"
              onChange={(value) => console.log(value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="bg-[#303845] text-white p-3 md:p-4 rounded-t-lg">
            <h3 className="font-semibold text-sm md:text-base">PDI - Produção de Conteúdo e Marketing Digital</h3>
          </div>
          <div className="border border-gray-200 rounded-b-lg overflow-x-auto">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left border text-sm font-semibold text-gray-700 w-[15%]">Atividade</th>
                  <th className="px-4 py-2 text-left border text-sm font-semibold text-gray-700 w-[30%]">Descrição</th>
                  <th className="px-4 py-2 text-left border text-sm font-semibold text-gray-700 w-[30%]">Resultado Esperado</th>
                  <th className="px-4 py-2 text-left border text-sm font-semibold text-gray-700 w-[10%]">Prazo</th>
                  <th className="px-4 py-2 text-left border text-sm font-semibold text-gray-700">Observação</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 border">Meta Business</td>
                  <td className="px-4 py-2 border">Focar em análise de desempenho, métricas, resultados, dados; Agendamento de stories (ou alinhar com a Flap).</td>
                  <td className="px-4 py-2 border">Otimizar tempo e estratégias, facilitar o planejamento de ações futuras e ter controle sobre o que não está funcionando bem para ajustes e conhecimento sobre o que está funcionando, visando novas metas.</td>
                  <td className="px-4 py-2 border"></td>
                  <td className="px-4 py-2 border"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 border">Canva</td>
                  <td className="px-4 py-2 border">Estudar e utilizar com mais frequência, gerar e trazer demandas (ex. Roteiros e Stickers).</td>
                  <td className="px-4 py-2 border">Melhorar habilidades no Canva e trazer mais demandas criativas.</td>
                  <td className="px-4 py-2 border"></td>
                  <td className="px-4 py-2 border"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 border">CapCut</td>
                  <td className="px-4 py-2 border">Estudar as funções do PRO, melhorar técnicas de edição.</td>
                  <td className="px-4 py-2 border">Vídeos com mais qualidade e criativos, aumentar as demandas de vídeos, explorar novas técnicas.</td>
                  <td className="px-4 py-2 border"></td>
                  <td className="px-4 py-2 border"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 border">Instagram</td>
                  <td className="px-4 py-2 border">Planejamento mensal de criativos para stories, além de utilizar o Meta Business.</td>
                  <td className="px-4 py-2 border">Informar e engajar nos stories; reter a atenção e interação de clientes e prospects, saber a relevância de cada conteúdo e onde podemos melhorar.</td>
                  <td className="px-4 py-2 border"></td>
                  <td className="px-4 py-2 border"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 border">YouTube</td>
                  <td className="px-4 py-2 border">Postar em Shorts o mesmo conteúdo que é postado em reels do Instagram (foco principal em vídeos informativos).</td>
                  <td className="px-4 py-2 border">Alimentar essa seção do YouTube para entregar vídeos curtos para nosso público, além de usar esse meio como atração de prospects.</td>
                  <td className="px-4 py-2 border"></td>
                  <td className="px-4 py-2 border"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 border">Conhecimento</td>
                  <td className="px-4 py-2 border">Cursos, livros, prática, mentorias, networking, pesquisa e autoaprendizado (criar material próprio de aprendizados para consultas).</td>
                  <td className="px-4 py-2 border">Melhorar habilidades no Canva, CapCut, Meta Business, Instagram; stories em tempo real e planejamento de criativos para stories.</td>
                  <td className="px-4 py-2 border"></td>
                  <td className="px-4 py-2 border"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 border">Pesquisas</td>
                  <td className="px-4 py-2 border">Equipamentos para vídeo (focoprincipal em luz e estabilizador) e construtoras (foco nas maisconhecidas).</td>
                  <td className="px-4 py-2 border">Aprimorar conteúdos em vídeo, analisar o que outras construtoras estão fazendo de diferente e filtrar o que faz sentido implementar nas nossas redes.</td>
                  <td className="px-4 py-2 border"></td>
                  <td className="px-4 py-2 border"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}