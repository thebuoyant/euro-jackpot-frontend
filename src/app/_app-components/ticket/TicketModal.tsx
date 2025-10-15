/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { APP_COLOR_CONST } from "../../_app-constants/app-color.const";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  numbers: number[]; // 5 aus 1..50
  euroNumbers: number[]; // 2 aus 1..12
};

const MAIN_MAX = 50;
const EURO_MAX = 12;

export default function TicketModal({
  open,
  onClose,
  title = "Spielschein",
  numbers = [],
  euroNumbers = [],
}: Props) {
  const theme = useTheme();
  const mainSet = new Set(numbers);
  const euroSet = new Set(euroNumbers);

  const mainColor = APP_COLOR_CONST?.colorPrimary ?? "#123456";
  const euroColor = APP_COLOR_CONST?.colorSuccess ?? "#388e3c";

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
            {Array.from({ length: MAIN_MAX }, (_, i) => i + 1).map((n) => {
              const active = mainSet.has(n);
              return (
                <Box
                  key={`main-${n}`}
                  sx={{
                    height: 30,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    border: "1px solid",
                    borderColor: active ? mainColor : "divider",
                    color: active ? "#fff" : "text.secondary",
                    backgroundColor: active ? mainColor : "transparent",
                    transition: "all .15s ease",
                    userSelect: "none",
                  }}
                >
                  {n}
                </Box>
              );
            })}
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
            {Array.from({ length: EURO_MAX }, (_, i) => i + 1).map((n) => {
              const active = euroSet.has(n);
              return (
                <Box
                  key={`euro-${n}`}
                  sx={{
                    height: 34,
                    borderRadius: 10,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    border: "1px solid",
                    borderColor: active ? euroColor : "divider",
                    color: active ? "#fff" : "text.secondary",
                    backgroundColor: active ? euroColor : "transparent",
                    transition: "all .15s ease",
                    userSelect: "none",
                  }}
                >
                  {n}
                </Box>
              );
            })}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
