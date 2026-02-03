import { useData } from "@/context/DataContext";
import { GlassCard } from "@/components/ui/glass-card";
import { Link } from "wouter";
import { getIcon } from "@/lib/icons";

export function DashboardChains() {
  const { data } = useData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.categories.map(category => {
        const Icon = getIcon(category.icon);

        return (
          <Link key={category.id} href={`/category/${category.id}`}>
            <GlassCard
              variant="interactive"
              className="p-8 flex flex-col items-center text-center gap-6 h-full min-h-[240px]"
            >
              <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <Icon className="h-10 w-10 text-muted-foreground" />
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-white">
                  {category.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {category.chains.length}{" "}
                  {category.chains.length === 1 ? "Chain" : "Chains"}
                </p>
              </div>
            </GlassCard>
          </Link>
        );
      })}
    </div>
  );
}
