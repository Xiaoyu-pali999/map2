
import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import { useData } from '../contexts/DataContext';
import { REGION_COLORS, AFFILIATE_STYLE, CORPORATE_STYLE } from '../constants';
import { AssociationMember } from '../types';
import { Lock, Unlock, MousePointer2 } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface MapSystemProps {
  onSelectAssociation: (assoc: AssociationMember) => void;
  selectedId: string | undefined;
  members: AssociationMember[]; 
}

const MapSystem: React.FC<MapSystemProps> = ({ onSelectAssociation, selectedId, members }) => {
  const { language } = useData(); 
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isMapLocked, setIsMapLocked] = useState(true);
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({ coordinates: [0, 10], zoom: 1 });

  const isZoomedIn = position.zoom >= 2;
  // 移动端默认开启手势锁，防止误触，点击“解锁”后方可自由操作
  const canInteract = !isMobile || !isMapLocked;

  return (
    <div className="w-full h-full bg-[#FDFDFF] relative overflow-hidden">
      {/* 移动端地图锁定切换按钮 - 调整至上方分类过滤下方 */}
      {isMobile && (
        <div className="absolute top-44 left-6 z-40 flex flex-col gap-3">
            <button 
                onClick={() => setIsMapLocked(!isMapLocked)} 
                className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl border transition-all active:scale-95 ${isMapLocked ? 'bg-white text-slate-600 border-slate-100' : 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100'}`}
            >
                {isMapLocked ? <Lock size={16} /> : <Unlock size={16} />}
                <span className="text-[10px] font-black uppercase tracking-widest">{isMapLocked ? '地图交互锁定' : '自由操作模式'}</span>
            </button>
        </div>
      )}

      <ComposableMap projectionConfig={{ scale: 190, center: [0, 0] }} width={1000} height={600} className="w-full h-full">
        <ZoomableGroup 
          zoom={position.zoom} 
          center={position.coordinates} 
          onMoveEnd={setPosition} 
          minZoom={1} 
          maxZoom={12} 
          disabled={!canInteract}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) => geographies.map((geo: any) => (
              <Geography 
                key={geo.rsmKey} 
                geography={geo} 
                style={{ 
                    default: { fill: '#F1F5F9', stroke: '#FFFFFF', strokeWidth: 0.8, outline: 'none' }, 
                    hover: { fill: '#E2E8F0', outline: 'none' } 
                }} 
              />
            ))}
          </Geographies>

          {members.map((assoc) => {
            const isAffiliate = assoc.memberType === 'Affiliate';
            const isSelected = selectedId === assoc.id;
            
            // 欧洲区自动映射为专业蓝色系统
            let markerColor = isAffiliate ? AFFILIATE_STYLE.fill : REGION_COLORS[assoc.region].fill;
            const tooltipContent = language === 'zh' ? `${assoc.abbreviation}｜${assoc.nameCN}` : `${assoc.abbreviation}｜${assoc.nameEN}`;

            return (
              <Marker key={assoc.id} coordinates={[assoc.coordinates.lng, assoc.coordinates.lat]} onClick={() => onSelectAssociation(assoc)}>
                {/* 移动端加大透明热区以适配指尖点击 */}
                <circle r={isMobile ? 18 : 10} fill="transparent" className="cursor-pointer" />
                
                <g className="cursor-pointer transition-all duration-300" data-tooltip-id="map-tooltip" data-tooltip-content={tooltipContent}>
                  {isSelected && (
                    <circle r={isZoomedIn ? 22 : 14} fill={markerColor} opacity={0.25} className="animate-pulse" />
                  )}
                  
                  <circle 
                    r={isZoomedIn ? 7 : 5} 
                    fill={isSelected ? '#fff' : markerColor} 
                    stroke={isSelected ? markerColor : '#fff'} 
                    strokeWidth={isSelected ? 4 : 2}
                    className="shadow-xl"
                  />
                </g>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {!isMobile && (
        <Tooltip 
            id="map-tooltip" 
            place="top" 
            style={{ 
                backgroundColor: 'white', 
                color: '#1e293b', 
                fontSize: '11px', 
                fontWeight: '900',
                padding: '10px 18px', 
                borderRadius: '18px', 
                boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
                border: '1px solid #f1f5f9',
                zIndex: 100 
            }} 
        />
      )}
    </div>
  );
};

export default MapSystem;
