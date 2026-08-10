import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ConditionalSiteLayout } from "@/components/layout/conditional-site-layout";
import { StaticSplash } from "@/components/layout/static-splash";
import { LocalBusinessJsonLd } from "@/components/seo/json-ld";
import {
  getCars,
  getDealership,
  getNavigation,
  getNews,
} from "@/lib/data-server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

export async function generateMetadata(): Promise<Metadata> {
  const dealership = await getDealership();

  return {
    metadataBase: new URL("https://hondatiendat.vn"),
    title: {
      default: `${dealership.name} | Giá Xe Honda Tốt Nhất Hà Nội`,
      template: `%s | ${dealership.name}`,
    },
    description: `${dealership.tagline}. Hotline: ${dealership.hotlineDisplay}. Địa chỉ: ${dealership.address}`,
    keywords: [
      "Honda",
      "ô tô Honda",
      "Honda Hà Nội",
      "Honda Tiến Đạt",
      "giá xe Honda",
      "đại lý Honda",
    ],
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: dealership.name,
      title: `${dealership.name} | Giá Xe Honda Tốt Nhất Hà Nội`,
      description: dealership.tagline,
      images: ["/logo.png"],
    },
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
      apple: "/apple-icon.png",
    },
  };
}

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dealership = await getDealership();
  const navigation = await getNavigation();
  const cars = await getCars();
  const news = (await getNews()).slice(0, 5);

  return (
    <html
      lang="vi"
      className={`${inter.variable} ${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Script src="/splash-init.js" strategy="beforeInteractive" />
        <StaticSplash dealership={dealership} />
        <LocalBusinessJsonLd />
        <ConditionalSiteLayout
          dealership={dealership}
          navigation={navigation}
          cars={cars}
          news={news}
        >
          {children}
        </ConditionalSiteLayout>
      </body>
    </html>
  );
}
