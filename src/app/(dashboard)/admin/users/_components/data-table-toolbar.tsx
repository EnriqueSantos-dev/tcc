"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { Table } from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { useRef } from "react";
import CreateUserDialog from "./create-user-dialog";
import { DataTableMeta } from "./data-table";

export default function DataTableToolbar<TData>({
  table,
  canCreateUser
}: {
  table: Table<TData>;
  canCreateUser: boolean;
}) {
  const { queryParams, searchParams } = useRouterStuff();
  const inputRef = useRef<HTMLInputElement>(null);

  const tableMeta = table.options.meta as DataTableMeta;

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
        <SearchIcon className="mr-1 size-4" />
        Pesquisar
      </Button>
      <CreateUserDialog
        canCreate={canCreateUser}
        onCreateUser={tableMeta.createUser}
      />
    </div>
  );
}
