"use client";

import { useState } from "react";

export function usePosTerminal() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<unknown[]>([]);

  return {
    data,
    setData,
    isLoading,
    setIsLoading,
  };
}
