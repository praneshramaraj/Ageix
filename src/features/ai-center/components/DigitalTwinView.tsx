import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Layers, Activity, Radio, MapPin, ShieldAlert, Cpu } from 'lucide-react';
import { MapCanvas } from '../../map/components/MapCanvas';

export const DigitalTwinView: React.FC = () => {
  const [twinActive, setTwinActive] = useState(true);

  return (
    <Card
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00D4FF]" />
            <span className="font-bold text-white">AEGISX Real-Time Digital Twin Canvas</span>
          </div>
          <Badge variant="success" pulse size="sm">
            WEBSOCKET LIVE FEED ACTIVE
          </Badge>
        </div>
      }
      glow="accent"
    >
      <div className="space-y-4">
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-[#1E3440]">
          <MapCanvas />
          <div className="absolute top-3 left-3 z-20 bg-[#07161E]/90 backdrop-blur border border-[#1E3440] p-2.5 rounded-xl font-mono text-[11px] space-y-1 text-white">
            <div className="flex items-center gap-2 text-[#3DDC84]">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Digital Twin Telemetry Sync: 20ms</span>
            </div>
            <div className="text-[#AAB6C3]">Active Overlays: Flood Inundation + Live Squad GPS</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs text-center">
          <div className="p-2.5 bg-[#07161E] border border-[#1E3440] rounded-lg">
            <span className="text-[#AAB6C3] block text-[10px]">TWIN NODES</span>
            <span className="text-[#00D4FF] font-bold text-sm">48 Active</span>
          </div>
          <div className="p-2.5 bg-[#07161E] border border-[#1E3440] rounded-lg">
            <span className="text-[#AAB6C3] block text-[10px]">LIVE SQUADS</span>
            <span className="text-[#3DDC84] font-bold text-sm">6 Tracked</span>
          </div>
          <div className="p-2.5 bg-[#07161E] border border-[#1E3440] rounded-lg">
            <span className="text-[#AAB6C3] block text-[10px]">SHELTERS</span>
            <span className="text-[#FFB000] font-bold text-sm">4 Synced</span>
          </div>
          <div className="p-2.5 bg-[#07161E] border border-[#1E3440] rounded-lg">
            <span className="text-[#AAB6C3] block text-[10px]">STREAM LATENCY</span>
            <span className="text-[#3DDC84] font-bold text-sm">18 ms</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
