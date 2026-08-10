"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminField, ImageField } from "./admin-ui";
import { cn } from "@/lib/utils";

export interface StringListEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel: string;
  placeholder?: string;
  imageUploadFolder?: string;
  multiline?: boolean;
  emptyHint?: string;
}

export function StringListEditor({
  items,
  onChange,
  addLabel,
  placeholder,
  imageUploadFolder,
  multiline = false,
  emptyHint = "Chưa có mục nào",
}: StringListEditorProps) {
  function update(index: number, value: string) {
    onChange(items.map((item, i) => (i === index ? value : item)));
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function add() {
    onChange([...items, ""]);
  }

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-border/70 bg-muted/20 px-3 py-3 text-center text-xs text-muted-foreground">
          {emptyHint}
        </p>
      )}
      {items.map((item, index) => (
        <div key={index} className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            {imageUploadFolder ? (
              <ImageField
                value={item}
                onChange={(value) => update(index, value)}
                uploadFolder={imageUploadFolder}
              />
            ) : multiline ? (
              <Textarea
                rows={3}
                value={item}
                placeholder={placeholder}
                onChange={(e) => update(index, e.target.value)}
              />
            ) : (
              <Input
                value={item}
                placeholder={placeholder}
                onChange={(e) => update(index, e.target.value)}
                className="h-9"
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => remove(index)}
            title="Xóa mục"
            className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={add}
        className="w-full"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  );
}

export interface EditorField {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "image" | "list";
  hint?: string;
  placeholder?: string;
  uploadFolder?: string;
  itemFields?: EditorField[];
  newItem?: () => Record<string, unknown>;
  itemLabel?: (item: Record<string, unknown>, index: number) => string;
}

interface CollectionEditorProps {
  items: Record<string, unknown>[];
  fields: EditorField[];
  onChange: (items: Record<string, unknown>[]) => void;
  newItem: () => Record<string, unknown>;
  addLabel?: string;
  itemLabel?: (item: Record<string, unknown>, index: number) => string;
  emptyHint?: string;
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: EditorField;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  if (field.type === "textarea") {
    return (
      <Textarea
        rows={3}
        value={(value as string) ?? ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  if (field.type === "number") {
    return (
      <Input
        type="number"
        value={(value as number) ?? ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    );
  }

  if (field.type === "checkbox") {
    return (
      <input
        type="checkbox"
        checked={Boolean(value)}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-honda-red h-4 w-4"
      />
    );
  }

  if (field.type === "image") {
    return (
      <ImageField
        value={(value as string) ?? ""}
        onChange={onChange}
        uploadFolder={field.uploadFolder ?? "images"}
      />
    );
  }

  if (field.type === "list") {
    const list = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
    return (
      <CollectionEditor
        items={list}
        fields={field.itemFields ?? []}
        onChange={(next) => onChange(next)}
        newItem={field.newItem ?? (() => ({}))}
        addLabel={`Thêm ${field.label.toLowerCase()}`}
        itemLabel={field.itemLabel}
        emptyHint={`Chưa có mục nào trong ${field.label.toLowerCase()}`}
      />
    );
  }

  return (
    <Input
      value={(value as string) ?? ""}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function CollectionEditor({
  items,
  fields,
  onChange,
  newItem,
  addLabel = "Thêm mới",
  itemLabel,
  emptyHint = "Chưa có mục nào",
}: CollectionEditorProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function updateItem(index: number, patch: Record<string, unknown>) {
    const next = items.map((item, i) =>
      i === index ? { ...item, ...patch } : item
    );
    onChange(next);
  }

  function handleAdd() {
    const next = [...items, newItem()];
    onChange(next);
    setSelectedIndex(next.length - 1);
  }

  function handleDelete() {
    if (selectedIndex === null) return;
    if (!confirm("Xóa mục này?")) return;
    const next = items.filter((_, i) => i !== selectedIndex);
    onChange(next);
    setSelectedIndex(null);
  }

  const selected =
    selectedIndex !== null ? items[selectedIndex] ?? null : null;

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
      <div className="space-y-3">
        <Button
          type="button"
          onClick={handleAdd}
          variant="outline"
          className="w-full"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
        <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
          {items.length === 0 && (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">
              {emptyHint}
            </p>
          )}
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                selectedIndex === index
                  ? "border-honda-red bg-honda-red/5"
                  : "border-border/60 hover:bg-muted/50"
              )}
            >
              {itemLabel
                ? itemLabel(item, index)
                : (item as Record<string, unknown>).label
                  ? String((item as Record<string, unknown>).label)
                  : `Mục ${index + 1}`}
            </button>
          ))}
        </div>
      </div>

      <div>
        {selected ? (
          <div className="space-y-4">
            {fields.map((field) => (
              <AdminField key={field.key} label={field.label} hint={field.hint}>
                <FieldInput
                  field={field}
                  value={selected[field.key]}
                  onChange={(value) => updateItem(selectedIndex!, {
                    [field.key]: value,
                  })}
                />
              </AdminField>
            ))}
            <div className="flex justify-end border-t border-border/60 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Xóa mục này
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 py-16 text-center">
            <p className="text-sm font-medium text-charcoal">Chưa chọn mục</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Chọn mục bên trái hoặc bấm &quot;{addLabel}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
