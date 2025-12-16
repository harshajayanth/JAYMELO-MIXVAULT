export interface ChainStep {
  name: string;
  settings?: Record<string, string | number>;
  description?: string;
}

export interface Chain {
  id: string;
  name: string;
  description?: string;
  steps: ChainStep[];
  referenceImages?: string[];
  downloadUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  chains: Chain[];
}

export interface AppData {
  categories: Category[];
}
