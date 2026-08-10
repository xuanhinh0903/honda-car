"use client";

import { usePathname } from "next/navigation";
import { SiteLayout } from "./site-layout";
import type {
  CarIndexItem,
  DealershipInfo,
  NavItem,
  NewsIndexItem,
} from "@/lib/types";

export function ConditionalSiteLayout({
  children,
  dealership,
  navigation,
  cars,
  news,
}: {
  children: React.ReactNode;
  dealership: DealershipInfo;
  navigation: NavItem[];
  cars: CarIndexItem[];
  news: NewsIndexItem[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <SiteLayout
      dealership={dealership}
      navigation={navigation}
      cars={cars}
      news={news}
    >
      {children}
    </SiteLayout>
  );
}
