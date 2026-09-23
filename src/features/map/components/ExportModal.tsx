import React, { useState } from 'react';
import { useMapStore } from '../stores/MapStore';
import { ExportService } from '../services/ExportService';
import { Download, X, FileImage, FileCode, Check } from 'lucide-react';
import { Map as MapLibreMap } from 'maplibre-gl';

interface ExportModalProps {
  onClose: () => void;
  mapInstance?: MapLibreMap | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onClose, mapInstance }) => {
  const { drawnShapes } = useMapStore();
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg' | 'geojson'>('png');
  const [filename, setFilename] = useState('aegisx-disaster-map');

  const handleExport = () => {
    if (exportFormat === 'geojson') {
      ExportService.exportGeoJSON(drawnShapes, filename);
    } else if (mapInstance) {
      ExportService.exportMapImage(mapInstance, exportFormat, filename);
    } else {
      alert('Map canvas is initializing...');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07161E]/80 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-md p-6 rounded-2xl map-glass-panel border border-[#1E3440] shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[#1E3440] pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-[#3DDC84]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Export Map & GIS Data
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#AAB6C3] hover:text-white hover:bg-[#1E3440]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[10px] font-mono text-[#AAB6C3] uppercase mb-1">
              File Name
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#07161E] border border-[#1E3440] text-white font-mono focus:outline-none focus:border-[#00D4FF]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-[#AAB6C3] uppercase mb-1">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setExportFormat('png')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  exportFormat === 'png'
                    ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-white'
                    : 'bg-[#07161E] border-[#1E3440] text-[#AAB6C3] hover:text-white'
                }`}
              >
                <FileImage className="w-5 h-5 text-[#00D4FF]" />
                <span className="font-bold">PNG Image</span>
              </button>

              <button
                onClick={() => setExportFormat('jpeg')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  exportFormat === 'jpeg'
                    ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-white'
                    : 'bg-[#07161E] border-[#1E3440] text-[#AAB6C3] hover:text-white'
                }`}
              >
                <FileImage className="w-5 h-5 text-[#FFB000]" />
                <span className="font-bold">JPEG Image</span>
              </button>

              <button
                onClick={() => setExportFormat('geojson')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                  exportFormat === 'geojson'
                    ? 'bg-[#00D4FF]/20 border-[#00D4FF] text-white'
                    : 'bg-[#07161E] border-[#1E3440] text-[#AAB6C3] hover:text-white'
                }`}
              >
                <FileCode className="w-5 h-5 text-[#3DDC84]" />
                <span className="font-bold">GeoJSON</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#1E3440] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#AAB6C3] hover:text-white hover:bg-[#1E3440]"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3DDC84] text-[#07161E] font-bold text-xs hover:bg-[#3DDC84]/90 transition-all shadow-md"
          >
            <Check className="w-4 h-4" /> Download Export
          </button>
        </div>
      </div>
    </div>
  );
};
