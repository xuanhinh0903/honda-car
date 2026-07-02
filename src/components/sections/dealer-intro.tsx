import { Building2, Users, Layers } from "lucide-react";
import { getDealership } from "@/lib/data";
import { SectionTitle } from "@/components/motion/section-reveal";
import { FadeIn } from "@/components/motion/fade-in";

const dealership = getDealership();

const stats = [
  {
    icon: Building2,
    value: dealership.stats.area,
    label: "Diện tích showroom",
  },
  {
    icon: Layers,
    value: `${dealership.stats.floors} tầng`,
    label: "Dịch vụ & trưng bày",
  },
  {
    icon: Users,
    value: `${dealership.stats.staff}+`,
    label: "Nhân viên chuyên nghiệp",
  },
];

export function DealerIntro() {
  return (
    <section className="py-20 bg-pearl">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Về chúng tôi"
          title={dealership.name}
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {dealership.intro}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {dealership.introExtended}
            </p>
            <p className="text-honda-red font-bold text-lg italic">
              &ldquo;{dealership.slogan}&rdquo;
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl p-5 text-center shadow-sm border border-border/50 hover:shadow-md transition-shadow"
                >
                  <stat.icon className="w-8 h-8 text-honda-red mx-auto mb-3" />
                  <p className="font-bold text-xl text-charcoal">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
