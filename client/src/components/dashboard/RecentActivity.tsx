import { useEffect, useState } from "react";
import { fetchAnalysisHistory, HistorySummary } from "../../lib/historyApi";
import { Icons } from "../icons";

export function RecentActivity() {
  const [activities, setActivities] = useState<HistorySummary[]>([]);

  useEffect(() => {
    async function loadActivities() {
      try {
        const history = await fetchAnalysisHistory();
        setActivities(history.slice(0, 5));
      } catch (error) {
        console.error("Failed to load recent activity:", error);
      }
    }

    loadActivities();
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full">
      <div className="px-6 py-5 border-b border-border">
        <h3 className="text-base font-semibold leading-6 text-foreground">
          Recent Activity
        </h3>
      </div>
      <div className="p-6">
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-card bg-emerald-500/10 text-emerald-600">
                        <Icons.checkCircle
                          className="w-4 h-4"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">
                            Analysis completed
                          </span>{" "}
                          for{" "}
                          <span className="font-medium text-foreground">
                            {activity.productName}
                          </span>
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
