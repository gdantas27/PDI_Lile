import React, { useState, useEffect } from 'react';
import { EditableField } from './EditableField';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Activity = Database['public']['Tables']['pdi_activities']['Row'];

export function ActionPlanSummary() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('pdi_activities')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const newActivity = {
        activity: '',
        description: '',
        expected_result: '',
        user_id: user.user.id
      };

      const { data, error } = await supabase
        .from('pdi_activities')
        .insert([newActivity])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setActivities([...activities, data]);
      }
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const updateActivity = async (id: string, field: keyof Activity, value: string) => {
    try {
      const { error } = await supabase
        .from('pdi_activities')
        .update({ [field]: value })
        .eq('id', id);

      if (error) throw error;

      setActivities(activities.map(activity => 
        activity.id === id ? { ...activity, [field]: value } : activity
      ));
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const removeActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pdi_activities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setActivities(activities.filter(activity => activity.id !== id));
    } catch (error) {
      console.error('Error removing activity:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[#303845]" />
      </div>
    );
  }

  return (
    <section className="px-4 md:px-0">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#303845]">PDI - Produção de Conteúdo e Marketing Digital</h2>
          <button
            onClick={addActivity}
            className="flex items-center gap-2 px-3 py-2 bg-[#303845] text-white rounded hover:bg-opacity-90 transition-colors text-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Adicionar Atividade</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border text-sm font-semibold text-gray-700 w-[15%]">Atividade</th>
                <th className="px-4 py-2 text-left border text-sm font-semibold text-gray-700 w-[30%]">Descrição</th>
                <th className="px-4 py-2 text-left border text-sm font-semibold text-gray-700 w-[30%]">Resultado Esperado</th>
                <th className="px-4 py-2 text-left border text-sm font-semibold text-gray-700 w-[10%]">Prazo</th>
                <th className="px-4 py-2 text-left border text-sm font-semibold text-gray-700">Observação</th>
                <th className="px-4 py-2 text-left border w-16">Ações</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(activity => (
                <tr key={activity.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    <EditableField
                      value={activity.activity}
                      onChange={(value) => updateActivity(activity.id, 'activity', value)}
                      multiline={true}
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <EditableField
                      value={activity.description}
                      onChange={(value) => updateActivity(activity.id, 'description', value)}
                      multiline={true}
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <EditableField
                      value={activity.expected_result}
                      onChange={(value) => updateActivity(activity.id, 'expected_result', value)}
                      multiline={true}
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <EditableField
                      value={activity.deadline || ''}
                      onChange={(value) => updateActivity(activity.id, 'deadline', value)}
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <EditableField
                      value={activity.observation || ''}
                      onChange={(value) => updateActivity(activity.id, 'observation', value)}
                      multiline={true}
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => removeActivity(activity.id)}
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
    </section>
  );
}