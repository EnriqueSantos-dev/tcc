import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ROLES, ROLES_INFO, User } from "@/lib/db/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon, Loader2, PlusCircleIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createUserAction } from "../_actions";
import { createUserSchema } from "../validations";

export default function CreateUserDialog({
  canCreate,
  onCreateUser
}: {
  canCreate: boolean;
  onCreateUser: (
    userData: Pick<User, "email" | "firstName" | "lastName" | "role">
  ) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransaction] = useTransition();
  const form = useForm<z.infer<typeof createUserSchema>>({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      role: ROLES.BASIC
    },
    resolver: zodResolver(createUserSchema)
  });

  const { toast } = useToast();

  const handleOpenChange = (isOpen: boolean) => {
    if (isPending) return;

    if (!isOpen) form.reset();
    setIsOpen(isOpen);
  };

  const handleSubmit = form.handleSubmit((data) => {
    startTransaction(async () => {
      onCreateUser(data);
      const [_, err] = await createUserAction(data);

      if (err) {
        toast({
          title: err.message,
          variant: "destructive"
        });
      }

      setIsOpen(false);
    });
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger disabled={!canCreate} asChild>
        <Button>
          <PlusCircleIcon className="mr-1 size-4" />
          Criar usuário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogHeader>
            <DialogTitle>Criar usuário</DialogTitle>
            <DialogDescription>
              Preencha o formulário para criar um novo usuário.
            </DialogDescription>
          </DialogHeader>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    💡Dica: Após a criação do usuário não será possível
                    visualizar a senha.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel>Função</FormLabel>
                    <Tooltip delayDuration={150}>
                      <TooltipTrigger className="">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-2"
                        >
                          <InfoIcon className="size-4" />
                          Entenda as funções
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="space-y-4 p-4"
                        showArrow
                      >
                        {Object.entries(ROLES_INFO).map(([role, info]) => (
                          <div key={role}>
                            <h3 className="text-sm font-bold">{role}</h3>
                            <ul className="list-disc pl-6">
                              {info.abilities.map((ability) => (
                                <li key={ability}>{ability}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[ROLES.BASIC, ROLES.MANAGE].map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Criando
                  usuário...
                </>
              ) : (
                "Criar usuário"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
