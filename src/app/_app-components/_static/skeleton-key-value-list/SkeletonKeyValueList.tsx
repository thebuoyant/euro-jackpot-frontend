/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Box, Skeleton } from "@mui/material";

type Props = {
  rows?: number;
  labelWidth?: number | string;
  valueMaxWidth?: number | string;
  lineHeight?: number;
  gap?: number;
  rowPaddingY?: number;
};

export default function SkeletonKeyValueList({
  rows = 5,
  labelWidth = 120,
  valueMaxWidth = "70%",
  lineHeight = 20,
  gap = 8,
  rowPaddingY = 6,
}: Props) {
  const items = Array.from({ length: rows });
  const labelCol =
    typeof labelWidth === "number" ? `${labelWidth}px` : labelWidth;

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
              marginTop: "2px",
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
