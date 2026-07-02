import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { getNews } from "@/lib/data-server";
import { formatDate } from "@/lib/format";
import { SectionTitle } from "@/components/motion/section-reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-container";
import { CarImage } from "@/components/ui/car-image";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Tin tức về xe Honda, chương trình khuyến mãi và sự kiện tại Honda Tiến Đạt",
};

const categoryLabels: Record<string, string> = {
  "khuyen-mai": "Khuyến mãi",
  "ho-tro": "Hỗ trợ",
  "su-kien": "Sự kiện",
  "kinh-nghiem": "Kinh nghiệm",
  "phan-tich": "Phân tích",
};

const articles = getNews();

export default function TinTucPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle subtitle="Tin tức" title="Tin tức & Sự kiện" />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {articles.map((article) => (
            <StaggerItem key={article.slug}>
              <Link
                href={`/tin-tuc/${article.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[16/9] bg-charcoal-light">
                  <CarImage
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {categoryLabels[article.category] ?? article.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.date)}
                    </span>
                  </div>
                  <h2 className="font-bold text-charcoal group-hover:text-honda-red transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
