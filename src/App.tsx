import React, { useState, useEffect } from 'react';
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
import { ActionPlanSummary } from './components/ActionPlanSummary';
import { supabase } from './lib/supabase';

interface SectionData {
  id: string;
  title: string;
  type: 'overview' | 'objectives' | 'actionPlan' | 'metrics' | 'monitoring' | 'tasks' | 'custom' | 'actionPlanSummary';
  isRemovable: boolean;
  content?: string;
}

const defaultSections: SectionData[] = [
  { id: 'overview', title: 'Visão Geral', type: 'overview', isRemovable: false },
  { id: 'actionPlanSummary', title: 'Plano de Ação - Resumo', type: 'actionPlanSummary', isRemovable: true },
  { id: 'objectives', title: 'Objetivos', type: 'objectives', isRemovable: true },
  { id: 'actionPlan', title: 'Plano de Ação', type: 'actionPlan', isRemovable: true },
  { id: 'metrics', title: 'Metas e Indicadores', type: 'metrics', isRemovable: true },
  { id: 'monitoring', title: 'Acompanhamento e Revisão', type: 'monitoring', isRemovable: true },
  { id: 'tasks', title: 'Gerenciamento de Tarefas', type: 'tasks', isRemovable: true }
];

function App() {
  const [overview, setOverview] = useState("Este Plano de Desenvolvimento Individual (PDI) foi elaborado com o objetivo de impulsionar minha carreira como Profissional de Publicidade e Propaganda, com foco específico na produção de conteúdo digital de alta performance. O plano visa desenvolver competências essenciais em criação, edição e análise de conteúdo para mídias sociais, combinando habilidades técnicas e estratégicas. A meta principal é estabelecer uma presença digital influente e autêntica, alcançando mais de 800 mil visualizações através de conteúdo estrategicamente planejado e executado com excelência. Este PDI representa um compromisso com a excelência profissional e o desenvolvimento contínuo no dinâmico mercado de marketing digital.");
  
  const [mainObjective, setMainObjective] = useState("Consolidar-me como referência em produção de conteúdo digital através do desenvolvimento de habilidades avançadas em criação, edição e estratégia de conteúdo. O objetivo é construir uma presença digital sólida e influente, atingindo a marca de 800 mil visualizações em 6 meses, através da criação de conteúdo estratégico, educativo e altamente engajador. Este objetivo será alcançado por meio do domínio de ferramentas essenciais como CANVA PRO, CAPCUT e NINJALITICS, além do aperfeiçoamento em copywriting e análise de dados para otimização contínua do conteúdo.");

  const [sectionOrder, setSectionOrder] = useState<SectionData[]>(defaultSections);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [customSectionContent, setCustomSectionContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!session) {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: 'tommyarts4@gmail.com',
            password: 'Gladston@123'
          });
          
          if (signInError) throw signInError;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          await loadData(user.id);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const loadData = async (uid: string) => {
    try {
      const { data: pdiData, error } = await supabase
        .from('pdi_data')
        .select('*')
        .eq('id', uid)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Data doesn't exist, create initial data
          await createInitialData(uid);
          return;
        }
        throw error;
      }

      if (pdiData) {
        setOverview(pdiData.overview);
        setMainObjective(pdiData.main_objective);
        setSectionOrder(pdiData.section_order);
        setCustomSectionContent(pdiData.custom_sections);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createInitialData = async (uid: string) => {
    try {
      const { error } = await supabase
        .from('pdi_data')
        .insert({
          id: uid,
          overview,
          main_objective: mainObjective,
          section_order: defaultSections,
          custom_sections: {}
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating initial data:', error);
    }
  };

  const saveData = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('pdi_data')
        .upsert({
          id: userId,
          overview,
          main_objective: mainObjective,
          section_order: sectionOrder,
          custom_sections: customSectionContent
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    if (!isLoading && userId) {
      const debounceTimer = setTimeout(() => {
        saveData();
      }, 1000);

      return () => clearTimeout(debounceTimer);
    }
  }, [overview, mainObjective, sectionOrder, customSectionContent, isLoading, userId]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSectionOrder((sections) => {
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

    const newSection: SectionData = {
      id: newSectionId,
      title,
      type: 'custom',
      isRemovable: true,
      content: initialContent
    };

    setSectionOrder([...sectionOrder, newSection]);
  };

  const handleRemoveSection = (sectionId: string) => {
    setSectionOrder(sections => sections.filter(section => section.id !== sectionId));
    if (customSectionContent[sectionId]) {
      const newContent = { ...customSectionContent };
      delete newContent[sectionId];
      setCustomSectionContent(newContent);
    }
  };

  const handleEditSection = (sectionId: string, newContent: string) => {
    if (sectionId.startsWith('custom-')) {
      setCustomSectionContent(prev => ({
        ...prev,
        [sectionId]: newContent
      }));
    }
  };

  const renderSectionComponent = (section: SectionData) => {
    switch (section.type) {
      case 'overview':
        return <Overview overview={overview} setOverview={setOverview} />;
      case 'actionPlanSummary':
        return <ActionPlanSummary />;
      case 'objectives':
        return <Objectives mainObjective={mainObjective} setMainObjective={setMainObjective} />;
      case 'actionPlan':
        return <ActionPlan />;
      case 'metrics':
        return <Metrics />;
      case 'monitoring':
        return <Monitoring />;
      case 'tasks':
        return <TaskManager />;
      case 'custom':
        return (
          <section className="px-4 md:px-0">
            <h2 className="text-2xl font-bold text-[#303845] mb-6">{section.title}</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <EditableField 
                value={customSectionContent[section.id] || ''}
                onChange={(value) => handleEditSection(section.id, value)}
                multiline={true}
              />
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#303845] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <DndContext 
        collisionDetection={closestCenter} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <main className="max-w-4xl mx-auto px-8 py-12 space-y-16 flex-grow">
          <SortableContext items={sectionOrder.map(s => s.id)} strategy={verticalListSortingStrategy}>
            {sectionOrder.map((section) => (
              <SortableSection
                key={section.id}
                id={section.id}
                title={section.title}
                onRemove={section.isRemovable ? () => handleRemoveSection(section.id) : undefined}
                onEdit={section.isRemovable ? (content) => handleEditSection(section.id, content) : undefined}
              >
                {renderSectionComponent(section)}
              </SortableSection>
            ))}
          </SortableContext>
          <AddSection onAdd={handleAddSection} />
        </main>

        <DragOverlay>
          {activeId ? (
            <div className="opacity-50 bg-white rounded-lg shadow-2xl">
              {renderSectionComponent(sectionOrder.find(section => section.id === activeId)!)}
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