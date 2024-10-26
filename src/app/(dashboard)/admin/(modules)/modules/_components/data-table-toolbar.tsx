"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouterStuff } from "@/hooks/use-router-stuff";
import { SearchIcon } from "lucide-react";
import { useRef } from "react";
import CreateModuleForm from "./create-module-form";

export default function DataTableToolbar({
  canCreateModules
}: {
  canCreateModules: boolean;
}) {
  const { queryParams } = useRouterStuff();
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
        ref={inputRef}
        placeholder="Pesquise pelo nome do módulo..."
        className="max-w-md"
      />
      <Button size="sm" variant="secondary" className="h-9" onClick={onSearch}>
        <SearchIcon className="mr-2 size-4" />
        Pesquisar
      </Button>
      <CreateModuleForm enabledToCreate={canCreateModules} />
    </div>
  );
}
