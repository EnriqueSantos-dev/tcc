"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { Table } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { useRef } from "react";
import CreateDocumentDialog from "./create-document-dialog";
import { DataTableMeta } from "./data-table";

export default function DataTableToolbar<TData>({
  table,
  canCreateDocument
}: {
  canCreateDocument: boolean;
  table: Table<TData>;
}) {
  const { queryParams, searchParams } = useRouterStuff();
  const inputRef = useRef<HTMLInputElement>(null);

  const onSearch = () => {
    if (!inputRef.current) return;

    queryParams({
      set: {
        search: inputRef.current.value.trim(),
        page: "1"
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        defaultValue={searchParams.get("search") ?? ""}
        ref={inputRef}
        placeholder="Pesquise pelo nome do documento..."
        className="max-w-md"
      />
      <Button size="sm" variant="secondary" className="h-9" onClick={onSearch}>
        <SearchIcon className="mr-2 size-4" />
        Pesquisar
      </Button>
      <CreateDocumentDialog
        canCreate={canCreateDocument}
        onOptimisticCreate={() => {}}
        moduleId={(table.options.meta as DataTableMeta)?.module.id}
        moduleOwnerId={(table.options.meta as DataTableMeta)?.module.ownerId}
      />
    </div>
  );
}
