import React from "react";
import { Icons } from "../icons";

export function RecentActivity() {
  const activities = [
    { id: 1, type: "upload", content: "PRD uploaded", target: "Q3 Payment Gateway Integration", time: "2h ago", icon: Icons.upload, color: "text-blue-600", bg: "bg-blue-500/10" },
    { id: 2, type: "analysis", content: "Analysis completed", target: "Q3 Payment Gateway Integration", time: "1h 45m ago", icon: Icons.checkCircle, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { id: 3, type: "notification", content: "Slack notification sent", target: "#product-updates", time: "1h 45m ago", icon: Icons.slack, color: "text-amber-600", bg: "bg-amber-500/10" },
    { id: 4, type: "calendar", content: "Launch review scheduled", target: "Calendar event created", time: "1h 30m ago", icon: Icons.calendar, color: "text-purple-600", bg: "bg-purple-500/10" },
    { id: 5, type: "export", content: "Report exported", target: "Mobile Push Notifications Revamp", time: "Yesterday", icon: Icons.download, color: "text-muted-foreground", bg: "bg-muted" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full">
      <div className="px-6 py-5 border-b border-border">
        <h3 className="text-base font-semibold leading-6 text-foreground">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="flow-root">
          <ul role="list" className="-mb-8">
            {activities.map((activity, activityIdx) => (
              <li key={activity.id}>
                <div className="relative pb-8">
                  {activityIdx !== activities.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-card ${activity.bg} ${activity.color}`}>
                        <activity.icon className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{activity.content}</span>{' '}
                          for <span className="font-medium text-foreground">{activity.target}</span>
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-muted-foreground">
                        {activity.time}
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
