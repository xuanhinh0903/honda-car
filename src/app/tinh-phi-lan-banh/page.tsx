import type { Metadata } from "next";
import { SectionTitle } from "@/components/motion/section-reveal";
import { RollingCostCalculator } from "@/components/forms/rolling-cost-calculator";

export const metadata: Metadata = {
  title: "Tính phí lăn bánh",
  description: "Công cụ tính phí lăn bánh xe Honda tại Hà Nội",
};

export default function TinhPhiLanBanhPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Công cụ"
          title="Tính phí lăn bánh"
        />
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Ước tính tổng chi phí lăn bánh bao gồm thuế, bảo hiểm và các khoản phí khác
        </p>
        <RollingCostCalculator />
      </div>
    </div>
  );
}
