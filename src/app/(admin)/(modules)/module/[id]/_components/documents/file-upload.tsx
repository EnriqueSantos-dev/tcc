import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { ComponentProps, useMemo } from "react";
import { DropzoneProps, useDropzone } from "react-dropzone";

const EXTENSIONS_SVG_URL = {
  pdf: "/pdf.svg",
  md: "/md.svg",
  txt: "/txt.svg"
};

const getFileExtension = (file: File) => {
  return file.name.split(".").pop()?.toLowerCase();
};

function formatFileSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let unitIndex = 0;
  let size = bytes;

  // Determina a unidade apropriada
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  // Formata o número usando o Intl.NumberFormat
  const formattedSize = new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 2
  }).format(size);

  return `${formattedSize} ${units[unitIndex]}`;
}

type FileUploadProps = DropzoneProps & {
  value?: File | FileList;
  onRemoveFile: () => void;
  helperTextDescription: string;
};

export default function FileUpload({
  onRemoveFile,
  helperTextDescription,
  ...props
}: FileUploadProps) {
  const {
    getInputProps,
    getRootProps,
    acceptedFiles,
    isDragActive,
    open,
    isFocused
  } = useDropzone({
    ...props
  });

  const currentFile = useMemo(() => acceptedFiles[0], [acceptedFiles]);

  return (
    <div className="h-[200px] w-full">
      <div
        {...getRootProps()}
        className={cn(
          "flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors",
          (isDragActive || isFocused) && "border-violet-300 outline-none"
        )}
      >
        <input name="file" {...getInputProps()} />
        {currentFile ? (
          <div className="relative grid h-4/5 w-3/5 grid-rows-[1fr_auto] rounded-lg bg-muted-foreground p-4">
            <Button
              type="reset"
              size="icon"
              className="absolute right-2 top-2 size-4 rounded-full"
              onClick={onRemoveFile}
            >
              <X className="size-3" />
            </Button>
            <div className="grid place-items-center">
              <Image
                src={
                  EXTENSIONS_SVG_URL[
                    (getFileExtension(
                      currentFile
                    ) as keyof typeof EXTENSIONS_SVG_URL) ?? "txt"
                  ]
                }
                alt="file extension"
                width={40}
                height={40}
              />
            </div>
            <div className="grid">
              <p className="max-w-full truncate text-xs text-foreground">
                <b>{currentFile.name}</b>
              </p>
              <span className="text-[10px] text-xs font-bold text-muted">
                {formatFileSize(currentFile.size)}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-1 items-center">
              {isDragActive ? (
                <p className="text-sm">Solte o arquivo aqui!</p>
              ) : (
                <p className="text-sm">
                  Arraste e solte um arquivo aqui ou{" "}
                  <Button
                    type="button"
                    aria-label="abrir seletor de arquivos"
                    variant="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      open();
                    }}
                    className="inline p-0 text-blue-400"
                  >
                    navegue
                  </Button>
                </p>
              )}
            </div>
            <div className="text-center text-xs text-muted-foreground *:leading-relaxed">
              <p>{helperTextDescription}</p>
              <span>
                O tamanho máximo do arquivo é de{" "}
                <b>{formatFileSize(props.maxSize ?? 0)}</b>.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
