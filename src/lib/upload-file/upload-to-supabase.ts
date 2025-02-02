import { createClient } from "@supabase/supabase-js";
import { env } from "../env.mjs";
import { UploadFileProvider } from "./types";

export const supabaseClient = createClient(
  env.SUPABASE_API_URL,
  env.SUPABASE_SECRET_KEY
);

/**
 * Uploads a file to a specified Supabase storage bucket and returns the public URL of the uploaded file.
 *
 * @param params - The parameters for the upload.
 * @param params.bucket - The name of the Supabase storage bucket.
 * @param params.file - The file to be uploaded.
 * @param params.filename - The name to be used for the uploaded file.
 * @returns A promise that resolves to the public URL of the uploaded file, or null if the upload failed.
 */
export const uploadToSupabase: UploadFileProvider = async ({
  folder: bucket,
  file,
  filename
}) => {
  const { error } = await supabaseClient.storage
    .from(bucket)
    .upload(filename, file);

  if (error) return null;

  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(filename);

  return data.publicUrl;
};
