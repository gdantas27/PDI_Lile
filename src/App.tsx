import React, { useState } from 'react';
import { DndContext, DragEndEvent, closestCenter, DragStartEvent, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { Objectives } from './components/Objectives';
import { ActionPlan } from './components/ActionPlan';
import { Metrics } from './components/Metrics';
import { Monitoring } from './components/Monitoring';
import { TaskManager } from './components/TaskManager';
import { SortableSection } from './components/SortableSection';
import { AddSection } from './components/AddSection';
import { EditableField } from './components/EditableField';
import { Trash2 } from 'lucide-react';

type Section = {
  id: string;
  component: React.ReactNode;
  title: string;
  isRemovable?: boolean;
  content?: string;
};

function App() {
  const [overview, setOverview] = useState(
    "Este Plano de Desenvolvimento Individual (PDI) foi elaborado com o objetivo de impulsionar minha carreira como Profissional de Publicidade e Propaganda, com foco específico na produção de conteúdo digital de alta performance. O plano visa desenvolver competências essenciais em criação, edição e análise de conteúdo para mídias sociais, combinando habilidades técnicas e estratégicas. A meta principal é estabelecer uma presença digital influente e autêntica, alcançando mais de 800 mil visualizações através de conteúdo estrategicamente planejado e executado com excelência. Este PDI representa um compromisso com a excelência profissional e o desenvolvimento contínuo no dinâmico mercado de marketing digital."
  );
  
  const [mainObjective, setMainObjective] = useState(
    "Consolidar-me como referência em produção de conteúdo digital através do desenvolvimento de habilidades avançadas em criação, edição e estratégia de conteúdo. O objetivo é construir uma presença digital sólida e influente, atingindo a marca de 800 mil visualizações em 6 meses, através da criação de conteúdo estratégico, educativo e altamente engajador. Este objetivo será alcançado por meio do domínio de ferramentas essenciais como CANVA PRO, CAPCUT e NINJALITICS, além do aperfeiçoamento em copywriting e análise de dados para otimização contínua do conteúdo."
  );

  const [sections, setSections] = useState<Section[]>([
    { 
      id: 'overview', 
      component: <Overview overview={overview} setOverview={setOverview} />,
      title: 'Visão Geral',
      isRemovable: false
    },
    { 
      id: 'objectives', 
      component: <Objectives mainObjective={mainObjective} setMainObjective={setMainObjective} />,
      title: 'Objetivos',
      isRemovable: true
    },
    { 
      id: 'actionPlan', 
      component: <ActionPlan />,
      title: 'Plano de Ação',
      isRemovable: true
    },
    { 
      id: 'metrics', 
      component: <Metrics />,
      title: 'Metas e Indicadores',
      isRemovable: true
    },
    { 
      id: 'monitoring', 
      component: <Monitoring />,
      title: 'Acompanhamento e Revisão',
      isRemovable: true
    },
    {
      id: 'tasks',
      component: <TaskManager />,
      title: 'Gerenciamento de Tarefas',
      isRemovable: true
    }
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [customSectionContent, setCustomSectionContent] = useState<Record<string, string>>({});

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((sections) => {
        const oldIndex = sections.findIndex((section) => section.id === active.id);
        const newIndex = sections.findIndex((section) => section.id === over.id);
        return arrayMove(sections, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  const handleAddSection = (title: string) => {
    const newSectionId = `custom-${Date.now()}`;
    const initialContent = "Digite o conteúdo aqui...";
    
    setCustomSectionContent(prev => ({
      ...prev,
      [newSectionId]: initialContent
    }));

    const newSection: Section = {
      id: newSectionId,
      title,
      isRemovable: true,
      content: initialContent,
      component: (
        <section className="px-4 md:px-0">
          <h2 className="text-2xl font-bold text-[#303845] mb-6">{title}</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <EditableField 
              value={initialContent}
              onChange={(value) => {
                setCustomSectionContent(prev => ({
                  ...prev,
                  [newSectionId]: value
                }));
              }}
              multiline={true}
            />
          </div>
        </section>
      )
    };

    setSections([...sections, newSection]);
  };

  const handleRemoveSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
    if (customSectionContent[sectionId]) {
      const newContent = { ...customSectionContent };
      delete newContent[sectionId];
      setCustomSectionContent(newContent);
    }
  };

  const handleEditSection = (sectionId: string, newContent: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const updatedSection = { ...section };
        if (section.id.startsWith('custom-')) {
          setCustomSectionContent(prev => ({
            ...prev,
            [sectionId]: newContent
          }));
          updatedSection.component = (
            <section className="px-4 md:px-0">
              <h2 className="text-2xl font-bold text-[#303845] mb-6">{section.title}</h2>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <EditableField 
                  value={newContent}
                  onChange={(value) => {
                    setCustomSectionContent(prev => ({
                      ...prev,
                      [sectionId]: value
                    }));
                  }}
                  multiline={true}
                />
              </div>
            </section>
          );
        }
        return updatedSection;
      }
      return section;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <DndContext 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <main className="max-w-4xl mx-auto px-8 py-12 space-y-16 flex-grow">
          <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                id={section.id}
                title={section.title}
                onRemove={section.isRemovable ? () => handleRemoveSection(section.id) : undefined}
                onEdit={section.isRemovable ? (content) => handleEditSection(section.id, content) : undefined}
              >
                {section.component}
              </SortableSection>
            ))}
          </SortableContext>
          <AddSection onAdd={handleAddSection} />
        </main>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-50 bg-white rounded-lg shadow-2xl">
              {sections.find(section => section.id === activeId)?.component}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <footer className="text-center py-8 text-gray-400 text-xs">
        Com amor, seu, Adis.
      </footer>
    </div>
  );
}

export default App;