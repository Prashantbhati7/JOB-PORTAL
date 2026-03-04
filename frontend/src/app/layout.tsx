import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/context/appContext";


export const metadata: Metadata = {
  title: "EzHire",
  description: "To simplify the hiring and applying process.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <Navbar/>
        {children}
        </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
