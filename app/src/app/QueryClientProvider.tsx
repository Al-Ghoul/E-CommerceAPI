"use client";
import { AuthContext } from "@/lib/contexts";
import { QueryClient, QueryClientProvider as QCP } from "@tanstack/react-query";

export default function QueryClientProvider({
  children,
  isLoggedIn = false,
}: Readonly<{
  children: React.ReactNode;
  isLoggedIn: boolean;
}>) {
  const queryClient = new QueryClient();
  return (
    <QCP client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated: isLoggedIn }}>
        {children}
      </AuthContext.Provider>
    </QCP>
  );
}
