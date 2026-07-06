import React, { useState, useEffect } from "react";
import { ProductInformationForm, ProductInfo } from "../components/new-analysis/ProductInformationForm";
import { PRDUploadArea } from "../components/new-analysis/PRDUploadArea";
import { PRDTextEditor } from "../components/new-analysis/PRDTextEditor";
import { AnalysisOptions, AnalysisConfig } from "../components/new-analysis/AnalysisOptions";

export function NewAnalysis() {
  const [productInfo, setProductInfo] = useState<ProductInfo>({ name: "", type: "" });
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [options, setOptions] = useState<AnalysisConfig>({
    riskAssessment: true,
    launchReadinessScore: true,
    missingRequirements: true,
    executiveSummary: true,
    goNoGoRecommendation: true,
  });
  const [showToast, setShowToast] = useState(false);
  const [touched, setTouched] = useState(false);

  const hasName = productInfo.name.trim().length > 0;
  const hasType = productInfo.type !== "";
  const hasPRD = file !== null || pastedText.trim().length > 0;
  
  const isValid = hasName && hasType && hasPRD;

  const handleAnalyze = () => {
    setTouched(true);
    if (!isValid) return;

    // TODO: Gemini Analysis API Integration
    // TODO: Prompt Engine Integration
    // TODO: Analysis History logging

    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <div className="animate-in fade-in duration-500 pb-12 relative">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">
          New Product Analysis
        </h2>
        <p className="text-muted-foreground">
          Upload or paste your Product Requirements Document (PRD) to begin AI-powered launch analysis.
        </p>
      </div>

      <div className="space-y-8">
        {/* Section 1 */}
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <ProductInformationForm info={productInfo} onChange={setProductInfo} />
          {touched && (!hasName || !hasType) && (
            <p className="text-sm text-destructive mt-3">Please fill out all required product information fields.</p>
          )}
        </section>

        {/* Sections 2, 3, 4 */}
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <PRDUploadArea 
            file={file} 
            onFileSelect={(f) => {
              setFile(f);
              if (f) setPastedText("");
            }} 
            disabled={pastedText.length > 0}
          />
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-medium">Or</span>
            </div>
          </div>

          <PRDTextEditor 
            value={pastedText} 
            onChange={(val) => {
              setPastedText(val);
              if (val.length > 0) setFile(null);
            }} 
            disabled={file !== null}
          />

          {touched && !hasPRD && (
            <p className="text-sm text-destructive mt-3">Please provide a PRD by uploading a file or pasting content.</p>
          )}
        </section>

        {/* Section 5 */}
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <AnalysisOptions options={options} onChange={setOptions} />
        </section>

        {/* Section 6 */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleAnalyze}
            disabled={!isValid && touched}
            className={`px-8 py-3 rounded-md text-sm font-medium transition-all shadow-sm ${
              isValid
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            Analyze PRD
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-card border border-border shadow-lg rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-300 max-w-sm z-50">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Analysis Initiated</h4>
            <p className="text-sm text-muted-foreground leading-snug">
              AI Analysis will be connected in the next development phase.
            </p>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="ml-auto text-muted-foreground hover:text-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}
