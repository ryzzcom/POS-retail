"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PosHeader } from "./PosHeader";
import { PosProductCatalog } from "./PosProductCatalog";
import { PosCart } from "./PosCart";
import { PosHeldBillsModal } from "./PosHeldBillsModal";
import { PosCheckoutModal } from "./PosCheckoutModal";
import { PosSaleCompletedModal } from "./PosSaleCompletedModal";
import { usePosCart } from "../hooks/usePosCart";
import { MOCK_POS_PRODUCTS } from "../constants";
import { PosTender, PosSaleResult } from "../types";

export interface PosTerminalViewProps {
  counterName?: string;
  cashierName?: string;
  shiftInfo?: string;
  onExit?: () => void;
}

/**
 * Full-screen POS Terminal & Checkout Flow matching all 6 Figma screens.
 * Features exactly ONE outer dark frame and exactly ONE inner cream workspace.
 */
export function PosTerminalView({
  counterName = "Counter 1",
  cashierName = "Bilal Ahmed",
  shiftInfo = "Shift opened 10:02 AM by Bilal Ahmed",
  onExit,
}: PosTerminalViewProps) {
  const router = useRouter();

  // POS Cart State Controller
  const {
    cartItems,
    customer,
    heldBills,
    billDiscount,
    pointsRedeemed,
    subtotal,
    itemCount,
    pointsDiscountPKR,
    grandTotal,
    pointsEarned,
    addToCart,
    updateQuantity,
    removeItem,
    setItemDiscount,
    attachCustomer,
    detachCustomer,
    setBillDiscount,
    setPointsRedeemed,
    holdCart,
    recallBill,
    clearCart,
    completeSale,
  } = usePosCart(cashierName, counterName);

  // Modal Visibility States
  const [isHeldBillsOpen, setIsHeldBillsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeSaleResult, setActiveSaleResult] = useState<PosSaleResult | null>(null);

  // Global Keyboard Shortcuts (F9 for Charge, Esc to dismiss)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F9" && cartItems.length > 0 && !isCheckoutOpen && !activeSaleResult) {
        e.preventDefault();
        setIsCheckoutOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cartItems.length, isCheckoutOpen, activeSaleResult]);

  // Handle Complete Sale from Checkout Modal
  const handleConfirmSale = (tenders: PosTender[]) => {
    const result = completeSale(tenders);
    setIsCheckoutOpen(false);
    setActiveSaleResult(result);
  };

  const handleStartNewSale = () => {
    setActiveSaleResult(null);
  };

  const handleOpenMySales = () => {
    router.push("/noor-pret/counter/1/my-sales");
  };

  const handleCloseShift = () => {
    router.push("/noor-pret/counter/1/shift");
  };

  return (
    // EXACTLY ONE outer dark frame: h-screen w-screen overflow-hidden bg-primary p-4 select-none
    <div className="h-screen w-screen overflow-hidden bg-primary p-4 select-none flex flex-col antialiased">
      {/* EXACTLY ONE inner cream workspace: w-full h-full bg-page rounded-[28px] overflow-hidden flex flex-col p-4 sm:p-6 gap-4 */}
      <div className="w-full h-full bg-page rounded-[28px] overflow-hidden flex flex-col p-4 sm:p-6 gap-4">
        {/* 1. POS Top Bar Header */}
        <PosHeader
          counterName={counterName}
          shiftInfo={shiftInfo}
          cashierName={cashierName}
          onOpenMySales={handleOpenMySales}
          onCloseShift={handleCloseShift}
          onExit={onExit}
        />

        {/* 2. Main Content Layout: Left Catalog + Right Cart */}
        <div className="flex-1 flex flex-col lg:flex-row gap-3.5 sm:gap-4 overflow-hidden min-h-0">
          {/* Left Panel: Barcode Scanner, Category Filter & Products Grid */}
          <PosProductCatalog
            products={MOCK_POS_PRODUCTS}
            onAddToCart={addToCart}
          />

          {/* Right Panel: Active Cart, Customer Bar, Loyalty & Total */}
          <PosCart
            cartItems={cartItems}
            customer={customer}
            subtotal={subtotal}
            itemCount={itemCount}
            pointsRedeemed={pointsRedeemed}
            pointsDiscountPKR={pointsDiscountPKR}
            billDiscount={billDiscount}
            grandTotal={grandTotal}
            pointsEarned={pointsEarned}
            heldBillsCount={heldBills.length}
            onUpdateQty={updateQuantity}
            onRemoveItem={removeItem}
            onSetItemDiscount={setItemDiscount}
            onAttachCustomer={attachCustomer}
            onDetachCustomer={detachCustomer}
            onPointsChange={setPointsRedeemed}
            onSetBillDiscount={setBillDiscount}
            onClearCart={clearCart}
            onOpenHeldBills={() => setIsHeldBillsOpen(true)}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        </div>
      </div>

      {/* 3. Park / Held Bills Modal Dialog */}
      <PosHeldBillsModal
        open={isHeldBillsOpen}
        onClose={() => setIsHeldBillsOpen(false)}
        heldBills={heldBills}
        onRecallBill={recallBill}
        onHoldCurrentCart={holdCart}
        canHoldCurrent={cartItems.length > 0}
      />

      {/* 4. Payment & Tender Checkout Modal Dialog */}
      <PosCheckoutModal
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        grandTotal={grandTotal}
        customer={customer}
        onConfirmSale={handleConfirmSale}
      />

      {/* 5. Sale Completed & Thermal Receipt Modal Dialog */}
      <PosSaleCompletedModal
        saleResult={activeSaleResult}
        open={Boolean(activeSaleResult)}
        onStartNewSale={handleStartNewSale}
      />
    </div>
  );
}
