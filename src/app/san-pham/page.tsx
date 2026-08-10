import type { Metadata } from "next";
import { getCarThumbnail, getCars, getPageContent } from "@/lib/data-server";
import { CarCard } from "@/components/cars/car-card";
import { SectionTitle } from "@/components/motion/section-reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-container";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Danh sách các dòng xe Honda tại Honda Tiến Đạt Hà Nội",
};

export default async function SanPhamPage() {
  const products = (await getPageContent()).products;
  const cars = await getCars();

  const thumbnails = Object.fromEntries(
    await Promise.all(
      cars.map(async (car) => [car.slug, await getCarThumbnail(car.slug)])
    )
  );

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle subtitle={products.subtitle} title={products.title} />
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {products.description}
        </p>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <StaggerItem key={car.slug}>
              <CarCard car={car} thumbnail={thumbnails[car.slug]} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
