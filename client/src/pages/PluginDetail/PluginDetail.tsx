import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { useData } from "@/context/PluginDataContext";
import { PluginJSONv13 } from "shared/types/plugin";

interface RouteParams {
  plugin_id: string;
}

export default function PluginDetailPage() {
  const { plugin_id } = useParams<RouteParams>();
  const { data } = useData();

  // 1️⃣ Resolve plugin from index.json (MANDATORY)
  const pluginIndexEntry = data.plugins.find(
    p => p.plugin_id === plugin_id
  );

  if (!pluginIndexEntry) {
    return (
      <p className="text-muted-foreground">
        Status: Plugin not found in index
      </p>
    );
  }

  // 2️⃣ Load plugin-level JSON (v1.3)
  const { data: pluginData, isLoading, error } = useQuery({
    queryKey: ["plugin-json", plugin_id],
    queryFn: async (): Promise<PluginJSONv13> => {
      const response = await fetch(pluginIndexEntry.path);
      if (!response.ok) {
        throw new Error("Plugin JSON failed to load");
      }

      console.log(response)
      return response.json();
    }
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading plugin…</p>;
  }

  if (error || !pluginData) {
    return (
      <p className="text-muted-foreground">
        Status: Data not provided / needs confirmation
      </p>
    );
  }

  // 🔒 From here on → render ONLY what exists
  return (
    <section className="space-y-8">
      {/* ---------- HEADER ---------- */}
      <header className="space-y-2">
        <h1 className="text-4xl font-bold text-white">
          {pluginData.plugin_name}
        </h1>

        <p className="text-muted-foreground">
          {pluginData.description.short}
        </p>
      </header>

      {/* ---------- BASIC META ---------- */}
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>Manufacturer: {pluginData.manufacturer}</span>
        <span>Category: {pluginData.category}</span>
        <span>
          Subcategories:{" "}
          {pluginData.subcategory.join(", ") || "—"}
        </span>
        <span>Type: {pluginData.plugin_type}</span>
      </div>

      {/* ---------- APPLICATIONS ---------- */}
      {Object.keys(pluginData.application).length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">
            Applications
          </h2>

          {Object.entries(pluginData.application).map(
            ([key, block]) => (
              <div key={key} className="space-y-2">
                <h3 className="text-lg font-medium capitalize text-white">
                  {key}
                </h3>

                <ul className="list-disc list-inside text-muted-foreground">
                  {block.when_to_use.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                {Object.keys(block.recommended_settings).length >
                  0 && (
                  <div className="text-sm text-muted-foreground">
                    <strong>Recommended settings:</strong>
                    <ul className="list-disc list-inside ml-4">
                      {Object.entries(
                        block.recommended_settings
                      ).map(([param, value]) => (
                        <li key={param}>
                          {param}: {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          )}
        </section>
      )}

      {/* ---------- SIGNAL CHAIN (TEXT ONLY) ---------- */}
      {(pluginData.signal_chain.recommended_position ||
        pluginData.signal_chain.common_chains.length >
          0) && (
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">
            Signal Chain
          </h2>

          {pluginData.signal_chain.recommended_position && (
            <p className="text-muted-foreground">
              {pluginData.signal_chain.recommended_position}
            </p>
          )}

          {pluginData.signal_chain.common_chains.length >
            0 && (
            <ul className="list-disc list-inside text-muted-foreground">
              {pluginData.signal_chain.common_chains.map(
                chain => (
                  <li key={chain}>{chain}</li>
                )
              )}
            </ul>
          )}
        </section>
      )}

      {/* ---------- WORKFLOW TIPS ---------- */}
      {pluginData.workflow_tips.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">
            Workflow Tips
          </h2>

          <ul className="list-disc list-inside text-muted-foreground">
            {pluginData.workflow_tips.map(tip => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- META FOOTER ---------- */}
      <footer className="text-xs text-muted-foreground space-y-1">
        <p>Skill level: {pluginData.skill_level}</p>
        <p>CPU usage: {pluginData.cpu_usage}</p>
        <p>Latency: {pluginData.latency}</p>
        <p>Last updated: {pluginData.last_updated}</p>
      </footer>
    </section>
  );
}
