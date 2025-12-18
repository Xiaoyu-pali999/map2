import React, { useState } from 'react';
import { REGION_COLORS, UI_TRANSLATIONS } from '../constants';
import { useData } from '../contexts/DataContext';
import { Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Region } from '../types';

const Legend: React.FC = () => {
  const { language, members } = useData();
  const T = UI_TRANSLATIONS[language];
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isExpanded, setIsExpanded] = useState(!isMobile);

  // Calculate Region Counts based on Active Associations
  const regionCounts = members.reduce((acc, m) => {
    if (m.status === 'active' && m.memberCategory === 'association' && m.memberType === 'Member') {
        acc[m.region] = (acc[m.region] || 0) + 1;
    }
    return acc;
  }, {} as Record<Region, number>);

  const affiliateCount = members.filter(m => m.status === 'active' && m.memberType === 'Affiliate').length;

  return (
    <div className={`absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl shadow-lg z-20 transition-all duration-300 ${isExpanded ? 'p-4' : 'p-2'} animate-in fade-in slide-in-from-bottom-4`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-slate-800 w-full"
      >
        <Globe size={16} />
        {isExpanded && <h3 className="text-sm font-bold flex-1 text-left">{T.mapLegend}</h3>}
        {isMobile && (
           isExpanded ? <ChevronDown size={14} /> : null
        )}
      </button>
      
      {isExpanded && (
        <div className="space-y-2 mt-3 min-w-[140px]">
          <div className="text-xs font-semibold text-slate-500 mb-1">{T.member}</div>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(REGION_COLORS).map(([region, colors]) => (
              <div key={region} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.fill }}></span>
                  <span className="text-xs text-slate-600">
                    {(T as any)[`region${region}`] || region}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 rounded-full">
                  {regionCounts[region as Region] || 0}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs font-semibold text-slate-500 mb-1">{T.affiliate}</div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border border-dashed border-slate-500 bg-transparent flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span>
              </span>
              <span className="text-xs text-slate-600">{T.affiliate}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 rounded-full">
               {affiliateCount}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Legend;