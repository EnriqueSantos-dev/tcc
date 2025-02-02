import { env } from "../env.mjs";
import { UploadFileProvider } from "./types";
import { uploadFileToMemory } from "./upload-to-memory";
import { uploadToSupabase } from "./upload-to-supabase";

export const uploadFileFactory: () => UploadFileProvider = () => {
  console.log("SAVE_FILE_IN_CLOUD", env.SAVE_FILE_IN_CLOUD);

  if (env.SAVE_FILE_IN_CLOUD) {
    return uploadToSupabase;
  }
  return uploadFileToMemory;
};
