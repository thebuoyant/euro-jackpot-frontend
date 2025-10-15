/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { APP_COLOR_CONST } from "../../_app-constants/app-color.const";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;

  /** Aktuelle Auswahl aus dem Parent */
  numbers: ReadonlyArray<number>; // 5 aus 1..50
  euroNumbers: ReadonlyArray<number>; // 2 aus 1..12

  /** Wird bei jeder Änderung (Klick auf Felder) sofort aufgerufen */
  onChange: (next: { numbers: number[]; euroNumbers: number[] }) => void;

  /** Optional Limits (Default EuroJackpot) */
  mainMaxCount?: number; // default 5
  euroMaxCount?: number; // default 2
};

const MAIN_RANGE_MAX = 50;
const EURO_RANGE_MAX = 12;

export default function TicketModal({
  open,
  onClose,
  title = "Spielschein",
  numbers = [],
  euroNumbers = [],
  onChange,
  mainMaxCount = 5,
  euroMaxCount = 2,
}: Props) {
  const theme = useTheme();

  const mainSet = useMemo(() => new Set(numbers), [numbers]);
  const euroSet = useMemo(() => new Set(euroNumbers), [euroNumbers]);

  const mainColor = APP_COLOR_CONST?.colorPrimary ?? "#123456";
  const euroColor = APP_COLOR_CONST?.colorSuccess ?? "#388e3c";

  const remainingMain = Math.max(0, mainMaxCount - mainSet.size);
  const remainingEuro = Math.max(0, euroMaxCount - euroSet.size);

  /** Hilfsfunktionen: toggle mit Limits */
  const commit = (nextNums: number[], nextEuros: number[]) =>
    onChange({ numbers: nextNums, euroNumbers: nextEuros });

  const toggleMain = (n: number) => {
    const isActive = mainSet.has(n);
    if (isActive) {
      const next = [...numbers].filter((x) => x !== n);
      commit(next, [...euroNumbers]);
    } else {
      if (mainSet.size >= mainMaxCount) return; // Limit erreicht
      const next = [...numbers, n].sort((a, b) => a - b);
      commit(next, [...euroNumbers]);
    }
  };

  const toggleEuro = (n: number) => {
    const isActive = euroSet.has(n);
    if (isActive) {
      const next = [...euroNumbers].filter((x) => x !== n);
      commit([...numbers], next);
    } else {
      if (euroSet.size >= euroMaxCount) return; // Limit erreicht
      const next = [...euroNumbers, n].sort((a, b) => a - b);
      commit([...numbers], next);
    }
  };

  /** A11y: keyboard toggle (Enter/Space) */
  const keyToggle =
    (fn: (n: number) => void, n: number) =>
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fn(n);
      }
    };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="ticket-modal-title"
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(1px)",
            backgroundColor: "rgba(0,0,0,0.15)",
          },
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.06)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.2,
          py: 1.6,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))"
              : "linear-gradient(180deg, rgba(18,52,86,0.06), rgba(18,52,86,0))",
        }}
      >
        <Typography
          id="ticket-modal-title"
          variant="subtitle1"
          fontWeight={700}
        >
          {title}
        </Typography>
        <Tooltip title="Schließen">
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <DialogContent sx={{ p: 2.2 }}>
        {/* Status-Zeile (Restplätze) */}
        <Box sx={{ mb: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            size="small"
            label={`Gewinnzahlen: ${numbers.length}/${mainMaxCount} (noch ${remainingMain})`}
            sx={{
              fontWeight: 500,
              color: numbers.length >= mainMaxCount ? mainColor : "inherit",
            }}
            variant={numbers.length >= mainMaxCount ? "outlined" : "filled"}
          />
          <Chip
            size="small"
            label={`Eurozahlen: ${euroNumbers.length}/${euroMaxCount} (noch ${remainingEuro})`}
            sx={{
              fontWeight: 500,
              color: euroNumbers.length >= euroMaxCount ? euroColor : "inherit",
            }}
            variant={euroNumbers.length >= euroMaxCount ? "outlined" : "filled"}
          />
        </Box>

        {/* Gewinnzahlen 1..50 */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Gewinnzahlen (1–50)
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(10, 1fr)",
              gap: 0.75,
            }}
          >
            {Array.from({ length: MAIN_RANGE_MAX }, (_, i) => i + 1).map(
              (n) => {
                const active = mainSet.has(n);
                const disabled = !active && numbers.length >= mainMaxCount;

                return (
                  <Box
                    key={`main-${n}`}
                    role="button"
                    aria-pressed={active}
                    tabIndex={disabled ? -1 : 0}
                    onKeyDown={disabled ? undefined : keyToggle(toggleMain, n)}
                    onClick={disabled ? undefined : () => toggleMain(n)}
                    sx={{
                      height: 32,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                      border: "1px solid",
                      borderColor: active ? mainColor : "divider",
                      color: active
                        ? "#fff"
                        : disabled
                        ? "text.disabled"
                        : "text.secondary",
                      backgroundColor: active ? mainColor : "transparent",
                      transition: "all .12s ease",
                      userSelect: "none",
                      cursor: disabled ? "not-allowed" : "pointer",
                      opacity: disabled ? 0.4 : 1,
                      outline: "none",
                      "&:focus-visible": {
                        boxShadow: `0 0 0 2px ${mainColor}33`,
                        borderColor: active ? "#fff" : mainColor,
                      },
                    }}
                  >
                    {n}
                  </Box>
                );
              }
            )}
          </Box>
        </Box>

        {/* Eurozahlen 1..12 */}
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Eurozahlen (1–12)
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 0.75,
            }}
          >
            {Array.from({ length: EURO_RANGE_MAX }, (_, i) => i + 1).map(
              (n) => {
                const active = euroSet.has(n);
                const disabled = !active && euroNumbers.length >= euroMaxCount;

                return (
                  <Box
                    key={`euro-${n}`}
                    role="button"
                    aria-pressed={active}
                    tabIndex={disabled ? -1 : 0}
                    onKeyDown={disabled ? undefined : keyToggle(toggleEuro, n)}
                    onClick={disabled ? undefined : () => toggleEuro(n)}
                    sx={{
                      height: 34,
                      borderRadius: 10,
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                      border: "1px solid",
                      borderColor: active ? euroColor : "divider",
                      color: active
                        ? "#fff"
                        : disabled
                        ? "text.disabled"
                        : "text.secondary",
                      backgroundColor: active ? euroColor : "transparent",
                      transition: "all .12s ease",
                      userSelect: "none",
                      cursor: disabled ? "not-allowed" : "pointer",
                      opacity: disabled ? 0.4 : 1,
                      outline: "none",
                      "&:focus-visible": {
                        boxShadow: `0 0 0 2px ${euroColor}33`,
                        borderColor: active ? "#fff" : euroColor,
                      },
                    }}
                  >
                    {n}
                  </Box>
                );
              }
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
