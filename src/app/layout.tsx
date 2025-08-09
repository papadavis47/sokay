import { Provider } from "@/components/ui/provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/main.css";
const inter = Inter({
  variable: "--inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sokay",
  description: "an application to improve eating habits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
