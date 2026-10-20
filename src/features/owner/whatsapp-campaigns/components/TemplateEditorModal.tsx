"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TemplateItem } from "../types/whatsapp-campaigns.types";
import {
  templateEditorSchema,
  TemplateEditorFormValues,
} from "../schemas/whatsapp-campaigns.schemas";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Smartphone } from "lucide-react";

interface TemplateEditorModalProps {
  open: boolean;
  onClose: () => void;
  template: TemplateItem | null;
  onSaveTemplate: (updated: TemplateItem) => void;
  onSendTest: (template: TemplateItem, phone: string) => void;
}

export function TemplateEditorModal({
  open,
  onClose,
  template,
  onSaveTemplate,
  onSendTest,
}: TemplateEditorModalProps) {
  const [testPhone, setTestPhone] = React.useState("+92 300 1234567");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<TemplateEditorFormValues>({
    resolver: zodResolver(templateEditorSchema),
    mode: "onChange",
    defaultValues: {
      name: template?.name || "",
      category: template?.category || "Digital receipt",
      body: template?.body || "",
    },
  });

  React.useEffect(() => {
    if (template) {
      reset({
        name: template.name,
        category: template.category,
        body: template.body,
      });
    }
  }, [template, reset]);

  if (!template) return null;

  const currentBody = watch("body") || "";

  const onSubmit = (values: TemplateEditorFormValues) => {
    onSaveTemplate({
      ...template,
      name: values.name,
      category: values.category,
      body: values.body,
    });
    onClose();
  };

  const handleTest = () => {
    onSendTest(template, testPhone);
  };

  // Preview replacement of variables with dummy values
  const previewText = currentBody
    .replace(/\{\{name\}\}/g, "Fatima Raza")
    .replace(/\{\{store\}\}/g, "Noor Pret & Boutique")
    .replace(/\{\{receipt\}\}/g, "NP-010420")
    .replace(/\{\{total\}\}/g, "Rs. 9,000")
    .replace(/\{\{points\}\}/g, "640")
    .replace(/\{\{balance\}\}/g, "Rs. 14,500")
    .replace(/\{\{code\}\}/g, "SILK2026")
    .replace(/\{\{link\}\}/g, "google.com/secret pret/review");

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Edit Template: ${template.name}`}
      subtitle="Meta WhatsApp Cloud API pre-approved template with dynamic placeholder tokens."
      maxWidthClass="w-full sm:max-w-2xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onClose}
            className="px-6 rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="default"
            onClick={handleSubmit(onSubmit)}
            disabled={!isDirty || !isValid}
            className="px-7 rounded-full"
          >
            Save Changes
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 pt-2 select-none">
        {/* Category & Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="delivered" size="sm">
            {template.status}
          </Badge>
          <Badge variant="outline" size="sm">
            {template.category}
          </Badge>
          <Badge variant="gold" size="sm">
            {template.metaCategory}
          </Badge>
          <span className="text-xs text-muted font-sans ml-auto">
            Language: {template.language}
          </span>
        </div>

        {/* Template Name & Category Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Template Name *"
            {...register("name")}
            error={errors.name?.message}
          />
          <Input
            label="Category *"
            {...register("category")}
            error={errors.category?.message}
          />
        </div>

        {/* Template Body Editor */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans text-xs sm:text-sm font-medium text-heading">
            Template Message Body *
          </label>
          <textarea
            rows={4}
            {...register("body")}
            className="w-full p-3.5 rounded-xl border border-default bg-card font-sans text-xs sm:text-sm text-heading focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent leading-relaxed resize-none"
          />
          {errors.body?.message ? (
            <p className="text-xs text-status-error font-sans">
              {errors.body.message}
            </p>
          ) : (
            <span className="text-[11px] text-muted">
              Placeholder variables like{" "}
              <code className="text-primary font-mono font-semibold">{"{{name}}"}</code> and{" "}
              <code className="text-primary font-mono font-semibold">{"{{store}}"}</code> are
              automatically populated by the POS engine.
            </span>
          )}
        </div>

        {/* Live Preview Bubble */}
        <div className="flex flex-col gap-2 pt-1">
          <label className="font-sans text-xs sm:text-sm font-medium text-heading flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-accent" />
            Live Preview (Rendered for Customer)
          </label>
          <div className="p-4 rounded-xl bg-subtle/30 border border-default/50 font-sans text-xs sm:text-sm text-heading leading-relaxed">
            {previewText}
          </div>
        </div>

        {/* Test Send Row */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 p-3.5 rounded-xl border border-default/40 bg-card">
          <div className="flex-1">
            <Input
              label="Send Test Message To"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="+92 300 1234567"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={handleTest}
            className="gap-2 shrink-0 font-medium h-[42px]"
          >
            <Send className="w-3.5 h-3.5 text-body" />
            <span>Send Test</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
