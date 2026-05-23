import { Link, useParams } from "wouter";
import { useQueries } from "@tanstack/react-query";
import { useData } from "@/context/PluginDataContext";
import { PluginJSONv20 } from "shared/types/plugin";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";


interface RouteParams {
  category: string;
}

interface SubCategoryCount {
  name: string;
  count: number;
}

export default function PluginSubCategoriesPage() {
  const { category } = useParams<RouteParams>();
  const decodedCategory = decodeURIComponent(category);

  const { data } = useData();

  if (!data.plugins || data.plugins.length === 0) {
    return (
      <p className="text-muted-foreground">
        Status: Plugin index not loaded
      </p>
    );
  }

  // 🔒 Filter plugins strictly by category (index.json only)
  const categoryPlugins = data.plugins.filter(
    plugin => plugin.category === decodedCategory
  );

  const modelCountQueries = useQueries({
    queries: categoryPlugins.map((plugin) => ({
      queryKey: ["plugin-json-model-count", plugin.plugin_id, plugin.path],
      queryFn: async () => {
        const response = await fetch(plugin.path);

        if (!response.ok) {
          throw new Error("Failed to load plugin model count");
        }

        const pluginData = (await response.json()) as Partial<PluginJSONv20>;
        return Array.isArray(pluginData.models) ? pluginData.models.length : 1;
      },
      staleTime: Infinity,
    })),
  });

  const modelCountByPluginId = new Map(
    categoryPlugins.map((plugin, index) => [
      plugin.plugin_id,
      modelCountQueries[index]?.data ?? 0,
    ])
  );

  if (categoryPlugins.length === 0) {
    return (
      <p className="text-muted-foreground">
        Status: Data not provided / needs confirmation
      </p>
    );
  }

  // 🔒 Collect subcategories
  const subCategoryMap = new Map<string, number>();

  categoryPlugins.forEach(plugin => {
    if (plugin.subcategory.length === 0) {
      return;
    }

    const modelCount = modelCountByPluginId.get(plugin.plugin_id) ?? 0;
    plugin.subcategory.forEach(sub => {
      const current = subCategoryMap.get(sub) ?? 0;
      subCategoryMap.set(sub, current + modelCount);
    });
  });

  const hasSubCategories = subCategoryMap.size > 0;

  const subCategories: SubCategoryCount[] = hasSubCategories
    ? Array.from(subCategoryMap.entries()).map(([name, count]) => ({
        name,
        count
      }))
    : [
        {
          name: "All",
          count: categoryPlugins.length
        }
      ];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
      {/* Row: back arrow + title */}
      <div className="flex items-center gap-3">
        <Link href={`/plugins`}>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-white">
         {decodedCategory}
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-muted-foreground">
        Browse plugins by category
      </p>
    </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subCategories.map(sub => (
          <Link
            key={sub.name}
            href={`/plugins/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(sub.name)}`}
          >
            <GlassCard
              variant="interactive"
              className="p-6 h-full flex flex-col justify-center text-center"
              data-testid={`plugin-subcategory-${sub.name}`}
            >
              <h2 className="text-xl font-semibold text-white">
                {sub.name}
              </h2>

              <p className="text-sm text-muted-foreground mt-2">
                {sub.count} {sub.count === 1 ? "Model" : "Models"}
              </p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
