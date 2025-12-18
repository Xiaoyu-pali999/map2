
import PptxGenJS from 'pptxgenjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssociationMember, DisplaySettings, Region, Field } from '../types';
import { REGION_COLORS, EXPORT_MAP_BG, UI_TRANSLATIONS } from '../constants';

const getConfirmedValue = (field: Field, lang: 'zh' | 'en') => {
    if (field.status === 'confirmed') return lang === 'zh' ? field.valueCN : field.valueEN;
    // Fallback to history not implemented for export for simplicity, strict export
    return '';
};

const getFilteredMembers = (members: AssociationMember[], settings: DisplaySettings) => {
  return members.filter(m => {
    if (m.status !== 'active') return false;
    if (m.memberCategory === 'corporate' && !settings.showCorporate) return false;
    if (m.memberCategory === 'association' && m.memberType === 'Member' && !settings.showAssociation) return false;
    if (m.memberCategory === 'association' && m.memberType === 'Affiliate' && !settings.showAffiliate) return false;
    return true;
  });
};

const formatDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const latLngToXY = (lat: number, lng: number) => {
  const x = (lng + 180) / 360;
  const latRad = lat * Math.PI / 180;
  const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
  const y = 0.5 - (mercN / (2 * Math.PI)); 
  return {
    x: Math.max(0, Math.min(1, x)),
    y: Math.max(0, Math.min(1, y))
  };
};

export const generatePPTX = async (members: AssociationMember[], settings: DisplaySettings, lang: 'zh' | 'en') => {
  const filtered = getFilteredMembers(members, settings);
  const pptx = new PptxGenJS();
  const T = UI_TRANSLATIONS[lang];

  pptx.layout = 'LAYOUT_16x9';
  
  const slideCover = pptx.addSlide();
  slideCover.background = { color: 'F1F5F9' }; 
  slideCover.addText(lang === 'zh' ? "全球会员概览" : "Global Members Overview", { x: 1, y: 2.5, w: '80%', fontSize: 36, bold: true, color: '1E293B' });
  slideCover.addText(`IFPSM / ECOSOC ${lang === 'zh' ? '报告' : 'Report'}`, { x: 1, y: 3.2, w: '80%', fontSize: 18, color: '64748B' });
  slideCover.addText(`${lang === 'zh' ? '日期' : 'Date'}: ${formatDate()}`, { x: 1, y: 4, fontSize: 14, color: '94A3B8' });

  // Map Slide
  const slideMap = pptx.addSlide();
  slideMap.addText(lang === 'zh' ? "全球分布" : "Global Distribution", { x: 0.5, y: 0.5, fontSize: 24, bold: true, color: '0F172A' });
  slideMap.addImage({ path: EXPORT_MAP_BG, x: 0.5, y: 1.2, w: 8.9, h: 5 });
  
  filtered.forEach(m => {
    const { x, y } = latLngToXY(m.coordinates.lat, m.coordinates.lng);
    const plotX = 0.5 + (x * 8.9); 
    const plotY = 1.2 + (y * 5); 
    let color = '000000';
    if (m.memberCategory === 'corporate') color = '7C3AED';
    else if (m.memberType === 'Affiliate') color = '475569';
    else color = REGION_COLORS[m.region].fill.replace('#', '');

    slideMap.addShape(pptx.ShapeType.ellipse, { 
        x: plotX - 0.05, y: plotY - 0.05, w: 0.1, h: 0.1, 
        fill: color, line: { width: 0 } 
    });
  });

  // Data Slides
  const regions: Region[] = ['Europe', 'AsiaPacific', 'Americas', 'Africa'];
  regions.forEach(reg => {
    const regMembers = filtered.filter(m => m.region === reg && m.memberCategory === 'association');
    if (regMembers.length === 0) return;

    const slideReg = pptx.addSlide();
    const regName = lang === 'zh' ? (T as any)[`region${reg}`] : reg;
    slideReg.addText(`${regName}`, { x: 0.5, y: 0.5, fontSize: 24, bold: true, color: REGION_COLORS[reg].text.replace('#', '') });
    
    const rows = regMembers.map(m => [
      m.abbreviation,
      lang === 'zh' ? m.nameCN : m.nameEN,
      lang === 'zh' ? m.countryCN : m.country,
      getConfirmedValue(m.basicFacts.memberScale, lang)
    ]);

    slideReg.addTable([
       [
         { text: 'Abbr', options: { bold: true } }, 
         { text: lang === 'zh' ? '名称' : 'Name', options: { bold: true } }, 
         { text: lang === 'zh' ? '国家' : 'Country', options: { bold: true } },
         { text: lang === 'zh' ? '规模' : 'Scale', options: { bold: true } }
       ],
       ...rows
    ], {
      x: 0.5, y: 1.2, w: 9, fontSize: 10,
      border: { pt: 0, pb: 1, color: 'E2E8F0' },
      fill: { color: 'FFFFFF' },
      autoPage: true 
    });
  });

  pptx.writeFile({ fileName: `IFPSM_Members_${formatDate()}.pptx` });
};

export const generatePDF = (members: AssociationMember[], settings: DisplaySettings, lang: 'zh' | 'en') => {
  const filtered = getFilteredMembers(members, settings);
  const doc = new jsPDF();
  const T = UI_TRANSLATIONS[lang];
  
  doc.setFontSize(22);
  doc.text(lang === 'zh' ? "Global Members Report" : "Global Members Report", 20, 40);
  doc.setFontSize(14);
  doc.setTextColor(100);
  doc.text(`Generated: ${formatDate()}`, 20, 50);

  const regions: Region[] = ['Europe', 'AsiaPacific', 'Americas', 'Africa'];
  let yPos = 70;

  regions.forEach(reg => {
    const regMembers = filtered.filter(m => m.region === reg && m.memberCategory === 'association');
    if (regMembers.length === 0) return;

    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text(reg, 14, yPos);
    yPos += 10;

    autoTable(doc, {
      startY: yPos,
      head: [['Abbr', 'Name', 'Country', 'Scale']],
      body: regMembers.map(m => [
        m.abbreviation,
        m.nameEN, 
        m.country,
        getConfirmedValue(m.basicFacts.memberScale, 'en')
      ]),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 20;
    if (yPos > 250) {
        doc.addPage();
        yPos = 20;
    }
  });

  doc.save(`IFPSM_Members_${formatDate()}.pdf`);
};
