import type { Metadata } from "next";
import { Building2, Users, Layers, Award } from "lucide-react";
import { getDealership } from "@/lib/data-server";
import { SectionTitle } from "@/components/motion/section-reveal";
import { FadeIn } from "@/components/motion/fade-in";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: "Giới thiệu về đại lý Honda Tiến Đạt - Uy tín tạo nên giá trị",
};

const dealership = getDealership();

const features = [
  {
    icon: Building2,
    title: "Showroom hiện đại",
    description: `Diện tích ${dealership.stats.area} với phòng trưng bày và kho xe rộng rãi`,
  },
  {
    icon: Layers,
    title: "3 tầng dịch vụ",
    description: "Trung tâm sửa chữa và bảo dưỡng ô tô đạt chuẩn Honda",
  },
  {
    icon: Users,
    title: "Đội ngũ chuyên nghiệp",
    description: `Hơn ${dealership.stats.staff} cán bộ nhân viên giàu kinh nghiệm`,
  },
  {
    icon: Award,
    title: "Tiêu chuẩn 5S",
    description: "Đạt tiêu chuẩn đại lý 5S của Honda Việt Nam",
  },
];

export default function GioiThieuPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Về chúng tôi"
          title="Honda Tiến Đạt"
        />

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
          {features.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.1}>
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-border/50 hover:shadow-md transition-shadow h-full">
                <feature.icon className="w-10 h-10 text-honda-red mx-auto mb-4" />
                <h3 className="font-bold text-charcoal mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
