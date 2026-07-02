"use client";

import { usePathname } from "next/navigation";
import { SiteLayout } from "./site-layout";

export function ConditionalSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return <SiteLayout>{children}</SiteLayout>;
}
