"use client";

import { useState, useMemo, useCallback } from "react";
import {
  PosProduct,
  ProductVariant,
  PosCartItem,
  PosCustomer,
  PosHeldBill,
  PosTender,
  PosSaleResult,
} from "../types";

export function usePosCart(cashierName: string = "Bilal Ahmed", counterId: string = "1") {
  const [cartItems, setCartItems] = useState<PosCartItem[]>([]);
  const [customer, setCustomer] = useState<PosCustomer | null>(null);
  const [heldBills, setHeldBills] = useState<PosHeldBill[]>([]);
  const [billDiscount, setBillDiscount] = useState<number>(0);
  const [pointsRedeemed, setPointsRedeemed] = useState<number>(0);

  // 1. Add to cart
  const addToCart = useCallback(
    (product: PosProduct, selectedVariant?: ProductVariant, qty: number = 1) => {
      const variant = selectedVariant || product.variants[0];
      const cartItemId = `${product.id}-${variant.id}`;

      setCartItems((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === cartItemId);
        if (existingIndex > -1) {
          const updated = [...prev];
          const existing = updated[existingIndex];
          const newQty = existing.quantity + qty;
          const lineTotal = newQty * existing.unitPrice;
          updated[existingIndex] = {
            ...existing,
            quantity: newQty,
            lineTotal,
          };
          return updated;
        }

        const newItem: PosCartItem = {
          id: cartItemId,
          productId: product.id,
          productName: product.name,
          code: product.code,
          image: product.image,
          variantId: variant.id,
          sku: variant.sku,
          size: variant.size,
          color: variant.color,
          unitPrice: variant.price || product.price,
          quantity: qty,
          lineTotal: (variant.price || product.price) * qty,
        };

        return [newItem, ...prev];
      });
    },
    []
  );

  // 2. Update quantity
  const updateQuantity = useCallback((cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity: newQty,
            lineTotal: newQty * item.unitPrice,
          };
        }
        return item;
      })
    );
  }, []);

  // 3. Remove single item
  const removeItem = useCallback((cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  // 4. Set per-item discount
  const setItemDiscount = useCallback(
    (
      cartItemId: string,
      discountType: "percentage" | "fixed",
      discountValue: number
    ) => {
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.id === cartItemId) {
            const rawTotal = item.quantity * item.unitPrice;
            const discountAmount =
              discountType === "percentage"
                ? (rawTotal * discountValue) / 100
                : discountValue;
            const lineTotal = Math.max(0, rawTotal - discountAmount);

            return {
              ...item,
              discountType,
              discountValue,
              lineTotal,
            };
          }
          return item;
        })
      );
    },
    []
  );

  // 5. Attach & Detach Customer
  const attachCustomer = useCallback((cust: PosCustomer) => {
    setCustomer(cust);
    setPointsRedeemed(0);
  }, []);

  const detachCustomer = useCallback(() => {
    setCustomer(null);
    setPointsRedeemed(0);
  }, []);

  // 6. Hold current bill
  const holdCart = useCallback(
    (note?: string) => {
      if (cartItems.length === 0) return;

      const subtotalVal = cartItems.reduce((acc, curr) => acc + curr.lineTotal, 0);
      const held: PosHeldBill = {
        id: `held-${Date.now()}`,
        heldAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        customer,
        items: [...cartItems],
        subtotal: subtotalVal,
        total: Math.max(0, subtotalVal - billDiscount - pointsRedeemed),
        note,
      };

      setHeldBills((prev) => [held, ...prev]);
      setCartItems([]);
      setCustomer(null);
      setBillDiscount(0);
      setPointsRedeemed(0);
    },
    [cartItems, customer, billDiscount, pointsRedeemed]
  );

  // 7. Recall held bill
  const recallBill = useCallback(
    (heldBillId: string) => {
      const target = heldBills.find((b) => b.id === heldBillId);
      if (!target) return;

      setCartItems(target.items);
      setCustomer(target.customer);
      setHeldBills((prev) => prev.filter((b) => b.id !== heldBillId));
    },
    [heldBills]
  );

  // 8. Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    setCustomer(null);
    setBillDiscount(0);
    setPointsRedeemed(0);
  }, []);

  // Computations
  const subtotal = useMemo(
    () => cartItems.reduce((acc, curr) => acc + curr.lineTotal, 0),
    [cartItems]
  );

  const itemCount = useMemo(
    () => cartItems.reduce((acc, curr) => acc + curr.quantity, 0),
    [cartItems]
  );

  const pointsDiscountPKR = pointsRedeemed; // 1 point = Rs. 1

  const grandTotal = useMemo(
    () => Math.max(0, subtotal - pointsDiscountPKR - billDiscount),
    [subtotal, pointsDiscountPKR, billDiscount]
  );

  // Earn 1 point per Rs. 100 spent
  const pointsEarned = useMemo(() => Math.floor(grandTotal / 100), [grandTotal]);

  // 9. Complete Sale
  const completeSale = useCallback(
    (tenders: PosTender[]): PosSaleResult => {
      const receiptNumber = `NP-0104${Math.floor(10 + Math.random() * 90)}`;
      const completedAt = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const totalTendered = tenders.reduce(
        (acc, curr) => acc + (curr.cashTendered || curr.amount),
        0
      );
      const changeDuePKR = Math.max(0, totalTendered - grandTotal);
      const newPointsBalance = customer
        ? customer.pointsBalance - pointsRedeemed + pointsEarned
        : 0;

      const result: PosSaleResult = {
        receiptNumber,
        completedAt,
        customer,
        items: [...cartItems],
        subtotal,
        pointsRedeemed,
        pointsDiscountPKR,
        billDiscountPKR: billDiscount,
        grandTotalPKR: grandTotal,
        tenders,
        changeDuePKR,
        pointsEarned,
        newPointsBalance,
        cashierName,
        counterId,
      };

      // Reset cart for next customer
      clearCart();

      return result;
    },
    [
      cartItems,
      customer,
      subtotal,
      pointsRedeemed,
      pointsDiscountPKR,
      billDiscount,
      grandTotal,
      pointsEarned,
      cashierName,
      counterId,
      clearCart,
    ]
  );

  return {
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
  };
}
