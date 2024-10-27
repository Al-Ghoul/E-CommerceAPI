"use client";
import { AuthContext } from "@/lib/contexts";
import { QueryClient, QueryClientProvider as QCP } from "@tanstack/react-query";
import { Header } from "@/components/ui/core/header";
import { SignUpModal } from "@/components/ui/modal";
import { useState } from "react";

const queryClient = new QueryClient();

export default function QueryClientProvider({
  children,
  isLoggedIn,
}: Readonly<{
  children: React.ReactNode;
  isLoggedIn: boolean;
}>) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated: isLoggedIn }}>
      <QCP client={queryClient}>
        <Header onSignUpClick={() => setIsModalOpen(true)} />
        <SignUpModal isOpen={isModalOpen} setIsOpenFN={setIsModalOpen} />
        {children}
      </QCP>
    </AuthContext.Provider>
  );
}
