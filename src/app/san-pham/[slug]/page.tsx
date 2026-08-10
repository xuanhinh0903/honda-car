import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Car, Phone } from "lucide-react";
import {
  getAllCarSlugs,
  getCarBySlug,
  getCarThumbnail,
  getCars,
} from "@/lib/data-server";
import { formatVND, formatPhone } from "@/lib/format";
import { getDealership } from "@/lib/data-server";
import { CarGallery } from "@/components/cars/car-gallery";
import { CarSpecsPanel } from "@/components/cars/car-specs";
import { CarCard } from "@/components/cars/car-card";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCarSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) return { title: "Không tìm thấy" };

  return {
    title: car.name,
    description: car.description,
    openGraph: {
      title: `${car.name} | Honda Tiến Đạt`,
      description: car.description,
      images: [car.heroImage],
    },
  };
}

export default async function CarDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const dealership = getDealership();
  const car = getCarBySlug(slug);
  if (!car) notFound();

  const relatedCars = getCars()
    .filter((c) => c.slug !== slug && c.category === car.category)
    .slice(0, 3);

  const relatedThumbnails = Object.fromEntries(
    relatedCars.map((c) => [c.slug, getCarThumbnail(c.slug)])
  );

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="mb-6">
            <Badge variant="secondary">{car.category}</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-2">
            {car.name}
          </h1>
          <p className="text-muted-foreground text-lg mb-2">{car.tagline}</p>
          <p className="text-2xl font-bold text-gold-accent">
            Từ: {formatVND(car.priceFrom)}
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-10 mt-10">
          <FadeIn>
            <CarGallery images={car.gallery} alt={car.name} />
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {car.description}
            </p>
            <CarSpecsPanel
              specs={car.specs}
              variants={car.variants}
              highlights={car.highlights}
            />
            <div className="flex flex-wrap gap-3 mt-8">
              <Link href="/dang-ky-lai-thu">
                <Button className="bg-honda-red hover:bg-honda-red-hover text-white border-0">
                  <Car className="w-4 h-4" />
                  Đăng ký lái thử
                </Button>
              </Link>
              <a href={`tel:${dealership.hotline}`}>
                <Button variant="outline">
                  <Phone className="w-4 h-4" />
                  {formatPhone(dealership.hotline)}
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>

        {relatedCars.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-charcoal mb-8">
              Xe cùng phân khúc
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCars.map((related) => (
                <CarCard
                  key={related.slug}
                  car={related}
                  thumbnail={relatedThumbnails[related.slug]}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
