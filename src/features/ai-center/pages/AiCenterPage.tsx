import React, { useState } from 'react';
import { PageContainer } from '../../../components/layout/PageContainer';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Bot, Brain, Cpu, Sparkles, Navigation, Layers, TrendingUp, FileText, Download } from 'lucide-react';

// Sub-components
import { AiCommanderChat } from '../components/AiCommanderChat';
import { IncidentClassifierCard } from '../components/IncidentClassifierCard';
import { MissionPrioritizerCard } from '../components/MissionPrioritizerCard';
import { ResourceOptimizerCard } from '../components/ResourceOptimizerCard';
import { AiRouteAdvisorCard } from '../components/AiRouteAdvisorCard';
import { DamageAssessmentDashboard } from '../components/DamageAssessmentDashboard';
import { DigitalTwinView } from '../components/DigitalTwinView';
import { PredictiveAnalyticsDashboard } from '../components/PredictiveAnalyticsDashboard';
import { ReportGeneratorModal } from '../components/ReportGeneratorModal';

export const AiCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'commander' | 'triage' | 'routing' | 'twin' | 'analytics'>('commander');
  const [reportModalOpen, setReportModalOpen] = useState(false);

  return (
    <PageContainer
      title="AI Command Center & Emergency Intelligence Suite"
      subtitle="Neural Disaster Intelligence, Automated Triage Classifier, Mission Prioritization & Digital Twin Monitoring"
      breadcrumbs={[{ label: 'AEGISX EOC' }, { label: 'AI Command Center' }]}
      action={
        <div className="flex items-center gap-3">
          <Badge variant="success" pulse size="md">
            AEGISX NEURAL ENGINE v2.4 ONLINE
          </Badge>
          <Button variant="accent" size="sm" onClick={() => setReportModalOpen(true)}>
            <Download className="w-4 h-4 mr-1.5" />
            <span>EXPORT AI REPORT</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#1E3440] pb-3 overflow-x-auto font-mono text-xs">
          {[
            { id: 'commander', label: 'AI Commander & Triage', icon: Bot },
            { id: 'triage', label: 'Resource & Mission Prioritizer', icon: Sparkles },
            { id: 'routing', label: 'AI Route Advisor', icon: Navigation },
            { id: 'twin', label: 'Digital Twin Canvas', icon: Layers },
            { id: 'analytics', label: 'Damage & Predictive Analytics', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? 'bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/40 font-bold'
                    : 'bg-[#10232C] text-[#AAB6C3] border border-[#1E3440] hover:text-white hover:border-[#AAB6C3]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: AI Commander Chat & Automated Incident Classifier */}
        {activeTab === 'commander' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AiCommanderChat />
            <div className="space-y-6">
              <IncidentClassifierCard />
            </div>
          </div>
        )}

        {/* Tab 2: Mission Prioritizer & Resource Allocation Engine */}
        {activeTab === 'triage' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MissionPrioritizerCard />
            <ResourceOptimizerCard />
          </div>
        )}

        {/* Tab 3: AI Route Advisor */}
        {activeTab === 'routing' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AiRouteAdvisorCard />
            <div className="p-4 bg-[#10232C] border border-[#1E3440] rounded-2xl font-mono text-xs text-[#AAB6C3] space-y-3">
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#00D4FF]" />
                Valhalla + GIS Hazard avoidance Matrix
              </h4>
              <p>
                The AI Route Advisor integrates MapLibre GL JS vector layers, real-time flood polygons, and Valhalla road matrix telemetry to route rescue squads around active hazards.
              </p>
              <div className="p-3 bg-[#07161E] rounded-xl border border-[#1E3440] space-y-1">
                <span className="text-[#3DDC84] font-bold block">Live Constraints Evaluated:</span>
                <div>• Water Depth &gt; 0.5m Avoidance Filter</div>
                <div>• Fallen Powerline Road Blockades</div>
                <div>• High-Risk Structural Bridge Weight Limits</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Real-Time Digital Twin View */}
        {activeTab === 'twin' && <DigitalTwinView />}

        {/* Tab 5: Damage Assessment & Predictive Forecasting */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <DamageAssessmentDashboard />
            <PredictiveAnalyticsDashboard />
          </div>
        )}

        {/* Export Report Modal */}
        <ReportGeneratorModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} />
      </div>
    </PageContainer>
  );
};

export default AiCenterPage;
