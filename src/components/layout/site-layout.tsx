"use client";

import { Header } from "./header";
import { Footer } from "./footer";
import { FloatingContact } from "./floating-contact";
import { PageLoader } from "./page-loader";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLoader>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact />
    </PageLoader>
  );
}
