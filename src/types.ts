
export interface CourseData {
  title: string;
  description?: string;
  startDate?: string;
  duration?: string;
  cost?: string;
  subsidized?: boolean;
  url?: string;
  imageUrl?: string;
}

export interface SelectorConfig {
  title: string;
  description?: string;
  startDate?: string;
  duration?: string;
  cost?: string;
  subsidized?: string;
  url?: string;
  imageUrl?: string;
}

export interface ScrapingConfig {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  selectors: SelectorConfig;
  transformers?: Record<string, string>;
  enabled?: boolean;
}

export interface ImportedConfig {
  name: string;
  description: string;
  baseUrl: string;
  selectors: SelectorConfig;
  transformers?: Record<string, string>;
}
