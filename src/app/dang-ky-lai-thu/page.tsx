import type { Metadata } from "next";
import { getCars, getPageContent } from "@/lib/data-server";
import { SectionTitle } from "@/components/motion/section-reveal";
import { TestDriveForm } from "@/components/forms/test-drive-form";

export const metadata: Metadata = {
  title: "Đăng ký lái thử",
  description: "Đăng ký lái thử xe Honda miễn phí tại Honda Tiến Đạt Hà Nội",
};

export default function DangKyLaiThuPage() {
  const testDrive = getPageContent().testDrive;
  const cars = getCars();

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <SectionTitle subtitle={testDrive.subtitle} title={testDrive.title} />
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {testDrive.description}
        </p>
        <div className="max-w-lg mx-auto bg-white rounded-2xl p-8 shadow-sm border border-border/50">
          <TestDriveForm cars={cars} />
        </div>
      </div>
    </div>
  );
}
