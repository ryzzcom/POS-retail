"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, RefreshCw, UploadCloud, Loader2, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { formatPKR } from "@/lib/formatters";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  productSchema,
  ProductFormValues,
} from "../schemas/products-inventory.schemas";
import { ProductItem } from "../types/products-inventory.types";

interface NewProductDialogProps {
  open: boolean;
  onClose: () => void;
  productToEdit?: ProductItem | null;
  onSave?: (data: ProductFormValues) => void;
}

export function NewProductDialog({
  open,
  onClose,
  productToEdit,
  onSave,
}: NewProductDialogProps) {
  // Quick matrix generator inputs
  const [matrixColours, setMatrixColours] = React.useState("Black, Maroon");
  const [matrixSizes, setMatrixSizes] = React.useState("S, M, L");
  const [matrixPrice, setMatrixPrice] = React.useState("9500");
  const [matrixCost, setMatrixCost] = React.useState("5890");

  const defaultValues: ProductFormValues = {
    name: productToEdit?.name || "",
    designCode: productToEdit?.sku || "LW-2401",
    category: productToEdit?.category || "pret",
    subCategory: "3-piece suit",
    brand: "Signature Pret",
    season: "Winter 26",
    supplier: "Default Mill",
    collection: productToEdit?.collection || "Winter Pret",
    fabric: productToEdit?.fabric || "Cotton Silk",
    minPrice: productToEdit?.minPrice || 7800,
    gstRate: 0,
    description: "",
    imageUrl: "",
    variants: productToEdit?.variants?.length
      ? productToEdit.variants.map((v) => ({
          id: v.id,
          color: v.color,
          size: v.size,
          sku: v.sku,
          barcode: v.barcode,
          costPrice: v.costPrice,
          retailPrice: v.retailPrice,
          stock: v.onHand,
          reorderLevel: v.reorderLevel,
        }))
      : [
          {
            color: "Maroon",
            size: "S",
            sku: "21321-DAS-DASD",
            barcode: "8964001240167",
            retailPrice: 9500,
            costPrice: 5890,
            stock: 10,
            reorderLevel: 2,
          },
        ],
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);

  const currentImageUrl = watch("imageUrl");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      const url = await uploadToCloudinary(file);
      setValue("imageUrl", url, { shouldValidate: true, shouldDirty: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Re-populate when editing changes
  React.useEffect(() => {
    if (open) {
      if (productToEdit) {
        reset({
          name: productToEdit.name,
          designCode: productToEdit.sku,
          category: productToEdit.category,
          subCategory: "Ready to wear",
          brand: "Signature Pret",
          season: "Winter 26",
          supplier: "Default Mill",
          collection: productToEdit.collection,
          fabric: productToEdit.fabric,
          minPrice: productToEdit.minPrice,
          gstRate: 0,
          description: "",
          imageUrl: "",
          variants: productToEdit.variants.map((v) => ({
            id: v.id,
            color: v.color,
            size: v.size,
            sku: v.sku,
            barcode: v.barcode,
            costPrice: v.costPrice,
            retailPrice: v.retailPrice,
            stock: v.onHand,
            reorderLevel: v.reorderLevel,
          })),
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [open, productToEdit, reset]);

  // Handle matrix generation
  const handleAddMatrix = () => {
    const colours = matrixColours
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    const sizes = matrixSizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const p = parseFloat(matrixPrice) || 0;
    const c = parseFloat(matrixCost) || 0;

    colours.forEach((col) => {
      sizes.forEach((sz) => {
        const randomEan = `896400${Math.floor(100000 + Math.random() * 900000)}`;
        append({
          color: col,
          size: sz,
          sku: `${col.slice(0, 3).toUpperCase()}-${sz.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
          barcode: randomEan,
          retailPrice: p,
          costPrice: c,
          stock: 5,
          reorderLevel: 2,
        });
      });
    });
  };

  const onSubmit = (data: ProductFormValues) => {
    onSave?.(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={productToEdit ? "Edit Product" : "New product"}
      subtitle="Stock can't be typed in here — new variants get opening stock as a ledger movement; later changes go through receiving or adjustments."
      maxWidthClass="sm:max-w-[850px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 select-none">
        {/* Product Name (Figma Node 3404:28823) */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans font-medium text-xs sm:text-sm text-heading">
            Product name
          </label>
          <input
            type="text"
            {...register("name")}
            placeholder="e.g. Embroidered Lawn 3-Piece"
            className="w-full h-11 px-4 rounded-xl bg-card border border-default font-sans text-xs sm:text-sm text-heading focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
          {errors.name && (
            <span className="text-xs text-status-error">{errors.name.message}</span>
          )}
        </div>

        {/* Design Code & Category Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-medium text-xs sm:text-sm text-heading">
              Design / style code
            </label>
            <input
              type="text"
              {...register("designCode")}
              placeholder="e.g. LW-2401"
              className="w-full h-11 px-4 rounded-xl bg-card border border-default font-sans text-xs sm:text-sm text-heading focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            {errors.designCode && (
              <span className="text-xs text-status-error">
                {errors.designCode.message}
              </span>
            )}
          </div>

          <Select
            label="Category"
            options={[
              { label: "Pret", value: "pret" },
              { label: "Formal", value: "formal" },
              { label: "Unstitched", value: "unstitched" },
              { label: "Bottoms", value: "bottoms" },
              { label: "Kids", value: "kids" },
              { label: "Men", value: "men" },
              { label: "Accessories", value: "accessories" },
            ]}
            value={watch("category")}
            onChange={(val) => setValue("category", val, { shouldValidate: true })}
            fullWidth
            sizeVariant="md"
            error={errors.category?.message}
          />
        </div>

        {/* Sub-Category, Brand, Season */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-medium text-xs sm:text-sm text-heading">
              Sub-category
            </label>
            <input
              type="text"
              {...register("subCategory")}
              placeholder="e.g. 3-piece suit"
              className="w-full h-11 px-4 rounded-xl bg-card border border-default font-sans text-xs sm:text-sm text-heading focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-medium text-xs sm:text-sm text-heading">
              Brand
            </label>
            <input
              type="text"
              {...register("brand")}
              placeholder="e.g. Asim Jofa"
              className="w-full h-11 px-4 rounded-xl bg-card border border-default font-sans text-xs sm:text-sm text-heading focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Season & Min Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-medium text-xs sm:text-sm text-heading">
              Season
            </label>
            <input
              type="text"
              {...register("season")}
              placeholder="e.g. Winter"
              className="w-full h-11 px-4 rounded-xl bg-card border border-default font-sans text-xs sm:text-sm text-heading focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-medium text-xs sm:text-sm text-heading">
              Minimum selling price (Rs.)
            </label>
            <input
              type="number"
              {...register("minPrice")}
              placeholder="e.g. 7800"
              className="w-full h-11 px-4 rounded-xl bg-card border border-default font-sans text-xs sm:text-sm text-heading focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <span className="text-[11px] text-body">
              Enforced at checkout, including after discounts.
            </span>
          </div>
        </div>

        {/* Image Upload Box (Cloudinary Direct + URL fallback) */}
        <div className="flex flex-col gap-1.5">
          <label className="font-sans font-medium text-xs sm:text-sm text-heading">
            Product media
          </label>

          {/* Hidden native file input triggered by button click */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp,image/jpg"
            className="hidden"
          />

          <div className="w-full p-4 rounded-xl border border-dashed border-default bg-page/30 flex flex-col sm:flex-row items-center gap-4">
            {/* Thumbnail Preview or Upload Trigger Box */}
            {currentImageUrl ? (
              <div className="relative size-16 rounded-lg bg-card border border-default overflow-hidden shrink-0 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentImageUrl}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setValue("imageUrl", "")}
                  className="absolute inset-0 bg-heading/70 text-dark-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Remove image"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="size-16 rounded-lg bg-card border border-default flex flex-col items-center justify-center text-muted hover:text-heading hover:border-primary transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                title="Browse file to upload"
              >
                {isUploading ? (
                  <Loader2 className="size-5 mb-0.5 animate-spin text-primary" />
                ) : (
                  <UploadCloud className="size-5 mb-0.5" />
                )}
                <span className="text-[10px]">{isUploading ? "..." : "Upload"}</span>
              </button>
            )}

            <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                placeholder="...or paste an image URL"
                className="w-full h-10 px-3 rounded-lg bg-card border border-default font-sans text-xs text-heading focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                {...register("imageUrl")}
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto h-10 px-4 rounded-lg bg-primary text-dark-primary font-sans font-medium text-xs shrink-0 cursor-pointer hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="size-3.5" />
                    <span>Browse Image</span>
                  </>
                )}
              </button>
            </div>
          </div>
          {uploadError && (
            <p className="text-[11px] text-status-error font-sans">{uploadError}</p>
          )}
        </div>

        {/* Colours × sizes matrix generator (Figma Node 3404:28823) */}
        <div className="w-full rounded-2xl border border-default/60 bg-page/40 p-4 sm:p-5 flex flex-col gap-4">
          <h4 className="font-heading font-medium text-sm text-heading">
            Colours × sizes
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-body">Colours</label>
              <input
                type="text"
                value={matrixColours}
                onChange={(e) => setMatrixColours(e.target.value)}
                placeholder="Black, Maroon"
                className="h-9 px-3 rounded-lg bg-card border border-default font-sans text-xs text-heading"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-body">Sizes</label>
              <input
                type="text"
                value={matrixSizes}
                onChange={(e) => setMatrixSizes(e.target.value)}
                placeholder="S, M, L or 36, 38"
                className="h-9 px-3 rounded-lg bg-card border border-default font-sans text-xs text-heading"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-body">Price</label>
              <input
                type="number"
                value={matrixPrice}
                onChange={(e) => setMatrixPrice(e.target.value)}
                placeholder="9500"
                className="h-9 px-3 rounded-lg bg-card border border-default font-sans text-xs text-heading"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-body">Cost</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={matrixCost}
                  onChange={(e) => setMatrixCost(e.target.value)}
                  placeholder="5890"
                  className="w-full h-9 px-3 rounded-lg bg-card border border-default font-sans text-xs text-heading"
                />
                <button
                  type="button"
                  onClick={handleAddMatrix}
                  className="h-9 px-3 rounded-lg bg-primary text-dark-primary font-sans font-medium text-xs flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Matrix Variants List Table */}
          <div className="w-full overflow-x-auto custom-scrollbar border-t border-default/40 pt-3">
            <table className="w-full min-w-[620px] border-collapse text-left text-xs font-sans">
              <thead>
                <tr className="text-body border-b border-default/30">
                  <th className="py-2 px-2 font-medium">Colour / size</th>
                  <th className="py-2 px-2 font-medium">SKU</th>
                  <th className="py-2 px-2 font-medium">Barcode</th>
                  <th className="py-2 px-2 font-medium">Price</th>
                  <th className="py-2 px-2 font-medium">Cost</th>
                  <th className="py-2 px-2 font-medium">Stock</th>
                  <th className="py-2 px-2 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default/20 text-heading">
                {fields.map((field, idx) => (
                  <tr key={field.id}>
                    <td className="py-2.5 px-2 font-medium whitespace-nowrap">
                      {field.color} • {field.size}
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="text"
                        {...register(`variants.${idx}.sku`)}
                        className="w-28 h-8 px-2 rounded-md bg-card border border-default text-[11px]"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          {...register(`variants.${idx}.barcode`)}
                          className="w-28 h-8 px-2 rounded-md bg-card border border-default text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // refresh barcode
                          }}
                          className="p-1 rounded text-muted hover:text-heading cursor-pointer"
                        >
                          <RefreshCw className="size-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        {...register(`variants.${idx}.retailPrice`)}
                        className="w-18 h-8 px-2 rounded-md bg-card border border-default text-xs"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        {...register(`variants.${idx}.costPrice`)}
                        className="w-18 h-8 px-2 rounded-md bg-card border border-default text-xs"
                      />
                    </td>
                    <td className="py-2.5 px-2">
                      <input
                        type="number"
                        {...register(`variants.${idx}.stock`)}
                        className="w-16 h-8 px-2 rounded-md bg-card border border-default text-xs"
                      />
                    </td>
                    <td className="py-2.5 px-2 text-right">
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="text-status-error hover:underline text-xs cursor-pointer"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-sans text-[11px] text-body leading-normal pt-1">
            Average margin 31% · min price Rs. 2,500. Barcodes are EAN-13 with a verified check digit; supplier codes are mapped so either scans.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-default/50">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-full border border-default bg-card font-sans font-medium text-xs sm:text-sm text-heading hover:bg-subtle/30 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="h-10 px-6 rounded-full bg-primary font-sans font-medium text-xs sm:text-sm text-dark-primary hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
          >
            {productToEdit ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}
