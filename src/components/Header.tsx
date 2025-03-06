import React, { useState } from 'react';
import { User, Briefcase, StickyNote } from 'lucide-react';
import { Notes } from './Notes';

export function Header() {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <>
      <div className="bg-[#303845] text-white py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowNotes(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#303845] rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <StickyNote size={20} />
              <span className="hidden sm:inline">Anotações</span>
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="relative">
                <img
                  src="https://upww.screenrec.com/images/f_EYTuxyrPtd3Slaj6fk1Z0vBFX5eiWGnw.png"
                  alt="Elisrayane Barbosa"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  <User className="w-5 h-5 text-[#303845]" />
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-left flex-grow">
              <h1 className="text-2xl md:text-4xl font-bold mb-4 text-shadow">
                Plano de Desenvolvimento Individual
              </h1>
              <div className="border-l-4 border-white pl-4 space-y-2">
                <div className="text-2xl md:text-3xl font-semibold text-gray-200">
                  Elisrayane Barbosa
                </div>
                <div className="flex items-center gap-2 text-gray-200">
                  <Briefcase className="w-4 h-4 flex-shrink-0" />
                  <span className="text-lg">Estagiária Auxiliar de Marketing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Notes isOpen={showNotes} onClose={() => setShowNotes(false)} />
    </>
  );
}