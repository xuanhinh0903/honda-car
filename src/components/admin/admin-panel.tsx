"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminFetch } from "./admin-utils";
import { DealershipSection } from "./dealership-section";
import { CarsSection } from "./cars-section";
import { NewsSection } from "./news-section";
import { JsonDataSection } from "./json-data-section";

export function AdminPanel() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sessionUser, setSessionUser] = useState("");
  const [loginUser, setLoginUser] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    adminFetch<{ authenticated: boolean; username?: string }>(
      "/api/admin/auth"
    )
      .then((data) => {
        setAuthenticated(data.authenticated);
        setSessionUser(data.username ?? "");
      })
      .catch(() => setAuthenticated(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await adminFetch("/api/admin/auth", { method: "DELETE" });
    setAuthenticated(false);
    setSessionUser("");
  }

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Đang kiểm tra phiên đăng nhập...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-5 rounded-2xl border bg-white p-8 shadow-xl"
        >
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-bold text-charcoal">Admin Honda Tiến Đạt</h1>
            <p className="text-sm text-muted-foreground">
              Đăng nhập để quản trị nội dung website
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Tài khoản</Label>
            <Input
              id="username"
              value={loginUser}
              onChange={(e) => setLoginUser(e.target.value)}
              autoComplete="username"
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
            />
          </div>
          {error && <p className="text-sm text-honda-red">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            <Link href="/" className="underline">
              Về trang chủ
            </Link>
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-lg font-bold text-charcoal">Quản trị nội dung</h1>
            <p className="text-xs text-muted-foreground">
              Xin chào, {sessionUser} — thay đổi lưu trực tiếp vào thư mục data/ và public/
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex h-7 items-center gap-1 rounded-lg border border-border px-2.5 text-sm hover:bg-muted"
            >
              <ExternalLink className="h-4 w-4" />
              Xem website
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Tabs defaultValue="dealership">
          <TabsList className="mb-6 flex h-auto flex-wrap gap-1">
            <TabsTrigger value="dealership">Đại lý</TabsTrigger>
            <TabsTrigger value="cars">Xe</TabsTrigger>
            <TabsTrigger value="news">Tin tức</TabsTrigger>
            <TabsTrigger value="pricing">Bảng giá</TabsTrigger>
            <TabsTrigger value="delivery">Bàn giao</TabsTrigger>
            <TabsTrigger value="process">Quy trình</TabsTrigger>
            <TabsTrigger value="promotions">Khuyến mại</TabsTrigger>
            <TabsTrigger value="navigation">Menu</TabsTrigger>
          </TabsList>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <TabsContent value="dealership">
              <DealershipSection />
            </TabsContent>
            <TabsContent value="cars">
              <CarsSection />
            </TabsContent>
            <TabsContent value="news">
              <NewsSection />
            </TabsContent>
            <TabsContent value="pricing">
              <JsonDataSection dataKey="pricing" />
            </TabsContent>
            <TabsContent value="delivery">
              <JsonDataSection dataKey="delivery" />
            </TabsContent>
            <TabsContent value="process">
              <JsonDataSection dataKey="process" />
            </TabsContent>
            <TabsContent value="promotions">
              <JsonDataSection dataKey="promotions" />
            </TabsContent>
            <TabsContent value="navigation">
              <JsonDataSection dataKey="navigation" />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
