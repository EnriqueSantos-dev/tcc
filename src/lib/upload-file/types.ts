export type UploadFileInput = {
  folder: string;
  file: File | Buffer;
  filename: string;
};

export type UploadFileProvider = (
  input: UploadFileInput
) => Promise<string | null>;

export type UploadFile = (
  uploadFileInput: UploadFileInput,
  uploadFileProvider: UploadFileProvider
) => Promise<string | null>;
