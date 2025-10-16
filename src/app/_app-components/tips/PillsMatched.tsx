"use client";
import React from "react";
import { Badge, Box, Chip, useTheme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const BADGE_GREEN = "#00C853"; // kontrastreiches Grün

export const PillsMatched: React.FC<{
  vals: number[];
  color: "primary" | "success";
  matchSet?: Set<number>;
}> = ({ vals, color, matchSet }) => {
  const theme = useTheme();
  if (!vals?.length) return <span className="value numbers">—</span>;
  const PILL_SIZE = 32;
  const BADGE_SIZE = 18;
  return (
    <Box className="pill-row">
      {vals.map((n) => {
        const isMatch = !!matchSet && matchSet.has(n);
        const chip = (
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
        );
        return isMatch ? (
          <Badge
            key={`${color}-match-${n}`}
            overlap="circular"
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            badgeContent={
              <CheckIcon
                sx={{
                  color: "#fff",
                  fontSize: BADGE_SIZE * 0.7,
                  lineHeight: 1,
                }}
              />
            }
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: BADGE_GREEN,
                width: BADGE_SIZE,
                height: BADGE_SIZE,
                minWidth: BADGE_SIZE,
                borderRadius: "50%",
                border: "2px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  theme.palette.mode === "dark"
                    ? "0 0 0 1px rgba(0,0,0,.6)"
                    : "0 0 0 1px rgba(0,0,0,.15)",
              },
            }}
            title="Treffer"
          >
            {chip}
          </Badge>
        ) : (
          chip
        );
      })}
    </Box>
  );
};
