/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  Card,
  CardContent,
  Divider,
  Typography,
  useTheme,
  Box,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { API_ROUTE_CONST } from "src/app/_app-constants/api-routes.const";
import { useDashboardStore } from "src/app/_app-stores/dashboard.store";
import { APP_COLOR_CONST } from "src/app/_app-constants/app-color.const";
import SkeletonBarChart from "../../_static/skeleton-bar-chart/SkeletonBarChart";

type Props = { title?: string; ticketPrice?: number };

// ————————————————————————————————————————————————————————————————————————
// Helper: erkennt alle gängigen Abbruch-Fälle (AbortController, Reason-Strings, alte codes)
function isAbort(err: unknown) {
  if (!err) return false;
  if (typeof err === "string") return err === "unmount" || err === "refresh";
  if (typeof err === "object") {
    const e = err as any;
    if (e?.name === "AbortError") return true;
    if (e?.code === 20) return true; // ältere Browser
    if (e?.message === "aborted") return true;
  }
  return false;
}

export default function DashboardCardPopularNumbers({
  title = "Populäre Zahlen (Heuristik)",
  ticketPrice = 2.0,
}: Props) {
  const theme = useTheme();

  const {
    isLoadingPopularity,
    setIsLoadingPopularity,
    popularityMain,
    setPopularityMain,
    popularityEuro,
    setPopularityEuro,
  } = useDashboardStore() as any;

  // Controller-Ref, um laufende Requests bewusst zu beenden (mit Reason)
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // vorherigen Request abbrechen (mit Reason → kein „without reason“-Noise)
    if (controllerRef.current && !controllerRef.current.signal.aborted) {
      controllerRef.current.abort("refresh");
    }

    const ac = new AbortController();
    controllerRef.current = ac;
    const { signal } = ac;
    let alive = true;

    (async () => {
      try {
        setIsLoadingPopularity(true);

        if (signal.aborted) return; // früh raus, kein catch-Noise

        const url = `${API_ROUTE_CONST.popularityNumbers}?ticketPrice=${encodeURIComponent(
          ticketPrice
        )}`;

        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const mains = Array.isArray(json?.mainScores) ? json.mainScores : [];
        const euros = Array.isArray(json?.euroScores) ? json.euroScores : [];

        if (!alive || signal.aborted) return;
        setPopularityMain(mains);
        setPopularityEuro(euros);
      } catch (err: any) {
        // Abbrüche still ignorieren
        if (isAbort(err) || signal.aborted) return;

        if (process.env.NODE_ENV !== "production") console.error(err);
        if (alive) {
          setPopularityMain([]);
          setPopularityEuro([]);
        }
      } finally {
        if (alive && !signal.aborted) setIsLoadingPopularity(false);
        if (controllerRef.current === ac) controllerRef.current = null;
      }
    })();

    return () => {
      alive = false;
      if (!signal.aborted) ac.abort("unmount");
    };
  }, [
    setIsLoadingPopularity,
    setPopularityMain,
    setPopularityEuro,
    ticketPrice,
  ]);

  // TOP 5 pro Chart
  const topMain = useMemo(
    () => (popularityMain ?? []).slice(0, 5),
    [popularityMain]
  );
  const topEuro = useMemo(
    () => (popularityEuro ?? []).slice(0, 5),
    [popularityEuro]
  );

  // Headroom: +10%, damit Spitzen im Grid bleiben
  const mainDomain = useMemo<[number, number]>(() => {
    const max = topMain.reduce(
      (m: number, r: any) => Math.max(m, Number(r?.value ?? 0)),
      0
    );
    return [0, Math.max(0.001, Number((max * 1.1).toFixed(6)))];
  }, [topMain]);

  const euroDomain = useMemo<[number, number]>(() => {
    const max = topEuro.reduce(
      (m: number, r: any) => Math.max(m, Number(r?.value ?? 0)),
      0
    );
    return [0, Math.max(0.001, Number((max * 1.1).toFixed(6)))];
  }, [topEuro]);

  const mainColor = APP_COLOR_CONST.colorPrimary;
  const euroColor = theme.palette.success.main;

  // Etwas top-Margin, damit die überlagerten Mini-Titel nicht mit dem Grid kollidieren
  const chartMargin = { top: 18, right: 12, left: 10, bottom: 8 };

  return (
    <Card className="card" elevation={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {/* Gewinnzahlen */}
          <Box sx={{ flex: 1, minWidth: 0, position: "relative" }}>
            {/* dezente Überschrift (Overlay) */}
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: 2,
                left: 12,
                zIndex: 2,
                color: "text.secondary",
                opacity: 0.9,
                pointerEvents: "none",
              }}
            >
              Gewinnzahlen
            </Typography>

            {isLoadingPopularity ? (
              <SkeletonBarChart height={205} bars={5} />
            ) : (
              <ResponsiveContainer width="100%" height={205}>
                <BarChart data={topMain} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis domain={mainDomain} hide />
                  <Bar dataKey="value" name="Score" isAnimationActive={false}>
                    {topMain.map((_: any, idx: number) => (
                      <Cell key={`m-${idx}`} fill={mainColor} />
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
          </Box>

          {/* Eurozahlen */}
          <Box sx={{ flex: 1, minWidth: 0, position: "relative" }}>
            {/* dezente Überschrift (Overlay) */}
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: 2,
                left: 12,
                zIndex: 2,
                color: "text.secondary",
                opacity: 0.9,
                pointerEvents: "none",
              }}
            >
              Eurozahlen
            </Typography>

            {isLoadingPopularity ? (
              <SkeletonBarChart height={205} bars={5} />
            ) : (
              <ResponsiveContainer width="100%" height={205}>
                <BarChart data={topEuro} margin={chartMargin}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis domain={euroDomain} hide />
                  <Bar dataKey="value" name="Score" isAnimationActive={false}>
                    {topEuro.map((_: any, idx: number) => (
                      <Cell key={`e-${idx}`} fill={euroColor} />
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
          </Box>
        </div>
      </CardContent>
    </Card>
  );
}
