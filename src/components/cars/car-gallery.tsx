"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarImage } from "@/components/ui/car-image";
import { cn } from "@/lib/utils";

interface CarGalleryProps {
  images: string[];
  alt: string;
}

export function CarGallery({ images, alt }: CarGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
          <div className="flex">
            {images.map((src, index) => (
              <div key={src} className="flex-[0_0_100%] min-w-0">
                <div className="relative aspect-[16/9] bg-charcoal-light">
                  <CarImage
                    src={src}
                    alt={`${alt} - ảnh ${index + 1}`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm"
          onClick={scrollPrev}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm"
          onClick={scrollNext}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        {images.map((src, index) => (
          <button
            key={src}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors",
              selectedIndex === index
                ? "border-honda-red"
                : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <CarImage src={src} alt="" fill sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  );
}
