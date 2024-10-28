import { type ClassValue, clsx } from "clsx";
import path from "path";
import { twMerge } from "tailwind-merge";
import { ROLES, User } from "./db/schemas";
import { ClerkAPIError } from "@clerk/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getFileExtension = (file: File) => path.extname(file.name);

export const formatFileSize = (bytes: number) => {
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
};

export const isAdminUser = (user: User) => user.role === ROLES.ADMIN;

export const getUserInitialsLetters = (user: User) => {
  return `${user.firstName?.at(0)}${user.lastName?.at(0)}`.toUpperCase();
};

export const isClerkApiError = (err: any): err is { errors: ClerkAPIError[] } =>
  "clerkError" in err;
