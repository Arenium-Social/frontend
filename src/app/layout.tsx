import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import DynamicProvider from "@/lib/blockchain/dynamic-provider";
import NavBar from "@/components/navbar";
import { TransactionProvider } from "@/lib/transaction-provider";
import NotificationList from "@/components/notificationlist";

export const metadata: Metadata = {
  title: "Prediction Market",
  description: "A decentralized prediction market powered by UMA and Uniswap V3",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <DynamicProvider>
            <TransactionProvider>
              <div className="relative flex min-h-screen flex-col">
                <NavBar />
                <main className="flex-1 container mx-auto px-4 py-8 mt-16">
                  {children}
                </main>
              </div>
              <NotificationList />
            </TransactionProvider>
          </DynamicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
