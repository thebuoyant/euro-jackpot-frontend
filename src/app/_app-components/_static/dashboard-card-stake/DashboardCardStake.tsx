"use client";

import React, { useEffect, useMemo } from "react";
import { Card, CardContent, Divider, Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import { API_ROUTE_CONST } from "src/app/_app-constants/api-routes.const";
import { useDashboardStore } from "src/app/_app-stores/dashboard.store";
import { DrawRecord } from "src/app/_app-types/record.types";
import {
  parseGermanDateMaybe,
  toComparableUtcNoon,
} from "src/app/_app-utils/date.util";
import { APP_COLOR_CONST } from "src/app/_app-constants/app-color.const";

type Props = { title: string };

const COLOR_TUE = APP_COLOR_CONST.dashboard.cards.stake.colorTuesday;
const COLOR_FRI = APP_COLOR_CONST.dashboard.cards.stake.colorFriday;

export default function DashboardCardStake({ title }: Props) {
  const {
    setIsLoadingStakeData,
    records = [],
    setRecords,
  } = useDashboardStore() as any;

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setIsLoadingStakeData(true);
        const res = await fetch(`${API_ROUTE_CONST.archive}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive) setRecords((data?.records ?? []) as DrawRecord[]);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.error(err);
        if (alive) setRecords([]);
      } finally {
        if (alive) setIsLoadingStakeData(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [setIsLoadingStakeData, setRecords]);

  const toStakeNumber = (v: unknown): number => {
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    if (typeof v === "string") {
      const n = Number(v.replace(/\./g, "").replace(",", "."));
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  };

  const chartData = useMemo(() => {
    const rows = (records as DrawRecord[])
      .map((r) => {
        const value = toStakeNumber((r as any).spielEinsatz);
        const ts =
          toComparableUtcNoon?.(r.datum) ??
          (parseGermanDateMaybe
            ? parseGermanDateMaybe(r.datum)?.getTime() ?? null
            : null);

        return {
          key: r.datum,
          value,
          day: r.tag, // "Di" | "Fr"
          ts,
        };
      })
      .filter((d) => d.ts != null);

    // NEW: sort DESC so newest is first (leftmost in Recharts)
    rows.sort((a, b) => b.ts! - a.ts!);

    // With DESC, just take the first N most recent items
    const take = 24;
    const recent = rows.slice(0, take);

    // (Optional) keep DESC so newest stays left; if you prefer newest left and older to the right,
    // keep as-is. Recharts renders in array order.
    return recent.map((d) => ({
      ...d,
      fill: d.day === "Di" ? COLOR_TUE : COLOR_FRI,
      dayLabel: d.day === "Di" ? "Dienstag" : "Freitag",
    }));
  }, [records]);

  const hasData = chartData.length > 0;

  function StakeTooltip({
    active,
    label,
    payload,
  }: {
    active?: boolean;
    label?: string;
    payload?: Array<{ value: number; payload?: any }>;
  }) {
    if (!active || !payload || payload.length === 0) return null;
    const p0 = payload[0];
    const val = Number(p0.value);
    const formatted = val.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const dayLabel = p0?.payload?.dayLabel ?? "";
    return (
      <Paper sx={{ p: 1 }}>
        <Typography variant="body2">Datum: {label}</Typography>
        <Typography variant="body2">Value: {formatted} €</Typography>
        {dayLabel && <Typography variant="body2">Tag: {dayLabel}</Typography>}
      </Paper>
    );
  }

  const legendPayload = [
    {
      value: "Dienstag",
      type: "square" as const,
      color: COLOR_TUE,
      id: "legend-tue",
    },
    {
      value: "Freitag",
      type: "square" as const,
      color: COLOR_FRI,
      id: "legend-fri",
    },
  ];

  return (
    <Card className="card" elevation={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        {!hasData ? (
          <Typography variant="body2" color="text.secondary">
            Keine Daten vorhanden.
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={205}>
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 12, left: 10, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="key"
                tick={{ fontSize: 11 }}
                interval="preserveEnd"
                minTickGap={10}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                width={70}
                tickFormatter={(v: number) =>
                  Math.round(Number(v)).toLocaleString("de-DE", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                }
              />
              <Tooltip content={<StakeTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                payload={legendPayload}
                wrapperStyle={{ paddingBottom: 8 }}
              />
              <Bar dataKey="value" name="Einsatz">
                {chartData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
