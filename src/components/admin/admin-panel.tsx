"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  Car,
  ExternalLink,
  Gift,
  LayoutTemplate,
  ListOrdered,
  LogOut,
  Menu,
  MessageSquareText,
  Newspaper,
  Shield,
  Tags,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { adminFetch } from "./admin-utils";
import { adminToast } from "./admin-toast";
import { DealershipSection } from "./dealership-section";
import { CarsSection } from "./cars-section";
import { NewsSection } from "./news-section";
import { PagesSection } from "./pages-section";
import { ProcessSection } from "./process-section";
import { PricingSection } from "./pricing-section";
import { DeliverySection } from "./delivery-section";
import { PromotionsSection } from "./promotions-section";
import { NavigationSection } from "./navigation-section";
import { LeadsSection } from "./leads-section";
import { cn } from "@/lib/utils";

type AdminSection =
  | "dealership"
  | "cars"
  | "news"
  | "pages"
  | "pricing"
  | "delivery"
  | "process"
  | "promotions"
  | "navigation"
  | "leads";

const NAV_ITEMS: {
  id: AdminSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
}[] = [
  { id: "dealership", label: "Thông tin đại lý", icon: Building2, group: "Nội dung" },
  { id: "pages", label: "Nội dung trang", icon: LayoutTemplate, group: "Nội dung" },
  { id: "cars", label: "Sản phẩm xe", icon: Car, group: "Nội dung" },
  { id: "news", label: "Tin tức", icon: Newspaper, group: "Nội dung" },
  { id: "process", label: "Quy trình mua", icon: ListOrdered, group: "Trang" },
  { id: "pricing", label: "Bảng giá", icon: Tags, group: "Trang" },
  { id: "delivery", label: "Bàn giao xe", icon: Truck, group: "Trang" },
  { id: "promotions", label: "Khuyến mại", icon: Gift, group: "Trang" },
  { id: "leads", label: "Đăng ký khách", icon: MessageSquareText, group: "Khách hàng" },
  { id: "navigation", label: "Menu", icon: Menu, group: "Hệ thống" },
];

const SECTION_TITLES: Record<AdminSection, { title: string; desc: string }> = {
  dealership: {
    title: "Thông tin đại lý",
    desc: "Hotline, địa chỉ, mạng xã hội và nội dung giới thiệu hiển thị trên toàn website.",
  },
  pages: {
    title: "Nội dung trang",
    desc: "Chỉnh sửa nội dung các mục trên trang chủ, giới thiệu, liên hệ và các trang con.",
  },
  cars: {
    title: "Quản lý xe",
    desc: "Thêm, sửa, xóa sản phẩm. Dữ liệu lưu trong data/cars/ và ảnh trong public/images/cars/.",
  },
  news: {
    title: "Quản lý tin tức",
    desc: "Bài viết hiển thị tại trang Tin tức và phần preview trang chủ.",
  },
  process: {
    title: "Quy trình mua xe",
    desc: "Các bước mua xe hiển thị trên trang chủ.",
  },
  pricing: {
    title: "Bảng giá",
    desc: "Chỉnh sửa bảng giá các dòng xe theo phiên bản.",
  },
  delivery: {
    title: "Bàn giao xe",
    desc: "Album hình ảnh lễ bàn giao xe cho khách hàng.",
  },
  promotions: {
    title: "Khuyến mại",
    desc: "Chương trình khuyến mãi.",
  },
  leads: {
    title: "Đăng ký khách",
    desc: "Đăng ký lái thử, yêu cầu báo giá và liên hệ từ website. Kèm trạng thái gửi thông báo Zalo.",
  },
  navigation: {
    title: "Menu điều hướng",
    desc: "Cấu trúc menu header và footer.",
  },
};

export function AdminPanel() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sessionUser, setSessionUser] = useState("");
  const [loginUser, setLoginUser] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("dealership");

  useEffect(() => {
    adminFetch<{ authenticated: boolean; username?: string }>("/api/admin/auth")
      .then((data) => {
        setAuthenticated(data.authenticated);
        setSessionUser(data.username ?? "");
      })
      .catch(() => setAuthenticated(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const toastId = adminToast.loading("Đang đăng nhập...");
    try {
      await adminFetch("/api/admin/auth", {
        method: "POST",
        body: JSON.stringify({ username: loginUser, password: loginPassword }),
      });
      const me = await adminFetch<{ authenticated: boolean; username: string }>(
        "/api/admin/auth"
      );
      setAuthenticated(true);
      setSessionUser(me.username);
      setLoginPassword("");
      adminToast.dismiss(toastId);
      adminToast.success("Đăng nhập thành công", `Xin chào, ${me.username}`);
    } catch (err) {
      adminToast.dismiss(toastId);
      adminToast.error(
        "Đăng nhập thất bại",
        err instanceof Error ? err.message : "Vui lòng thử lại"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await adminFetch("/api/admin/auth", { method: "DELETE" });
      setAuthenticated(false);
      setSessionUser("");
      adminToast.success("Đã đăng xuất");
    } catch {
      adminToast.error("Không thể đăng xuất");
    }
  }

  if (authenticated === null) {
    return (
      <>
        <Toaster />
        <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7]">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Shield className="h-5 w-5 animate-pulse" />
            <span className="text-sm">Đang kiểm tra phiên đăng nhập...</span>
          </div>
        </div>
      </>
    );
  }

  if (!authenticated) {
    return (
      <>
        <Toaster />
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-charcoal px-4">
          <div className="absolute inset-0 bg-hero-gradient opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.52_0.24_27/0.25)_0%,transparent_55%)]" />

          <form
            onSubmit={handleLogin}
            className="relative z-10 w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-white p-8 shadow-2xl"
          >
            <div className="flex flex-col items-center space-y-3 text-center">
              <Image
                src="/logo.png"
                alt="Honda Tiến Đạt"
                width={180}
                height={64}
                className="h-14 w-auto object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-charcoal">Admin Panel</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Đăng nhập để quản trị nội dung website
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tài khoản</Label>
                <Input
                  id="username"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  autoComplete="username"
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  className="h-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-10 w-full bg-honda-red hover:bg-honda-red-hover"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              <Link href="/" className="underline-offset-4 hover:underline">
                ← Về trang chủ
              </Link>
            </p>
          </form>
        </div>
      </>
    );
  }

  const navGroups = [...new Set(NAV_ITEMS.map((item) => item.group))];
  const sectionMeta = SECTION_TITLES[activeSection];

  return (
    <>
      <Toaster />
      <div className="flex min-h-screen bg-[#f4f5f7]">
        <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-white/10 bg-charcoal text-white">
          <div className="border-b border-white/10 px-5 py-5">
            <Image
              src="/logo.png"
              alt="Honda Tiến Đạt"
              width={160}
              height={56}
              className="h-10 w-auto object-contain brightness-0 invert"
            />
            <p className="mt-3 text-xs text-silver/70">Quản trị nội dung</p>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {navGroups.map((group) => (
              <div key={group} className="mb-5">
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-silver/50">
                  {group}
                </p>
                <div className="space-y-0.5">
                  {NAV_ITEMS.filter((item) => item.group === group).map(
                    (item) => {
                      const Icon = item.icon;
                      const active = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveSection(item.id)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                            active
                              ? "bg-honda-red font-medium text-white shadow-sm"
                              : "text-silver hover:bg-white/8 hover:text-white"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {item.label}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <p className="truncate px-1 text-xs text-silver/60">
              {sessionUser}
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col pl-64">
          <header className="sticky top-0 z-10 border-b border-border/60 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
            <div className="flex items-center justify-between px-8 py-4">
              <div>
                <h1 className="text-lg font-semibold text-charcoal">
                  {sectionMeta.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {sectionMeta.desc}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted"
                >
                  <ExternalLink className="h-4 w-4" />
                  Xem website
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-8 py-6">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              {activeSection === "dealership" && <DealershipSection />}
              {activeSection === "pages" && <PagesSection />}
              {activeSection === "cars" && <CarsSection />}
              {activeSection === "news" && <NewsSection />}
              {activeSection === "process" && <ProcessSection />}
              {activeSection === "pricing" && <PricingSection />}
              {activeSection === "delivery" && <DeliverySection />}
              {activeSection === "promotions" && <PromotionsSection />}
              {activeSection === "leads" && <LeadsSection />}
              {activeSection === "navigation" && <NavigationSection />}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
