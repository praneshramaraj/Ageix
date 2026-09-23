import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Settings, User, Bell, Shield, Sliders } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <PageContainer
      title="System & Profile Configuration"
      subtitle="Security Clearance, Notification Subscriptions & EOC Terminal Preferences"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'Settings' }]}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card title="Operator Security Profile">
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#07161E] border border-[#1E3440] rounded-xl space-y-2 font-mono">
                <div>
                  <span className="text-[10px] text-[#AAB6C3] block">Operator Full Name</span>
                  <span className="text-white font-bold">{user?.fullName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#AAB6C3] block">Clearance Level</span>
                  <span className="text-[#00D4FF] font-bold">{user?.role}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#AAB6C3] block">Tactical Callsign</span>
                  <span className="text-[#3DDC84] font-bold">{user?.callsign}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#AAB6C3] block">Badge Serial</span>
                  <span className="text-white">{user?.badgeNumber}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card title="Notification & Channel Preferences">
            <div className="space-y-4 text-xs">
              <label className="flex items-center justify-between p-3 bg-[#07161E] border border-[#1E3440] rounded-xl cursor-pointer">
                <div>
                  <span className="font-bold text-white block">P1 Critical Incident Audio Alarm</span>
                  <span className="text-[11px] text-[#AAB6C3]">Play high-decibel audible alert on new P1 dispatch</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-[#1E3440] bg-[#10232C] text-[#00D4FF]" />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#07161E] border border-[#1E3440] rounded-xl cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Satellite Comms Failover Notification</span>
                  <span className="text-[11px] text-[#AAB6C3]">Push automated alerts on telemetry signal loss</span>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-[#1E3440] bg-[#10232C] text-[#00D4FF]" />
              </label>

              <div className="flex justify-end pt-2">
                <Button variant="accent">Save Terminal Preferences</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
