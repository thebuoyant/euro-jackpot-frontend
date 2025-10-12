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

/** a11y-Helper wie in der MUI-Doku */
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
      // 👇 kein height: "100%" mehr → verhindert unnötige Scrollbars
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

/** Tooltip im gleichen Stil wie deine Cards */
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

export default function ClassQuotaPage() {
  // Aktive Klasse (0-basiert für Tabs; tatsächliche Klasse = value+1)
  const [value, setValue] = useState(0);

  // Cache: Klasse -> Daten
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

  // Daten laden, wenn Tab wechselt (und noch nicht im Cache)
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

  // Headroom auf der Y-Achse wie in deinen Charts
  const yDomain = useMemo<[number, number]>(() => {
    const max = (data ?? []).reduce(
      (m, r) => Math.max(m, Number(r?.valueAsNumber ?? 0)),
      0
    );
    return [0, Math.max(3, Math.ceil(max * 1.1))]; // +10% oder min. 3
  }, [data]);

  // 👇 Neueste links: wir drehen die Reihenfolge beim Rendern um
  const getDisplayData = (k: number) => {
    const rows = k === quotaClass ? data : cache[k] ?? [];
    return rows.length ? [...rows].reverse() : rows; // reverse → neueste links
  };

  return (
    <div className="class-quota-page">
      <div className="class-quota-page-header page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.classQuota.headerTitle}
        </Typography>
      </div>

      <div className="class-quota-page-content page-content">
        {/* Tabs */}
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

        <Divider sx={{ my: 2 }} />

        {/* Panels */}
        {tabItems.map((k, idx) => (
          <TabPanel key={k} value={value} index={idx}>
            <Typography variant="subtitle1" gutterBottom>
              {`Ausgewählte Klasse: ${k}`}
            </Typography>

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

            <Box
              sx={{
                mt: 2,
                height: 260,
                overflow: "visible", // 👈 verhindert unnötige Scrollbar am rechten Rand
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={getDisplayData(k)}
                  margin={{ top: 8, right: 12, left: 10, bottom: 8 }}
                >
                  <defs>
                    <linearGradient
                      id="quotaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="rgba(33,150,243,1)"
                        stopOpacity={0.85}
                      />
                      <stop
                        offset="100%"
                        stopColor="rgba(33,150,243,1)"
                        stopOpacity={0.15}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="datum"
                    tick={{ fontSize: 11 }}
                    interval="preserveEnd"
                    minTickGap={10}
                  />
                  <YAxis
                    domain={yDomain}
                    allowDecimals={false}
                    tick={{ fontSize: 11 }}
                    width={78} // optional: etwas breiter wegen " €"
                    tickMargin={6} // optional: etwas Luft
                    tickFormatter={(v: number) =>
                      `${Math.round(Number(v)).toLocaleString("de-DE", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })} €`
                    }
                  />
                  <Tooltip content={<QuotaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="valueAsNumber"
                    name="Quote (€)"
                    isAnimationActive={false}
                    stroke="rgba(33,150,243,1)"
                    fill="url(#quotaGradient)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 3 }}
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
