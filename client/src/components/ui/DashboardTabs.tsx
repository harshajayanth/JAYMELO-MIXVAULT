"use client";

import { DashboardTab } from "@/data/dashboardTabs";
import clsx from "clsx";

interface Props {
  tabs: DashboardTab[];
  activeTab: string;
  onChange: (key: any) => void;
}

export function DashboardTabs({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="flex gap-2 border-b border-white/10">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={clsx(
            "px-4 py-2 text-lg font-semibold tracking-wide transition-colors",
            activeTab === tab.key
              ? "text-yellow-400 border-b-2 border-yellow-400"
              : "text-muted-foreground hover:text-white"
          )}
          data-testid={`tab-${tab.key}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
