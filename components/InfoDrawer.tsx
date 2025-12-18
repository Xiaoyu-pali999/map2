
import React, { useState } from 'react';
import { AssociationMember } from '../types';
import { X, Globe, Calendar, Users, Building2, ChevronDown, ChevronUp } from 'lucide-react';
import { REGION_COLORS } from '../constants';
import { useData } from '../contexts/DataContext';

interface InfoDrawerProps {
  association: AssociationMember | null;
  onClose: () => void;
}

const InfoDrawer: React.FC<InfoDrawerProps> = ({ association, onClose }) => {
  const { language } = useData();
  const [expandedProfile, setExpandedProfile] = useState(false);

  if (!association) return null;

  const isAffiliate = association.memberType === 'Affiliate';
  const themeColor = isAffiliate ? '#475569' : REGION_COLORS[association.region].text;
  const bgBadge = isAffiliate ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-blue-50 text-blue-800 border-blue-200';

  const overview = language === 'zh' ? association.overview.valueCN : association.overview.valueEN;
  const tags = language === 'zh' ? association.coreAreas.tagsCN : association.coreAreas.tagsEN;

  return (
    <div className={`fixed right-0 top-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${association ? 'translate-x-0' : 'translate-x-full'} overflow-hidden flex flex-col border-l border-slate-200`}>
      
      <div className="bg-white p-6 border-b border-slate-100 flex items-start justify-between relative z-10 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 text-xs font-semibold uppercase tracking-wider border rounded ${bgBadge}`}>
              {association.memberType === 'Member' ? 'Member' : 'Affiliate'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">
            {association.abbreviation}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-light leading-snug">
            {language === 'zh' ? association.nameCN : association.nameEN}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        
        {/* Overview */}
        <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Overview</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{overview || "—"}</p>
        </div>

        {/* Basic Facts */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Calendar size={14} />
                <span className="text-xs font-medium uppercase">Established</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{association.basicFacts.yearEstablished.valueEN || "—"}</p>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Building2 size={14} />
                <span className="text-xs font-medium uppercase">Type</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{association.basicFacts.legalStatus.valueEN || "—"}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Users size={14} />
                <span className="text-xs font-medium uppercase">Members</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{association.basicFacts.memberScale.valueEN || "—"}</p>
            </div>
        </div>

        {/* Tags */}
        {tags && (
          <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Core Areas</h4>
              <div className="flex flex-wrap gap-2">
                {tags.map((biz, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs rounded-full shadow-sm">
                    {biz}
                  </span>
                ))}
              </div>
          </div>
        )}

        {association.contacts.website && (
            <a 
              href={association.contacts.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all text-sm font-medium shadow-md"
            >
              <Globe size={16} />
              Visit Website
            </a>
        )}
      </div>
    </div>
  );
};

export default InfoDrawer;
