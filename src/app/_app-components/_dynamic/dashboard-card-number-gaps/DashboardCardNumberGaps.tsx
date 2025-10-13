/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, Divider, Typography, Paper } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  Tooltip,
  LabelList,
} from "recharts";
import { API_ROUTE_CONST } from "src/app/_app-constants/api-routes.const";
import { useDashboardStore } from "src/app/_app-stores/dashboard.store";
import { TNumberGap } from "src/app/_app-handlers/handleGetNumberGaps";
import SkeletonBarChart from "src/app/_app-components/_static/skeleton-bar-chart/SkeletonBarChart";
import { APP_COLOR_CONST } from "src/app/_app-constants/app-color.const";

type Props = { title: string; topN?: number };

// Optional: schöner Tooltip
function GapTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: any }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p0 = payload[0]?.payload as TNumberGap & { label?: string };
  if (!p0) return null;
  return (
    <Paper sx={{ p: 1 }}>
      <Typography variant="body2">Zahl: {p0.number}</Typography>
      <Typography variant="body2">Overdue (Gap): {p0.gap}</Typography>
      {p0.lastDate && (
        <Typography variant="body2">Zuletzt: {p0.lastDate}</Typography>
      )}
    </Paper>
  );
}

export default function DashboardCardNumberGaps({ title, topN = 10 }: Props) {
  const {
    isLoadingNumberGaps,
    setIsLoadingNumberGaps,
    numberGaps = [],
    setNumberGaps,
  } = useDashboardStore() as any;

  const [errMsg, setErrMsg] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setErrMsg(null);
        setIsLoadingNumberGaps(true);

        const res = await fetch(API_ROUTE_CONST.numberGaps, {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const rows = (json?.data ?? []) as TNumberGap[];

        setNumberGaps(Array.isArray(rows) ? rows : []);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          if (process.env.NODE_ENV !== "production") console.error(err);
          setErrMsg("Fehler beim Laden der Daten.");
          setNumberGaps([]);
        }
      } finally {
        if (!ac.signal.aborted) {
          setIsLoadingNumberGaps(false);
          hasFetchedRef.current = true;
        }
      }
    })();
    return () => ac.abort();
  }, [setIsLoadingNumberGaps, setNumberGaps]);

  // Top-N „überfälligste“ Zahlen
  const data = useMemo(() => numberGaps.slice(0, topN), [numberGaps, topN]);

  // Headroom für Labels innerhalb des Grids
  const yDomain = useMemo<[number, number]>(() => {
    const max = data.reduce(
      (m: number, r: any) => Math.max(m, Number(r?.gap ?? 0)),
      0
    );
    return [0, Math.max(3, Math.ceil(max * 1.1))];
  }, [data]);

  const showSkeleton = !hasFetchedRef.current || isLoadingNumberGaps;

  return (
    <Card className="card" elevation={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />

        {errMsg ? (
          <Typography variant="body2" color="error" sx={{ mb: 1 }}>
            {errMsg}
          </Typography>
        ) : null}

        {showSkeleton ? (
          <SkeletonBarChart
            height={205}
            bars={topN}
            margin={{ top: 8, right: 12, left: 10, bottom: 8 }}
            barGap={8}
            maxBarHeight={140}
            showXAxisLine
          />
        ) : data.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Keine Daten vorhanden.
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={205}>
            <BarChart
              data={data.map((r: any) => ({ ...r, key: String(r.number) }))}
              margin={{ top: 8, right: 12, left: 10, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis domain={yDomain} hide allowDecimals={false} />
              <Tooltip content={<GapTooltip />} />
              <Bar dataKey="gap" name="Gap" isAnimationActive={false}>
                <LabelList
                  dataKey="gap"
                  position="top"
                  style={{ fontSize: 10 }}
                />
                {data.map((_: any, idx: number) => (
                  <Cell
                    key={`gap-cell-${idx}`}
                    fill={APP_COLOR_CONST.colorPrimary}
                  />
                ))}
              </Bar>
              <XAxis
                dataKey="key"
                tick={{ fontSize: 10 }}
                interval={0}
                height={28}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
