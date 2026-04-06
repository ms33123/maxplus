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
  token?: string | null;
  secure?: boolean;
}

function isPrivateHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
    /^192\.168\.\d+\.\d+\.\d+$/.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname) ||
    /^169\.254\.\d+\.\d+$/.test(hostname)
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

async function postJson<T>(path: string, payload: unknown, options: PostOptions): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
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
      throw new Error(`${result.message} 当前来源可能未加入后端允许列表。`);
    }

    throw new Error(result.message || "请求失败。");
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
    const result = await postJson<T>(path, body, options);

    return result.data;
  } catch (error) {
    if (options.secure && shouldAllowPlaintextFallback()) {
      const result = await postJson<T>(path, payload ?? {}, options);

      return result.data;
    }

    if (error instanceof TypeError) {
      throw new Error(
        "网络请求失败。可能原因：后端未启动、接口地址错误、端口不通，或浏览器被 CORS 拦截。"
      );
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("未知请求错误。");
  }
}
