import { UploadFile } from "./types";

export const uploadFile: UploadFile = async (
  uploadFileInput,
  uploadProvider
) => {
  try {
    return await uploadProvider(uploadFileInput);
  } catch (error) {
    console.log("UPLOAD_FILE_ERROR", error);
    return null;
  }
};
