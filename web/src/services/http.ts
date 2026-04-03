import { API_BASE_URL } from "./config";
import { buildSecureEnvelope } from "./security";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  errorCode?: string | null;
  details?: unknown;
  data: T;
}

interface PostOptions {
  secure?: boolean;
}

function isPrivateHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
    /^192\.168\.\d+\.\d+\.\d+$/.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname)
  );
}

function canUseSecureEnvelope() {
  if (typeof window === "undefined") {
    return true;
  }

  return Boolean(window.isSecureContext && window.crypto?.subtle);
}

function shouldAllowPlaintextFallback() {
  if (typeof window === "undefined") {
    return false;
  }

  return import.meta.env.DEV && isPrivateHost(window.location.hostname) && !canUseSecureEnvelope();
}

async function postJson<T>(path: string, payload: unknown): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload ?? {})
  });
  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json")
    ? ((await response.json()) as ApiResponse<T>)
    : ({
        success: response.ok,
        message: await response.text(),
        data: null as T
      } satisfies ApiResponse<T>);

  if (!response.ok || !result.success) {
    if (result.errorCode === "CORS_NOT_ALLOWED") {
      throw new Error(`${result.message} This origin is not currently allowed by the backend.`);
    }

    throw new Error(result.message || "Request failed.");
  }

  return result;
}

export async function apiPost<T>(
  path: string,
  payload: unknown,
  options: PostOptions = {}
): Promise<T> {
  try {
    const body = options.secure && canUseSecureEnvelope()
      ? { envelope: await buildSecureEnvelope(payload) }
      : payload ?? {};
    const result = await postJson<T>(path, body);

    return result.data;
  } catch (error) {
    if (options.secure && shouldAllowPlaintextFallback()) {
      const result = await postJson<T>(path, payload ?? {});

      return result.data;
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Network request failed. Possible reasons: backend not started, wrong API URL, blocked port, or browser CORS interception."
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unknown request error.");
  }
}
