export interface ApiClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
}

export class ApiClient {
  private baseUrl: string;

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || process.env.NEXT_PUBLIC_API_URL || "/api";
  }

  async get<T>(endpoint: string, _options?: RequestInit): Promise<T> {
    throw new Error("API client GET to " + endpoint + " not implemented yet");
  }

  async post<T>(endpoint: string, _body?: unknown, _options?: RequestInit): Promise<T> {
    throw new Error("API client POST to " + endpoint + " not implemented yet");
  }

  async put<T>(endpoint: string, _body?: unknown, _options?: RequestInit): Promise<T> {
    throw new Error("API client PUT to " + endpoint + " not implemented yet");
  }

  async patch<T>(endpoint: string, _body?: unknown, _options?: RequestInit): Promise<T> {
    throw new Error("API client PATCH to " + endpoint + " not implemented yet");
  }

  async delete<T>(endpoint: string, _options?: RequestInit): Promise<T> {
    throw new Error("API client DELETE to " + endpoint + " not implemented yet");
  }
}

export const apiClient = new ApiClient();
