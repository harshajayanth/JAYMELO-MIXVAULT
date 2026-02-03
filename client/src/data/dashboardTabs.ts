export type DashboardTabKey = "chains" | "templates" | "plugins";

export interface DashboardTab {
  key: DashboardTabKey;
  label: string;
}

export const DASHBOARD_TABS: DashboardTab[] = [
  { key: "chains", label: "Chains" },
  { key: "templates", label: "Templates" },
  { key: "plugins", label: "Plugins" }
];
