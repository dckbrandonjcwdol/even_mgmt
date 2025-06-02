import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Bounce, ToastContainer } from "react-toastify";
import Navbar from "@/components/navbar";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/context/ThemeContext";
import { auth } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_BRAND} Event Management`,
  description: `${process.env.NEXT_PUBLIC_BRAND} Event Management`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  console.log("Session (server):", session); // Ini akan log di server console

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <SessionProvider session={session}> {/* ✅ tambahkan session prop */}
            <Navbar />
            {children}
          </SessionProvider>
        </ThemeProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          draggable
          theme="dark"
          closeOnClick
          transition={Bounce}
        />
      </body>
    </html>
  );
}
