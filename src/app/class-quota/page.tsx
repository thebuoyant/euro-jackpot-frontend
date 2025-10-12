/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Tabs, Tab, Typography, Divider, Paper } from "@mui/material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./ClassQuota.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";
import { API_ROUTE_CONST } from "../_app-constants/api-routes.const";

type TClassQuotaPoint = {
  datum: string;
  valueAsNumber: number;
  valueAsString: string;
};

function a11yProps(index: number) {
  return {
    id: `class-tab-${index}`,
    "aria-controls": `class-tabpanel-${index}`,
  };
}

function TabPanel({
  children,
  value,
  index,
}: {
  children?: React.ReactNode;
  value: number;
  index: number;
}) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`class-tabpanel-${index}`}
      aria-labelledby={`class-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

function QuotaTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: Array<{ payload?: any }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p0 = payload[0]?.payload as TClassQuotaPoint | undefined;
  if (!p0) return null;

  return (
    <Paper sx={{ p: 1 }}>
      <Typography variant="body2">Datum: {label}</Typography>
      <Typography variant="body2">Quote: {p0.valueAsString}</Typography>
    </Paper>
  );
}

/**
 * 1–2–5 “nice” Scale:
 * Liefert runde Obergrenze + Ticks (0..niceMax), damit Grid logisch wirkt und nichts abgeschnitten wird.
 */
function makeNiceScale(
  maxValue: number,
  approxTicks = 6
): { domain: [number, number]; ticks: number[] } {
  const safeMax = Math.max(0, Number(maxValue) || 0);
  if (safeMax === 0) {
    return { domain: [0, 3], ticks: [0, 1, 2, 3] };
  }

  // grobe Schrittweite
  const rawStep = safeMax / Math.max(2, approxTicks - 1);
  const pow10 = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const stepCandidates = [1, 2, 5, 10].map((m) => m * pow10);

  // nächstgrößere "schöne" Schrittweite
  const step =
    stepCandidates.find((s) => s >= rawStep) ??
    stepCandidates[stepCandidates.length - 1];

  // niceMax = nächstes Vielfaches der Schrittweite oberhalb des Max-Wertes
  const niceMax = Math.ceil(safeMax / step) * step;

  // Ticks generieren
  const tickCount = Math.round(niceMax / step) + 1;
  const ticks = Array.from({ length: tickCount }, (_, i) => i * step);

  return { domain: [0, niceMax], ticks };
}

export default function ClassQuotaPage() {
  const [value, setValue] = useState(0);
  const [cache, setCache] = useState<Record<number, TClassQuotaPoint[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const tabItems = Array.from({ length: 12 }, (_, i) => i + 1);
  const quotaClass = value + 1;
  const data = cache[quotaClass] ?? [];

  const handleChange = (_e: React.SyntheticEvent, next: number) => {
    setValue(next);
  };

  useEffect(() => {
    if (cache[quotaClass]?.length) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        setIsLoading(true);
        setErrMsg(null);

        const url = `${API_ROUTE_CONST.classQuota}?quotaClass=${quotaClass}`;
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const rows = (json?.data ?? []) as TClassQuotaPoint[];
        setCache((prev) => ({
          ...prev,
          [quotaClass]: Array.isArray(rows) ? rows : [],
        }));
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          if (process.env.NODE_ENV !== "production") console.error(err);
          setErrMsg("Fehler beim Laden der Daten.");
          setCache((prev) => ({ ...prev, [quotaClass]: [] }));
        }
      } finally {
        setIsLoading(false);
      }
    })();

    return () => ac.abort();
  }, [quotaClass, cache]);

  // Max bestimmen & "nice" Scale berechnen
  const currentMax = useMemo(
    () =>
      (data ?? []).reduce(
        (m, r) => Math.max(m, Number(r?.valueAsNumber ?? 0)),
        0
      ),
    [data]
  );
  const yScale = useMemo(() => makeNiceScale(currentMax, 6), [currentMax]);

  // Neueste links: Reihenfolge beim Rendern umkehren
  const getDisplayData = (k: number) => {
    const rows = k === quotaClass ? data : cache[k] ?? [];
    return rows.length ? [...rows].reverse() : rows;
  };

  return (
    <div className="class-quota-page">
      <div className="class-quota-page-header page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.classQuota.headerTitle}
        </Typography>
      </div>

      <div className="class-quota-page-content page-content">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Klassen-Tabs"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((k, idx) => (
              <Tab
                key={k}
                label={`Klasse ${k}`}
                disableRipple
                {...a11yProps(idx)}
                sx={{ textTransform: "none", minHeight: 44 }}
              />
            ))}
          </Tabs>
        </Box>

        {Array.from({ length: 12 }, (_, i) => i + 1).map((k, idx) => (
          <TabPanel key={k} value={value} index={idx}>
            {errMsg ? (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errMsg}
              </Typography>
            ) : null}

            {!isLoading && (!cache[k] || cache[k].length === 0) ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Keine Daten vorhanden.
              </Typography>
            ) : null}

            <Box sx={{ mt: 2, height: 570, overflow: "visible" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={getDisplayData(k)}
                  margin={{ top: 8, right: 12, left: 10, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="datum"
                    tick={{ fontSize: 11 }}
                    interval="preserveEnd"
                    minTickGap={10}
                  />
                  <YAxis
                    domain={yScale.domain}
                    ticks={yScale.ticks}
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    width={88}
                    tickMargin={6}
                    tickFormatter={(v: number) =>
                      `${Math.round(Number(v)).toLocaleString("de-DE", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })} €`
                    }
                  />
                  <Tooltip
                    content={<QuotaTooltip />}
                    wrapperStyle={{ outline: "none" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="valueAsNumber"
                    name="Quote (€)"
                    isAnimationActive={false}
                    stroke="#123456"
                    strokeWidth={2}
                    fill="#123456"
                    fillOpacity={0.9}
                    dot={false}
                    activeDot={{ r: 3, stroke: "#123456", fill: "#123456" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </TabPanel>
        ))}
      </div>
    </div>
  );
}
