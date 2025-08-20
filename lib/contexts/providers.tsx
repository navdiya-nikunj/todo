"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "./auth-context"
import { RealmProvider } from "./realm-context"
import { UIProvider } from "./ui-context"

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <AuthProvider>
        <RealmProvider>{children}</RealmProvider>
      </AuthProvider>
    </UIProvider>
  )
}
