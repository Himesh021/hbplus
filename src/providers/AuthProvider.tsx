import type { Session, User } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { Platform } from "react-native";
import { supabase } from "../lib/supabase";

WebBrowser.maybeCompleteAuthSession();

const isAllowedEmail = (email?: string | null) =>
  /^[^@\s]+@hbplus\.fit$/i.test(email?.trim() ?? "");

const DOMAIN_ACCESS_ERROR =
  "Access restricted. Sign in with your official @hbplus.fit Google account.";
const UNVERIFIED_EMAIL_ERROR =
  "Google could not verify this email. Select an active, verified @hbplus.fit account.";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function authorize(next: Session | null) {
    if (!next) {
      setUser(null);
      setSession(null);
      return false;
    }

    if (!isAllowedEmail(next.user.email)) {
      setUser(null);
      setSession(null);
      setError(DOMAIN_ACCESS_ERROR);

      await supabase.auth.signOut();
      return false;
    }

    if (next.user.email_confirmed_at == null) {
      setUser(null);
      setSession(null);
      setError(UNVERIFIED_EMAIL_ERROR);

      await supabase.auth.signOut();
      return false;
    }

    setUser(next.user);
    setSession(next);
    setError(null);
    return true;
  }

  useEffect(() => {
    let active = true;

    async function initialize() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (active) await authorize(data.session);
      } catch {
        if (active) {
          setError("Unable to restore your session. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
          setInitialized(true);
        }
      }
    }

    void initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;

      if (event === "SIGNED_OUT") {
        setUser(null);
        setSession(null);
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // Defer work until the Supabase callback has returned.
        setTimeout(() => {
          if (active) void authorize(nextSession);
        }, 0);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signInWithGoogle() {
    setLoading(true);
    setError(null);

    try {
      const redirectTo =
        Platform.OS === "web"
          ? `${window.location.origin}/auth/callback`
          : Linking.createURL("auth/callback");

      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: Platform.OS !== "web",
          queryParams: { hd: "hbplus.fit" },
        },
      });

      if (oauthError) throw oauthError;
      if (!data.url) throw new Error("Google OAuth URL was not returned.");

      if (Platform.OS === "web") {
        window.location.assign(data.url);
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo,
      );

      if (result.type === "cancel" || result.type === "dismiss") {
        setError("Google sign-in was cancelled.");
        return;
      }

      if (result.type !== "success") {
        throw new Error("Google sign-in could not be completed.");
      }

      const callbackUrl = new URL(result.url);
      const code = callbackUrl.searchParams.get("code");

      if (!code) {
        throw new Error("No authorization code was returned.");
      }

      const { data: exchanged, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) throw exchangeError;

      await authorize(exchanged.session);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Google sign-in failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setLoading(true);

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      setUser(null);
      setSession(null);
      setError(null);
    } catch {
      setError("Unable to sign out. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        initialized,
        error,
        signInWithGoogle,
        signOut,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return context;
}
