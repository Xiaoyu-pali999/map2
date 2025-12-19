
import React, { useState, useMemo, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { AssociationMember, Region, VerificationStatus, MemberType, CustomField } from '../types';
import { X, Save, ArrowLeft, Globe, User, Edit3, Search, Plus, Trash2, Layout, Link, Map, Info, Sparkles, Upload } from 'lucide-react';

const StatusSelector = ({ status, onChange }: { status: VerificationStatus, onChange: (s: VerificationStatus) => void }) => {
    const states: VerificationStatus[] = ['confirmed', 'pending', 'auto'];
    return (
        <div className="flex bg-slate-100 p-1 rounded-lg">
            {states.map(s => (
                <button key={s} onClick={() => onChange(s)} className={`px-2 py-1 text-[9px] font-black uppercase rounded-md transition-all ${status === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{s}</button>
            ))}
        </div>
    );
};

const AdminEditor: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { members, language, updateMember, updateFieldInfo, addMember, deleteMember, addCustomField } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AssociationMember>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => members.filter(m => m.abbreviation.toLowerCase().includes(searchTerm.toLowerCase()) || m.nameCN.includes(searchTerm)), [members, searchTerm]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateNew = () => {
      const id = 'm-' + Date.now();
      const newM: AssociationMember = {
          id, 
          memberCategory: 'association',
          coreAreas: { tagsCN: [], tagsEN: [], status: 'pending' },
          abbreviation: 'NEW', 
          nameCN: '新成员协会', 
          nameEN: 'New Association', 
          region: 'Europe', 
          country: 'Country', 
          countryCN: '国家', 
          coordinates: { lat: 0, lng: 0 }, 
          logo: '', 
          status: 'active', 
          memberType: 'Member',
          overview: { valueCN: '', valueEN: '', status: 'pending' },
          basicFacts: {
              yearEstablished: { valueCN: '', valueEN: '', status: 'pending' },
              legalStatus: { valueCN: '', valueEN: '', status: 'pending' },
              memberScale: { valueCN: '', valueEN: '', status: 'pending' },
              staffScale: { valueCN: '', valueEN: '', status: 'pending' }
          },
          contacts: { delegate: '', emails: [], website: '' }
      };
      addMember(newM);
      setFormData(newM);
      setEditingId(id);
  };

  const handleSave = () => {
      if (editingId) {
          updateMember(editingId, formData);
          setEditingId(null);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-200/40 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-full bg-white rounded-[2.5rem] shadow-2xl flex overflow-hidden border border-white/60 animate-in zoom-in-95 duration-300">
        
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/30">
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-2"><Sparkles className="text-blue-500" size={20}/> 成员治理</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20}/></button>
                </div>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-2.5 text-slate-300" size={16} />
                    <input className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/10 outline-none" placeholder="搜索简称或名称..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <button onClick={handleCreateNew} className="w-full py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:scale-[1.02] transition-transform">
                    <Plus size={16}/> 新增成员
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {filtered.map(m => (
                    <button key={m.id} onClick={() => { setFormData(m); setEditingId(m.id); }} className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all text-left group ${editingId === m.id ? 'bg-white shadow-xl shadow-slate-200 ring-1 ring-slate-100' : 'hover:bg-white/60'}`}>
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            <img src={m.logo} className="max-w-[70%] max-h-[70%] object-contain" alt="" />
                        </div>
                        <div className="flex-1">
                            <div className="text-xs font-black text-slate-900 leading-none mb-1 uppercase">{m.abbreviation}</div>
                            <div className="text-[9px] text-slate-400 font-bold uppercase">{m.countryCN}</div>
                        </div>
                        <Edit3 size={14} className={`transition-colors ${editingId === m.id ? 'text-blue-500' : 'text-slate-200 group-hover:text-slate-400'}`} />
                    </button>
                ))}
            </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
            {editingId ? (
                <>
                    <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setEditingId(null)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><ArrowLeft size={20}/></button>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">{formData.abbreviation} 档案编辑</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">ID: {editingId}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => deleteMember(editingId)} className="p-2.5 text-red-400 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={20}/></button>
                            <button onClick={handleSave} className="px-8 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"><Save size={16}/> 保存更改</button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-10 py-10 space-y-12 custom-scrollbar">
                        {/* Meta */}
                        <section className="grid grid-cols-3 gap-10">
                            <div className="col-span-1">
                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Layout size={14} className="text-blue-500"/> 品牌标识</h4>
                                <div className="space-y-4">
                                    <div className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center p-6 relative overflow-hidden group">
                                        {formData.logo ? <img src={formData.logo} className="max-w-full max-h-full object-contain" alt="Preview" /> : <Info className="text-slate-200" size={32}/>}
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                              onClick={() => fileInputRef.current?.click()}
                                              className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-xl flex items-center gap-2 pointer-events-auto"
                                            >
                                              <Upload size={14} /> 上传图片
                                            </button>
                                        </div>
                                    </div>
                                    <input 
                                      type="file" 
                                      ref={fileInputRef} 
                                      className="hidden" 
                                      accept="image/*" 
                                      onChange={handleFileUpload} 
                                    />
                                    <input className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-mono focus:bg-white transition-all outline-none" placeholder="输入 Logo URL 或 Base64..." value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} />
                                </div>
                            </div>
                            <div className="col-span-2 grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">缩写</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-blue-500/10" value={formData.abbreviation} onChange={e => setFormData({...formData, abbreviation: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">当前状态</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-black text-sm outline-none appearance-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                                        <option value="active">ACTIVE / 激活</option>
                                        <option value="inactive">INACTIVE / 禁用</option>
                                    </select>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">中文全称</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/10" value={formData.nameCN} onChange={e => setFormData({...formData, nameCN: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">地理区域</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-black text-sm outline-none" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value as any})}>
                                        {['Europe', 'AsiaPacific', 'Americas', 'Africa'].map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">会员类型</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 rounded-2xl font-black text-sm outline-none" value={formData.memberType} onChange={e => setFormData({...formData, memberType: e.target.value as any})}>
                                        <option value="Member">正式会员 (Full Member)</option>
                                        <option value="Affiliate">附属会员 (Affiliate)</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Governance Fields */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2"><Info size={14} className="text-emerald-500"/> 档案板块治理</h4>
                                <button 
                                    onClick={() => {
                                        const lCN = prompt('输入板块中文名称:');
                                        const lEN = prompt('输入板块英文名称:');
                                        if(lCN && lEN && editingId) addCustomField(editingId, lCN, lEN);
                                    }} 
                                    className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase hover:bg-emerald-100 transition-colors"
                                >
                                    + 新增板块
                                </button>
                            </div>
                            <div className="space-y-4">
                                {['overview', 'basicFacts.yearEstablished', 'basicFacts.memberScale'].map(path => {
                                    const keys = path.split('.');
                                    const field = keys.length === 1 ? (formData as any)[keys[0]] : (formData as any)[keys[0]][keys[1]];
                                    return (
                                        <div key={path} className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{path.toUpperCase()}</span>
                                                {editingId && field && (
                                                  <StatusSelector status={field.status} onChange={(s) => updateFieldInfo(editingId, keys, field.valueCN, field.valueEN, s)} />
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <textarea className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500/5 min-h-[80px]" placeholder="中文描述..." value={field?.valueCN || ''} onChange={e => editingId && field && updateFieldInfo(editingId, keys, e.target.value, field.valueEN, field.status)} />
                                                <textarea className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500/5 min-h-[80px]" placeholder="English Text..." value={field?.valueEN || ''} onChange={e => editingId && field && updateFieldInfo(editingId, keys, field.valueCN, e.target.value, field.status)} />
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* Custom Fields Render */}
                                {formData.customFields?.map(cf => (
                                    <div key={cf.id} className="p-6 bg-blue-50/30 rounded-[2rem] border border-blue-100/50 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{cf.labelCN} / {cf.labelEN}</span>
                                            <div className="flex items-center gap-3">
                                                {editingId && <StatusSelector status={cf.status} onChange={(s) => updateFieldInfo(editingId, ['customFields', cf.id], cf.valueCN, cf.valueEN, s)} />}
                                                <button onClick={() => setFormData({...formData, customFields: formData.customFields?.filter(f => f.id !== cf.id)})} className="text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <textarea className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-xs outline-none" value={cf.valueCN} onChange={e => editingId && updateFieldInfo(editingId, ['customFields', cf.id], e.target.value, cf.valueEN, cf.status)} />
                                            <textarea className="w-full p-4 bg-white border border-slate-100 rounded-2xl text-xs outline-none" value={cf.valueEN} onChange={e => editingId && updateFieldInfo(editingId, ['customFields', cf.id], cf.valueCN, e.target.value, cf.status)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Geo & Links */}
                        <section className="space-y-6 pb-20">
                            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2"><Map size={14} className="text-amber-500"/> 地理与连接</h4>
                            <div className="grid grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">经纬度 (Lat, Lng)</label>
                                    <div className="flex gap-2">
                                        <input type="number" step="0.0001" className="w-full px-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs outline-none" value={formData.coordinates?.lat} onChange={e => setFormData({...formData, coordinates: {...formData.coordinates!, lat: parseFloat(e.target.value)}})} />
                                        <input type="number" step="0.0001" className="w-full px-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs outline-none" value={formData.coordinates?.lng} onChange={e => setFormData({...formData, coordinates: {...formData.coordinates!, lng: parseFloat(e.target.value)}})} />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">官方网站</label>
                                    <div className="relative">
                                        <Link size={14} className="absolute left-4 top-3.5 text-slate-300" />
                                        <input className="w-full pl-10 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs outline-none font-mono text-blue-600" value={formData.contacts?.website} onChange={e => setFormData({...formData, contacts: {...formData.contacts!, website: e.target.value}})} />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-200">
                    <Sparkles size={64} strokeWidth={1}/>
                    <p className="mt-4 font-black uppercase tracking-[0.3em] text-[10px] text-slate-300">请选择一个成员协会进行深层治理</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminEditor;
