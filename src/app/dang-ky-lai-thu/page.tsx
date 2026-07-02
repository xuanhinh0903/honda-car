import type { Metadata } from "next";
import { SectionTitle } from "@/components/motion/section-reveal";
import { TestDriveForm } from "@/components/forms/test-drive-form";

export const metadata: Metadata = {
  title: "Đăng ký lái thử",
  description: "Đăng ký lái thử xe Honda miễn phí tại Honda Tiến Đạt Hà Nội",
};

export default function DangKyLaiThuPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle
          subtitle="Trải nghiệm"
          title="Đăng ký lái thử"
        />
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Trải nghiệm cảm giác lái xe Honda chính hãng. Điền form bên dưới để đặt lịch lái thử miễn phí.
        </p>
        <div className="max-w-lg mx-auto bg-white rounded-2xl p-8 shadow-sm border border-border/50">
          <TestDriveForm />
        </div>
      </div>
    </div>
  );
}
