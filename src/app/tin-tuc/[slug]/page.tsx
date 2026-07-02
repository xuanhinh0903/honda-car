import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { getAllNewsSlugs, getNewsBySlug } from "@/lib/data-server";
import { formatDate } from "@/lib/format";
import { CarImage } from "@/components/ui/car-image";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";

const categoryLabels: Record<string, string> = {
  "khuyen-mai": "Khuyến mãi",
  "ho-tro": "Hỗ trợ",
  "su-kien": "Sự kiện",
  "kinh-nghiem": "Kinh nghiệm",
  "phan-tich": "Phân tích",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) return { title: "Không tìm thấy" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);
  if (!article) notFound();

  return (
    <div className="pt-24 pb-16">
      <article className="container mx-auto px-4 max-w-3xl">
        <FadeIn>
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-honda-red transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại tin tức
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">
              {categoryLabels[article.category] ?? article.category}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(article.date)}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {article.author}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-6 leading-tight">
            {article.title}
          </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 bg-charcoal-light">
            <CarImage
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="prose prose-neutral max-w-none">
            {article.content.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </FadeIn>
      </article>
    </div>
  );
}
