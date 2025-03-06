import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddSectionProps {
  onAdd: (title: string) => void;
}

export function AddSection({ onAdd }: AddSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="my-8">
      {isAdding ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Título da Nova Seção
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#303845]"
              placeholder="Digite o título da seção"
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#303845] text-white rounded hover:bg-opacity-90 transition-colors"
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#303845] text-white rounded hover:bg-opacity-90 transition-colors mx-auto"
        >
          <Plus size={20} />
          Adicionar Nova Seção
        </button>
      )}
    </div>
  );
}