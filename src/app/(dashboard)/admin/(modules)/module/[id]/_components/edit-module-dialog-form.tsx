"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PencilIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { editModuleSchema } from "../../../validation";
import { editModule } from "../actions";

type EditModuleDialogFormProps = {
  canEditModule: boolean;
  module: {
    id: string;
    name: string;
    description: string;
    ownerId: string;
  };
};

export default function EditModuleDialogForm({
  canEditModule,
  module
}: EditModuleDialogFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isPending, execute } = useServerAction(editModule);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof editModuleSchema>>({
    defaultValues: {
      id: module.id,
      name: module.name,
      description: module.description
    },
    resolver: zodResolver(editModuleSchema)
  });

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen && isPending) return;
    if (!isOpen) form.reset();
    setIsOpen(isOpen);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const [_, error] = await execute(values);

    if (error) {
      toast({
        title: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "O módulo foi editado com sucesso.",
      variant: "success"
    });

    form.reset({
      name: values.name,
      description: values.description
    });
    setIsOpen(false);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger
        disabled={!canEditModule}
        className={buttonVariants({ size: "sm" })}
      >
        <PencilIcon className="size-4 shrink-0 md:mr-2" />
        <span className="hidden md:inline">Editar</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar módulo</DialogTitle>
          <DialogDescription>
            Editando o módulo &ldquo;{module.name}&ldquo;.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="space-y-4 pb-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Ex: Matrícula"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="max-h-20 resize-none"
                        placeholder="Módulo que contém documentos referente a matrículas."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending || !canEditModule}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
