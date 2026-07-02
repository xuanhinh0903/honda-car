import { getFeaturedCars } from "@/lib/data";
import { SectionTitle } from "@/components/motion/section-reveal";
import {
  StaggerContainer,
  StaggerItem,
} from "@/components/motion/stagger-container";
import { CarCard } from "@/components/cars/car-card";

const cars = getFeaturedCars();

export function CarShowcase() {
  return (
    <section className="py-20 bg-warm-white">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Sản phẩm"
          title="Các dòng xe Honda Tiến Đạt"
        />

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <StaggerItem key={car.slug}>
              <CarCard car={car} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
