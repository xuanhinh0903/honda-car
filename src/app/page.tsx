import { HeroSection } from "@/components/sections/hero-section";
import { DealerIntro } from "@/components/sections/dealer-intro";
import { CarShowcase } from "@/components/sections/car-showcase";
import { PurchaseProcess } from "@/components/sections/purchase-process";
import { VideoSection } from "@/components/sections/video-section";
import { NewsPreview } from "@/components/sections/news-preview";
import { CtaBanner } from "@/components/sections/cta-banner";
import {
  getCarThumbnail,
  getDealership,
  getFeaturedCars,
  getFeaturedNews,
  getPageContent,
  getProcessSteps,
} from "@/lib/data-server";

export default async function Home() {
  const dealership = await getDealership();
  const pageContent = await getPageContent();
  const featuredCars = await getFeaturedCars();
  const featuredNews = await getFeaturedNews(4);
  const processSteps = await getProcessSteps();

  const thumbnails = Object.fromEntries(
    await Promise.all(
      featuredCars.map(async (car) => [car.slug, await getCarThumbnail(car.slug)])
    )
  );

  return (
    <>
      <HeroSection dealership={dealership} hero={pageContent.home.hero} />
      <DealerIntro
        dealership={dealership}
        heading={pageContent.home.dealerIntro}
      />
      <CarShowcase
        cars={featuredCars}
        thumbnails={thumbnails}
        heading={pageContent.home.showcase}
      />
      <PurchaseProcess
        steps={processSteps}
        heading={pageContent.home.process}
      />
      <VideoSection video={pageContent.home.video} />
      <NewsPreview news={featuredNews} heading={pageContent.home.newsPreview} />
      <CtaBanner dealership={dealership} cta={pageContent.home.cta} />
    </>
  );
}
