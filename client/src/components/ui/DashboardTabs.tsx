import { Link, useLocation } from "wouter";
import clsx from "clsx";

interface Tab {
  key: string;
  label: string;
  href: string;
}

interface Props {
  tabs: Tab[];
}

export function DashboardTabs({ tabs }: Props) {
  const [location] = useLocation();

  return (
    <div className="flex gap-2 border-b border-white/10">
      {tabs.map(tab => (
        <Link key={tab.key} href={tab.href}>
          <span
            className={clsx(
              "px-4 py-3 text-base font-semibold cursor-pointer transition-colors",
              location === tab.href ||
                location.startsWith(tab.href + "/")
                ? "text-yellow-400 border-b-2 border-yellow-400"
                : "text-muted-foreground hover:text-white"
            )}
            data-testid={`tab-${tab.key}`}
          >
            {tab.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
