import { Providers } from "@/components/providers";
import { ptBR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Chatboot SIGAA",
    template: "%s | Chatbot SIGAA"
  },
  description:
    "Um chatbot para auxiliar estudantes da UFAL com a ferramenta SIGAA."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      // @ts-ignore
      localization={ptBR}
      appearance={{
        baseTheme: dark
      }}
    >
      <html lang="pt-BR" className="dark">
        <body className={`${inter.className} h-dvh overflow-clip`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
