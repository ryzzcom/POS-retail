"use client";

import * as React from "react";
import { useProductsInventory } from "../hooks/useProductsInventory";
import { ProductsInventoryHeader } from "./ProductsInventoryHeader";
import { ProductsInventoryTabs } from "./ProductsInventoryTabs";
import { ProductsInventoryToolbar } from "./ProductsInventoryToolbar";
import { ProductsInventoryTable } from "./ProductsInventoryTable";
import { StocktakeView } from "./StocktakeView";
import { StockLedgerView } from "./StockLedgerView";
import { ImportProductsDialog } from "./ImportProductsDialog";
import { NewProductDialog } from "./NewProductDialog";
import { AdjustStockDialog } from "./AdjustStockDialog";
import { PrintBarcodeModal } from "./PrintBarcodeModal";

export function ProductsInventoryView() {
  const {
    products,
    filteredTotalCount,
    summary,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    status,
    setStatus,
    sortBy,
    setSortBy,
    lowStockOnly,
    setLowStockOnly,
    currentPage,
    setCurrentPage,
    pageSize,
    isImportModalOpen,
    setIsImportModalOpen,
    isNewProductModalOpen,
    setIsNewProductModalOpen,
    productToEdit,
    setProductToEdit,
    adjustStockModal,
    setAdjustStockModal,
    printLabelModal,
    setPrintLabelModal,
    handleSaveProduct,
    handleArchiveProduct,
    handleConfirmStockAdjustment,
    handleExportCSV,
  } = useProductsInventory();

  return (
    <div className="w-full flex flex-col gap-6 lg:gap-8 pb-6 animate-in fade-in-50 duration-200 select-none">
      {/* 1. Page Header (Figma Node 3386:20563) */}
      <ProductsInventoryHeader
        productsCount={summary.activeProductsCount}
        totalUnits={summary.totalUnitsOnHand}
        inventoryValuationCost={summary.inventoryValuationCost}
        onNewProduct={() => {
          setProductToEdit(null);
          setIsNewProductModalOpen(true);
        }}
        onImport={() => setIsImportModalOpen(true)}
        onExport={handleExportCSV}
      />

      {/* 2. Top Navigation Tabs: Catalog | Stocktake | Stock ledger (Figma Node 3386:17827) */}
      <ProductsInventoryTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* 3. Tab Contents */}
      {activeTab === "catalog" && (
        <div className="flex flex-col gap-5">
          {/* Filter & Search Toolbar (Figma Node 3386:20658) */}
          <ProductsInventoryToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            category={category}
            onCategoryChange={setCategory}
            status={status}
            onStatusChange={setStatus}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            lowStockOnly={lowStockOnly}
            onLowStockToggle={setLowStockOnly}
          />

          {/* Products & Inventory Data Table with Expandable Variants (Figma Node 3386:17827 & Component 5) */}
          <ProductsInventoryTable
            products={products}
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredTotalCount}
            onPageChange={setCurrentPage}
            onEditProduct={(product) => {
              setProductToEdit(product);
              setIsNewProductModalOpen(true);
            }}
            onArchiveProduct={handleArchiveProduct}
            onAdjustStock={(product, variant) => {
              setAdjustStockModal({
                open: true,
                product,
                variant,
              });
            }}
            onPrintLabels={(product, variant) => {
              setPrintLabelModal({
                open: true,
                product,
                variant,
              });
            }}
            onViewLedger={() => {
              setActiveTab("ledger");
            }}
          />
        </div>
      )}

      {activeTab === "stocktake" && <StocktakeView />}

      {activeTab === "ledger" && <StockLedgerView />}

      {/* 4. Modals and Dialogs */}
      <ImportProductsDialog
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <NewProductDialog
        open={isNewProductModalOpen}
        onClose={() => {
          setIsNewProductModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSave={handleSaveProduct}
      />

      <AdjustStockDialog
        open={adjustStockModal.open}
        onClose={() =>
          setAdjustStockModal({ open: false, product: null, variant: null })
        }
        product={adjustStockModal.product}
        variant={adjustStockModal.variant}
        onConfirm={handleConfirmStockAdjustment}
      />

      <PrintBarcodeModal
        open={printLabelModal.open}
        onClose={() =>
          setPrintLabelModal({ open: false, product: null, variant: null })
        }
        product={printLabelModal.product}
        variant={printLabelModal.variant}
      />
    </div>
  );
}
