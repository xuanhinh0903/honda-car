"use client";

import { FadeIn } from "./fade-in";

interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionReveal({ children, className, id }: SectionRevealProps) {
  return (
    <section id={id} className={className}>
      <FadeIn>{children}</FadeIn>
    </section>
  );
}

export function SectionTitle({
  title,
  subtitle,
  className,
  dark = false,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <FadeIn className={className}>
      <div className="text-center mb-12">
        {subtitle && (
          <p
            className={`text-sm font-semibold uppercase tracking-widest mb-2 ${
              dark ? "text-honda-red" : "text-honda-red"
            }`}
          >
            {subtitle}
          </p>
        )}
        <h2
          className={`text-3xl md:text-4xl font-bold tracking-tight ${
            dark ? "text-white" : "text-charcoal"
          }`}
        >
          {title}
        </h2>
        <div className="mt-4 mx-auto w-16 h-1 bg-honda-red rounded-full" />
      </div>
    </FadeIn>
  );
}
