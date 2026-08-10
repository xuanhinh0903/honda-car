"use client";

import { useEffect, useState } from "react";
import { MessageSquareText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminFetch } from "./admin-utils";
import { adminToast } from "./admin-toast";
import { AdminLoading } from "./admin-ui";
import { LEAD_TYPE_LABELS, type Lead } from "@/lib/leads-shared";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("vi-VN");
}

export function LeadsSection() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<{ leads: Lead[] }>("/api/leads")
      .then((data) => setLeads(data.leads))
      .catch((err: Error) =>
        adminToast.error("Không tải được danh sách", err.message)
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Xóa đăng ký này?")) return;
    try {
      await adminFetch(`/api/leads?id=${id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
      adminToast.success("Đã xóa");
    } catch (err) {
      adminToast.error(
        "Xóa thất bại",
        err instanceof Error ? err.message : undefined
      );
    }
  }

  if (loading) return <AdminLoading />;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        Mỗi khách gửi form (lái thử / báo giá / liên hệ) sẽ xuất hiện tại đây.
      </div>

      {leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 py-16 text-center">
          <MessageSquareText className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm font-medium text-charcoal">Chưa có đăng ký nào</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Các form trên website sẽ hiển thị tại đây
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="rounded-xl border border-border/60 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary">{LEAD_TYPE_LABELS[lead.type]}</Badge>
                    <span className="font-medium text-charcoal">{lead.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {lead.phone}
                    </span>
                  </div>
                  <div className="mt-2 space-y-0.5 text-sm text-muted-foreground">
                    {lead.email ? <p>Email: {lead.email}</p> : null}
                    {lead.car ? <p>Xe quan tâm: {lead.car}</p> : null}
                    {lead.date ? <p>Ngày: {lead.date}</p> : null}
                    {lead.subject ? <p>Tiêu đề: {lead.subject}</p> : null}
                    {lead.message ? (
                      <p className="whitespace-pre-line">Nội dung: {lead.message}</p>
                    ) : null}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(lead.createdAt)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(lead.id)}
                  className="shrink-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
