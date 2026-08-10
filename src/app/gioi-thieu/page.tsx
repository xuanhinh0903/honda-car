import type { Metadata } from "next";
import { Building2, Layers, Users, Award } from "lucide-react";
import { getDealership, getPageContent } from "@/lib/data-server";
import { SectionTitle } from "@/components/motion/section-reveal";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Giới thiệu về đại lý Honda Tiến Đạt - Uy tín tạo nên giá trị",
};

const featureIcons = [Building2, Layers, Users, Award];

export default async function GioiThieuPage() {
  const dealership = await getDealership();
  const about = (await getPageContent()).about;

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle subtitle={about.subtitle} title={about.title} />

        <div className="max-w-3xl mx-auto text-center mb-16">
          <FadeIn>
            <p className="text-muted-foreground leading-relaxed text-lg mb-4">
              {dealership.intro}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {dealership.introExtended}
            </p>
            <p className="text-honda-red font-bold text-xl italic">
              &ldquo;{dealership.slogan}&rdquo;
            </p>
          </FadeIn>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {about.features.map((feature, index) => {
            const Icon = featureIcons[index % featureIcons.length];
            return (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-border/50 hover:shadow-md transition-shadow h-full">
                  <Icon className="w-10 h-10 text-honda-red mx-auto mb-4" />
                  <h3 className="font-bold text-charcoal mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
