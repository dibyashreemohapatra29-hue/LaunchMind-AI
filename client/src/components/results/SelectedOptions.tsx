
interface SelectedOptionsProps {
  options: string[];
}

export function SelectedOptions({ options }: SelectedOptionsProps) {
  if (options.length === 0) return null;

  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Selected Analysis Options</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <span
            key={option}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
          >
            {option}
          </span>
        ))}
      </div>
    </section>
  );
}
