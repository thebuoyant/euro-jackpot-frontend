/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import { useDashboardStore } from "src/app/_app-stores/dashboard.store";
import { API_ROUTE_CONST } from "src/app/_app-constants/api-routes.const";
import { WinningNumbersItem } from "src/app/_app-stores/winning-numbers.store";

type Props = { title: string; numberOfRecords?: number };

export default function DashboardCardTopWinningNumbers({ title }: Props) {
  const { setTopWinningNumbersCounts, topWinningNumbersCounts } =
    useDashboardStore() as any;

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `${API_ROUTE_CONST.winningNumbers}?sortedValues=${true}`,
          { signal: ac.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const data = (json?.data ?? []) as WinningNumbersItem[];

        setTopWinningNumbersCounts(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          if (process.env.NODE_ENV !== "production") console.error(err);
          setTopWinningNumbersCounts([]);
        }
      }
    })();

    return () => ac.abort();
  }, [setTopWinningNumbersCounts]);
  const topWinningNumbers = topWinningNumbersCounts.slice(0, 5);
  console.log("topWinningNumbers", topWinningNumbers);
  return (
    <Card className="card" elevation={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        top winning numbers goes here
      </CardContent>
    </Card>
  );
}
