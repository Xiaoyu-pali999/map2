
import React, { useState, useCallback, useMemo } from 'react';
import MapSystem from './components/MapSystem';
import AssociationDetailCard from './components/AssociationDetailCard';
import Legend from './components/Legend';
import AdminEditor from './components/AdminEditor';
import { AssociationMember, Region } from './types';
import { DataProvider, useData } from './contexts/DataContext';
import { Settings, Download, FileText, Presentation, SlidersHorizontal, Check, Eye } from 'lucide-react';
import { UI_TRANSLATIONS } from './constants';
import { useMediaQuery } from './hooks/useMediaQuery';
import { generatePDF, generatePPTX } from './utils/exportSystem';

const MinimalFilter: React.FC = () => {
    const { displaySettings, updateDisplaySettings, language } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const T = UI_TRANSLATIONS[language];

    const toggleRegion = (r: Region) => {
        const next = displaySettings.allowedRegions.includes(r) ? displaySettings.allowedRegions.filter(x => x !== r) : [...displaySettings.allowedRegions, r];
        updateDisplaySettings({ ...displaySettings, allowedRegions: next });
    };

    return (
        <div className="relative pointer-events-auto">
            <button 
                onMouseEnter={() => !isOpen && setIsOpen(true)}
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-6 h-12 rounded-full shadow-2xl border transition-all duration-500 font-black text-[10px] uppercase tracking-widest ${isOpen ? 'bg-slate-900 text-white border-slate-900' : 'bg-white/90 backdrop-blur-md text-slate-600 border-slate-100 hover:border-blue-400'}`}
            >
                <SlidersHorizontal size={14} />
                <span>{language === 'zh' ? '分类过滤' : 'Filters'}</span>
                <span className="opacity-30">{displaySettings.allowedRegions.length}/4</span>
            </button>

            {isOpen && (
                <div onMouseLeave={() => setIsOpen(false)} className="absolute top-16 left-0 w-64 bg-white/95 backdrop-blur-xl border border-white/60 rounded-[2rem] shadow-[0_40px_80px_-12px_rgba(0,0,0,0.15)] z-20 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-6">
                        <section>
                            <h4 className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4 flex items-center justify-between">选择洲际</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {['Europe', 'AsiaPacific', 'Americas', 'Africa'].map(r => (
                                    <button key={r} onClick={() => toggleRegion(r as Region)} className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${displaySettings.allowedRegions.includes(r as Region) ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:bg-slate-50'}`}>
                                        {(T as any)[`region${r}`]}
                                        {displaySettings.allowedRegions.includes(r as Region) && <Check size={12}/>}
                                    </button>
                                ))}
                            </div>
                        </section>
                        <button 
                            onClick={() => updateDisplaySettings({...displaySettings, showActiveOnly: !displaySettings.showActiveOnly})}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${displaySettings.showActiveOnly ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400'}`}
                        >
                            <span className="flex items-center gap-2"><Eye size={12}/> 仅看活跃</span>
                            <div className={`w-3 h-3 rounded-full ${displaySettings.showActiveOnly ? 'bg-white' : 'bg-slate-200'}`} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AppContent: React.FC = () => {
  const [selectedAssociation, setSelectedAssociation] = useState<AssociationMember | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const { members, isAdminMode, toggleAdminMode, language, toggleLanguage, displaySettings } = useData();
  const T = UI_TRANSLATIONS[language];
  const isMobile = useMediaQuery('(max-width: 768px)');

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      if (displaySettings.showActiveOnly && m.status !== 'active') return false;
      if (!displaySettings.allowedRegions.includes(m.region)) return false;
      return true;
    });
  }, [members, displaySettings]);

  const currentIndex = useMemo(() => {
    return selectedAssociation ? filteredMembers.findIndex(m => m.id === selectedAssociation.id) : -1;
  }, [selectedAssociation, filteredMembers]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedAssociation(filteredMembers[currentIndex - 1]);
    }
  }, [currentIndex, filteredMembers]);

  const handleNext = useCallback(() => {
    if (currentIndex < filteredMembers.length - 1) {
      setSelectedAssociation(filteredMembers[currentIndex + 1]);
    }
  }, [currentIndex, filteredMembers]);

  return (
    <div className="relative w-full h-screen flex flex-col bg-[#FDFDFF] overflow-hidden">
      <header className={`absolute top-0 left-0 w-full pointer-events-none z-30 flex items-start justify-between transition-all duration-500 ${isMobile ? 'px-6 pt-6' : 'px-16 mt-12'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-10 pointer-events-auto">
            <div className="flex flex-col">
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none uppercase">{T.systemTitle}</h1>
                <div className="flex items-center gap-4 mt-3">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-indigo-100/50">IFPSM Professional Map</span>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">{T.systemSubtitle}</p>
                </div>
            </div>
            {!isMobile && <MinimalFilter />}
        </div>
        
        <div className={`flex items-center gap-5 pointer-events-auto ${isMobile ? 'absolute top-6 right-6' : ''}`}>
          <div className="relative">
            <button onClick={() => setIsExportOpen(!isExportOpen)} className="flex items-center gap-3 px-8 h-12 rounded-full shadow-2xl border border-white/60 transition-all bg-white/90 backdrop-blur-md text-slate-700 hover:bg-slate-50 font-black text-[10px] uppercase tracking-widest">
              <Download size={15} /> <span>{!isMobile && T.exportMenu}</span>
            </button>
            {isExportOpen && (
              <div className="absolute right-0 mt-4 w-64 bg-white/95 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-2xl p-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <button onClick={() => { generatePPTX(members, displaySettings as any, language); setIsExportOpen(false); }} className="w-full px-6 py-4 text-left text-[10px] font-black text-slate-500 hover:bg-slate-50 rounded-[1.75rem] flex items-center gap-4 transition-all uppercase tracking-widest"><Presentation size={18} className="text-orange-400"/> {T.exportPPTX}</button>
                <button onClick={() => { generatePDF(members, displaySettings as any, language); setIsExportOpen(false); }} className="w-full px-6 py-4 text-left text-[10px] font-black text-slate-500 hover:bg-slate-50 rounded-[1.75rem] flex items-center gap-4 transition-all uppercase tracking-widest"><FileText size={18} className="text-rose-400"/> {T.exportPDF}</button>
              </div>
            )}
          </div>

          <button onClick={toggleLanguage} className="flex items-center justify-center w-12 h-12 rounded-full shadow-2xl border border-white transition-all bg-white/90 backdrop-blur-md text-slate-500 font-black text-[11px] hover:text-indigo-600">
             {language === 'zh' ? 'EN' : 'ZH'}
          </button>

          <button onClick={toggleAdminMode} className={`flex items-center justify-center w-12 h-12 rounded-full shadow-2xl border transition-all duration-500 ${isAdminMode ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200' : 'bg-white/90 backdrop-blur-md text-slate-300 border-white hover:text-slate-900'}`}>
             <Settings size={22} />
          </button>
        </div>
      </header>

      <main className="relative z-10 w-full h-full">
        <MapSystem members={filteredMembers} onSelectAssociation={setSelectedAssociation} selectedId={selectedAssociation?.id} />
        <Legend />
        {selectedAssociation && (
          <div className={isMobile ? 'contents' : 'absolute top-40 right-16 z-40'}>
            <AssociationDetailCard 
              data={selectedAssociation} 
              onClose={() => setSelectedAssociation(null)} 
              isMobile={isMobile}
              onPrev={currentIndex > 0 ? handlePrev : undefined}
              onNext={currentIndex < filteredMembers.length - 1 ? handleNext : undefined}
            />
          </div>
        )}
        {isAdminMode && <AdminEditor onClose={toggleAdminMode} />}
      </main>
    </div>
  );
};

const App: React.FC = () => <DataProvider><AppContent /></DataProvider>;
export default App;
