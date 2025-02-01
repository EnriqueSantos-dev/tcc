import { writeFile } from "node:fs/promises";
import path from "node:path";
import { UploadFileProvider } from "./types";

const isBuffer = (file: any): file is Buffer => {
  return file instanceof Buffer;
};

export const uploadFileToMemory: UploadFileProvider = async ({
  file,
  folder,
  filename
}) => {
  const folderToSave = path.join(process.cwd(), "/tmp", folder, filename);
  console.log("UPLOAD_FILE_TO_MEMORY", folderToSave);

  try {
    if (isBuffer(file)) {
      await writeFile(folderToSave, file);
      return folderToSave;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await writeFile(folderToSave, buffer);

    return folderToSave;
  } catch (error) {
    console.log("UPLOAD_FILE_TO_MEMORY_ERROR", error);
    return null;
  }
};
