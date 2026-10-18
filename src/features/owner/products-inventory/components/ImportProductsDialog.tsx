"use client";

import * as React from "react";
import { Download, UploadCloud } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

interface ImportProductsDialogProps {
  open: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

export function ImportProductsDialog({
  open,
  onClose,
  onImportSuccess,
}: ImportProductsDialogProps) {
  const [dragOver, setDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileSelect = () => {
    // Simulated instant success stub
    onImportSuccess?.();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Import products"
      subtitle="CSV or Excel. Rows are grouped into products by design code; opening stock is posted to the stock ledger."
      maxWidthClass="sm:max-w-[700px]"
    >
      <div className="flex flex-col gap-5 select-none">
        {/* Upload Dropzone Box (Figma Node 3399:27540) */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFileSelect();
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full py-12 px-6 rounded-2xl border border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-default bg-page/40 hover:bg-page/70"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".csv, .xlsx, .xls"
            className="hidden"
          />
          <div className="size-12 rounded-xl bg-card border border-default/60 flex items-center justify-center text-heading mb-3 shadow-2xs">
            <UploadCloud className="size-6 text-heading" />
          </div>
          <p className="font-heading font-medium text-sm text-heading">
            Choose a .csv or .xlsx file
          </p>
          <p className="font-sans text-xs text-body mt-1">
            First row must be the column headings
          </p>
        </div>

        {/* Required Columns Information */}
        <p className="font-sans text-xs text-body leading-relaxed">
          Columns: design_code, name, category, collection, fabric, color, size, price, min_price, cost, opening_stock, reorder_at, sku, barcode. sku/barcode are generated when blank.
        </p>

        {/* Template Download Link */}
        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              // Stub download action
            }}
            className="inline-flex items-center gap-1.5 font-sans font-medium text-xs sm:text-sm text-heading hover:underline cursor-pointer"
          >
            <Download className="size-4 shrink-0" />
            <span>Template</span>
          </button>
        </div>
      </div>
    </Dialog>
  );
}
