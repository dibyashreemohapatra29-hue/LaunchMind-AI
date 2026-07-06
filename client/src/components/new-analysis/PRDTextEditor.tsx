import React from "react";

interface PRDTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function PRDTextEditor({ value, onChange, disabled }: PRDTextEditorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Paste Document Content</label>
      <div className={`relative rounded-xl border ${disabled ? 'opacity-50 border-border bg-muted/50' : 'border-border bg-card focus-within:border-primary focus-within:ring-1 focus-within:ring-primary'}`}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Paste your Product Requirements Document here..."
          className="w-full min-h-[300px] p-4 bg-transparent resize-y outline-none text-sm disabled:cursor-not-allowed"
        />
        <div className="absolute bottom-3 right-4 text-xs text-muted-foreground pointer-events-none">
          {value.length} characters
        </div>
      </div>
    </div>
  );
}
