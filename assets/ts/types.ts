// Configuration for an AI provider (e.g., Grok or ChatGPT)
export interface AIConfig {
  endpoint: string; // API endpoint URL
  payload: {
    // Request payload parameters
    model: string;
    temperature: number;
    messages: any[];
  };
  headers: { [key: string]: string }; // HTTP headers for the API request
}

// Shape of the config.json file
export interface Config {
  ais: {
    // Map of supported AI providers
    [key in "grok" | "chatgpt"]: AIConfig;
  };
}

// Represents a single user's session
export interface User {
  ai: string | null; // Selected AI provider (e.g., "grok" or "chatgpt")
  key: string | null; // Hashed API key for the AI provider
}

// Map of all users, keyed by their WhatsApp ID
export interface Users {
  [key: string]: User;
}
