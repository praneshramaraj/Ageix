import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Brain, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { AiCommanderEngine } from '../services/aiCommanderEngine';
import { ClassifiedIncident } from '../services/llmProvider';

export const IncidentClassifierCard: React.FC = () => {
  const [title, setTitle] = useState('Submerged Residential Complex Rooftop Trapped');
  const [description, setDescription] = useState('6 civilians trapped on roof with 2.8m rapidly rising flood water.');
  const [classification, setClassification] = useState<ClassifiedIncident | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const res = await AiCommanderEngine.classifyIncident(title, description);
    setClassification(res);
    setAnalyzing(false);
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-[#00D4FF]" />
          <span className="font-bold text-white">AI Automated Incident Classification</span>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        <div>
          <label className="block text-[#AAB6C3] mb-1 font-mono">Report Title / Headline</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#07161E] border border-[#1E3440] rounded-lg px-3 py-1.5 text-white font-mono focus:border-[#00D4FF]"
          />
        </div>

        <div>
          <label className="block text-[#AAB6C3] mb-1 font-mono">Incident Details</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#07161E] border border-[#1E3440] rounded-lg px-3 py-1.5 text-white font-mono focus:border-[#00D4FF]"
          />
        </div>

        <Button variant="accent" size="sm" onClick={handleAnalyze} disabled={analyzing} className="w-full">
          {analyzing ? 'Classifying Incident...' : 'Run Neural Triage Classifier'}
        </Button>


        {classification && (
          <div className="p-3 bg-[#07161E] border border-[#1E3440] rounded-xl space-y-2 font-mono">
            <div className="flex justify-between items-center">
              <span className="text-[#AAB6C3]">Category Classification:</span>
              <span className="text-[#00D4FF] font-bold uppercase">{classification.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#AAB6C3]">Confidence Score:</span>
              <span className="text-[#3DDC84] font-bold">{(classification.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#AAB6C3]">Casualty Risk Index:</span>
              <span className="text-[#FF4B55] font-bold">{classification.casualtyRiskScore} / 100 ({classification.urgencyLevel})</span>
            </div>

            <div className="pt-2 border-t border-[#1E3440]">
              <span className="text-white font-bold block mb-1">AI Action Recommendations:</span>
              <ul className="space-y-1 text-[11px] text-[#AAB6C3]">
                {classification.recommendedActions.map((act, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3DDC84]" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
