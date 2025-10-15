"use client";

import React, { useMemo } from "react";
import { Box, Skeleton, useTheme } from "@mui/material";

type Props = {
  /** Gesamthöhe des Platzhalters (inkl. Margins, Achse etc.) */
  height?: number;
  /** Anzahl der Balken */
  bars?: number;
  /** Außenabstände – analog zu Recharts margin */
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  /** Abstand zwischen den Balken */
  barGap?: number;
  /** Maximale Balkenhöhe im Plotbereich */
  maxBarHeight?: number;
  /** Untere X-Achsenlinie anzeigen */
  showXAxisLine?: boolean;
  /** Rasterlinien wie im CartesianGrid */
  showGrid?: boolean;
  /** Schimmer-Animation der Balken */
  shimmer?: boolean;
};

export default function SkeletonBarChart({
  height = 205,
  bars = 10,
  margin = { top: 8, right: 12, bottom: 8, left: 10 },
  barGap = 8,
  maxBarHeight = 140,
  showXAxisLine = true,
  showGrid = true,
  shimmer = true,
}: Props) {
  const theme = useTheme();

  const mTop = margin.top ?? 0;
  const mRight = margin.right ?? 0;
  const mBottom = margin.bottom ?? 0;
  const mLeft = margin.left ?? 0;

  // Platz für X-Achse (Tick-Linie/Labels) – ähnlich deinen Charts
  const xAxisReserve = showXAxisLine ? 14 : 0;

  const plotHeight = Math.max(0, height - mTop - mBottom - xAxisReserve);

  // Dezente Variation der Balkenhöhen (optisch „natürlich“), aber gleiche Breite je Bar.
  const barHeights = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < bars; i++) {
      const f = 0.5 + ((i * 37) % 47) / 100; // 0.50 .. ~0.97
      out.push(Math.round(maxBarHeight * f));
    }
    return out;
  }, [bars, maxBarHeight]);

  // Grid-Linien-Abstände – visuell nah an strokeDasharray="3 3"
  // Wir machen horizontale Linien alle ~22px im Plotbereich.
  const gridBackground =
    theme.palette.mode === "dark"
      ? "repeating-linear-gradient(to bottom, transparent, transparent 22px, rgba(255,255,255,0.07) 22px, rgba(255,255,255,0.07) 23px)"
      : "repeating-linear-gradient(to bottom, transparent, transparent 22px, rgba(0,0,0,0.06) 22px, rgba(0,0,0,0.06) 23px)";

  // Balkenfarbe (Skeleton übernimmt selbst, aber wir geben abgerundetes Rect + Radius)
  const borderRadius = 4;

  return (
    <Box
      sx={{
        width: "100%",
        height,
        position: "relative",
        overflow: "hidden", // wie ResponsiveContainer
      }}
    >
      {/* Plotbereich (mit optionalem Grid) */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          left: `${mLeft}px`,
          right: `${mRight}px`,
          top: `${mTop}px`,
          height: `${plotHeight}px`,
          pointerEvents: "none",
          ...(showGrid
            ? {
                backgroundImage: gridBackground,
                opacity: 0.35,
              }
            : {}),
        }}
      />

      {/* Bars-Container */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pt: `${mTop}px`,
          pr: `${mRight}px`,
          pb: `${mBottom + xAxisReserve}px`,
          pl: `${mLeft}px`,
          display: "flex",
          alignItems: "flex-end",
          gap: `${barGap}px`,
        }}
      >
        {Array.from({ length: bars }).map((_, i) => (
          <Box
            key={i}
            sx={{
              flex: 1, // ⟵ gleiche Breite je Bar
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Skeleton
              variant="rectangular"
              animation={shimmer ? "wave" : false}
              sx={{
                height: `${barHeights[i]}px`,
                width: "100%",
                borderRadius,
                // leichte „Glas“-Optik je nach Theme
                ...(theme.palette.mode === "dark"
                  ? { bgcolor: "rgba(255,255,255,0.08)" }
                  : { bgcolor: "rgba(0,0,0,0.06)" }),
              }}
            />
          </Box>
        ))}
      </Box>

      {/* X-Achsenlinie */}
      {showXAxisLine ? (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            left: `${mLeft}px`,
            right: `${mRight}px`,
            bottom: `${mBottom}px`,
            height: "1px",
            bgcolor: "divider",
          }}
        />
      ) : null}
    </Box>
  );
}
