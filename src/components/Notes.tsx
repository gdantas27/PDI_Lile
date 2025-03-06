import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface Note {
  id: string;
  title: string;
  content: string;
}

interface NotesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Notes({ isOpen, onClose }: NotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');

  const addNote = () => {
    if (newNoteTitle.trim()) {
      setNotes([
        ...notes,
        {
          id: Date.now().toString(),
          title: newNoteTitle.trim(),
          content: '',
        },
      ]);
      setNewNoteTitle('');
    }
  };

  const updateNoteContent = (noteId: string, content: string) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, content } : note
    ));
  };

  const removeNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg md:text-xl font-semibold text-[#303845]">Anotações do Projeto</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Título da nova anotação"
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#303845]"
              onKeyPress={(e) => e.key === 'Enter' && addNote()}
            />
            <button
              onClick={addNote}
              className="px-4 py-2 bg-[#303845] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {notes.map(note => (
            <div key={note.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#303845] break-all">{note.title}</h3>
                <button
                  onClick={() => removeNote(note.id)}
                  className="text-red-500 hover:text-red-700 transition-colors ml-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <RichTextEditor
                content={note.content}
                onChange={(content) => updateNoteContent(note.id, content)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}