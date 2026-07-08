import { Icons } from "../icons";

export interface AnalysisConfig {
  riskAssessment: boolean;
  launchReadinessScore: boolean;
  missingRequirements: boolean;
  executiveSummary: boolean;
  goNoGoRecommendation: boolean;
}

interface AnalysisOptionsProps {
  options: AnalysisConfig;
  onChange: (options: AnalysisConfig) => void;
}

export function AnalysisOptions({ options, onChange }: AnalysisOptionsProps) {
  const toggleOption = (key: keyof AnalysisConfig) => {
    onChange({ ...options, [key]: !options[key] });
  };

  const optionLabels: Record<keyof AnalysisConfig, string> = {
    riskAssessment: "Risk Assessment",
    launchReadinessScore: "Launch Readiness Score",
    missingRequirements: "Missing Requirements",
    executiveSummary: "Executive Summary",
    goNoGoRecommendation: "Go / No-Go Recommendation",
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground">Analysis Configuration</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(Object.keys(options) as Array<keyof AnalysisConfig>).map((key) => {
          const isChecked = options[key];
          return (
            <label 
              key={key} 
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                isChecked ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                isChecked ? "bg-primary border-primary text-primary-foreground" : "border-input bg-background"
              }`}>
                {isChecked && <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
              <span className="text-sm font-medium select-none">{optionLabels[key]}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
