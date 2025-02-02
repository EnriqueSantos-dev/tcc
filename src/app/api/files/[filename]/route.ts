import { getFileContentType, getFileExtension } from "@/lib/utils";
import { readFileSync } from "fs";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const filename = (await params).filename;
  console.log("GET_FILE", filename);

  if (!filename) {
    return new Response("File not found", { status: 404 });
  }

  try {
    const path = `${process.cwd()}/tmp/documents/files/${filename}`;

    const buffer = readFileSync(path);

    if (!buffer) {
      return new Response("File not found", { status: 404 });
    }

    const blob = new Blob([buffer]);

    const fileExtension = getFileExtension(filename);
    const contentType = getFileContentType(fileExtension);
    const blobSize = blob.size;

    return new Response(blob, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": blobSize.toString(),
        "Content-Disposition": `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.log("GET_FILE_ERROR", error);
    return new Response("File not found", { status: 404 });
  }
}
