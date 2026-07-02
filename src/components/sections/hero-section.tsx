"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Car, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CarImage } from "@/components/ui/car-image";
import { getDealership } from "@/lib/data";
import { formatPhone } from "@/lib/format";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const dealership = getDealership();

export function HeroSection() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen flex items-center bg-hero-gradient overflow-hidden">
      <div className="absolute inset-0">
        <CarImage
          src="/images/hero/showroom.jpg"
          alt="Honda Tiến Đạt Showroom"
          fill
          priority
          className={`opacity-30 ${!reducedMotion ? "ken-burns" : ""}`}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/60" />
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="inline-block bg-honda-red/20 text-honda-red border border-honda-red/30 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
              {dealership.tagline}
            </span>
          </motion.div>

          <motion.h1
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            {dealership.name}
            <span className="block text-gradient-metallic">{dealership.tagline}</span>
          </motion.h1>

          <motion.p
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-silver text-lg mb-8 leading-relaxed"
          >
            Đại lý 5S quy mô lớn nhất miền Bắc — {dealership.stats.area},{" "}
            {dealership.stats.staff}+ nhân viên chuyên nghiệp
          </motion.p>

          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="flex flex-wrap gap-3 mb-8"
          >
            <Link href="/dang-ky-lai-thu">
              <Button
                size="lg"
                className="bg-honda-red hover:bg-honda-red-hover text-white border-0 h-11 px-6"
              >
                <Car className="w-4 h-4" />
                Đăng ký lái thử
              </Button>
            </Link>
            <Link href="/bang-gia">
              <Button
                size="lg"
                className="h-11 px-6 border border-white/40 bg-transparent text-white hover:bg-white/15 hover:text-white"
              >
                Bảng giá xe mới nhất
              </Button>
            </Link>
            <Link href="/tinh-phi-lan-banh">
              <Button
                size="lg"
                className="h-11 px-6 border border-white/40 bg-transparent text-white hover:bg-white/15 hover:text-white"
              >
                <Calculator className="w-4 h-4" />
                Tính lãi trả góp
              </Button>
            </Link>
          </motion.div>

          <motion.a
            initial={reducedMotion ? {} : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            href={`tel:${dealership.hotline}`}
            className="inline-flex items-center gap-3 text-white group"
          >
            <div className="w-12 h-12 bg-honda-red rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-silver text-xs uppercase tracking-wider">
                Hotline tư vấn
              </p>
              <p className="text-2xl font-bold">
                {formatPhone(dealership.hotline)}
              </p>
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
