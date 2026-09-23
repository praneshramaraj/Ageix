import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Table } from '../../../components/ui/Table';

import { useResourceStore } from '../../../stores/ResourceStore';

import {
  Package,
  AlertTriangle,
  Plus,
  Send,
  Building2,
  Clock,
  History,
  TrendingDown,
} from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const { resources, distributionLogs, dispatchSupply, updateStockLevel } = useResourceStore();

  const [selectedResId, setSelectedResId] = useState<string>(resources[0]?.id || '');
  const [dispatchQty, setDispatchQty] = useState<number>(50);
  const [destination, setDestination] = useState<string>('Sector 2 Evacuation Shelter');

  const selectedRes = resources.find((r) => r.id === selectedResId) || resources[0];

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRes || dispatchQty <= 0 || !destination) return;

    dispatchSupply(selectedRes.id, dispatchQty, destination, 'Commander EOC');
    setDispatchQty(50);
  };

  return (
    <PageContainer
      title="Warehouse Logistics & Supply Distribution"
      subtitle="Stock Levels, Automated Low-Stock Warnings & Field Allocation Tracking"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'Resource Inventory' }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Warehouse Inventory Grid & Distribution Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Warehouse Inventory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((res) => {
              const pct = Math.min(100, Math.round((res.currentStock / res.maxCapacity) * 100));
              const isLow = res.status === 'LOW STOCK' || res.status === 'CRITICAL EMPTY';

              return (
                <div
                  key={res.id}
                  onClick={() => setSelectedResId(res.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedResId === res.id
                      ? 'bg-[#07161E] border-[#00D4FF] shadow-lg ring-1 ring-[#00D4FF]/40'
                      : 'bg-[#10232C] border-[#1E3440] hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#00D4FF] uppercase">{res.category}</span>
                      <h3 className="text-xs font-bold text-white block mt-0.5">{res.name}</h3>
                      <span className="text-[11px] font-mono text-gray-400 block">{res.storageHub}</span>
                    </div>

                    <Badge variant={isLow ? 'danger' : 'success'}>
                      {res.status}
                    </Badge>
                  </div>

                  {/* Stock Quantity */}
                  <div className="mt-3 pt-3 border-t border-[#1E3440] flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-bold font-mono text-white">
                        {res.currentStock.toLocaleString()}
                      </span>
                      <span className="text-xs font-mono text-gray-400 ml-1">{res.unit}</span>
                    </div>
                    <span className="text-[11px] font-mono text-gray-400">
                      Cap: {res.maxCapacity.toLocaleString()}
                    </span>
                  </div>

                  {/* Stock Bar */}
                  <div className="w-full bg-[#1E3440] h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isLow ? 'bg-[#FF4B55]' : 'bg-[#3DDC84]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Distribution History Log Table */}
          <Card title="Distribution History Logs" subtitle="Field supply dispatches recorded across EOC depots">
            <Table
              data={distributionLogs}
              keyExtractor={(item) => item.id}
              columns={[
                {
                  header: 'Time',
                  accessor: (item) => <span className="font-mono text-[#00D4FF] font-bold">{item.timestamp}</span>,
                },
                {
                  header: 'Item',
                  accessor: (item) => <span className="font-semibold text-white">{item.resourceName}</span>,
                },
                {
                  header: 'Quantity',
                  accessor: (item) => (
                    <span className="font-mono text-[#3DDC84] font-bold">
                      {item.quantity} {item.unit}
                    </span>
                  ),
                },
                {
                  header: 'Destination',
                  accessor: (item) => <span className="text-xs text-[#AAB6C3]">{item.destination}</span>,
                },
                {
                  header: 'Dispatched By',
                  accessor: (item) => <span className="text-xs text-gray-400">{item.dispatchedBy}</span>,
                },
              ]}
            />
          </Card>
        </div>

        {/* Right Column: Dispatch Action Form & Restock Controls */}
        <div className="space-y-6">
          {/* Dispatch Supplies Form */}
          <Card title="Dispatch Supply to Field" glow="accent">
            <form onSubmit={handleDispatch} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Select Supply Resource</label>
                <select
                  value={selectedResId}
                  onChange={(e) => setSelectedResId(e.target.value)}
                  className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#00D4FF] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                >
                  {resources.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.currentStock} {r.unit} available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Dispatch Quantity ({selectedRes?.unit})</label>
                <input
                  type="number"
                  min={1}
                  max={selectedRes?.currentStock || 1000}
                  value={dispatchQty}
                  onChange={(e) => setDispatchQty(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#00D4FF] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Destination Facility / Sector</label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-[#07161E] border border-[#1E3440] focus:border-[#00D4FF] rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#00D4FF] hover:bg-[#00B4D8] text-[#07161E] font-mono font-bold text-xs rounded-lg shadow-lg uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Dispatch Supplies Now
              </button>
            </form>
          </Card>

          {/* Quick Restock Control */}
          {selectedRes && (
            <Card title="Restock Inventory">
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-gray-400">Item:</span>
                  <span className="text-white font-bold">{selectedRes.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Stock:</span>
                  <span className="text-[#3DDC84] font-bold">{selectedRes.currentStock} {selectedRes.unit}</span>
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#1E3440]">
                  <button
                    onClick={() => updateStockLevel(selectedRes.id, selectedRes.currentStock + 500)}
                    className="flex-1 py-1.5 bg-[#3DDC84]/20 border border-[#3DDC84] text-[#3DDC84] font-bold rounded hover:bg-[#3DDC84]/30"
                  >
                    +500 {selectedRes.unit}
                  </button>
                  <button
                    onClick={() => updateStockLevel(selectedRes.id, selectedRes.maxCapacity)}
                    className="flex-1 py-1.5 bg-[#00D4FF]/20 border border-[#00D4FF] text-[#00D4FF] font-bold rounded hover:bg-[#00D4FF]/30"
                  >
                    Fill Capacity
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default ResourcesPage;
