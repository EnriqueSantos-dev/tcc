"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { createColumnHelper } from "@tanstack/react-table";
import { ExternalLinkIcon, UserXIcon } from "lucide-react";
import Link from "next/link";
import { ModuleWithUserAndDocumentsCount } from "../../types";

const columnHelper = createColumnHelper<ModuleWithUserAndDocumentsCount>();

export const columns = [
  columnHelper.accessor("name", {
    header: "Nome",
    maxSize: 150,
    cell: ({ row }) => {
      return (
        <Button asChild variant="link" className="px-0 py-0 text-sm font-bold">
          <Link href={`/admin/module/${row.original.id}`}>
            {row.getValue("name")}
            <ExternalLinkIcon className="mb-0.5 ml-2 size-4" />
          </Link>
        </Button>
      );
    }
  }),
  columnHelper.accessor("description", {
    header: "Descrição",
    cell: ({ row }) => {
      return (
        <p className="max-w-[150px] truncate text-sm">
          {row.getValue("description")}
        </p>
      );
    }
  }),
  columnHelper.accessor("documents", {
    header: "# Documentos",
    cell: ({ row }) => {
      return <p className="text-sm">{row.getValue("documents")}</p>;
    }
  }),
  columnHelper.accessor("user.email", {
    header: "Criado por",
    cell: ({ row }) => {
      const { user } = row.original;
      return (
        <p className="text-sm">
          {user ? (
            user.email
          ) : (
            <Tooltip>
              <TooltipTrigger>
                <UserXIcon className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                O usuário que criou este módulo não existe mais.
              </TooltipContent>
            </Tooltip>
          )}
        </p>
      );
    }
  }),
  columnHelper.accessor("createdAt", {
    header: "Criado em",
    cell: ({ row }) => {
      return (
        <p className="text-sm">
          {new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "medium"
          }).format(new Date(row.getValue("createdAt")))}
        </p>
      );
    }
  }),
  columnHelper.accessor("updatedAt", {
    header: "Atualizado em",
    cell: ({ row }) => {
      return (
        <p className="text-sm">
          {new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "medium"
          }).format(new Date(row.getValue("updatedAt")))}
        </p>
      );
    }
  })
];
