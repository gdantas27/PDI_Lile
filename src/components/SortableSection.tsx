import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Pencil, X } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface SortableSectionProps {
  id: string;
  children: React.ReactNode;
  title: string;
  onRemove?: () => void;
  onEdit?: (content: string) => void;
}

export function SortableSection({ id, children, title, onRemove, onEdit }: SortableSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 0.2s ease-in-out',
    zIndex: isDragging ? 1 : 'auto',
    position: 'relative' as const,
  };

  const handleEdit = () => {
    setEditedContent('');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onEdit && editedContent.trim()) {
      onEdit(editedContent);
    }
    setIsEditing(false);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`relative group ${isDragging ? 'opacity-75 shadow-2xl' : ''}`}
    >
      <div className="absolute left-0 top-0 -ml-8 h-full flex items-center">
        <div
          {...attributes}
          {...listeners}
          className="p-2 rounded hover:bg-gray-100 cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
          title="Arraste para reordenar"
        >
          <GripVertical className="w-6 h-6 text-gray-400" />
        </div>
      </div>
      
      <div className="absolute right-0 top-0 mr-4 mt-4 flex items-center gap-2">
        <button
          onClick={handleEdit}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Editar seção"
        >
          <Pencil className="w-5 h-5" />
        </button>
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-2 rounded-full hover:bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remover seção"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className={`transition-shadow duration-200 ${isDragging ? 'shadow-2xl' : ''}`}>
        {children}
      </div>

      {/* Modal de Edição */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-[#303845]">Editar Seção: {title}</h2> ```
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <RichTextEditor
                content={editedContent}
                onChange={setEditedContent}
                autoFocus={true}
              />
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#303845] text-white rounded hover:bg-opacity-90 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}