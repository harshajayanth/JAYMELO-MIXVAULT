import { Link, useParams } from "wouter";
import { useData } from "@/context/PluginDataContext";
import { GlassCard } from "@/components/ui/glass-card";

interface RouteParams {
  category: string;
  subcategory: string;
}

export default function PluginListPage() {
  const { category, subcategory } = useParams<RouteParams>();

  const decodedCategory = decodeURIComponent(category);
  const decodedSubcategory = decodeURIComponent(subcategory);

  const { data } = useData();

  // 🔒 Filter strictly from index.json
  const plugins = data.plugins.filter(plugin => {
    if (plugin.category !== decodedCategory) return false;

    // UI-only fallback
    if (decodedSubcategory === "All") return true;

    return plugin.subcategory.includes(decodedSubcategory);
  });

  if (plugins.length === 0) {
    return (
      <p className="text-muted-foreground">
        Status: Data not provided / needs confirmation
      </p>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">
          {decodedCategory} / {decodedSubcategory}
        </h1>
        <p className="text-muted-foreground">
          {plugins.length}{" "}
          {plugins.length === 1 ? "Plugin" : "Plugins"}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map(plugin => (
          <Link
            key={plugin.plugin_id}
            href={`/plugin/${plugin.plugin_id}`}
          >
            <GlassCard
              variant="interactive"
              className="p-6 h-full flex flex-col justify-center"
              data-testid={`plugin-card-${plugin.plugin_id}`}
            >
              <h2 className="text-lg font-semibold text-white">
                {plugin.plugin_name}
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                {plugin.manufacturer}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                {plugin.subcategory.map(sub => (
                  <span
                    key={sub}
                    className="text-xs px-2 py-1 rounded bg-white/10 text-muted-foreground"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </GlassCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
