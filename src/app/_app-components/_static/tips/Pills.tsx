"use client";
import React from "react";
import { Box, Chip, useTheme } from "@mui/material";

export const Pills: React.FC<{
  vals: number[];
  color: "primary" | "success";
}> = ({ vals, color }) => {
  const theme = useTheme();
  if (!vals?.length) return <span className="value numbers">—</span>;
  const PILL_SIZE = 32;
  return (
    <Box className="pill-row">
      {vals.map((n) => (
        <Chip
          key={`${color}-${n}`}
          label={n}
          size="small"
          sx={{
            height: PILL_SIZE,
            width: PILL_SIZE,
            borderRadius: 9999,
            fontWeight: 700,
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
};
