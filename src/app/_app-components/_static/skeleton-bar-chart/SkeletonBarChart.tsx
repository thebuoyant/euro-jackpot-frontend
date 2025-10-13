"use client";

import React, { useMemo } from "react";
import { Box, Skeleton } from "@mui/material";

type Props = {
  height?: number;
  bars?: number;
  margin?: { top?: number; right?: number; bottom?: number; left?: number };
  barGap?: number;
  maxBarHeight?: number;
  showXAxisLine?: boolean;
};

export default function SkeletonBarChart({
  height = 205,
  bars = 10,
  margin = { top: 8, right: 12, bottom: 8, left: 10 },
  barGap = 8,
  maxBarHeight = 140,
  showXAxisLine = true,
}: Props) {
  const barWidths = useMemo(
    () => [
      "70%",
      "64%",
      "82%",
      "56%",
      "68%",
      "78%",
      "60%",
      "74%",
      "66%",
      "80%",
    ],
    []
  );

  const plotHeight = Math.max(
    0,
    height - (margin.top ?? 0) - (margin.bottom ?? 0) - (showXAxisLine ? 14 : 0)
  );

  return (
    <Box
      sx={{
        width: "100%",
        height,
        position: "relative",
        // optisch wie ResponsiveContainer -> kein Overflow
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pt: `${margin.top ?? 0}px`,
          pr: `${margin.right ?? 0}px`,
          pb: `${(margin.bottom ?? 0) + (showXAxisLine ? 14 : 0)}px`,
          pl: `${margin.left ?? 0}px`,
          display: "flex",
          alignItems: "flex-end",
          gap: `${barGap}px`,
        }}
      >
        {Array.from({ length: bars }).map((_, i) => {
          const hFactor = 0.45 + ((i * 37) % 55) / 100; // 0.45..1.0
          const barHeight = Math.round(maxBarHeight * hFactor);
          const width = barWidths[i % barWidths.length];

          return (
            <Skeleton
              key={i}
              variant="rectangular"
              sx={{
                height: `${barHeight}px`,
                width,
                borderRadius: "4px",
                alignSelf: "flex-end",
              }}
            />
          );
        })}
      </Box>

      {showXAxisLine ? (
        <Box
          sx={{
            position: "absolute",
            left: `${margin.left ?? 0}px`,
            right: `${margin.right ?? 0}px`,
            bottom: `${margin.bottom ?? 0}px`,
            height: "1px",
            bgcolor: "divider",
          }}
        />
      ) : null}

      <Box
        sx={{
          position: "absolute",
          left: `${margin.left ?? 0}px`,
          right: `${margin.right ?? 0}px`,
          top: `${margin.top ?? 0}px`,
          height: `${plotHeight}px`,
          pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent, transparent 22px, rgba(0,0,0,0.06) 22px, rgba(0,0,0,0.06) 23px)",
          opacity: 0.3,
        }}
      />
    </Box>
  );
}
