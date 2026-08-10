import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/format";
import { SectionTitle } from "@/components/motion/section-reveal";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/stagger-container";
import { CarImage } from "@/components/ui/car-image";
import { Badge } from "@/components/ui/badge";
import type { NewsIndexItem, SectionHeading } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  "khuyen-mai": "Khuyến mãi",
  "ho-tro": "Hỗ trợ",
  "su-kien": "Sự kiện",
  "kinh-nghiem": "Kinh nghiệm",
  "phan-tich": "Phân tích",
};

export function NewsPreview({
  news,
  heading,
}: {
  news: NewsIndexItem[];
  heading: SectionHeading;
}) {
  return (
    <section className="py-20 bg-warm-white">
      <div className="container mx-auto px-4">
        <SectionTitle subtitle={heading.subtitle} title={heading.title ?? "Tin tức & Sự kiện"} />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {news.map((article) => (
            <StaggerItem key={article.slug}>
              <Link
                href={`/tin-tuc/${article.slug}`}
                className="group flex gap-4 bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-lg transition-all"
              >
                <div className="relative w-36 sm:w-44 shrink-0 aspect-square">
                  <CarImage
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="176px"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="py-4 pr-4 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {categoryLabels[article.category] ?? article.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(article.date)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-charcoal line-clamp-2 group-hover:text-honda-red transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {article.excerpt}
                  </p>
                  <span className="mt-2 flex items-center gap-1 text-honda-red text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Đọc thêm <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="text-center mt-10">
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 text-honda-red font-semibold hover:gap-3 transition-all"
          >
            Xem tất cả tin tức
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
