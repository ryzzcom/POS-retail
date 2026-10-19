"use client";

import * as React from "react";
import { TemplateItem, TemplateCategory } from "../types/whatsapp-campaigns.types";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedFilter, SegmentedFilterOption } from "@/components/ui/segmented-filter";
import { Badge } from "@/components/ui/badge";
import { Plus, Send, CheckCircle2 } from "lucide-react";

interface TemplatesTabProps {
  templates: TemplateItem[];
  onOpenNewTemplate: () => void;
  onEditTemplate: (template: TemplateItem) => void;
  onTestTemplate: (template: TemplateItem) => void;
}

const CATEGORY_FILTERS: SegmentedFilterOption[] = [
  { label: "All", value: "all" },
  { label: "Digital receipt", value: "Digital receipt" },
  { label: "Loyalty update", value: "Loyalty update" },
  { label: "New arrivals", value: "New arrivals" },
  { label: "Khata reminder", value: "Khata reminder" },
  { label: "Review request", value: "Review request" },
];

export function TemplatesTab({
  templates,
  onOpenNewTemplate,
  onEditTemplate,
  onTestTemplate,
}: TemplatesTabProps) {
  const [filter, setFilter] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredTemplates = React.useMemo(() => {
    return templates.filter((item) => {
      if (filter !== "all" && item.category !== filter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesBody = item.body.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesBody) {
          return false;
        }
      }
      return true;
    });
  }, [templates, filter, searchQuery]);

  // Helper to render message body with highlighted variable pills
  const renderMessageBody = (body: string) => {
    // Split by {{...}}
    const parts = body.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, index) => {
      if (part.startsWith("{{") && part.endsWith("}}")) {
        return (
          <span
            key={index}
            className="inline-block bg-subtle/80 text-heading font-mono text-xs px-1.5 py-0.5 rounded border border-default/60 mx-0.5 font-medium"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* 1. Header Toolbar matching Figma Node 3469:54346 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <SegmentedFilter
          options={CATEGORY_FILTERS}
          value={filter}
          onChange={setFilter}
          sizeVariant="sm"
          aria-label="Filter templates by category"
        />

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenNewTemplate}
          className="gap-2 font-medium shrink-0 self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Template</span>
        </Button>
      </div>

      {/* 2. Search Toolbar */}
      <div className="w-full sm:max-w-md">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search WhatsApp templates by name or content..."
        />
      </div>

      {/* 3. Templates List Container */}
      <div className="w-full bg-card rounded-2xl border border-default/50 overflow-hidden divide-y divide-default/40 shadow-xs">
        {filteredTemplates.length === 0 ? (
          <div className="p-8 text-center text-body font-sans text-sm">
            No approved WhatsApp templates found matching your search.
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-subtle/10 transition-colors"
            >
              <div className="flex flex-col gap-1.5 max-w-3xl">
                {/* Title and Category */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-heading font-semibold text-sm sm:text-base text-heading">
                    {template.name}
                  </span>
                  <span className="text-muted text-xs">·</span>
                  <span className="font-sans text-xs text-body">
                    {template.category}
                  </span>
                  <Badge
                    variant={template.metaCategory === "Marketing" ? "gold" : "delivered"}
                    size="sm"
                    className="text-[11px] h-5 px-2 ml-1"
                  >
                    {template.metaCategory}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-[11px] font-sans text-status-success font-medium ml-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Meta Approved
                  </span>
                </div>

                {/* Message Body with Highlighted Variables */}
                <div className="font-sans text-xs sm:text-sm text-body leading-relaxed pt-0.5">
                  {renderMessageBody(template.body)}
                </div>
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTestTemplate(template)}
                  className="h-8 px-2.5 text-xs text-body hover:text-heading gap-1 font-medium"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Test Send</span>
                </Button>

                <button
                  type="button"
                  onClick={() => onEditTemplate(template)}
                  className="font-sans text-sm font-medium text-heading underline hover:text-primary transition-colors cursor-pointer px-1"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
