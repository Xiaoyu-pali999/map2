
import { AssociationMember, Region, Field } from './types';

export const REGION_COLORS: Record<Region, { fill: string; text: string; stroke: string }> = {
  Europe: { fill: '#2563EB', text: '#1E3A8A', stroke: '#93C5FD' }, 
  AsiaPacific: { fill: '#F59E0B', text: '#92400E', stroke: '#FCD34D' },
  Americas: { fill: '#10B981', text: '#065F46', stroke: '#6EE7B7' },
  Africa: { fill: '#EF4444', text: '#991B1B', stroke: '#FCA5A5' },
};

export const AFFILIATE_STYLE = { fill: '#94A3B8', stroke: '#CBD5E1', text: '#334155' };
export const CORPORATE_STYLE = { fill: '#8B5CF6', stroke: '#A78BFA', text: '#4C1D95' };
export const EXPORT_MAP_BG = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Mercator-projection.jpg/1280px-Mercator-projection.jpg";

export const UI_TRANSLATIONS = {
  zh: {
    systemTitle: '国际采购与供应管理联盟地图',
    systemSubtitle: 'IFPSM 国际联盟成员档案管理系统',
    clickToView: '查看详细档案',
    zoomToNav: '缩放导航',
    unStandard: '联合国 ECOSOC 标准',
    member: '正式会员 (Full Member)',
    affiliate: '附属机构 (Affiliate)',
    delegate: '联系代表',
    email: '联系邮箱',
    website: '访问官方门户网站',
    overview: '协会简介',
    coreAreas: '主要活动 / 涉及领域',
    basicFacts: '基础概况',
    yearEstablished: '成立时间',
    legalStatus: '组织性质',
    memberScale: '会员规模',
    staffScale: '员工规模',
    internalNote: '受限治理备注',
    exportMenu: '导出数字化报告',
    exportPPTX: 'PPTX 演示汇报版',
    exportPDF: 'PDF 档案手册版',
    filterAll: '查看全部',
    filterMember: '正式会员',
    filterAffiliate: '附属机构',
    adminTitle: '档案治理工作台',
    adminFilter: '快速检索',
    verified: '已核验',
    pending: '待确认',
    auto: '候选',
    mapLegend: '全球组织分布图例',
    regionEurope: '欧洲大区',
    regionAsiaPacific: '亚太大区',
    regionAmericas: '美洲大区',
    regionAfrica: '非洲大区',
    digitalAssets: '数字化治理资产'
  },
  en: {
    systemTitle: 'International Procurement Alliance Map',
    systemSubtitle: 'IFPSM Member Intelligence Hub',
    clickToView: 'View Profile',
    zoomToNav: 'Scroll to Zoom',
    unStandard: 'UN ECOSOC Standard',
    member: 'Full Member',
    affiliate: 'Affiliate Member',
    delegate: 'Senior Delegate',
    email: 'Contact Email',
    website: 'Official Website',
    overview: 'Profile Overview',
    coreAreas: 'Core Activities',
    basicFacts: 'Fact Sheet',
    yearEstablished: 'Est. Year',
    legalStatus: 'Legal Status',
    memberScale: 'Member Base',
    staffScale: 'Team Size',
    internalNote: 'Internal Notes',
    exportMenu: 'Export Report',
    exportPPTX: 'PPTX Briefing',
    exportPDF: 'PDF Factsheet',
    filterAll: 'Show All',
    filterMember: 'Full Members',
    filterAffiliate: 'Affiliates',
    adminTitle: 'Archive Hub',
    adminFilter: 'Search',
    verified: 'Verified',
    pending: 'Pending',
    auto: 'Candidate',
    mapLegend: 'Global Legend',
    regionEurope: 'Europe',
    regionAsiaPacific: 'Asia-Pacific',
    regionAmericas: 'Americas',
    regionAfrica: 'Africa',
    digitalAssets: 'Digital Assets'
  }
};

const field = (valCN: string, valEN?: string): Field => ({ 
  valueCN: valCN, valueEN: valEN || valCN, status: 'confirmed', updatedAt: new Date().toISOString() 
});

const initMember = (id: string, abbr: string, nameCN: string, nameEN: string, region: Region, country: string, countryCN: string, lat: number, lng: number, delegate: string, email: string, type: 'Member' | 'Affiliate' = 'Member'): AssociationMember => ({
  id, memberCategory: 'association', memberType: type, status: 'active', abbreviation: abbr, nameCN, nameEN, country, countryCN, region, coordinates: { lat, lng }, logo: '',
  overview: field(`该机构是${countryCN}地区最具影响力的采购与供应链管理专业组织。致力于推动行业标准的建立，通过职业教育与认证体系提升专业人员素质，是区域内政府与企业间的重要智库。`, `Leading professional body in ${country} for procurement and supply chain management. Focal point for industry standards and professional development.`),
  coreAreas: { tagsCN: ['采购与供应链专业培训', '行业标准与认证', '国际交流与政策倡议'], tagsEN: ['Professional Training', 'Standards & Certification', 'Policy Advocacy'], status: 'confirmed' },
  basicFacts: { 
    yearEstablished: field("1980"), 
    legalStatus: field("非营利性协会 (Non-profit)", "Non-profit Association"), 
    memberScale: field(""), 
    staffScale: field("") 
  },
  contacts: { delegate, emails: [email], website: 'https://www.ifpsm.org' },
});

export const MEMBERS_DATA: AssociationMember[] = [
  initMember('m1', 'ABCAL', '比利时采购、物流与供应链经理人协会', 'Association francophone belge des Cadres d’Achat', 'Europe', 'Belgium', '比利时', 50.85, 4.35, 'GUELTON Jean-Louis', 'jlguelton@gmail.com'),
  initMember('m2', 'ADACI', '意大利采购与供应管理协会', 'ADACI ASSOCIAZIONE ITALIANA ACQUISTI', 'Europe', 'Italy', '意大利', 41.9, 12.5, 'Paolo Marnoni', 'paolo.marnoni@adaci.it'),
  initMember('m3', 'AERCE', '西班牙采购专业协会', 'ASOCIACIÓN ESPAÑOLA DE PROFESIONALES DE COMPRAS', 'Europe', 'Spain', '西班牙', 40.4, -3.7, 'FERRAN BAÑOS', 'fbanos@aerce.org'),
  initMember('m4', 'AMCA', '摩洛哥采购社团协会', 'Association Marocaine de La Communauté Achats', 'Africa', 'Morocco', '摩洛哥', 33.5, -7.6, 'Yassine SERHANI', 'serhani.yassine16@gmail.com; y.serhani@amca.ma'),
  initMember('m5', 'APCADEC', '葡萄牙采购与供应协会', 'APCADEC - Associação Portuguesa de Compras', 'Europe', 'Portugal', '葡萄牙', 38.7, -9.1, 'João Botelho', 'joao.botelho@apcadec.org.pt'),
  initMember('m6', 'APROCAL', '墨西哥采购与物流协会', 'Asociación de Profesionales en Compras (APROCAL)', 'Americas', 'Mexico', '墨西哥', 19.4, -99.1, 'Cesar Leal', 'cesare_leal@hotmail.com'),
  initMember('m7', 'BME', '德国联邦采购物流协会', 'BME - Supply Chain Management, Procurement and Logistics', 'Europe', 'Germany', '德国', 50.1, 8.7, 'Lars Kleeberg', 'lars.kleeberg@bme.de'),
  initMember('m8', 'BMÖ', '奥地利物资管理、采购与物流联邦协会', 'BMÖ Bundesverband Materialwirtschaft', 'Europe', 'Austria', '奥地利', 48.2, 16.4, 'Dkfm. Heinz Pechek', 'heinz.pechek@aon.at'),
  initMember('m9', 'CAP (HUND)', '克罗地亚采购协会', 'Croatian Association of Purchasing', 'Europe', 'Croatia', '克罗地亚', 45.8, 16.0, 'Mirela Senica', 'mirela.senica@hund.hr'),
  initMember('m10', 'CBEC', '巴西采购高管委员会', 'CONSELHO BRASILEIRO DOS EXECUTIVOS DE COMPRAS', 'Americas', 'Brazil', '巴西', -23.5, -46.6, 'LISLEY PÓLVORA', 'lisley.polvora@cbec.org.br'),
  initMember('m11', 'CFLP', '中国物流与采购联合会', 'China Federation of Logistics and Purchasing', 'AsiaPacific', 'China', '中国', 39.9, 116.4, 'Cai Jin', 'international@cflp.org.cn'),
  initMember('m12', 'CIPSMN', '尼日利亚特许采购与供应管理协会', 'CHARTERED INSTITUTE OF PURCHASING NIGERIA', 'Africa', 'Nigeria', '尼日利亚', 6.5, 3.4, 'ALHAJI MOHAMMED JIMOH ALIYU', 'mohamedjimohalliyu@yahoo.com'),
  initMember('m13', 'CISCM', '加纳特许供应链管理协会', 'Chartered Institute of Supply Chain Management', 'Africa', 'Ghana', '加纳', 5.6, -0.2, 'Richard Obeng Okrah', 'okrahrichard@gmail.com'),
  initMember('m14', 'CNA', '法国全国采购理事会', 'Conseil national des Achats CNA', 'Europe', 'France', '法国', 48.9, 2.4, 'Jean-Luc BARAS', 'Jean-Luc.BARAS@eiffage.com'),
  initMember('m15', 'FZUP', '俄罗斯采购与供应管理联合会', 'Federation of Purchasing and Supply Management Russia', 'Europe', 'Russia', '俄罗斯', 55.8, 37.6, 'Dmitriy Lapin', 'lapindn@rambler.ru'),
  initMember('m16', 'HALPIM', '匈牙利物流、采购与库存管理协会', 'Hungarian Association of Logistics', 'Europe', 'Hungary', '匈牙利', 47.5, 19.0, 'Anita Kőhegyi', 'anita.kohegyi@logisztika.hu'),
  initMember('m17', 'HPI', '希腊采购协会', 'HELLENIC PURCHASING INSTITUTE', 'Europe', 'Greece', '希腊', 38.0, 23.7, 'Ignatios Michailidis', 'ignatios.michailidis@pepsico.com'),
  initMember('m18', 'IAPI', '印度尼西亚采购专业协会', 'INDONESIA PROCUREMENT ASSOCIATION (IAPI)', 'AsiaPacific', 'Indonesia', '印度尼西亚', -6.2, 106.8, 'Bapak Agus Prabowo', 'prabowo2009@gmail.com'),
  initMember('m19', 'IIMM', '印度物资管理协会', 'INDIAN INSTITUTE OF MATERIALS MANAGEMENT', 'AsiaPacific', 'India', '印度', 19.1, 72.9, 'MR. LALBHAI PATEL', 'lppatel09@yahoo.com'),
  initMember('m20', 'IPLMA', '以色列采购与物流协会', 'Israeli Purchasing and Logistics Society', 'Europe', 'Israel', '以色列', 32.1, 34.8, 'Gil Zefoni', 'gil@zefoni.com'),
  initMember('m21', 'IPPU', '乌干达采购专业协会', 'Institute of Procurement Professionals of Uganda', 'Africa', 'Uganda', '乌干达', 0.3, 32.6, 'Pelly Mugasi Dr. Bategeka Kabagambe Levi', 'Dr. Levi Kabagambe Bategeka <levi.kabagambe@gmail.com>'),
  initMember('m22', 'IPSHK', '中国香港物资采购与供销学会', 'The Institute of Purchasing & Supply of Hong Kong', 'AsiaPacific', 'Hong Kong', '香港', 22.3, 114.2, 'Dr Stephen Ng', 'drswkng@netvigator.com'),
  initMember('m23', 'ISMM', '斯里兰卡供应与物资管理学会', 'Institute of Supply and Materials Management', 'AsiaPacific', 'Sri Lanka', '斯里兰卡', 6.9, 79.9, 'Lilantha Subasinghe', 'lilantha.subasinghe@gmail.com; president@ismm.edu.lk'),
  initMember('m24', 'LOGY', '芬兰采购与物流协会', 'The Finnish Association of Purchasing and Logistics', 'Europe', 'Finland', '芬兰', 60.2, 24.9, 'Jyri Vilko', 'jyri.vilko@lut.fi'),
  initMember('m25', 'MIPMM', '马来西亚采购与物资管理学会', 'Malaysian Institute of Purchasing & Materials Management', 'AsiaPacific', 'Malaysia', '马来西亚', 3.1, 101.7, 'YANG CHOR LEONG', 'yang.chorleong@gmail.com'),
  initMember('m26', 'NEVI', '荷兰采购与供应管理协会', 'Nevi B.V.', 'Europe', 'Netherlands', '荷兰', 52.4, 4.9, 'Jeroen Hulsman', 'j.hulsman@nevi.nl'),
  initMember('m27', 'PASIA', '亚洲采购与供应研究院', 'Procurement and Supply Institute of Asia, Inc.', 'AsiaPacific', 'Philippines', '菲律宾', 14.6, 121.0, 'Charlie Villasenor', 'charlie.villasenor@pasia.org'),
  initMember('m28', 'PISM', '菲律宾供应管理协会', 'Philippine Institute for Supply Management', 'AsiaPacific', 'Philippines', '菲律宾', 14.6, 121.1, 'Gerard Magadia', 'ggmagadia@hoi.com.ph'),
  initMember('m29', 'PROCURE.CH', '瑞士采购协会', 'procure.ch', 'Europe', 'Switzerland', '瑞士', 46.9, 7.4, 'Kyburz Andreas', 'kyburz@procure.ch'),
  initMember('m30', 'PROLOG', '爱沙尼亚供应链管理协会', 'Eesti Tarneahelate Juhtimise Ühing PROLOG', 'Europe', 'Estonia', '爱沙尼亚', 59.4, 24.8, 'Tõnis Hintsov', 'tonis.hintsov@prolog.ee'),
  initMember('m31', 'PSCMT', '泰国采购与供应链管理协会', 'Purchasing and Supply Chain Management Association', 'AsiaPacific', 'Thailand', '泰国', 13.8, 100.5, 'AKANIT SMITABINDU', 'akanit@pscmt.or.th'),
  initMember('m32', 'PSML', '波兰供应链管理协会', 'PSML POLISH SUPPLY MANAGEMENT LEADERS', 'Europe', 'Poland', '波兰', 52.2, 21.0, 'Andrzej Zawistowski', 'andrzej.zawistowski@psml.pl'),
  initMember('m33', 'PSPTB', '坦桑尼亚采购与供应专业技术局', 'Procurement and Supplies Technical Board', 'Africa', 'Tanzania', '坦桑尼亚', -6.8, 39.2, 'Godfred Mbanyi', 'godfred.mbanyi@psptb.go.tz', 'Affiliate'),
  initMember('m34', 'SILF', '瑞典采购与物流协会', 'The Swedish Purchasing and Logistics Association', 'Europe', 'Sweden', '瑞典', 59.3, 18.1, 'Sofia Andersson', 'sofia.andersson@silf.se'),
  initMember('m35', 'TASS', '中国台湾永续供应联盟', 'Taiwan Alliance for Sustainable Supply', 'AsiaPacific', 'Taiwan', '台湾', 25.0, 121.6, 'Shu-Shin (Steve) LAI', 'Steve.Lai@go-tass.org'),
  initMember('m36', 'Tusayder', '土耳其采购专业人士与管理者协会', 'Satinalma Profesyonelleri ve Yoneticileri Dernegi', 'Europe', 'Turkey', '土耳其', 39.9, 32.9, 'Ediz KAPLAN', 'ediz.kaplan@tusayder.org'),
  initMember('m37', 'TÜSMOD', '土耳其采购与供应管理协会', 'SATINALMA VE TEDARIK YÖNETIMI DERNEĞI', 'Europe', 'Turkey', '土耳其', 41.0, 29.0, 'Gurkan Huryilmaz', 'gurkan.huryilmaz@tusmod.org'),
  initMember('m38', 'ZNS', '斯洛文尼亚采购协会', 'ZNS-Združenje nabavnikov Slovenije', 'Europe', 'Slovenia', '斯洛文尼亚', 46.1, 14.5, 'Marina Lindič', 'marina.lindic@zns-zdruzenje.si'),
  initMember('m39', 'Supply Chain Canada', '加拿大供应链协会', 'Supply Chain Canada', 'Americas', 'Canada', '加拿大', 56.1, -106.3, 'Dylan Barett', 'dbartlett@supplychaincanada.com'),
  initMember('m40', 'EIPM', '欧洲采购管理学院', 'The European Institute of Purchasing Management', 'Europe', 'France', '法国', 45.8, 4.8, 'Bernard Gracia', 'bgracia@eipm.org', 'Affiliate'),
];

export const ASSOCIATIONS = MEMBERS_DATA;
