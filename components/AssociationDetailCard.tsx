
import React from 'react';
import { AssociationMember, Field } from '../types';
import { useData } from '../contexts/DataContext';
import { X, User, ExternalLink, MapPin, Globe, Building, Users, Calendar, Lock, Sparkles, Mail, LayoutGrid } from 'lucide-react';
import { UI_TRANSLATIONS } from '../constants';

interface Props {
  data: AssociationMember;
  onClose?: () => void;
  isMobile: boolean;
}

const AssociationDetailCard: React.FC<Props> = ({ data, onClose, isMobile }) => {
  const { language } = useData(); 
  const T = UI_TRANSLATIONS[language]; 
  
  const isAffiliate = data.memberType === 'Affiliate';
  
  const getDisplayValue = (field: Field) => {
      const val = language === 'zh' ? field.valueCN : field.valueEN;
      return val || "—";
  };

  const desktopClasses = "w-[500px] bg-white/95 backdrop-blur-3xl shadow-[0_48px_140px_-24px_rgba(0,0,0,0.18)] rounded-[3.5rem] border border-white flex flex-col max-h-[85vh] overflow-hidden animate-in slide-in-from-right-16 duration-700 ease-out";
  const mobileClasses = "fixed bottom-0 left-0 w-full bg-white z-[60] rounded-t-[3.5rem] shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.1)] flex flex-col h-[85vh] animate-in slide-in-from-bottom-full duration-500 ease-out";

  return (
    <div className={isMobile ? mobileClasses : desktopClasses}>
      {/* 拖动指示条 (仅移动端) */}
      {isMobile && <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mt-4 shrink-0" />}

      {/* 头部摘要信息 */}
      <div className="relative p-10 pb-8 border-b border-slate-50 shrink-0">
         <button onClick={onClose} className="absolute top-8 right-10 p-3 bg-slate-50 hover:bg-blue-50 text-slate-300 hover:text-blue-600 rounded-full transition-all duration-300"><X size={20} /></button>
         
         <div className="flex gap-8 items-start">
             <div className="w-28 h-28 rounded-[2.5rem] bg-white border border-slate-100 p-5 shadow-2xl shadow-slate-100 flex items-center justify-center shrink-0">
                 {data.logo ? (
                     <img src={data.logo} alt="Org Logo" className="max-w-full max-h-full object-contain" />
                 ) : (
                     <Sparkles size={40} className="text-blue-100" />
                 )}
             </div>
             <div className="pt-2">
                 <div className="flex flex-wrap items-center gap-3 mb-4">
                     <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border ${isAffiliate ? 'bg-slate-50 text-slate-400 border-slate-200' : 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100'}`}>
                         {isAffiliate ? (language === 'zh' ? '附属机构' : 'Affiliate') : (language === 'zh' ? '联盟会员' : 'Full Member')}
                     </span>
                     <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        <MapPin size={14} className="text-blue-500" /> {language === 'zh' ? data.countryCN : data.country}
                     </div>
                 </div>
                 <h1 className="text-3xl font-black text-slate-950 tracking-tighter leading-tight mb-2">{data.abbreviation}</h1>
                 <p className="text-[12px] text-slate-400 font-bold uppercase tracking-tight line-clamp-2 leading-snug">{language === 'zh' ? data.nameCN : data.nameEN}</p>
             </div>
         </div>
      </div>

      {/* 核心能力与档案内容 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-10 pt-0 space-y-12 mt-8 pb-16">
         {/* 1. 协会简介 */}
         <section>
             <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] mb-5 flex items-center gap-3">
                 <Building size={16}/> {T.overview}
             </h3>
             <p className="text-[16px] text-slate-800 leading-relaxed font-medium">
                 {language === 'zh' ? data.overview.valueCN : data.overview.valueEN}
             </p>
         </section>

         {/* 2. 基础概况指标 */}
         <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white transition-colors">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">{T.yearEstablished}</span>
                <div className="text-base font-black text-slate-900 flex items-center gap-3"><Calendar size={18} className="text-blue-400"/> {getDisplayValue(data.basicFacts.yearEstablished)}</div>
            </div>
            <div className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white transition-colors">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">{T.legalStatus}</span>
                <div className="text-base font-black text-slate-900 flex items-center gap-3"><Lock size={18} className="text-blue-400"/> {getDisplayValue(data.basicFacts.legalStatus)}</div>
            </div>
            <div className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white transition-colors">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">{T.memberScale}</span>
                <div className="text-base font-black text-slate-900 flex items-center gap-3"><Users size={18} className="text-blue-400"/> {getDisplayValue(data.basicFacts.memberScale)}</div>
            </div>
            <div className="p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white transition-colors">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 block">{T.staffScale}</span>
                <div className="text-base font-black text-slate-900 flex items-center gap-3"><Users size={18} className="text-blue-400"/> {getDisplayValue(data.basicFacts.staffScale)}</div>
            </div>
         </div>

         {/* 3. 主要业务领域 */}
         <section>
             <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                 <LayoutGrid size={16}/> {T.coreAreas}
             </h3>
             <div className="space-y-4">
                 {(language === 'zh' ? data.coreAreas.tagsCN : data.coreAreas.tagsEN).map((tag, i) => (
                     <div key={i} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                         <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                         <span className="text-sm font-bold text-slate-700">{tag}</span>
                     </div>
                 ))}
             </div>
         </section>

         {/* 4. 联络治理资产 */}
         <section>
             <h3 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                 <Globe size={16}/> {T.digitalAssets}
             </h3>
             <div className="space-y-4">
                 <div className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                     <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><User size={20}/></div>
                     <div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{T.delegate}</span>
                         <span className="text-base font-bold text-slate-900">{data.contacts.delegate}</span>
                     </div>
                 </div>
                 
                 <div className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                     <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Mail size={20}/></div>
                     <div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{T.email}</span>
                         <span className="text-base font-bold text-slate-900 break-all">{data.contacts.emails[0]}</span>
                     </div>
                 </div>

                 {/* 品牌蓝配色官方网站按钮 */}
                 <a 
                   href={data.contacts.website} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="w-full flex items-center justify-between p-7 bg-blue-600 text-white rounded-[2.5rem] shadow-2xl shadow-blue-100 transition-all hover:scale-[1.03] active:scale-[0.98] group"
                 >
                     <div className="flex items-center gap-6">
                        <Globe size={20} className="text-blue-200 group-hover:rotate-12 transition-transform" />
                        <span className="text-[13px] font-black uppercase tracking-[0.3em]">{T.website}</span>
                     </div>
                     <ExternalLink size={20} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                 </a>
             </div>
         </section>

         {/* 5. 受限治理备注 */}
         <section className="p-8 bg-slate-50 border border-slate-200 border-dashed rounded-[3.5rem]">
             <div className="flex items-center gap-3 text-slate-500 font-black text-[11px] uppercase tracking-widest mb-4">
                 <Lock size={16}/> {T.internalNote}
             </div>
             <p className="text-[14px] text-slate-600 italic leading-relaxed">
                 {data.internalNotes || (language === 'zh' ? '暂无针对该协会机构的受限备注信息。' : 'No governance remarks recorded.')}
             </p>
         </section>
      </div>
    </div>
  );
};

export default AssociationDetailCard;
