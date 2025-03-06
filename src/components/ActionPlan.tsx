import React, { useState } from 'react';
import { EditableField } from './EditableField';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface TableRow {
  id: string;
  cells: Record<string, string>;
}

interface TableConfig {
  id: string;
  title: string;
  headers: string[];
  rows: TableRow[];
}

export function ActionPlan() {
  const [tables, setTables] = useState<TableConfig[]>([
    {
      id: 'technical',
      title: '2.1 Capacitação Técnica',
      headers: ['Ferramenta', 'Objetivo', 'Prazo', 'Investimento', 'Status'],
      rows: [
        {
          id: '1',
          cells: {
            ferramenta: 'CANVA PRO',
            objetivo: 'Domínio avançado em design profissional, criação de templates personalizados e desenvolvimento de identidade visual consistente para todas as plataformas',
            prazo: '30 dias',
            investimento: 'R$ 500,00',
            status: 'Em andamento'
          }
        },
        {
          id: '2',
          cells: {
            ferramenta: 'CAPCUT PRO',
            objetivo: 'Especialização em edição de vídeos virais, incluindo efeitos especiais avançados, transições profissionais e edição de áudio para maximizar engajamento',
            prazo: '45 dias',
            investimento: 'R$ 750,00',
            status: 'A iniciar'
          }
        },
        {
          id: '3',
          cells: {
            ferramenta: 'Curso de Copywriting',
            objetivo: 'Desenvolvimento de habilidades em escrita persuasiva, storytelling e técnicas avançadas de copywriting para redes sociais',
            prazo: '60 dias',
            investimento: 'R$ 1.200,00',
            status: 'A iniciar'
          }
        },
        {
          id: '4',
          cells: {
            ferramenta: 'NINJALITICS PRO',
            objetivo: 'Análise avançada de métricas, interpretação de dados e otimização estratégica de conteúdo baseada em performance',
            prazo: '30 dias',
            investimento: 'R$ 450,00',
            status: 'Em análise'
          }
        }
      ]
    },
    {
      id: 'content-strategy',
      title: '2.2 Estratégia de Conteúdo',
      headers: ['Tipo', 'Formato', 'Frequência', 'Objetivo', 'Métrica Principal'],
      rows: [
        {
          id: '1',
          cells: {
            tipo: 'Conteúdo Educativo',
            formato: 'Carrossel + Reels',
            frequência: '3x por semana',
            objetivo: 'Estabelecer autoridade no nicho e gerar valor para a audiência',
            'métrica principal': '50k visualizações/post'
          }
        },
        {
          id: '2',
          cells: {
            tipo: 'Conteúdo Viral',
            formato: 'Reels + Stories',
            frequência: '4x por semana',
            objetivo: 'Aumentar alcance e atrair novo público',
            'métrica principal': '100k visualizações/post'
          }
        },
        {
          id: '3',
          cells: {
            tipo: 'Behind the Scenes',
            formato: 'Stories + Posts',
            frequência: '2x por semana',
            objetivo: 'Humanizar a marca e criar conexão com o público',
            'métrica principal': '80% taxa de retenção'
          }
        },
        {
          id: '4',
          cells: {
            tipo: 'Lives e Q&A',
            formato: 'Transmissão ao vivo',
            frequência: '1x por semana',
            objetivo: 'Engajamento direto e fortalecimento da comunidade',
            'métrica principal': '1k espectadores simultâneos'
          }
        }
      ]
    },
    {
      id: 'content-calendar',
      title: '2.3 Calendário de Postagens',
      headers: ['Dia', 'Horário', 'Tipo de Conteúdo', 'Tema', 'Hashtags'],
      rows: [
        {
          id: '1',
          cells: {
            dia: 'Segunda-feira',
            horário: '10:00',
            'tipo de conteúdo': 'Carrossel Educativo',
            tema: 'Dicas e Tutoriais',
            hashtags: '#DicasDeMarketing #ContentCreator'
          }
        },
        {
          id: '2',
          cells: {
            dia: 'Quarta-feira',
            horário: '15:00',
            'tipo de conteúdo': 'Reels Viral',
            tema: 'Tendências do Mercado',
            hashtags: '#MarketingDigital #Trending'
          }
        },
        {
          id: '3',
          cells: {
            dia: 'Sexta-feira',
            horário: '19:00',
            'tipo de conteúdo': 'Live Semanal',
            tema: 'Cases e Resultados',
            hashtags: '#CaseDeMarketing #Resultados'
          }
        },
        {
          id: '4',
          cells: {
            dia: 'Domingo',
            horário: '20:00',
            'tipo de conteúdo': 'Stories Reflexivos',
            tema: 'Planejamento Semanal',
            hashtags: '#MarketingDeConteudo #Planejamento'
          }
        }
      ]
    }
  ]);

  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>(
    Object.fromEntries(tables.map(table => [table.id, true]))
  );

  const toggleTable = (tableId: string) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableId]: !prev[tableId]
    }));
  };

  const addRow = (tableId: string) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        const newRow = {
          id: Date.now().toString(),
          cells: Object.fromEntries(table.headers.map(header => [header.toLowerCase(), '']))
        };
        return { ...table, rows: [...table.rows, newRow] };
      }
      return table;
    }));
  };

  const removeRow = (tableId: string, rowId: string) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return { ...table, rows: table.rows.filter(row => row.id !== rowId) };
      }
      return table;
    }));
  };

  const updateCell = (tableId: string, rowId: string, header: string, value: string) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          rows: table.rows.map(row => {
            if (row.id === rowId) {
              return {
                ...row,
                cells: { ...row.cells, [header.toLowerCase()]: value }
              };
            }
            return row;
          })
        };
      }
      return table;
    }));
  };

  return (
    <section className="px-4 md:px-0">
      <h2 className="text-2xl font-bold text-[#303845] mb-6">2. Plano de Ação</h2>
      <div className="space-y-4">
        {tables.map(table => (
          <div key={table.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleTable(table.id)}
              className="w-full px-4 py-3 flex justify-between items-center bg-[#303845] text-white hover:bg-opacity-90 transition-colors"
            >
              <h3 className="text-lg font-semibold">{table.title}</h3>
              {expandedTables[table.id] ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            
            {expandedTables[table.id] && (
              <div className="p-4">
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => addRow(table.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-[#303845] text-white rounded hover:bg-opacity-90 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Adicionar Linha</span>
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        {table.headers.map(header => (
                          <th key={header} className="px-4 py-2 text-left border text-sm font-semibold text-gray-700">
                            {header}
                          </th>
                        ))}
                        <th className="px-4 py-2 text-left border w-16">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map(row => (
                        <tr key={row.id} className="border-b hover:bg-gray-50">
                          {table.headers.map(header => (
                            <td key={header} className="px-4 py-2 border">
                              <EditableField
                                value={row.cells[header.toLowerCase()]}
                                onChange={(value) => updateCell(table.id, row.id, header, value)}
                                multiline={true}
                                expandedByDefault={true}
                              />
                            </td>
                          ))}
                          <td className="px-4 py-2 border">
                            <button
                              onClick={() => removeRow(table.id, row.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}