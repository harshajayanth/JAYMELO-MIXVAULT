import { useState } from "react";
import { DashboardTabKey } from "@/data/dashboardTabs";

export function useDashboardTabs(
  defaultTab: DashboardTabKey = "chains"
) {
  const [activeTab, setActiveTab] = useState<DashboardTabKey>(defaultTab);

  return {
    activeTab,
    setActiveTab
  };
}
