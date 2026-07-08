---
name: LaunchMind-AI per-launch engine reuse pattern
description: How to get an Executive-Dashboard-equivalent view model for an arbitrary saved launch (not just the latest) without touching ExecutiveDashboard.tsx
---

`ContextBuilder.buildLaunchContext()` accepts an optional `currentAnalysis` input
(`{ productName, productType, viewData, createdAt }`). Passing in a specific saved
analysis (fetched via `lib/historyApi.fetchAnalysisById`) instead of omitting it (which
defaults to the latest history entry) lets any new module build a full
`LaunchContext` → `LaunchIntelligence` → `ExecutiveDashboardViewModel` pipeline for
*any* past launch, reusing `ContextBuilder`/`ContextEngine`/`IntelligenceEngine`/
`DashboardService` completely unmodified.

**Why:** several module specs forbid modifying `ExecutiveDashboard.tsx` or the
underlying engines, but still want "switching launches updates the dashboard" type
behavior. Since `ExecutiveDashboard.tsx` itself has no prop to select a launch, the
fix is to build a parallel condensed view inside the new feature (not edit the shared
page) using the same untouched service functions with a different `currentAnalysis`
input.

**How to apply:** when a new module needs an Executive-Dashboard-like or read-only
summary for a specific historical launch, call
`buildLaunchContext({ currentAnalysis: {...fetched detail} })` →
`buildLaunchIntelligence(context)` → `buildDashboardViewModel(context, intelligence)`
directly from the new feature's own service file, and render the result in the new
feature's own components. Never add a "selected launch" prop to the shared
dashboard/history pages themselves.
