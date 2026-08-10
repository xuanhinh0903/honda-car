"use client";

import { SectionTitle } from "@/components/motion/section-reveal";
import { FadeIn } from "@/components/motion/fade-in";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { ProcessStep, SectionHeading } from "@/lib/types";

export function PurchaseProcess({
  steps,
  heading,
}: {
  steps: ProcessStep[];
  heading: SectionHeading;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <section className="py-20 bg-charcoal-light">
      <div className="container mx-auto px-4">
        <SectionTitle subtitle={heading.subtitle} title={heading.title ?? "Quy trình mua xe"} dark />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <FadeIn key={step.step} delay={index * 0.1}>
              <motion.div
                whileHover={reducedMotion ? {} : { y: -4 }}
                className="bg-charcoal rounded-2xl p-6 border border-white/10 hover:border-honda-red/30 transition-colors h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-honda-red rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-silver text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
