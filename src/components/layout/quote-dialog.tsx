"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuoteForm } from "@/components/forms/quote-form";

interface QuoteDialogProps {
  trigger: React.ReactElement;
}

export function QuoteDialog({ trigger }: QuoteDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Yêu cầu báo giá</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">
          Vui lòng điền đầy đủ thông tin để nhận báo giá xe Honda!
        </p>
        <QuoteForm />
      </DialogContent>
    </Dialog>
  );
}
