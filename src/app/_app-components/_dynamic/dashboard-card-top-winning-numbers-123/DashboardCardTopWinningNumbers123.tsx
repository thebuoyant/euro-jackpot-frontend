/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo } from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import { useDashboardStore } from "src/app/_app-stores/dashboard.store";
import { API_ROUTE_CONST } from "src/app/_app-constants/api-routes.const";
import { WinningNumbersItem } from "src/app/_app-stores/winning-numbers.store";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
} from "recharts";
import { APP_COLOR_CONST } from "src/app/_app-constants/app-color.const";

type Props = { title: string; numberOfRecords?: number };

export default function DashboardCardTopWinningNumbers123({ title }: Props) {
  const { setTopWinningNumbersCounts123, topWinningNumbersCounts123 } =
    useDashboardStore() as any;

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        const res = await fetch(
          `${API_ROUTE_CONST.winningNumbersTop123}?sortedValues=${true}`,
          { signal: ac.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const data = (json?.data ?? []) as WinningNumbersItem[];

        setTopWinningNumbersCounts123(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          if (process.env.NODE_ENV !== "production") console.error(err);
          setTopWinningNumbersCounts123([]);
        }
      }
    })();

    return () => ac.abort();
  }, [setTopWinningNumbersCounts123]);

  const topWinningNumbers = topWinningNumbersCounts123.slice(0, 10);

  // Headroom für Labels innerhalb des Grids (kein Overflow nach oben)
  const yDomain = useMemo<[number, number]>(() => {
    const max = topWinningNumbers.reduce(
      (m: number, r: any) => Math.max(m, Number(r?.value ?? 0)),
      0
    );
    return [0, Math.max(3, Math.ceil(max * 1.1))]; // +10% oder min. 3
  }, [topWinningNumbers]);

  return (
    <Card className="card" elevation={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <ResponsiveContainer width="100%" height={205}>
          <BarChart
            data={topWinningNumbers}
            margin={{ top: 8, right: 12, left: 10, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis domain={yDomain} hide allowDecimals={false} /> {/* ⟵ NEU */}
            <Bar dataKey="value" name="Einsatz" isAnimationActive={false}>
              <LabelList
                dataKey="value"
                position="top"
                style={{ fontSize: 10 }} // kleinere Font für Bar-Labels
              />
              {topWinningNumbers.map((entry: any, idx: number) => (
                <Cell key={`cell-${idx}`} fill={APP_COLOR_CONST.colorPrimary} />
              ))}
            </Bar>
            <XAxis
              dataKey="key"
              tick={{ fontSize: 10 }}
              interval={0}
              height={28}
            >
              <Label value="" position="insideBottom" offset={-16} />
            </XAxis>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
