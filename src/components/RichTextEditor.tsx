import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table as TableIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Type,
  HighlighterIcon,
  Palette,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckSquare,
  X,
  MoreVertical,
  GripHorizontal,
  GripVertical
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  autoFocus?: boolean;
}

export function RichTextEditor({ content, onChange, autoFocus = false }: RichTextEditorProps) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableSize, setTableSize] = useState({ rows: 3, cols: 3 });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
        handleWidth: 5,
        cellMinWidth: 50,
        lastColumnResizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableCell.configure({
        handleWidth: 5,
      }),
      TableHeader,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'table'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Image,
      Link.configure({
        openOnClick: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    autofocus: autoFocus ? 'end' : false,
  });

  if (!editor) {
    return null;
  }

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: tableSize.rows, cols: tableSize.cols, withHeaderRow: true })
      .run();
    setShowTableModal(false);
  };

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkModal(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageModal(false);
    }
  };

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080'];
  const highlights = ['#FFFF00', '#00FFFF', '#FF69B4', '#98FB98', '#DDA0DD'];

  const toolbarGroups = [
    {
      id: 'text-style',
      tools: [
        {
          icon: <Bold size={18} />,
          action: () => editor.chain().focus().toggleBold().run(),
          isActive: editor.isActive('bold'),
          title: 'Negrito'
        },
        {
          icon: <Italic size={18} />,
          action: () => editor.chain().focus().toggleItalic().run(),
          isActive: editor.isActive('italic'),
          title: 'Itálico'
        },
        {
          icon: <UnderlineIcon size={18} />,
          action: () => editor.chain().focus().toggleUnderline().run(),
          isActive: editor.isActive('underline'),
          title: 'Sublinhado'
        }
      ]
    },
    {
      id: 'alignment',
      tools: [
        {
          icon: <AlignLeft size={18} />,
          action: () => editor.chain().focus().setTextAlign('left').run(),
          isActive: editor.isActive({ textAlign: 'left' }),
          title: 'Alinhar à esquerda'
        },
        {
          icon: <AlignCenter size={18} />,
          action: () => editor.chain().focus().setTextAlign('center').run(),
          isActive: editor.isActive({ textAlign: 'center' }),
          title: 'Centralizar'
        },
        {
          icon: <AlignRight size={18} />,
          action: () => editor.chain().focus().setTextAlign('right').run(),
          isActive: editor.isActive({ textAlign: 'right' }),
          title: 'Alinhar à direita'
        }
      ]
    },
    {
      id: 'lists',
      tools: [
        {
          icon: <List size={18} />,
          action: () => editor.chain().focus().toggleBulletList().run(),
          isActive: editor.isActive('bulletList'),
          title: 'Lista com marcadores'
        },
        {
          icon: <ListOrdered size={18} />,
          action: () => editor.chain().focus().toggleOrderedList().run(),
          isActive: editor.isActive('orderedList'),
          title: 'Lista numerada'
        },
        {
          icon: <CheckSquare size={18} />,
          action: () => editor.chain().focus().toggleTaskList().run(),
          isActive: editor.isActive('taskList'),
          title: 'Lista de tarefas'
        }
      ]
    }
  ];

  return (
    <>
      <div className="border rounded-lg overflow-hidden bg-white">
        {/* Mobile Toolbar */}
        <div className="md:hidden border-b p-2 bg-gray-50">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="w-full flex items-center justify-center gap-2 p-2 rounded bg-gray-100"
          >
            <MoreVertical size={20} />
            <span>Ferramentas de Edição</span>
          </button>
          
          {showMobileMenu && (
            <div className="mt-2 space-y-2">
              {toolbarGroups.map((group) => (
                <div key={group.id} className="flex flex-wrap gap-1 p-1 border-b">
                  {group.tools.map((tool) => (
                    <button
                      key={tool.title}
                      onClick={() => {
                        tool.action();
                        setShowMobileMenu(false);
                      }}
                      className={`p-2 rounded flex items-center gap-1 ${
                        tool.isActive ? 'bg-gray-200' : 'hover:bg-gray-100'
                      }`}
                    >
                      {tool.icon}
                      <span className="text-sm">{tool.title}</span>
                    </button>
                  ))}
                </div>
              ))}
              
              <div className="flex flex-wrap gap-1 p-1">
                <button
                  onClick={() => setShowTableModal(true)}
                  className="p-2 rounded flex items-center gap-1 hover:bg-gray-100"
                >
                  <TableIcon size={18} />
                  <span className="text-sm">Tabela</span>
                </button>
                <button
                  onClick={() => setShowImageModal(true)}
                  className="p-2 rounded flex items-center gap-1 hover:bg-gray-100"
                >
                  <ImageIcon size={18} />
                  <span className="text-sm">Imagem</span>
                </button>
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="p-2 rounded flex items-center gap-1 hover:bg-gray-100"
                >
                  <LinkIcon size={18} />
                  <span className="text-sm">Link</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Toolbar */}
        <div className="hidden md:flex border-b p-2 flex-wrap gap-2 bg-gray-50">
          <div className="flex items-center gap-1 border-r pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
              title="Negrito"
            >
              <Bold size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
              title="Itálico"
            >
              <Italic size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
              title="Sublinhado"
            >
              <UnderlineIcon size={18} />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r pr-2">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
              title="Alinhar à esquerda"
            >
              <AlignLeft size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
              title="Centralizar"
            >
              <AlignCenter size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
              title="Alinhar à direita"
            >
              <AlignRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
              title="Lista com marcadores"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
              title="Lista numerada"
            >
              <ListOrdered size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('taskList') ? 'bg-gray-200' : ''}`}
              title="Lista de tarefas"
            >
              <CheckSquare size={18} />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r pr-2">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
              title="Título 1"
            >
              <Heading1 size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
              title="Título 2"
            >
              <Heading2 size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`p-1.5 rounded hover:bg-gray-200 ${editor.isActive('paragraph') ? 'bg-gray-200' : ''}`}
              title="Parágrafo"
            >
              <Type size={18} />
            </button>
          </div>

          <div className="flex items-center gap-1 border-r pr-2">
            <div className="relative group">
              <button
                className="p-1.5 rounded hover:bg-gray-200 flex items-center gap-1"
                title="Cor do texto"
              >
                <Palette size={18} />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-2 hidden group-hover:flex flex-wrap gap-1 z-10">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => editor.chain().focus().setColor(color).run()}
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="relative group">
              <button
                className="p-1.5 rounded hover:bg-gray-200 flex items-center gap-1"
                title="Destacar texto"
              >
                <HighlighterIcon size={18} />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-2 hidden group-hover:flex flex-wrap gap-1 z-10">
                {highlights.map((color) => (
                  <button
                    key={color}
                    onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowTableModal(true)}
              className="p-1.5 rounded hover:bg-gray-200"
              title="Inserir tabela"
            >
              <TableIcon size={18} />
            </button>
            <button
              onClick={() => setShowImageModal(true)}
              className="p-1.5 rounded hover:bg-gray-200"
              title="Inserir imagem"
            >
              <ImageIcon size={18} />
            </button>
            <button
              onClick={() => setShowLinkModal(true)}
              className="p-1.5 rounded hover:bg-gray-200"
              title="Inserir link"
            >
              <LinkIcon size={18} />
            </button>
            {editor.isActive('table') && (
              <button
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="p-1.5 rounded hover:bg-gray-200 text-red-500"
                title="Remover tabela"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        </div>

        <EditorContent 
          editor={editor} 
          className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
        />
      </div>

      {/* Modal de Tabela */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Inserir Tabela</h3>
              <button onClick={() => setShowTableModal(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Linhas
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableSize.rows}
                  onChange={(e) => setTableSize({ ...tableSize, rows: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#303845]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Colunas
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableSize.cols}
                  onChange={(e) => setTableSize({ ...tableSize, cols: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#303845]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={addTable}
                className="px-4 py-2 bg-[#303845] text-white rounded hover:bg-opacity-90"
              >
                Inserir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Link */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Inserir Link</h3>
              <button onClick={() => setShowLinkModal(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://exemplo.com"
              className="w-full px-3 py-2 border rounded mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={addLink}
                className="px-4 py-2 bg-[#303845] text-white rounded hover:bg-opacity-90"
              >
                Inserir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Imagem */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Inserir Imagem</h3>
              <button onClick={() => setShowImageModal(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="w-full px-3 py-2 border rounded mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={addImage}
                className="px-4 py-2 bg-[#303845] text-white rounded hover:bg-opacity-90"
              >
                Inserir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}