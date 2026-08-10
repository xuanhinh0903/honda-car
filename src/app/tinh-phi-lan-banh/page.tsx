import type { Metadata } from "next";
import { getCars, getDealership, getPageContent } from "@/lib/data-server";
import { SectionTitle } from "@/components/motion/section-reveal";
import { RollingCostCalculator } from "@/components/forms/rolling-cost-calculator";

export const metadata: Metadata = {
  title: "Tính phí lăn bánh",
  description: "Công cụ tính phí lăn bánh xe Honda tại Hà Nội",
};

export default function TinhPhiLanBanhPage() {
  const rollingCost = getPageContent().rollingCost;
  const cars = getCars();
  const dealership = getDealership();

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle subtitle={rollingCost.subtitle} title={rollingCost.title} />
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {rollingCost.description}
        </p>
        <RollingCostCalculator cars={cars} dealership={dealership} />
      </div>
    </div>
  );
}
