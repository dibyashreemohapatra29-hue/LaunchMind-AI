
export interface ProductInfo {
  name: string;
  type: string;
}

interface ProductInformationFormProps {
  info: ProductInfo;
  onChange: (info: ProductInfo) => void;
}

export function ProductInformationForm({ info, onChange }: ProductInformationFormProps) {
  const productTypes = [
    "SaaS",
    "AI Product",
    "Mobile App",
    "Web Application",
    "Marketplace",
    "Internal Tool",
    "API",
    "Other",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label htmlFor="productName" className="text-sm font-medium text-foreground">
          Product Name <span className="text-destructive">*</span>
        </label>
        <input
          id="productName"
          type="text"
          value={info.name}
          onChange={(e) => onChange({ ...info, name: e.target.value })}
          placeholder="e.g. LaunchMind AI v2"
          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="productType" className="text-sm font-medium text-foreground">
          Product Type <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <select
            id="productType"
            value={info.type}
            onChange={(e) => onChange({ ...info, type: e.target.value })}
            className="w-full h-10 px-3 pr-8 rounded-md border border-input bg-background text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="" disabled>Select a product type</option>
            {productTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}
