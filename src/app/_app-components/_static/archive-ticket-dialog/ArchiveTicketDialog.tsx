/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ArchiveRecord } from "src/app/archive/_archiveColumns";
import { APP_COLOR_CONST } from "src/app/_app-constants/app-color.const";

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

  /** Dezentes Kreuz als dünne, halbtransparente Linien unter der Zahl */
  const CrossOverlay = ({ color }: { color: string }) => (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          left: "10%",
          right: "10%",
          top: "50%",
          height: "2px",
          transformOrigin: "50% 50%",
          backgroundColor: color,
          opacity: 0.35,
          borderRadius: 2,
        },
        "&::before": { transform: "rotate(45deg)" },
        "&::after": { transform: "rotate(-45deg)" },
      }}
    />
  );

  const renderMainGrid = () => {
    // 1..50 → 10 Spalten × 5 Reihen
    const cols = 10;
    const total = 50;
    const items = Array.from({ length: total }, (_, i) => i + 1);
    const selBg = APP_COLOR_CONST.colorPrimary; // #123456
    const selText = APP_COLOR_CONST.colorWhite; // #ffffff

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
          gap: 0.75, // ~6px
          p: 1, // 8px
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
                borderColor: checked ? selBg : "divider",
                position: "relative",
                userSelect: "none",
                backgroundColor: checked ? selBg : "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "& .cell-number": {
                  position: "relative",
                  zIndex: 2, // Zahl über dem Kreuz
                  fontSize: 13,
                  fontWeight: 700,
                  color: checked ? selText : "text.primary",
                },
              }}
            >
              {checked && <CrossOverlay color={selText} />}
              <span className="cell-number">{n}</span>
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
    const selBg = APP_COLOR_CONST.colorSuccess; // #388e3c
    const selText = APP_COLOR_CONST.colorWhite; // #ffffff

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
                borderColor: checked ? selBg : "divider",
                position: "relative",
                userSelect: "none",
                backgroundColor: checked ? selBg : "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "& .cell-number": {
                  position: "relative",
                  zIndex: 2,
                  fontSize: 13,
                  fontWeight: 800,
                  color: checked ? selText : "text.primary",
                },
              }}
            >
              {checked && <CrossOverlay color={selText} />}
              <span className="cell-number">{n}</span>
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
      // 👉 Papier orientiert sich am Inhalt; keine unnötige Breite/Höhe
      fullWidth={false}
      maxWidth={false}
      scroll="paper"
      PaperProps={{
        sx: {
          m: 1.5,
          width: "fit-content",
          maxWidth: "calc(100vw - 24px)",
          maxHeight: "calc(100vh - 24px)",
        },
      }}
    >
      {/* Header mit Close-Icon (kein Footer) */}
      <DialogTitle
        sx={{
          pr: 6, // Platz fürs Icon
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="h6" component="div" sx={{ flex: 1 }}>
          {`Spielschein – ${row?.datum ?? ""}`}
        </Typography>
        <IconButton
          aria-label="Dialog schließen"
          onClick={onClose}
          edge="end"
          sx={{ ml: 1 }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 1.5 }}>
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
    </Dialog>
  );
}
