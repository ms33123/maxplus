import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type { AdminRole, AdminSession } from "../types/admin";
import { isMockToken, loginWithMock } from "../services/mockAdmin";
import { NAV_ACTIVE_TAB_KEY, NAV_TABS_KEY, useNavTabsStore } from "./navTabs";
import { readStorage, removeStorage, writeStorage } from "../utils/storage";
import { apiPost } from "../services/http";

const SESSION_KEY = "maxplus-sysadmin-session";
const TOKEN_KEY = "maxplus-sysadmin-token";
const MODE_KEY = "maxplus-sysadmin-mode";
const ENABLE_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === "true";

type SessionMode = "api" | "mock";

interface LoginPayload {
  token: string;
  session: AdminSession;
}

export const useSessionStore = defineStore("session", () => {
  const storedToken = readStorage<string | null>(TOKEN_KEY, null);
  const storedSession = readStorage<AdminSession | null>(SESSION_KEY, null);
  const initialToken =
    !ENABLE_MOCK_FALLBACK && isMockToken(storedToken) ? null : storedToken;
  const initialSession =
    !ENABLE_MOCK_FALLBACK && isMockToken(storedToken) ? null : storedSession;

  if (!ENABLE_MOCK_FALLBACK && isMockToken(storedToken)) {
    removeStorage(TOKEN_KEY);
    removeStorage(SESSION_KEY);
    removeStorage(MODE_KEY);
  }

  const session = ref<AdminSession | null>(initialSession);
  const token = ref<string | null>(initialToken);
  const mode = ref<SessionMode>(
    readStorage<SessionMode>(MODE_KEY, isMockToken(initialToken) ? "mock" : "api")
  );

  const isAuthenticated = computed(() => Boolean(session.value && token.value));
  const isMockMode = computed(() => mode.value === "mock" || isMockToken(token.value));

  const setSession = (value: AdminSession | null) => {
    session.value = value;

    if (value) {
      writeStorage(SESSION_KEY, value);
      return;
    }

    removeStorage(SESSION_KEY);
  };

  const setToken = (value: string | null) => {
    token.value = value;

    if (value) {
      writeStorage(TOKEN_KEY, value);
      return;
    }

    removeStorage(TOKEN_KEY);
  };

  const setMode = (value: SessionMode) => {
    mode.value = value;
    writeStorage(MODE_KEY, value);
  };

  const setAuth = (payload: LoginPayload, nextMode: SessionMode = "api") => {
    setMode(nextMode);
    setToken(payload.token);
    setSession(payload.session);
  };

  const login = async (username: string, password: string, role: AdminRole) => {
    try {
      const result = await apiPost<LoginPayload>(
        "/auth/login",
        {
          username,
          password,
          role
        },
        {
          secure: true
        }
      );

      setAuth(result, "api");
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      const shouldUseMock =
        ENABLE_MOCK_FALLBACK &&
        message.includes("网络请求失败") ||
        (ENABLE_MOCK_FALLBACK && message.includes("当前来源可能未加入后端允许列表")) ||
        (ENABLE_MOCK_FALLBACK && message.includes("无法获取加密公钥"));

      if (!shouldUseMock) {
        throw error;
      }

      const result = loginWithMock(username, password, role);
      setAuth(result, "mock");
      return result;
    }
  };

  const logout = () => {
    useNavTabsStore().reset();
    setMode("api");
    setToken(null);
    setSession(null);
    removeStorage(NAV_TABS_KEY);
    removeStorage(NAV_ACTIVE_TAB_KEY);
  };

  return {
    session,
    token,
    mode,
    isAuthenticated,
    isMockMode,
    setSession,
    setMode,
    setAuth,
    login,
    logout
  };
});
