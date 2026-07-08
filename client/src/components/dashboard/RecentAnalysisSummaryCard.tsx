import { Icons } from "../icons";
import { RecentAnalysisViewModel } from "../../services/DashboardService";

export function RecentAnalysisSummaryCard({ productName, productType, createdAt, totalAnalyses }: RecentAnalysisViewModel) {
  const formattedDate = createdAt ? new Date(createdAt).toLocaleString() : "Unknown date";

  return (
    <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Icons.fileText className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">Recent Analysis Summary</h3>
      </div>
      <div className="space-y-1.5">
        <p className="text-base font-semibold text-foreground">{productName ?? "Unknown Product"}</p>
        {productType && <p className="text-xs text-muted-foreground">{productType}</p>}
        <p className="text-xs text-muted-foreground">Analyzed: {formattedDate}</p>
        <p className="text-xs text-muted-foreground">
          {totalAnalyses} total analys{totalAnalyses === 1 ? "is" : "es"} in history
        </p>
      </div>
    </section>
  );
}
