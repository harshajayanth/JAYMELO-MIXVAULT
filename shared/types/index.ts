export interface IndexPluginEntry {
  plugin_id: string;
  plugin_name: string;
  alternate_names: string[];
  manufacturer: "Logic" | "Waves";
  category: string;
  subcategory: string[];
  path: string;
}

export interface IndexJSONv13 {
  schema_version: "1.3";

  generated_from?: string;

  vendors: ("Logic" | "Waves")[];

  plugins: IndexPluginEntry[];
}
