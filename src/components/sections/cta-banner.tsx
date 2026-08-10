import Link from "next/link";
import { Car, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPhone } from "@/lib/format";
import { FadeIn } from "@/components/motion/fade-in";
import type { DealershipInfo } from "@/lib/types";

export function CtaBanner({
  dealership,
  cta,
}: {
  dealership: DealershipInfo;
  cta: {
    title: string;
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
}) {
  return (
    <section className="py-16 bg-honda-red relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,white_0%,transparent_50%)]" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <FadeIn>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {cta.title}
              </h2>
              <p className="text-white/80">
                {cta.description}{" "}
                {formatPhone(dealership.hotline)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={cta.primaryCta.href}>
                <Button
                  size="lg"
                  className="bg-white text-honda-red hover:bg-white/90 border-0 h-11"
                >
                  <Car className="w-4 h-4" />
                  {cta.primaryCta.label}
                </Button>
              </Link>
              <a href={`tel:${dealership.hotline}`}>
                <Button
                  size="lg"
                  className="h-11 border border-white/50 bg-transparent text-white hover:bg-white/15 hover:text-white"
                >
                  <Phone className="w-4 h-4" />
                  {cta.secondaryCta.label}
                </Button>
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
