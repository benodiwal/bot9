import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google";

import { cn } from "~/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Bot9Ai",
  description: "",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          fontSans.variable,
        )}
      >
        {children}
      </body>
    </html>
  );
}
