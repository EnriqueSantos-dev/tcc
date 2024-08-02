import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/session";
import { signOut } from "./_actions";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main>
      <Card>
        <CardTitle>Welcome, {user.email}</CardTitle>
        <CardContent>
          <form action={signOut}>
            <Button variant="ghost">Sair</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
