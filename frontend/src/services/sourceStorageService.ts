import { supabase } from "../lib/supabase";

const SOURCE_BUCKET = "study-sources";

const safeFileName = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-");
};

export const uploadSourceFileToSupabase = async ({
  file,
  userId,
  moduleId,
}: {
  file: File;
  userId?: string;
  moduleId?: string;
}) => {
  const fileExt = file.name.split(".").pop() || "file";
  const baseName = safeFileName(file.name.replace(/\.[^.]+$/, ""));
  const folderUser = userId || "guest";
  const folderModule = moduleId || "general";

  const filePath = `${folderUser}/${folderModule}/${crypto.randomUUID()}-${baseName}.${fileExt}`;

  const { error } = await supabase.storage
    .from(SOURCE_BUCKET)
    .upload(filePath, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(SOURCE_BUCKET).getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: data.publicUrl,
  };
};