import React, { useState } from 'react';
import { useMapStore } from '../stores/MapStore';
import { LayerService } from '../services/LayerService';
import { LayerCategory, LayerId } from '../types/map';
import { SlidersHorizontal, Eye, EyeOff, Check, X } from 'lucide-react';

export const LayerManager: React.FC = () => {
  const { activeLayers, toggleLayer } = useMapStore();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<LayerCategory | 'all'>('all');

  const categories: { id: LayerCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Layers' },
    { id: 'emergency', label: 'Emergency' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'environmental', label: 'Environment' },
    { id: 'base', label: 'Base GIS' },
  ];

  const filteredLayers = LayerService.LAYERS.filter(
    (layer) => selectedCategory === 'all' || layer.category === selectedCategory
  );

  return (
    <div className="relative pointer-events-auto">
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Layer Manager"
        className={`p-2.5 rounded-xl map-glass-button flex items-center gap-2 ${isOpen ? 'active' : ''}`}
      >
        <SlidersHorizontal className="w-5 h-5 text-[#00D4FF]" />
        <span className="text-xs font-semibold text-white hidden md:inline uppercase tracking-wider">
          Layer Manager
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 w-80 p-4 rounded-2xl map-glass-panel border border-[#1E3440] shadow-2xl space-y-3 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-[#1E3440] pb-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#00D4FF]" />
              <span className="text-xs font-mono font-bold text-[#00D4FF] uppercase tracking-wider">
                GIS Layer Control
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-[#AAB6C3] hover:text-white hover:bg-[#1E3440]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase font-bold shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#00D4FF]/20 text-[#00D4FF] border border-[#00D4FF]/40'
                    : 'bg-[#07161E] text-[#AAB6C3] border border-[#1E3440] hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Layer List */}
          <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {filteredLayers.map((layer) => {
              const isVisible = activeLayers[layer.id];
              return (
                <div
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all select-none ${
                    isVisible
                      ? 'bg-[#10232C] border-[#00D4FF]/40 text-white shadow-sm'
                      : 'bg-[#07161E]/80 border-[#1E3440] text-[#6C7A89] opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full shrink-0 border border-white/30"
                      style={{ backgroundColor: layer.color }}
                    />
                    <div>
                      <div className="text-xs font-bold leading-tight">{layer.name}</div>
                      <div className="text-[9px] text-[#AAB6C3] truncate max-w-[170px]">
                        {layer.description}
                      </div>
                    </div>
                  </div>
                  <button className="p-1 rounded-lg hover:bg-[#1E3440] text-[#00D4FF]">
                    {isVisible ? <Eye className="w-4 h-4 text-[#00D4FF]" /> : <EyeOff className="w-4 h-4 text-[#6C7A89]" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
