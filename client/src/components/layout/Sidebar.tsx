import { Icons } from "../icons";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ currentView, setCurrentView, isMobileOpen = false, onClose }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
    { id: "executive-dashboard", label: "Executive Dashboard", icon: Icons.trendingUp },
    { id: "new-analysis", label: "New Analysis", icon: Icons.plus },
    { id: "history", label: "History", icon: Icons.history },
    { id: "workspace", label: "Workspace", icon: Icons.layers },
    { id: "integrations", label: "Integrations", icon: Icons.integration },
    { id: "settings", label: "Settings", icon: Icons.settings },
  ];

  const handleNavigate = (id: string) => {
    setCurrentView(id);
    onClose?.();
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 backdrop-blur-[1px] md:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        className={`w-64 bg-card border-r border-border h-screen flex flex-col fixed md:sticky top-0 left-0 z-40 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <Icons.logo className="w-6 h-6" />
            </div>
            <span className="font-semibold text-lg tracking-tight">LaunchMind AI</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Icons.x className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Menu
          </div>
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              PM
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium leading-none">Product Manager</span>
              <span className="text-xs text-muted-foreground mt-1">Acme Corp</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
