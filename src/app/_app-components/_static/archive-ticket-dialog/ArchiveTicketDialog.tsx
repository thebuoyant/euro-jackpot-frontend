/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import type { ArchiveRecord } from "src/app/archive/_archiveColumns";

type Props = {
  open: boolean;
  row: ArchiveRecord | null;
  onClose: () => void;
};

const CELL_SIZE = 32; // px

export default function ArchiveTicketDialog({ open, row, onClose }: Props) {
  const nums = useMemo<number[]>(
    () =>
      row
        ? [row.nummer1, row.nummer2, row.nummer3, row.nummer4, row.nummer5]
            .map(Number)
            .filter((n) => Number.isFinite(n))
        : [],
    [row]
  );
  const euros = useMemo<number[]>(
    () => (row ? [row.zz1, row.zz2].map(Number).filter(Number.isFinite) : []),
    [row]
  );

  const isNumChecked = (n: number) => nums.includes(n);
  const isEuroChecked = (n: number) => euros.includes(n);

  const renderMainGrid = () => {
    // 1..50 → 10 Spalten × 5 Reihen
    const cols = 10;
    const total = 50;
    const items = Array.from({ length: total }, (_, i) => i + 1);
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
          gap: 0.75,
          p: 1,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,0.9))",
        }}
      >
        {items.map((n) => {
          const checked = isNumChecked(n);
          return (
            <Box
              key={`n-${n}`}
              aria-label={`zahl-${n}${checked ? "-markiert" : ""}`}
              sx={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                borderRadius: 1,
                border: "1px solid",
                borderColor: checked ? "primary.main" : "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
                color: checked ? "primary.contrastText" : "text.primary",
                backgroundColor: checked ? "primary.main" : "background.paper",
                boxShadow: checked
                  ? "inset 0 0 0 1px rgba(255,255,255,0.8)"
                  : "none",
                position: "relative",
                userSelect: "none",
              }}
            >
              {n}
              {checked && (
                <Box
                  component="span"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.95)",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  ✕
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    );
  };

  const renderEuroGrid = () => {
    // 1..12 → 6 Spalten × 2 Reihen
    const cols = 6;
    const total = 12;
    const items = Array.from({ length: total }, (_, i) => i + 1);
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
          gap: 0.75,
          p: 1,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,250,0.9))",
        }}
      >
        {items.map((n) => {
          const checked = isEuroChecked(n);
          return (
            <Box
              key={`e-${n}`}
              aria-label={`eurozahl-${n}${checked ? "-markiert" : ""}`}
              sx={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                borderRadius: "50%",
                border: "1px solid",
                borderColor: checked ? "warning.dark" : "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: checked ? "warning.contrastText" : "text.primary",
                backgroundColor: checked ? "warning.main" : "background.paper",
                boxShadow: checked
                  ? "inset 0 0 0 1px rgba(255,255,255,0.9)"
                  : "none",
                position: "relative",
                userSelect: "none",
              }}
            >
              {n}
              {checked && (
                <Box
                  component="span"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.95)",
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  ✕
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="ticket-title"
    >
      <DialogTitle id="ticket-title">
        Spielschein – {row?.datum ?? ""}
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Gewinnzahlen (5 aus 50)
        </Typography>
        {renderMainGrid()}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Eurozahlen (2 aus 12)
        </Typography>
        {renderEuroGrid()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Schließen</Button>
      </DialogActions>
    </Dialog>
  );
}
