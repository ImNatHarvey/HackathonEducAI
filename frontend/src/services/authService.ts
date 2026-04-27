import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export type AuthProfile = {
  id: string;
  displayName: string;
  email: string;
  title: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
};

type ProfileRow = {
  id: string;
  display_name: string;
  email: string | null;
  title: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
};

const mapProfileRow = (row: ProfileRow): AuthProfile => {
  return {
    id: row.id,
    displayName: row.display_name,
    email: row.email ?? "",
    title: row.title,
    level: row.level,
    xp: row.xp,
    xpToNextLevel: row.xp_to_next_level,
  };
};

export const getCurrentSession = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  return data.session;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
};

export const signUpWithEmail = async ({
  email,
  password,
  displayName,
}: {
  email: string;
  password: string;
  displayName: string;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: displayName,
        name: displayName,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const signInWithEmail = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};

export const fetchAuthProfile = async (
  userId: string,
): Promise<AuthProfile | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  return mapProfileRow(data as ProfileRow);
};

export const ensureAuthProfile = async ({
  userId,
  email,
  displayName,
}: {
  userId: string;
  email: string;
  displayName: string;
}): Promise<AuthProfile> => {
  const safeDisplayName =
    displayName || email.split("@")[0] || "Study Aura User";

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        display_name: safeDisplayName,
        email,
        title: "Aura Farmer",
        level: 1,
        xp: 240,
        xp_to_next_level: 1000,
      },
      {
        onConflict: "id",
      },
    )
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapProfileRow(data as ProfileRow);
};