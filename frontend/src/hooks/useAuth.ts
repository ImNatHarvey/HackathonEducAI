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

export const useAuth = () => {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [authError, setAuthError] = useState("");

  const loadProfile = async (nextUser: User | null) => {
    if (!nextUser) {
      setProfile(null);
      return;
    }

    const nextProfile = await ensureAuthProfile({
      userId: nextUser.id,
      email: nextUser.email ?? "",
      displayName:
        nextUser.user_metadata?.full_name ??
        nextUser.user_metadata?.name ??
        nextUser.email?.split("@")[0] ??
        "Study Aura User",
    });

    setProfile(nextProfile);
  };

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

        if (currentSession?.user) {
          await loadProfile(currentSession.user);
          if (isMounted) setStatus("authenticated");
        } else {
          setStatus("unauthenticated");
        }
      } catch (error) {
        if (!isMounted) return;

        setAuthError(
          error instanceof Error ? error.message : "Failed to load session.",
        );
        setStatus("unauthenticated");
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        try {
          await loadProfile(nextSession.user);
          setStatus("authenticated");
        } catch (error) {
          setAuthError(
            error instanceof Error ? error.message : "Failed to load profile.",
          );
          setStatus("authenticated");
        }
      } else {
        setProfile(null);
        setStatus("unauthenticated");
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setAuthError("");

    const data = await signInWithEmail({ email, password });

    setSession(data.session);
    setUser(data.user);
    await loadProfile(data.user);
    setStatus("authenticated");
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

    const data = await signUpWithEmail({
      email,
      password,
      displayName,
    });

    setSession(data.session);
    setUser(data.user);

    if (data.user) {
      await loadProfile(data.user);
    }

    if (data.session) {
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  };

  const logout = async () => {
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
    isLoadingAuth: status === "loading",
    isAuthenticated: status === "authenticated",
    login,
    register,
    logout,
    reloadProfile,
  };
};