"use client";

import { ReactNode } from "react";
import { ReactQueryProvider } from "@/providers/query-client";

export function AppProviders({ children }: { children: ReactNode }) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
