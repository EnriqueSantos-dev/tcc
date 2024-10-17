import Chat from "@/components/chat";
import Header from "@/components/header";

export default function Page() {
  return (
    <main className="relative grid h-full max-h-dvh grid-rows-[auto_1fr] overflow-hidden bg-neutral-900">
      <Header />
      <Chat />
    </main>
  );
}
