import { useState } from "react";
import { z } from "zod";
import { toast } from "./use-toast";

const isUrl = (path: string) => z.string().url().safeParse(path).success;

export function useDownloadFile() {
  const [isLoading, setIsLoading] = useState(false);

  const downloadFile = async (path: string) => {
    if (isUrl(path)) {
      const a = Object.assign(document.createElement("a"), {
        href: path,
        download: path,
        target: "_blank"
      });
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/files/${path}`);

      if (!response.ok) {
        throw new Error("Error downloading file");
      }
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: path
      });
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Não foi possível baixar o arquivo. Tente novamente mais tarde."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { downloadFile, isLoading };
}
