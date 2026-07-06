---
name: LaunchMind-AI view switching
description: How "navigation" works in the LaunchMind-AI client (no router library installed)
---

The client has no react-router (or any router) installed. `DashboardLayout.tsx` holds a
`currentView` state string and a `switch` statement that renders the matching page
component. "Navigating" to a page/route (e.g. "/results") means adding a new case to
that switch and calling `setCurrentView("results")` — not adding a router library.

**Why:** the task spec asked to "navigate to a placeholder /results route" while also
saying not to install unnecessary packages; extending the existing local-state
view-switching pattern satisfies the requirement without adding react-router.

**How to apply:** when wiring any new "page" or flow that needs to redirect after an
action (form submit, wizard step, etc.), lift the needed state up to `DashboardLayout`
and pass `setCurrentView` (plus any data setters) down as props, then add a `case` in
the switch for the new view id.
