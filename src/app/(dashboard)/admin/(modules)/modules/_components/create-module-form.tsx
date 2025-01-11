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
import { CirclePlusIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useServerAction } from "zsa-react";
import { createModule } from "../../actions";
import { createModuleSchema } from "../../validation";

export default function CreateModuleForm({
  enabledToCreate
}: {
  enabledToCreate: boolean;
}) {
  const { isPending, execute } = useServerAction(createModule);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createModuleSchema>>({
    defaultValues: {
      name: "",
      description: ""
    },
    resolver: zodResolver(createModuleSchema)
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const [_, error] = await execute(values);

    if (error) {
      toast({
        title: error.message,
        variant: "destructive"
      });
      return;
    }
    form.reset();
  });

  return (
    <Dialog
      onOpenChange={(isOpen) => {
        if (!isOpen) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-9">
          <CirclePlusIcon className="mr-1 size-4" /> Criar módulo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar módulo</DialogTitle>
          <DialogDescription>
            Crie um novo módulo para o sistema.
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
              <Button type="submit" disabled={isPending || !enabledToCreate}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Criando módulo...
                  </>
                ) : (
                  "Criar módulo"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
