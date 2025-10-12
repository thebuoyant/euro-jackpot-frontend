/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Tabs, Tab, Typography, Paper } from "@mui/material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

import "./ClassNumbers.css";
import { API_ROUTE_CONST } from "../_app-constants/api-routes.const";

type TClassNumbersPoint = {
  datum: string;
  valueAsNumber: number;
  valueAsString: string; // "123.456"
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

function NumbersTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: Array<{ payload?: any }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p0 = payload[0]?.payload as TClassNumbersPoint | undefined;
  if (!p0) return null;
  return (
    <Paper sx={{ p: 1 }}>
      <Typography variant="body2">Datum: {label}</Typography>
      <Typography variant="body2">Anzahl: {p0.valueAsString}</Typography>
    </Paper>
  );
}

/** 1–2–5 nice scale */
function makeNiceScale(
  maxValue: number,
  approxTicks = 6
): { domain: [number, number]; ticks: number[] } {
  const safeMax = Math.max(0, Number(maxValue) || 0);
  if (safeMax === 0) return { domain: [0, 3], ticks: [0, 1, 2, 3] };
  const rawStep = safeMax / Math.max(2, approxTicks - 1);
  const pow10 = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const stepCandidates = [1, 2, 5, 10].map((m) => m * pow10);
  const step =
    stepCandidates.find((s) => s >= rawStep) ??
    stepCandidates[stepCandidates.length - 1];
  const niceMax = Math.ceil(safeMax / step) * step;
  const tickCount = Math.round(niceMax / step) + 1;
  const ticks = Array.from({ length: tickCount }, (_, i) => i * step);
  return { domain: [0, niceMax], ticks };
}

const fmtInt0 = (n: number) =>
  Math.round(n).toLocaleString("de-DE", { maximumFractionDigits: 0 });

const MEAN_COLOR = "#708599"; // Average Line
const LINE_COLOR = "#123456"; // Filling

export default function ClassNumbersPage() {
  const [value, setValue] = useState(0);
  const [cache, setCache] = useState<Record<number, TClassNumbersPoint[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const tabItems = Array.from({ length: 12 }, (_, i) => i + 1);
  const numbersClass = value + 1;

  const handleChange = (_e: React.SyntheticEvent, next: number) =>
    setValue(next);

  useEffect(() => {
    if (cache[numbersClass]?.length) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        setIsLoading(true);
        setErrMsg(null);

        const res = await fetch(
          `${API_ROUTE_CONST.classNumbers}?numbersClass=${numbersClass}`,
          {
            signal: ac.signal,
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const rows = (json?.data ?? []) as TClassNumbersPoint[];
        setCache((prev) => ({
          ...prev,
          [numbersClass]: Array.isArray(rows) ? rows : [],
        }));
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          if (process.env.NODE_ENV !== "production") console.error(err);
          setErrMsg("Fehler beim Laden der Daten.");
          setCache((prev) => ({ ...prev, [numbersClass]: [] }));
        }
      } finally {
        setIsLoading(false);
      }
    })();

    return () => ac.abort();
  }, [numbersClass]);

  const getDisplayData = (k: number) => {
    const rows =
      k === numbersClass ? cache[numbersClass] ?? [] : cache[k] ?? [];
    return rows.length ? [...rows].reverse() : rows; // neueste links
  };

  const RIGHT_MARGIN = 88;

  return (
    <div className="class-numbers-page">
      <div className="class-numbers-page-header page-header">
        <Typography variant="h6">Klassen-Anzahlen</Typography>
      </div>

      <div className="class-numbers-page-content page-content">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Klassen-Tabs"
          >
            {tabItems.map((k, idx) => (
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

        {tabItems.map((k, idx) => (
          <TabPanel key={k} value={value} index={idx}>
            {errMsg && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errMsg}
              </Typography>
            )}

            {!isLoading && (!cache[k] || cache[k].length === 0) && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Keine Daten vorhanden.
              </Typography>
            )}

            <Box sx={{ mt: 2, height: 570, overflow: "visible" }}>
              <ResponsiveContainer width="100%" height="100%">
                {(() => {
                  const rows = getDisplayData(k);
                  const localMax = rows.reduce(
                    (m, r) => Math.max(m, r.valueAsNumber || 0),
                    0
                  );
                  const localScale = makeNiceScale(localMax, 6);
                  const mean = rows.length
                    ? rows.reduce((s, r) => s + (r.valueAsNumber || 0), 0) /
                      rows.length
                    : 0;

                  return (
                    <AreaChart
                      data={rows}
                      margin={{
                        top: 8,
                        right: RIGHT_MARGIN,
                        left: 10,
                        bottom: 8,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="datum"
                        tick={{ fontSize: 11 }}
                        interval="preserveEnd"
                        minTickGap={10}
                      />
                      <YAxis
                        domain={localScale.domain}
                        ticks={localScale.ticks}
                        allowDecimals={false}
                        tick={{ fontSize: 11 }}
                        width={92}
                        tickMargin={6}
                        tickFormatter={(v: number) =>
                          Math.round(Number(v)).toLocaleString("de-DE", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })
                        }
                      />
                      <Tooltip content={<NumbersTooltip />} />

                      <Area
                        type="monotone"
                        dataKey="valueAsNumber"
                        name="Anzahl"
                        isAnimationActive={false}
                        stroke={LINE_COLOR}
                        strokeWidth={1}
                        fill={LINE_COLOR}
                        fillOpacity={0.9}
                        dot={false}
                        activeDot={{
                          r: 3,
                          stroke: LINE_COLOR,
                          fill: LINE_COLOR,
                        }}
                      />

                      {/* Ø-Linie außerhalb rechts (4px Luft) */}
                      <ReferenceLine
                        y={mean}
                        stroke={MEAN_COLOR}
                        strokeOpacity={1}
                        strokeDasharray="6 6"
                        strokeWidth={1}
                        label={{
                          value: `Ø ${fmtInt0(mean)}`,
                          position: "right",
                          offset: 4,
                          fill: MEAN_COLOR,
                          fontSize: 11,
                          style: {
                            paintOrder: "stroke",
                            stroke: "#ffffff",
                            strokeWidth: 3,
                          },
                        }}
                      />
                    </AreaChart>
                  );
                })()}
              </ResponsiveContainer>
            </Box>
          </TabPanel>
        ))}
      </div>
    </div>
  );
}
