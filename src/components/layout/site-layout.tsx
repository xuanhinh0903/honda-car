"use client";

import { Header } from "./header";
import { Footer } from "./footer";
import { FloatingContact } from "./floating-contact";
import { PageLoader } from "./page-loader";
import type {
  CarIndexItem,
  DealershipInfo,
  NavItem,
  NewsIndexItem,
} from "@/lib/types";

export function SiteLayout({
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
  return (
    <PageLoader dealership={dealership}>
      <Header dealership={dealership} navigation={navigation} cars={cars} />
      <main className="flex-1">{children}</main>
      <Footer dealership={dealership} cars={cars} news={news} />
      <FloatingContact dealership={dealership} />
    </PageLoader>
  );
}
