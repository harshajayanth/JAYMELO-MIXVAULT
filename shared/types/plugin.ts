/**
 * 🔒 Plugin-level JSON v1.3
 * This file MUST mirror every plugin JSON exactly.
 * Used ONLY for plugin detail pages.
 */

/* ---------- Application Block ---------- */
export interface PluginApplicationBlock {
  when_to_use: string[];
  recommended_settings: Record<string, string>;
}

/* ---------- Plugin JSON Root ---------- */
export interface PluginJSONv13 {
  schema_version: "1.3";

  /* ---------- Identity ---------- */
  plugin_id: string;
  plugin_name: string;
  alternate_names: string[];
  manufacturer: "Logic" | "Waves";

  /* ---------- Classification ---------- */
  category: string;
  subcategory: string[];

  plugin_type: "Processor" | "Instrument" | "Utility";

  /* ---------- Description ---------- */
  description: {
    short: string;
    detailed: string;
  };

  /* ---------- Application ---------- */
  application: Record<string, PluginApplicationBlock>;

  /* ---------- Signal Chain (TEXT ONLY) ---------- */
  signal_chain: {
    recommended_position: string;
    common_chains: string[];
  };

  /* ---------- Usage ---------- */
  workflow_tips: string[];
  genre_suitability: string[];

  /* ---------- Metadata ---------- */
  skill_level: "Beginner" | "Intermediate" | "Advanced";
  cpu_usage: "Low" | "Medium" | "High";
  latency: "Zero" | "Low" | "Medium" | "High";

  /* ---------- Relations ---------- */
  related_plugins: string[];
  tags: string[];

  /* ---------- Versioning ---------- */
  last_updated: string; // YYYY-MM-DD
}
