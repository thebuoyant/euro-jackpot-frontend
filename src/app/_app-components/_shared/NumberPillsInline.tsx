"use client";

import { Box, Chip, useTheme } from "@mui/material";
import React from "react";

type Props = {
  values: number[];
  color: "primary" | "success";
  size?: number; // Durchmesser, default 28
  gap?: number; // Abstand in px, default 6
  "aria-label"?: string;
};

export default function NumberPillsInline({
  values,
  color,
  size = 28,
  gap = 6,
  ...rest
}: Props) {
  const theme = useTheme();

  if (!values?.length) {
    return <span {...rest}>—</span>;
  }

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: `${gap}px`,
        verticalAlign: "middle",
      }}
      {...rest}
    >
      {values.map((n) => (
        <Chip
          key={`${color}-${n}`}
          label={n}
          size="small"
          sx={{
            height: size,
            minHeight: size,
            width: size,
            borderRadius: 9999,
            fontWeight: 700,
            fontSize: size <= 28 ? 13 : 14,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            bgcolor: `${color}.main`,
            color: `${color}.contrastText`,
            p: 0,
            "& .MuiChip-label": {
              width: "100%",
              px: 0,
              lineHeight: 1,
              textAlign: "center",
            },
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 1px 2px rgba(0,0,0,.6)"
                : "0 1px 2px rgba(0,0,0,.15)",
          }}
        />
      ))}
    </Box>
  );
}
