"use client";

import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlusIcon, Loader2, PencilIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { editModuleSchema } from "../../../validation";
import { editModule } from "../../actions";

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
      ownerId: module.ownerId,
      name: module.name,
      description: module.description
    },
    resolver: zodResolver(editModuleSchema)
  });

  const onOpenChange = (open: boolean) => {
    if (!isOpen) form.reset();
    setIsOpen(open);
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

    form.reset();
    setIsOpen(false);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" disabled={!canEditModule}>
          <PencilIcon className="mr-2 size-4 shrink-0" />
          Editar
        </Button>
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
