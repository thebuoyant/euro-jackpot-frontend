/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  Card,
  CardContent,
  Divider,
  Typography,
  useTheme,
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

  // Robust: vermeidet "AbortError without reason" in Dev/StrictMode
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // ggf. laufenden Request abbrechen (mit Reason)
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
        if (signal.aborted) throw new DOMException("aborted", "AbortError");

        const url = `${
          API_ROUTE_CONST.popularityNumbers
        }?ticketPrice=${encodeURIComponent(ticketPrice)}`;
        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const mains = Array.isArray(json?.mainScores) ? json.mainScores : [];
        const euros = Array.isArray(json?.euroScores) ? json.euroScores : [];

        if (!alive || signal.aborted) return;
        setPopularityMain(mains);
        setPopularityEuro(euros);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          if (process.env.NODE_ENV !== "production") console.error(err);
          if (alive && !signal.aborted) {
            setPopularityMain([]);
            setPopularityEuro([]);
          }
        }
      } finally {
        if (alive && !signal.aborted) {
          setIsLoadingPopularity(false);
        }
        if (controllerRef.current === ac) {
          controllerRef.current = null;
        }
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

  // Headroom: +10% damit keine Spitzen/Labels (falls später) aus dem Grid ragen
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
          {/* Linker Chart: Gewinnzahlen (TOP 5) */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {isLoadingPopularity ? (
              <SkeletonBarChart height={205} bars={5} />
            ) : (
              <ResponsiveContainer width="100%" height={205}>
                <BarChart
                  data={topMain}
                  margin={{ top: 8, right: 12, left: 10, bottom: 8 }}
                >
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
          </div>

          {/* Rechter Chart: Eurozahlen (TOP 5, success color) */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {isLoadingPopularity ? (
              <SkeletonBarChart height={205} bars={5} />
            ) : (
              <ResponsiveContainer width="100%" height={205}>
                <BarChart
                  data={topEuro}
                  margin={{ top: 8, right: 12, left: 10, bottom: 8 }}
                >
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
