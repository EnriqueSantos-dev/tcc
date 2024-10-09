import { createClient } from "@supabase/supabase-js";
import { env } from "./env.mjs";

export const supabaseClient = createClient(
  env.SUPABASE_API_URL,
  env.SUPABASE_SECRET_KEY
);

/**
 * Uploads a file to a specified Supabase storage bucket and returns the public URL of the uploaded file.
 *
 * @param {Object} params - The parameters for the upload.
 * @param {string} params.bucket - The name of the Supabase storage bucket.
 * @param {File | Buffer} params.file - The file to be uploaded.
 * @param {string} params.filename - The name to be used for the uploaded file.
 * @returns {Promise<string | null>} - A promise that resolves to the public URL of the uploaded file, or null if the upload failed.
 */
export async function uploadToSupabase({
  bucket,
  file,
  filename
}: {
  bucket: string;
  file: File | Buffer;
  filename: string;
}): Promise<string | null> {
  const { error } = await supabaseClient.storage
    .from(bucket)
    .upload(filename, file);

  if (error) return null;

  const { data } = supabaseClient.storage.from(bucket).getPublicUrl(filename);

  return data.publicUrl;
}
