import type { Metadata } from "next";
import "./globals.css";
import { robotoRegular } from "./fonts";
import { Layout } from "@/components";

export const metadata: Metadata = {
  title: "Dungeon Manager",
  description: "Менеджер опыта персонажей для Dungeon Мастера",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={robotoRegular.className}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}
