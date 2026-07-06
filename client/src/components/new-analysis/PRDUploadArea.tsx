import React, { useState, useCallback } from "react";
import { Icons } from "../icons";

interface PRDUploadAreaProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function PRDUploadArea({ file, onFileSelect, disabled }: PRDUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown",
    ];
    const validExtensions = [".pdf", ".docx", ".txt", ".md"];
    
    const isValidType = validTypes.includes(selectedFile.type) || 
      validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      setError("Invalid file type. Please upload a .pdf, .docx, .txt, or .md file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    onFileSelect(selectedFile);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, [disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Upload Document</label>
      
      {!file ? (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
            disabled ? "opacity-50 cursor-not-allowed bg-muted/50 border-border" :
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card hover:bg-muted/50"
          }`}
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Icons.upload className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-medium mb-1">
            Drag and drop your PRD here, or{" "}
            <label className="text-primary hover:underline cursor-pointer">
              browse files
              <input 
                type="file" 
                className="hidden" 
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileInput}
                disabled={disabled}
              />
            </label>
          </p>
          <p className="text-xs text-muted-foreground">
            Supports .pdf, .docx, .txt, .md up to 10MB
          </p>
          
          {/* TODO: Supabase Storage Integration placeholder for actual file upload */}
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icons.fileText className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          </div>
          <button 
            onClick={() => onFileSelect(null)}
            className="p-2 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
            aria-label="Remove file"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
      )}
      
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
