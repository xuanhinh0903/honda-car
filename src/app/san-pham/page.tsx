import type { Metadata } from "next";
import { getCars } from "@/lib/data-server";
import { CarCard } from "@/components/cars/car-card";
import { SectionTitle } from "@/components/motion/section-reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-container";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Danh sách các dòng xe Honda tại Honda Tiến Đạt Hà Nội",
};

const cars = getCars();

export default function SanPhamPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Sản phẩm"
          title="Các dòng xe Honda"
        />
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Khám phá đầy đủ các dòng xe Honda chính hãng với giá tốt nhất tại Hà Nội
        </p>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <StaggerItem key={car.slug}>
              <CarCard car={car} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
