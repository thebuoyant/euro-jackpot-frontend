/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo } from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import { useDashboardStore } from "src/app/_app-stores/dashboard.store";
import { API_ROUTE_CONST } from "src/app/_app-constants/api-routes.const";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
} from "recharts";
import { APP_COLOR_CONST } from "src/app/_app-constants/app-color.const";

type Props = { title: string; numberOfRecords?: number };

export default function DashboardCardSpecialData({ title }: Props) {
  const { setIsLoadingSpecialData, setSpecialData, specialData } =
    useDashboardStore() as any;

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setIsLoadingSpecialData(true);

        const res = await fetch(API_ROUTE_CONST.specialDataCounts, {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        // API liefert: { specialData: { decades: {...}, highLow: {...} } }
        const data = json?.specialData ?? null;

        setSpecialData(data);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          if (process.env.NODE_ENV !== "production") console.error(err);
          setSpecialData(null);
        }
      } finally {
        setIsLoadingSpecialData(false);
      }
    })();

    return () => ac.abort();
  }, [setIsLoadingSpecialData, setSpecialData]);

  // Dekaden-Daten für Recharts vorbereiten
  const decadesData = useMemo(() => {
    const d = specialData?.decades ?? {
      decade1: 0,
      decade2: 0,
      decade3: 0,
      decade4: 0,
      decade5: 0,
    };
    return [
      { key: "1–10", value: d.decade1 },
      { key: "11–20", value: d.decade2 },
      { key: "21–30", value: d.decade3 },
      { key: "31–40", value: d.decade4 },
      { key: "41–50", value: d.decade5 },
    ];
  }, [specialData]);

  // High/Low-Daten für Recharts vorbereiten
  const highLowData = useMemo(() => {
    const h = specialData?.highLow ?? { high: 0, low: 0 };
    return [
      { key: "Low (1–25)", value: h.low },
      { key: "High (26–50)", value: h.high },
    ];
  }, [specialData]);

  return (
    <Card className="card" elevation={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />

        {/* Zwei Charts nebeneinander */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "stretch",
            width: "100%",
          }}
        >
          {/* Linker Chart: Dekaden */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={205}>
              <BarChart
                data={decadesData}
                margin={{ top: 8, right: 12, left: 10, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="value" name="Anzahl" isAnimationActive={false}>
                  <LabelList
                    dataKey="value"
                    position="top"
                    style={{ fontSize: 10 }}
                  />
                  {decadesData.map((_, idx: number) => (
                    <Cell
                      key={`decade-cell-${idx}`}
                      fill={APP_COLOR_CONST.colorPrimary}
                    />
                  ))}
                </Bar>
                <XAxis
                  dataKey="key"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  height={28}
                >
                  <Label value="Dekaden" position="insideBottom" offset={-16} />
                </XAxis>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Rechter Chart: High vs Low */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={205}>
              <BarChart
                data={highLowData}
                margin={{ top: 8, right: 12, left: 10, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="value" name="Anzahl" isAnimationActive={false}>
                  <LabelList
                    dataKey="value"
                    position="top"
                    style={{ fontSize: 10 }}
                  />
                  {highLowData.map((_, idx: number) => (
                    <Cell
                      key={`hl-cell-${idx}`}
                      fill={APP_COLOR_CONST.colorPrimary}
                    />
                  ))}
                </Bar>
                <XAxis
                  dataKey="key"
                  tick={{ fontSize: 10 }}
                  interval={0}
                  height={28}
                >
                  <Label
                    value="High / Low"
                    position="insideBottom"
                    offset={-16}
                  />
                </XAxis>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
