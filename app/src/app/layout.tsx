import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryClientProvider from "./QueryClientProvider";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/components/ui/core/footer";
import { VerifyAccessToken } from "@/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "E-Commerce Store",
  description: "E-Commerce is a store where you can buy products online.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const accessToken = cookies().get("access_token");
  const isAuthenticated = accessToken !== undefined;
  let tokenData, userId;
  try {
    tokenData = await VerifyAccessToken(accessToken?.value);
    /* eslint @typescript-eslint/no-non-null-asserted-optional-chain: off */
    userId = tokenData.payload.sub?.split("|")[1]!;
  } catch { }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="flex-1">
          <QueryClientProvider userData={{ isAuthenticated, userId }}>
            {children}
          </QueryClientProvider>
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
