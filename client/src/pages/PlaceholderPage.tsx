import React from "react";
import { Icons } from "../components/icons";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-muted/50 p-6 rounded-full mb-6">
        <Icons.externalLink className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        {description}
      </p>
      <div className="inline-flex items-center px-4 py-2 rounded-md bg-secondary text-secondary-foreground text-sm font-medium border border-border">
        Coming Soon
      </div>
    </div>
  );
}
