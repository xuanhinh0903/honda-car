import type { Metadata } from "next";
import { getDeliveryImages } from "@/lib/data-server";
import { SectionTitle } from "@/components/motion/section-reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-container";
import { CarImage } from "@/components/ui/car-image";

export const metadata: Metadata = {
  title: "Bàn giao xe",
  description: "Hình ảnh lễ bàn giao xe tại Honda Tiến Đạt",
};

const images = getDeliveryImages();

export default function BanGiaoXePage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Khách hàng"
          title="Bàn giao xe"
        />
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Những khoảnh khắc hạnh phúc khi khách hàng nhận xe tại Honda Tiến Đạt
        </p>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <StaggerItem key={image.src}>
              <div className="group rounded-2xl overflow-hidden shadow-sm border border-border/50 hover:shadow-lg transition-shadow">
                <div className="relative aspect-[4/3] bg-charcoal-light">
                  <CarImage
                    src={image.src}
                    alt={image.caption}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="p-4 text-sm text-muted-foreground">{image.caption}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
