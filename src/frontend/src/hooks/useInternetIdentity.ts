import type { Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import {
  type ReactNode,
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { loadConfig } from "../config";

type LoginStatus = "idle" | "logging-in" | "success" | "error";

interface InternetIdentityContextType {
  identity: Identity | null;
  loginStatus: LoginStatus;
  isInitializing: boolean;
  isLoggingIn: boolean;
  isLoginError: boolean;
  isLoginSuccess: boolean;
  login: () => Promise<void>;
  clear: () => Promise<void>;
}

const InternetIdentityContext =
  createContext<InternetIdentityContextType | null>(null);

let _authClient: AuthClient | null = null;

async function getAuthClient(): Promise<AuthClient> {
  if (!_authClient) {
    _authClient = await AuthClient.create();
  }
  return _authClient;
}

export function InternetIdentityProvider({
  children,
}: { children: ReactNode }) {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loginStatus, setLoginStatus] = useState<LoginStatus>("idle");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    getAuthClient().then(async (client) => {
      const authenticated = await client.isAuthenticated();
      if (authenticated) {
        const id = client.getIdentity();
        setIdentity(id);
        setLoginStatus("success");
      }
      setIsInitializing(false);
    });
  }, []);

  const login = useCallback(async () => {
    setLoginStatus("logging-in");
    try {
      const client = await getAuthClient();
      const config = await loadConfig();
      await new Promise<void>((resolve, reject) => {
        client.login({
          identityProvider: config.backend_host?.includes("localhost")
            ? "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943"
            : "https://identity.ic0.app",
          derivationOrigin: config.ii_derivation_origin,
          onSuccess: () => resolve(),
          onError: (err) => reject(new Error(err)),
        });
      });
      const id = client.getIdentity();
      setIdentity(id);
      setLoginStatus("success");
    } catch {
      setLoginStatus("error");
    }
  }, []);

  const clear = useCallback(async () => {
    const client = await getAuthClient();
    await client.logout();
    setIdentity(null);
    setLoginStatus("idle");
  }, []);

  const value: InternetIdentityContextType = {
    identity,
    loginStatus,
    isInitializing,
    isLoggingIn: loginStatus === "logging-in",
    isLoginError: loginStatus === "error",
    isLoginSuccess: loginStatus === "success",
    login,
    clear,
  };

  return createElement(InternetIdentityContext.Provider, { value }, children);
}

export function useInternetIdentity(): InternetIdentityContextType {
  const ctx = useContext(InternetIdentityContext);
  if (!ctx) {
    throw new Error(
      "useInternetIdentity must be used within InternetIdentityProvider",
    );
  }
  return ctx;
}
