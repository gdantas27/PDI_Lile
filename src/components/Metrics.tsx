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

export function Metrics() {
  const [tables, setTables] = useState<TableConfig[]>([
    {
      id: 'kpi-summary',
      title: 'KPIs Principais',
      headers: ['Indicador', 'Meta', 'Período', 'Status'],
      rows: [
        {
          id: '1',
          cells: {
            indicador: 'Visualizações Totais',
            meta: '800k',
            período: '6 meses',
            status: 'Em progresso'
          }
        },
        {
          id: '2',
          cells: {
            indicador: 'Taxa de Engajamento',
            meta: '15%',
            período: 'Mensal',
            status: 'Alcançado'
          }
        },
        {
          id: '3',
          cells: {
            indicador: 'Taxa de Crescimento',
            meta: '30%',
            período: 'Mensal',
            status: 'Em análise'
          }
        }
      ]
    },
    {
      id: 'detailed-metrics',
      title: 'Métricas Detalhadas',
      headers: ['Categoria', 'Métrica', 'Meta Atual', 'Frequência', 'Prioridade'],
      rows: [
        {
          id: '1',
          cells: {
            categoria: 'Alcance',
            métrica: 'Visualizações',
            'meta atual': '800k',
            frequência: '6 meses',
            prioridade: 'Alta'
          }
        },
        {
          id: '2',
          cells: {
            categoria: 'Alcance',
            métrica: 'Seguidores',
            'meta atual': '100k',
            frequência: '6 meses',
            prioridade: 'Alta'
          }
        }
      ]
    },
    {
      id: 'content-goals',
      title: 'Metas de Conteúdo',
      headers: ['Tipo de Conteúdo', 'Meta Mensal', 'Meta Semanal', 'Qualidade Esperada'],
      rows: [
        {
          id: '1',
          cells: {
            'tipo de conteúdo': 'Posts no Feed',
            'meta mensal': '30',
            'meta semanal': '7-8',
            'qualidade esperada': 'Alta qualidade visual, conteúdo educativo'
          }
        },
        {
          id: '2',
          cells: {
            'tipo de conteúdo': 'Stories',
            'meta mensal': '60',
            'meta semanal': '15',
            'qualidade esperada': 'Engajador, informativo, interativo'
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
      <h2 className="text-2xl font-bold text-[#303845] mb-6">3. Metas e Indicadores</h2>
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
                
                {/* Mobile View */}
                <div className="block md:hidden space-y-4">
                  {table.rows.map(row => (
                    <div key={row.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                      {table.headers.map(header => (
                        <div key={header}>
                          <div className="text-sm font-semibold text-gray-600 mb-1">
                            {header}
                          </div>
                          <EditableField
                            value={row.cells[header.toLowerCase()]}
                            onChange={(value) => updateCell(table.id, row.id, header, value)}
                            multiline={header === 'Qualidade Esperada'}
                          />
                        </div>
                      ))}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => removeRow(table.id, row.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
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
                                multiline={header === 'Qualidade Esperada'}
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