import React, { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, CheckCircle2, Circle, AlertCircle, Plus, Trash2, Filter } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'completed' | 'delayed';
  priority: 'low' | 'medium' | 'high';
}

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    deadline: '',
    priority: 'medium',
    status: 'pending'
  });

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const statusIcons = {
    pending: <Circle className="w-5 h-5 text-yellow-500" />,
    completed: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    delayed: <AlertCircle className="w-5 h-5 text-red-500" />
  };

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta'
  };

  const statusLabels = {
    pending: 'Pendente',
    completed: 'Concluída',
    delayed: 'Atrasada',
    all: 'Todas'
  };

  const addTask = () => {
    if (newTask.title && newTask.deadline) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTask.title,
          description: newTask.description || '',
          deadline: newTask.deadline,
          status: newTask.status as 'pending' | 'completed' | 'delayed',
          priority: newTask.priority as 'low' | 'medium' | 'high'
        }
      ]);
      setNewTask({
        title: '',
        description: '',
        deadline: '',
        priority: 'medium',
        status: 'pending'
      });
      setShowAddTask(false);
    }
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  return (
    <section className="px-4 md:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#303845]">Gerenciamento de Tarefas</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter size={20} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#303845] text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Nova Tarefa</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Task['status'] | 'all')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303845]"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="completed">Concluídas</option>
                <option value="delayed">Atrasadas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as Task['priority'] | 'all')}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303845]"
              >
                <option value="all">Todas</option>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm">Concluída</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm">Atrasada</span>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma tarefa encontrada
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-start gap-4 hover:bg-gray-50 transition-colors"
              >
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className="self-start sm:mt-1"
                >
                  {statusIcons[task.status]}
                </button>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg break-all">{task.title}</h3>
                      <p className="text-gray-600 mt-1 break-all">{task.description}</p>
                    </div>
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-red-500 hover:text-red-700 transition-colors self-end sm:self-start"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>
                        {format(new Date(task.deadline), "d 'de' MMMM", { locale: ptBR })}
                      </span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                      {priorityLabels[task.priority]}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showAddTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg">
              <h3 className="text-xl font-semibold mb-4">Nova Tarefa</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303845]"
                    placeholder="Digite o título da tarefa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303845] h-24"
                    placeholder="Digite a descrição da tarefa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Entrega
                  </label>
                  <input
                    type="date"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303845]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303845]"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg order-2 sm:order-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={addTask}
                  className="px-4 py-2 bg-[#303845] text-white rounded-lg hover:bg-opacity-90 order-1 sm:order-2"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}