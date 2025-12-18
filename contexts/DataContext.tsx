
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AssociationMember, Language, DisplaySettings, Field, VerificationStatus, CustomField } from '../types';
import { MEMBERS_DATA } from '../constants';

interface DataContextType {
  members: AssociationMember[];
  displaySettings: DisplaySettings;
  isAdminMode: boolean;
  language: Language;
  toggleAdminMode: () => void;
  toggleLanguage: () => void;
  addMember: (m: AssociationMember) => void;
  deleteMember: (id: string) => void;
  updateMember: (id: string, updates: Partial<AssociationMember>) => void;
  updateFieldInfo: (memberId: string, path: string[], valCN: string, valEN: string, newStatus: VerificationStatus) => void;
  addCustomField: (memberId: string, labelCN: string, labelEN: string) => void;
  updateDisplaySettings: (newSettings: DisplaySettings) => void;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<AssociationMember[]>([]);
  // Updated initial state to match the updated DisplaySettings interface
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    showActiveOnly: false,
    allowedRegions: ['Europe', 'AsiaPacific', 'Americas', 'Africa'],
    allowedTypes: ['Member', 'Affiliate'],
    showCorporate: true,
    showAssociation: true,
    showAffiliate: true,
  });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [language, setLanguage] = useState<Language>('zh');

  useEffect(() => {
    const saved = localStorage.getItem('ifpsm_v8_data');
    if (saved) setMembers(JSON.parse(saved));
    else setMembers(MEMBERS_DATA);
  }, []);

  useEffect(() => {
    if (members.length > 0) localStorage.setItem('ifpsm_v8_data', JSON.stringify(members));
  }, [members]);

  const addMember = (m: AssociationMember) => setMembers(prev => [m, ...prev]);
  const deleteMember = (id: string) => {
    if(confirm('确定删除该成员吗？')) setMembers(prev => prev.filter(m => m.id !== id));
  };

  const updateMember = (id: string, updates: Partial<AssociationMember>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const updateFieldInfo = (memberId: string, path: string[], valCN: string, valEN: string, newStatus: VerificationStatus) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;
      // Simple path update logic
      if (path[0] === 'overview') return { ...m, overview: { ...m.overview, valueCN: valCN, valueEN: valEN, status: newStatus }};
      if (path[0] === 'basicFacts') {
          const key = path[1] as keyof typeof m.basicFacts;
          return { ...m, basicFacts: { ...m.basicFacts, [key]: { ...m.basicFacts[key], valueCN: valCN, valueEN: valEN, status: newStatus } }};
      }
      if (path[0] === 'customFields') {
          const fid = path[1];
          return { ...m, customFields: m.customFields?.map(f => f.id === fid ? { ...f, valueCN: valCN, valueEN: valEN, status: newStatus } : f) };
      }
      return m;
    }));
  };

  const addCustomField = (memberId: string, labelCN: string, labelEN: string) => {
    setMembers(prev => prev.map(m => {
        if (m.id !== memberId) return m;
        const newField: CustomField = {
            id: Math.random().toString(36).substr(2, 9),
            labelCN, labelEN, valueCN: '', valueEN: '', status: 'pending'
        };
        return { ...m, customFields: [...(m.customFields || []), newField] };
    }));
  };

  return (
    <DataContext.Provider value={{
      members, displaySettings, isAdminMode, language,
      toggleAdminMode: () => setIsAdminMode(!isAdminMode),
      toggleLanguage: () => setLanguage(l => l === 'zh' ? 'en' : 'zh'),
      addMember, deleteMember, updateMember, updateFieldInfo, addCustomField,
      updateDisplaySettings: setDisplaySettings,
      resetToDefaults: () => { if(confirm('重置所有数据？')) { setMembers(MEMBERS_DATA); } }
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData error');
  return context;
};
