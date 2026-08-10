import Image from "next/image";
import type { DealershipInfo } from "@/lib/types";

export function StaticSplash({
  dealership,
}: {
  dealership: DealershipInfo;
}) {
  return (
    <div
      id="splash-static"
      aria-hidden="true"
      className="fixed inset-0 z-[99] hidden flex-col items-center justify-center bg-charcoal overflow-hidden splash-static"
    >
      <div className="absolute inset-0 bg-hero-gradient opacity-80" />
      <div className="relative z-10 flex flex-col items-center px-6">
        <Image
          src="/logo.png"
          alt=""
          width={220}
          height={80}
          priority
          className="mb-8 h-20 w-auto object-contain drop-shadow-2xl"
        />
        <p className="mb-10 text-center text-sm uppercase tracking-[0.25em] text-silver">
          {dealership.tagline}
        </p>
        <div className="h-0.5 w-56 overflow-hidden rounded-full bg-white/10 sm:w-64">
          <div className="splash-static-bar h-full w-1/3 rounded-full bg-gradient-to-r from-honda-red via-honda-red-hover to-gold-accent" />
        </div>
      </div>
      <p className="absolute bottom-10 text-xs uppercase tracking-widest text-silver/40">
        {dealership.name}
      </p>
    </div>
  );
}
