"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CarImage } from "@/components/ui/car-image";
import { formatVND } from "@/lib/format";
import { getCarThumbnail } from "@/lib/data";
import type { CarIndexItem } from "@/lib/types";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCountUp } from "@/hooks/use-count-up";
import { useEffect, useRef, useState } from "react";

interface CarCardProps {
  car: CarIndexItem;
  thumbnail?: string;
}

function PriceDisplay({ price }: { price: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const count = useCountUp(price, 1500, inView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="text-gold-accent font-bold text-lg">
      Từ: {formatVND(inView ? count : 0)}
    </span>
  );
}

export function CarCard({ car, thumbnail }: CarCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reducedMotion ? {} : { y: -8 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-border/50">
        <div className="relative aspect-[16/10] overflow-hidden bg-charcoal-light">
          <CarImage
            src={thumbnail ?? getCarThumbnail(car.slug)}
            alt={car.name}
            fill
            className="transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-charcoal/80 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
              {car.category}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-lg text-charcoal mb-1">{car.name}</h3>
          <PriceDisplay price={car.priceFrom} />
          <Link
            href={`/san-pham/${car.slug}`}
            className="mt-4 flex items-center gap-1.5 text-honda-red text-sm font-semibold hover:gap-2.5 transition-all"
          >
            Xem chi tiết
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
