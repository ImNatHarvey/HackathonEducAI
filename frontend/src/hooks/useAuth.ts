import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import {
  ensureAuthProfile,
  fetchAuthProfile,
  getCurrentSession,
  signInWithEmail,
  signOut,
  signUpWithEmail,
  type AuthProfile,
} from "../services/authService";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

const getFriendlyAuthError = (message: string) => {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("rate limit")) {
    return "Email rate limit exceeded. Please wait a few minutes before trying again.";
  }

  if (
    normalizedMessage.includes("email not confirmed") ||
    normalizedMessage.includes("not confirmed")
  ) {
    return "Please verify your email first before logging in.";
  }

  if (
    normalizedMessage.includes("invalid login credentials") ||
    normalizedMessage.includes("invalid credentials")
  ) {
    return "Invalid email or password.";
  }

  if (
    normalizedMessage.includes("already registered") ||
    normalizedMessage.includes("user already registered")
  ) {
    return "This email is already registered. Try logging in instead.";
  }

  return message;
};

export const useAuth = () => {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      setStatus("loading");
      setAuthError("");

      try {
        const currentSession = await getCurrentSession();

        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setStatus(currentSession?.user ? "authenticated" : "unauthenticated");
      } catch (error) {
        if (!isMounted) return;

        setAuthError(
          error instanceof Error ? error.message : "Failed to load session.",
        );
        setSession(null);
        setUser(null);
        setStatus("unauthenticated");
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setStatus(nextSession?.user ? "authenticated" : "unauthenticated");
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        setIsProfileLoading(false);
        return;
      }

      setIsProfileLoading(true);

      try {
        const nextProfile = await ensureAuthProfile({
          userId: user.id,
          email: user.email ?? "",
          displayName:
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            user.email?.split("@")[0] ??
            "Study Aura User",
        });

        if (isMounted) {
          setProfile(nextProfile);
        }
      } catch (error) {
        if (isMounted) {
          setAuthError(
            error instanceof Error ? error.message : "Failed to load profile.",
          );
        }
      } finally {
        if (isMounted) {
          setIsProfileLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setAuthError("");
    setAuthNotice("");

    try {
      const data = await signInWithEmail({ email, password });

      setSession(data.session);
      setUser(data.user);
      setStatus("authenticated");
      setAuthNotice("Login successful.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to login.";

      setAuthError(getFriendlyAuthError(message));
      throw error;
    }
  };

  const register = async ({
    email,
    password,
    displayName,
  }: {
    email: string;
    password: string;
    displayName: string;
  }) => {
    setAuthError("");
    setAuthNotice("");

    try {
      const data = await signUpWithEmail({
        email,
        password,
        displayName,
      });

      setSession(data.session);
      setUser(data.user);

      if (data.session) {
        setStatus("authenticated");
        setAuthNotice("Account created successfully.");
      } else {
        setStatus("unauthenticated");
        setAuthNotice(
          "Account created. Please check your email inbox and verify your account before logging in.",
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create account.";

      setAuthError(getFriendlyAuthError(message));
      throw error;
    }
  };

  const logout = async () => {
    setAuthError("");
    setAuthNotice("");

    await signOut();

    setSession(null);
    setUser(null);
    setProfile(null);
    setStatus("unauthenticated");
  };

  const reloadProfile = async () => {
    if (!user) return null;

    const nextProfile = await fetchAuthProfile(user.id);
    setProfile(nextProfile);
    return nextProfile;
  };

  return {
    status,
    session,
    user,
    profile,
    authError,
    authNotice,
    isProfileLoading,
    isLoadingAuth: status === "loading",
    isAuthenticated: status === "authenticated",
    login,
    register,
    logout,
    reloadProfile,
  };
};