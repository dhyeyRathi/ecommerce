"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchUserOrders } from "@/app/lib/supabase";

export function useOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  return { orders, loading, error, refreshOrders };
}
