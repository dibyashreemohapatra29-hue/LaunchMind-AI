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
      <div className="space-y-2">
        <div>
          <p className="text-base font-semibold text-foreground">
            {productName ?? "Unknown Product"}
          </p>

          {productType && (
            <p className="text-xs text-muted-foreground">
              {productType}
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Last Analysis
          </p>
          <p className="text-sm font-medium">
            {formattedDate}
          </p>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Total Analyses
          </p>
          <p className="text-lg font-bold">
            {totalAnalyses}
          </p>
        </div>
      </div>
    </section>
  );
}
