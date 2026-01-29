'use client';
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0d1117]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
