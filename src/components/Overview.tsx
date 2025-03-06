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
      </div>
    </section>
  );
}