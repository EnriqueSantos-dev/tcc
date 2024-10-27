"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { FormEvent, useState } from "react";
import { useServerAction } from "zsa-react";
import { deleteModule } from "../actions";

export default function DeleteModuleDialog({
  moduleId,
  canEditModule
}: {
  moduleId: string;
  canEditModule: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { execute, isPending } = useServerAction(deleteModule);
  const { toast } = useToast();

  const onOpenChange = (isOpen: boolean) => {
    if (isOpen && isPending) return;
    setIsOpen(isOpen);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const [_, error] = await execute({ id: moduleId });

    if (error) {
      setIsOpen(false);
      toast({
        variant: "destructive",
        title: error.message
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" disabled={!canEditModule}>
          <Trash2Icon className="size-4 shrink-0 md:mr-1" />
          <span className="hidden md:inline">Deletar</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={onSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja deletar este módulo?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não poderá ser desfeita. Todos os documentos associados
              a este módulo também serão deletados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-6">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <Button type="submit">
              {isPending ? (
                <>
                  <Loader2Icon className="mr-2 size-5 animate-spin" />
                  Deletando...
                </>
              ) : (
                "Confirmar"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
