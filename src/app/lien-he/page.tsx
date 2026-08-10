import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getDealership, getPageContent } from "@/lib/data-server";
import { formatPhone } from "@/lib/format";
import { SectionTitle } from "@/components/motion/section-reveal";
import { FadeIn } from "@/components/motion/fade-in";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ Honda Tiến Đạt - Hotline, địa chỉ và form liên hệ",
};

export default async function LienHePage() {
  const dealership = await getDealership();
  const contact = (await getPageContent()).contact;

  const contactInfo = [
    {
      icon: MapPin,
      label: "Địa chỉ",
      value: dealership.address,
    },
    {
      icon: Phone,
      label: "Hotline",
      value: formatPhone(dealership.hotline),
      href: `tel:${dealership.hotline}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: dealership.email,
      href: `mailto:${dealership.email}`,
    },
    {
      icon: Clock,
      label: "Giờ làm việc",
      value: contact.workingHours,
    },
  ];

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle subtitle={contact.subtitle} title={contact.title} />

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <FadeIn>
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div key={info.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-honda-red/10 rounded-lg flex items-center justify-center shrink-0">
                    <info.icon className="w-5 h-5 text-honda-red" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{info.label}</p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="font-medium hover:text-honda-red transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="font-medium">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="mt-8 rounded-2xl overflow-hidden border border-border/50 aspect-video bg-muted">
                <iframe
                  src={contact.mapEmbedUrl}
                  title="Bản đồ Honda Tiến Đạt"
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50">
              <h2 className="font-bold text-xl mb-6">Gửi tin nhắn</h2>
              <ContactForm />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
