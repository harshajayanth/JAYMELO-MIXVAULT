import { Link } from "wouter";
import { useData } from "@/context/PluginDataContext";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface CategoryCount {
  category: string;
  count: number;
}

export default function PluginCategoriesPage() {
  const { data } = useData();

  if (!data.plugins || data.plugins.length === 0) {
    return (
      <p className="text-muted-foreground">
        Status: Plugin index not loaded
      </p>
    );
  }

  // 🔒 derive categories ONLY from index.json
  const categoriesMap = new Map<string, number>();

  data.plugins.forEach(plugin => {
    const current = categoriesMap.get(plugin.category) ?? 0;
    categoriesMap.set(plugin.category, current + 1);
  });

  const categories: CategoryCount[] = Array.from(
    categoriesMap.entries()
  ).map(([category, count]) => ({
    category,
    count
  }));

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        {/* Row: back arrow + title */}
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-white">
            Plugins
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-muted-foreground">
          Browse plugins by category
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(({ category, count }) => (
          <Link
            key={category}
            href={`/plugins/${encodeURIComponent(category)}`}
          >
            <GlassCard
              variant="interactive"
              className="p-6 h-full flex flex-col justify-center text-center"
              data-testid={`plugin-category-${category}`}
            >
              <h2 className="text-xl font-semibold text-white">
                {category}
              </h2>

              <p className="text-sm text-muted-foreground mt-2">
                {count} {count === 1 ? "Plugin" : "Plugins"}
              </p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
