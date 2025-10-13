/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Box, Skeleton } from "@mui/material";

type Props = {
  /** Anzahl der Zeilen (Key/Value-Paare) */
  rows?: number;
  /** Breite der Label-Spalte (z. B. 120, "30%") */
  labelWidth?: number | string;
  /** max. Breite der Value-Skelette (pro Zeile leicht variierend) */
  valueMaxWidth?: number | string;
  /** Höhe der Skeleton-Balken (px), simuliert die Texthöhe in deinen echten Rows */
  lineHeight?: number;
  /** Grid-Gap in px (zwischen Label/Value) – standard 8 */
  gap?: number;
  /** Vertikales Padding je li (px) – standard 6 (entspricht deiner echten Row) */
  rowPaddingY?: number;
};

export default function SkeletonKeyValueList({
  rows = 5,
  labelWidth = 120,
  valueMaxWidth = "70%",
  lineHeight = 20, // kompakt wie eine Textzeile
  gap = 8, // exakt wie deine echte Row
  rowPaddingY = 6, // exakt wie deine echte Row
}: Props) {
  const items = Array.from({ length: rows });
  const labelCol =
    typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth;

  // dezente Variation, damit's „natürlich“ wirkt – capped durch valueMaxWidth
  const widths = ["70%", "60%", "80%", "50%", "65%", "75%", "55%"];

  return (
    <Box
      component="ul"
      className="card-list"
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
      }}
    >
      {items.map((_, idx) => (
        <Box
          key={idx}
          component="li"
          sx={{
            display: "grid",
            gridTemplateColumns: `${labelCol} 1fr`,
            gap: `${gap}px`,
            padding: `${rowPaddingY}px 0`,
            alignItems: "center",
          }}
        >
          {/* Label-Skeleton */}
          <Skeleton
            variant="rectangular"
            sx={{
              height: `${lineHeight}px`,
              width: labelCol,
              borderRadius: "4px",
            }}
          />

          {/* Value-Skeleton */}
          <Skeleton
            variant="rectangular"
            sx={{
              height: `${lineHeight}px`,
              width:
                typeof valueMaxWidth === "number"
                  ? `${valueMaxWidth}px`
                  : (widths[idx % widths.length] as any),
              maxWidth: valueMaxWidth,
              borderRadius: "4px",
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
