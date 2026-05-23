export interface PluginJSONv20 {
  schema_version: string;
  plugin_id: string;
  plugin_name: string;
  manufacturer: string;
  developer: string;
  plugin_type: string;
  category: string;
  subcategory: string[];
  official_reference: PluginOfficialReference;
  models: PluginModel[];
  shared_controls: PluginSharedControl[];
  related_plugins: PluginRelatedPlugin[];
  tags: string[];
  last_updated: string;
}

export interface PluginOfficialReference {
  apple_docs: string[];
  educational_sources: string[];
}

export interface PluginModel {
  model_id: string;
  model_name: string;
  circuit_type: string;
  hardware_inspiration: string;
  character: string[];
  description: {
    short: string;
    detailed: string;
  };
  ref_img: {
    main: string;
    gallery?: string[];
  };
  best_for: string[];
  application: Record<
    string,
    {
      when_to_use: string[];
      recommended_settings: Record<string, string>;
    }
  >;
  workflow_tips: string[];
  genre_suitability: {
    genre: string;
    rating: number;
  }[];
}

export interface PluginSharedControl {
  name: string;
  description: string;
}

export interface PluginRelatedPlugin {
  name: string;
  type: string;
}

export type PluginJSONv15 = PluginJSONv20;
export type PluginJSONv13 = PluginJSONv20;
