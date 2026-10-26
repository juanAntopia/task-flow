export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status?: string;
}

export interface ApiValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export interface HealthCheckResponse {
  status: string;
  message: string;
  timestamp: string;
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

