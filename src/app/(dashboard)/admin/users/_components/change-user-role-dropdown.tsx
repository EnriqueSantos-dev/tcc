import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@/lib/db/schemas";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { changeUserRoleAction } from "../_actions";

type ChangeUserRoleDropdownProps = {
  userId: string;
  userRole: Role;
  roles: Role[];
  disabled?: boolean;
  onChangeRole: (userId: string, role: Role) => void;
};

export default function ChangeUserRoleDropdown({
  userId,
  userRole,
  roles,
  disabled,
  onChangeRole
}: ChangeUserRoleDropdownProps) {
  const [isPending, startTransaction] = useTransition();
  const { toast } = useToast();

  const handleChangeRole = (role: Role) => {
    startTransaction(async () => {
      onChangeRole(userId, role);
      const [_, error] = await changeUserRoleAction({ userId, role });

      if (error) {
        toast({
          title:
            error.code !== "INPUT_PARSE_ERROR"
              ? error?.message
              : "Erro ao alterar o papel do usuário",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Papel do usuário alterado com sucesso",
        variant: "success"
      });
    });
  };

  return (
    <Select
      value={userRole}
      onValueChange={handleChangeRole}
      disabled={disabled}
    >
      <div className="flex items-center gap-2">
        <SelectTrigger
          className="h-8 w-fit rounded-full text-sm font-medium"
          disabled={isPending}
        >
          <SelectValue />
        </SelectTrigger>
        {isPending && (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        )}
      </div>
      <SelectContent>
        {roles.map((role) => (
          <SelectItem key={role} value={role}>
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
