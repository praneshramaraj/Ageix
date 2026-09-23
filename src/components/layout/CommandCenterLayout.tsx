import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopNavbar } from './TopNavbar';
import { Sidebar } from './Sidebar';
import { EocHeaderBar } from '../eoc/EocHeaderBar';
import { CommandPaletteModal } from '../eoc/CommandPaletteModal';
import { VoiceCallModal } from '../eoc/VoiceCallModal';

export const CommandCenterLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#07161E] text-white flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Main Navigation Bar */}
      <TopNavbar onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />

      {/* EOC Command Telemetry Header */}
      <EocHeaderBar />

      <div className="flex flex-1 w-full min-h-[calc(100vh-7rem)]">
        <Sidebar isCollapsed={isSidebarCollapsed} />

        <main className="flex-1 overflow-y-auto bg-[#07161E] relative min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Global EOC Overlays */}
      <CommandPaletteModal />
      <VoiceCallModal />
    </div>
  );
};
