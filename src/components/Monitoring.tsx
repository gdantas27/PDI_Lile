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

export function Monitoring() {
  const [tables, setTables] = useState<TableConfig[]>([
    {
      id: 'weekly-activities',
      title: 'Atividades Semanais',
      headers: ['Dia', 'Atividade', 'Horário', 'Observações'],
      rows: [
        {
          id: '1',
          cells: {
            dia: 'Segunda',
            atividade: 'Planejamento de conteúdo semanal',
            horário: '09:00 - 11:00',
            observações: 'Definir temas e formatos para a semana'
          }
        },
        {
          id: '2',
          cells: {
            dia: 'Terça',
            atividade: 'Produção de conteúdo',
            horário: '14:00 - 18:00',
            observações: 'Foco em Reels e carrosséis'
          }
        },
        {
          id: '3',
          cells: {
            dia: 'Quinta',
            atividade: 'Edição e programação',
            horário: '10:00 - 15:00',
            observações: 'Finalização dos conteúdos da semana'
          }
        },
        {
          id: '4',
          cells: {
            dia: 'Sexta',
            atividade: 'Análise de métricas e ajustes',
            horário: '13:00 - 15:00',
            observações: 'Avaliação de performance e otimizações'
          }
        }
      ]
    },
    {
      id: 'monthly-goals',
      title: 'Metas Mensais',
      headers: ['Meta', 'Objetivo', 'Prazo', 'Progresso'],
      rows: [
        {
          id: '1',
          cells: {
            meta: 'Visualizações totais',
            objetivo: '150k',
            prazo: '30 dias',
            progresso: 'Em andamento'
          }
        },
        {
          id: '2',
          cells: {
            meta: 'Novos seguidores',
            objetivo: '20k',
            prazo: '30 dias',
            progresso: 'Em andamento'
          }
        },
        {
          id: '3',
          cells: {
            meta: 'Taxa de engajamento',
            objetivo: '15%',
            prazo: '30 dias',
            progresso: 'Em andamento'
          }
        },
        {
          id: '4',
          cells: {
            meta: 'Conteúdos virais',
            objetivo: '3 posts',
            prazo: '30 dias',
            progresso: 'Em andamento'
          }
        }
      ]
    },
    {
      id: 'content-tracking',
      title: 'Acompanhamento de Conteúdo',
      headers: ['Tipo', 'Quantidade Planejada', 'Realizados', 'Performance Média'],
      rows: [
        {
          id: '1',
          cells: {
            tipo: 'Reels',
            'quantidade planejada': '12 por mês',
            realizados: '8',
            'performance média': '50k views'
          }
        },
        {
          id: '2',
          cells: {
            tipo: 'Carrosséis',
            'quantidade planejada': '8 por mês',
            realizados: '5',
            'performance média': '10k salvos'
          }
        },
        {
          id: '3',
          cells: {
            tipo: 'Stories',
            'quantidade planejada': '60 por mês',
            realizados: '45',
            'performance média': '80% visualização'
          }
        },
        {
          id: '4',
          cells: {
            tipo: 'Posts Estáticos',
            'quantidade planejada': '4 por mês',
            realizados: '3',
            'performance média': '5k curtidas'
          }
        }
      ]
    },
    {
      id: 'learning-progress',
      title: 'Progresso de Aprendizado',
      headers: ['Ferramenta', 'Nível Atual', 'Meta', 'Próximos Passos'],
      rows: [
        {
          id: '1',
          cells: {
            ferramenta: 'CANVA PRO',
            'nível atual': 'Intermediário',
            meta: 'Avançado',
            'próximos passos': 'Dominar animações e templates personalizados'
          }
        },
        {
          id: '2',
          cells: {
            ferramenta: 'CAPCUT',
            'nível atual': 'Básico',
            meta: 'Avançado',
            'próximos passos': 'Aprender efeitos especiais e transições'
          }
        },
        {
          id: '3',
          cells: {
            ferramenta: 'NINJALITICS',
            'nível atual': 'Iniciante',
            meta: 'Intermediário',
            'próximos passos': 'Análise avançada de métricas e relatórios'
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
      <h2 className="text-2xl font-bold text-[#303845] mb-6">4. Acompanhamento</h2>
      <div className="space-y-4">
        {tables.map(table => (
          <div key={table.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => toggleTable(table.id)}
              className="w-full px-6 py-4 flex justify-between items-center bg-[#303845] text-white hover:bg-opacity-90 transition-colors"
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
                    className="flex items-center gap-2 px-3 py-1 bg-[#303845] text-white rounded hover:bg-opacity-90 transition-colors text-sm"
                  >
                    <Plus size={16} />
                    Adicionar
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[640px]">
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
                                multiline={header === 'Observações' || header === 'Próximos Passos'}
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