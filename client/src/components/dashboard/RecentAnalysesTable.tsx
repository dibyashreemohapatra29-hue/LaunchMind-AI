import { useEffect, useState } from "react";
import { fetchAnalysisHistory, HistorySummary } from "../../lib/historyApi";
export function RecentAnalysesTable() {
  const [analyses, setAnalyses] = useState<HistorySummary[]>([]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await fetchAnalysisHistory();
        setAnalyses(history);
      } catch (err) {
        console.error("Failed to load analysis history:", err);
      }
    }

    loadHistory();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            Completed
          </span>
        );
      case "Running":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-primary/10 text-primary border-primary/20">
            Running
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-muted text-muted-foreground border-border">
            {status}
          </span>
        );
    }
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case "Go":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            Go
          </span>
        );
      case "No-Go":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border bg-destructive/10 text-destructive border-destructive/20">
            No-Go
          </span>
        );
      case "Go with Risks":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border bg-amber-500/10 text-amber-600 border-amber-500/20">
            Go with Risks
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border bg-muted text-muted-foreground border-border">
            {rec}
          </span>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-card">
        <h3 className="text-base font-semibold leading-6 text-foreground">
          Recent Analyses
        </h3>
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          View all
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                PRD Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Product
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Recommendation
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {analyses.map((analysis) => (
              <tr
                key={analysis.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-foreground">
                    {analysis.productName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-muted-foreground">
                    {analysis.productType}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge("Completed")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRecommendationBadge(analysis.recommendation)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-muted-foreground">
                  {new Date(analysis.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
