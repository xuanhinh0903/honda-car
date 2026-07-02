import { HeroSection } from "@/components/sections/hero-section";
import { DealerIntro } from "@/components/sections/dealer-intro";
import { CarShowcase } from "@/components/sections/car-showcase";
import { PurchaseProcess } from "@/components/sections/purchase-process";
import { VideoSection } from "@/components/sections/video-section";
import { NewsPreview } from "@/components/sections/news-preview";
import { CtaBanner } from "@/components/sections/cta-banner";

export default function Home() {
  return (
    <>
      <HeroSection />
      <DealerIntro />
      <CarShowcase />
      <PurchaseProcess />
      <VideoSection />
      <NewsPreview />
      <CtaBanner />
    </>
  );
}
