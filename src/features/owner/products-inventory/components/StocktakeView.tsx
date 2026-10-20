"use client";

import * as React from "react";
import { Barcode } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StocktakeViewProps {
  className?: string;
}

export function StocktakeView({ className }: StocktakeViewProps) {
  const [isInProgress, setIsInProgress] = React.useState(false);
  const [countedValues, setCountedValues] = React.useState<Record<string, number>>({});

  const sampleStocktakeItems = [
    {
      id: "stk-1",
      name: "Embroidered Lawn 3-Piece",
      meta: "Mint Standard • LW2401-MNT-STD",
      systemQty: 14,
    },
    {
      id: "stk-2",
      name: "Embroidered Lawn 3-Piece",
      meta: "Peach Standard • LW2401-PCH-STD",
      systemQty: 3,
    },
    {
      id: "stk-3",
      name: "Straight Cotton Kurta",
      meta: "Black S • KT118-BLK-S",
      systemQty: 0,
    },
  ];

  const handleCountChange = (id: string, val: string) => {
    const num = parseInt(val, 10);
    setCountedValues((prev) => ({
      ...prev,
      [id]: isNaN(num) ? 0 : num,
    }));
  };

  return (
    <div className={cn("w-full flex flex-col gap-6 select-none", className)}>
      {!isInProgress ? (
        <>
          {/* 1. Count Scope Setup Card (Figma Node 3396:23483) */}
          <div className="w-full bg-card rounded-[22px] border border-default/50 p-6 sm:p-7 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="font-sans font-medium text-sm text-heading">
                Count scope
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                <Select
                  options={[
                    { label: "All", value: "all" },
                    { label: "Unstitched", value: "unstitched" },
                    { label: "Pret", value: "pret" },
                    { label: "Formal", value: "formal" },
                    { label: "Bottoms", value: "bottoms" },
                  ]}
                  defaultValue="all"
                  sizeVariant="pill"
                  className="min-w-[200px]"
                  aria-label="Count scope"
                />

                <Button
                  type="button"
                  variant="primary"
                  onClick={() => setIsInProgress(true)}
                  className="rounded-full"
                >
                  Start Stocktake
                </Button>
              </div>
            </div>

            <p className="font-sans text-xs text-body leading-relaxed max-w-2xl">
              System quantities are frozen at the start. Posting adjusts each line by (counted - frozen), so sales during the count aren&apos;t lost.
            </p>
          </div>

          {/* 2. Past Counts Card (Figma Node 3396:23483) */}
          <div className="w-full bg-card rounded-[22px] border border-default/50 p-6 sm:p-7 shadow-xs flex flex-col gap-4">
            <h3 className="font-heading font-medium text-sm text-heading">
              Past counts
            </h3>
            <div className="pt-2 border-t border-default/30">
              <p className="font-sans text-xs sm:text-sm text-body">
                No stocktakes yet.
              </p>
            </div>
          </div>
        </>
      ) : (
        /* 3. In-Progress Stocktake View (Figma Node 3396:24387) */
        <div className="w-full bg-card rounded-[22px] border border-default/50 p-6 sm:p-7 shadow-xs flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-default/30">
            <div className="flex flex-col gap-1">
              <h3 className="font-heading font-medium text-base text-heading">
                STK-0001 · Whole store
              </h3>
              <p className="font-sans text-xs text-body">
                0/29 counted · value difference Rs. 0
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-56">
                <Input
                  type="text"
                  placeholder="Scan label → +1"
                  leftIcon={<Barcode className="size-4" />}
                  className="h-10 text-xs"
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsInProgress(false)}
                className="text-xs sm:text-sm"
              >
                Cancel count
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={() => setIsInProgress(false)}
                className="text-xs sm:text-sm rounded-full"
              >
                Post Differences
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[540px] border-collapse text-left">
              <thead>
                <tr className="text-xs font-sans text-body border-b border-default/30">
                  <th className="py-2.5 px-4 font-normal">Item</th>
                  <th className="py-2.5 px-4 font-normal text-center">System</th>
                  <th className="py-2.5 px-4 font-normal text-center">Counted</th>
                  <th className="py-2.5 px-4 font-normal text-right">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default/20 text-xs sm:text-sm font-sans">
                {sampleStocktakeItems.map((item) => {
                  const counted = countedValues[item.id] ?? "";
                  const numCounted = typeof counted === "number" ? counted : null;
                  const diff = numCounted !== null ? numCounted - item.systemQty : null;

                  return (
                    <tr key={item.id} className="hover:bg-subtle/10 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-heading block">
                          {item.name}
                        </span>
                        <span className="text-xs text-body block">
                          {item.meta}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-heading">
                        {item.systemQty}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="w-20 mx-auto">
                          <Input
                            type="number"
                            value={counted}
                            onChange={(e) => handleCountChange(item.id, e.target.value)}
                            className="h-8 text-center text-xs"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {diff !== null ? (
                          <span
                            className={cn(
                              diff > 0
                                ? "text-status-success"
                                : diff < 0
                                ? "text-status-error"
                                : "text-body"
                            )}
                          >
                            {diff > 0 ? `+${diff}` : diff}
                          </span>
                        ) : (
                          <span className="text-muted">--</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
