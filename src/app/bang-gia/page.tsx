import type { Metadata } from "next";
import { getPricing } from "@/lib/data-server";
import { formatDate } from "@/lib/format";
import { PriceTable } from "@/components/cars/price-table";
import { SectionTitle } from "@/components/motion/section-reveal";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Bảng giá xe",
  description: "Bảng giá xe Honda mới nhất tại Honda Tiến Đạt Hà Nội",
};

export default async function BangGiaPage() {
  const pricing = await getPricing();

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle subtitle="Giá xe" title={pricing.title} />
        <FadeIn>
          <p className="text-center text-muted-foreground mb-2">
            Cập nhật: {formatDate(pricing.updatedAt)}
          </p>
          <p className="text-center text-sm text-muted-foreground mb-12">
            Giá niêm yết chưa bao gồm chi phí lăn bánh. Liên hệ hotline để nhận ưu đãi tốt nhất.
          </p>
        </FadeIn>
        <PriceTable cars={pricing.cars} />
      </div>
    </div>
  );
}
