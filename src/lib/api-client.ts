/**
 * Production Multi-Tenant API Client for POS Retail
 * Clean, type-safe HTTP client with JWT injection, envelope unwrapping, and robust error handling.
 */

export interface ApiClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
}

export interface BackendResponseEnvelope<T> {
  success: boolean;
  statusCode: number;
  data: T;
  meta?: Record<string, unknown>;
  timestamp: string;
}

export class ApiError extends Error {
  statusCode: number;
  data?: unknown;
  originalError?: string;

  constructor(message: string, statusCode: number, data?: unknown, originalError?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
    this.originalError = originalError;
  }
}

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    const rawUrl = config.baseUrl || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    // Strip trailing slash if present
    this.baseUrl = rawUrl.replace(/\/+$/, "");
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...(config.headers || {}),
    };
  }

  /**
   * Retrieves active JWT token from browser storage
   */
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem("auth_token");
    } catch {
      return null;
    }
  }

  /**
   * Persists authentication token to browser storage
   */
  setToken(token: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("auth_token", token);
    } catch {
      // Storage access may be restricted in private browsing
    }
  }

  /**
   * Clears authentication token and related session storage
   */
  clearToken(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("active_profile");
      localStorage.removeItem("active_role");
      localStorage.removeItem("active_store");
      localStorage.removeItem("store_profiles");
      localStorage.removeItem("cashier_session");
      sessionStorage.removeItem("active_role");
      sessionStorage.removeItem("auth_pending_email");
      sessionStorage.removeItem("auth_reset_otp");
      sessionStorage.removeItem("auth_otp_purpose");
    } catch {
      // Storage access may be restricted
    }
  }

  /**
   * Resolves absolute request URL
   */
  private resolveUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${cleanEndpoint}`;
  }

  /**
   * Builds headers with Authorization token and Content-Type
   */
  private buildHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers(customHeaders);

    // Apply default Content-Type if not specified
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    // Inject Bearer token if not already explicitly supplied
    if (!headers.has("Authorization")) {
      const token = this.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    return headers;
  }

  /**
   * Core request dispatcher with response envelope unwrapping and exception parsing
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.resolveUrl(endpoint);
    const headers = this.buildHeaders(options.headers);

    let response: Response;
    try {
      response = await fetch(url, {
        ...options,
        headers,
      });
    } catch (networkError: unknown) {
      const message = networkError instanceof Error ? networkError.message : "Network request failed";
      throw new ApiError(`Unable to connect to server: ${message}`, 0);
    }

    // Try parsing JSON response body
    let payload: unknown;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }
    } else {
      payload = await response.text();
    }

    // Handle HTTP errors
    if (!response.ok) {
      let errorMessage = response.statusText || "Request failed";
      let errorName = "HttpError";

      if (payload && typeof payload === "object") {
        const errObj = payload as Record<string, unknown>;
        if (Array.isArray(errObj.message)) {
          errorMessage = errObj.message.join(", ");
        } else if (typeof errObj.message === "string") {
          errorMessage = errObj.message;
        } else if (typeof errObj.error === "string") {
          errorMessage = errObj.error;
        }
        if (typeof errObj.error === "string") {
          errorName = errObj.error;
        }
      }

      throw new ApiError(errorMessage, response.status, payload, errorName);
    }

    // If backend wrapped in ResponseEnvelope<T> ({ success: true, statusCode: 200, data: T })
    if (
      payload &&
      typeof payload === "object" &&
      "data" in payload &&
      "success" in payload
    ) {
      const envelope = payload as BackendResponseEnvelope<T>;
      return envelope.data;
    }

    return payload as T;
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
