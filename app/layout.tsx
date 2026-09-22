import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://unifin-financas.mr-fossori.chatgpt.site"),
  title: "UNIFIN | Finanças para universitários",
  description: "Organize os gastos da faculdade e do dia a dia de forma simples. Conheça o UNIFIN, uma plataforma financeira pensada para universitários.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { title: "UNIFIN | Finanças para universitários", description: "Uma visão simples dos gastos da faculdade e do dia a dia.", url: "/", siteName: "UNIFIN", locale: "pt_BR", type: "website", images: [{ url: "/og.png", width: 1536, height: 1024, alt: "UNIFIN — Finanças para universitários" }] },
  twitter: { card: "summary_large_image", title: "UNIFIN | Finanças para universitários", description: "Uma visão simples dos gastos da faculdade e do dia a dia.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
