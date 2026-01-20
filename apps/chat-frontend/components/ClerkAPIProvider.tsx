"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { setTokenProvider } from "@/utils/api";

export function ClerkAPIProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenProvider(() => getToken());
  }, [getToken]);

  return <>{children}</>;
}
