import React, { useState } from "react";
import { ProductInformationForm, ProductInfo } from "../components/new-analysis/ProductInformationForm";
import { PRDUploadArea } from "../components/new-analysis/PRDUploadArea";
import { PRDTextEditor } from "../components/new-analysis/PRDTextEditor";
import { AnalysisOptions, AnalysisConfig } from "../components/new-analysis/AnalysisOptions";
import { AnalyzePrdRequest } from "../lib/api";

const READABLE_TEXT_EXTENSIONS = [".txt", ".md"];

interface NewAnalysisProps {
  setCurrentView: (view: string) => void;
  onAnalyze: (payload: AnalyzePrdRequest) => void;
}

export function NewAnalysis({ setCurrentView, onAnalyze }: NewAnalysisProps) {
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
  const [touched, setTouched] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  const hasName = productInfo.name.trim().length > 0;
  const hasType = productInfo.type !== "";
  const hasPRD = file !== null || pastedText.trim().length > 0;
  
  const isValid = hasName && hasType && hasPRD;

  const extractPrdText = async (): Promise<string> => {
    if (pastedText.trim().length > 0) {
      return pastedText;
    }

    if (file) {
      const isReadableAsText = READABLE_TEXT_EXTENSIONS.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
      );
      if (!isReadableAsText) {
        throw new Error(
          "Only .txt and .md files can be read directly right now. Please paste the PRD text instead, or upload a .txt/.md file."
        );
      }
      return file.text();
    }

    throw new Error("No PRD content provided.");
  };

  const handleAnalyze = async () => {
    setTouched(true);
    if (!isValid || isPreparing) return;

    setAnalyzeError(null);
    setIsPreparing(true);

    try {
      const prdText = await extractPrdText();

      onAnalyze({
        productName: productInfo.name,
        productType: productInfo.type,
        prdText,
        options,
      });

      setCurrentView("results");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to read PRD content. Please try again.";
      setAnalyzeError(message);
    } finally {
      setIsPreparing(false);
    }
  };

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
        <div className="flex flex-col items-end gap-3 pt-4">
          {analyzeError && (
            <p className="text-sm text-destructive text-right max-w-md">{analyzeError}</p>
          )}
          <button
            onClick={handleAnalyze}
            disabled={(!isValid && touched) || isPreparing}
            className={`px-8 py-3 rounded-md text-sm font-medium transition-all shadow-sm inline-flex items-center gap-2 ${
              isValid && !isPreparing
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isPreparing && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            )}
            {isPreparing ? "Preparing PRD..." : "Analyze PRD"}
          </button>
        </div>
      </div>
    </div>
  );
}
