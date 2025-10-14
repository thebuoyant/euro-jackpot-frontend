/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Stack,
  Typography,
  Checkbox,
  FormControlLabel,
  useTheme,
} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { APP_CONST } from "../../_app-constants/app.const";
import { APP_TYPO_CONST } from "src/app/_app-constants/app-typo.const";

/** Debounced window size messen (nur Client, hydrationssicher) */
function useDebouncedWindowSize(delay = 200) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    const measure = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    measure();
    const onResize = () => {
      if (tRef.current) window.clearTimeout(tRef.current);
      tRef.current = window.setTimeout(() => {
        tRef.current = null;
        measure();
      }, delay);
    };
    window.addEventListener("resize", onResize);
    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [delay]);

  return size;
}

function clampPct(val: number) {
  return Math.max(0, Math.min(100, Math.round(val)));
}

export default function ResolutionGuard() {
  const theme = useTheme();
  const { minWidth, minHeight, storageKey, aspect } = APP_CONST.ui.resolution;

  const size = useDebouncedWindowSize(200);

  // „Nicht mehr anzeigen“ persistiert (nur nach Mount lesen)
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const [sessionDismissed, setSessionDismissed] = useState(false);
  const [neverAgain, setNeverAgain] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(storageKey) === "1");
    } catch {
      setDismissed(false);
    }
  }, [storageKey]);

  const below = useMemo(() => {
    if (!size) return false;
    return size.w < minWidth || size.h < minHeight;
  }, [size, minWidth, minHeight]);

  const open = useMemo(() => {
    if (dismissed == null) return false; // erst öffnen, wenn LS gelesen
    if (dismissed) return false;
    if (sessionDismissed) return false;
    return below;
  }, [dismissed, sessionDismissed, below]);

  const handleClose = () => setSessionDismissed(true);
  const handleSaveNever = () => {
    try {
      localStorage.setItem(storageKey, "1");
    } catch {}
    setDismissed(true);
    setNeverAgain(false);
  };

  const widthOk = size ? size.w >= minWidth : false;
  const heightOk = size ? size.h >= minHeight : false;
  const widthPct = size ? clampPct((size.w / minWidth) * 100) : 0;
  const heightPct = size ? clampPct((size.h / minHeight) * 100) : 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="resolution-guard-title"
      aria-describedby="resolution-guard-desc"
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(2px)",
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
      {/* Header mit Icon-Badge + leichtem Gradient */}
      <Box
        sx={{
          px: 2.2,
          py: 1.6,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))"
              : "linear-gradient(180deg, rgba(18,52,86,0.06), rgba(18,52,86,0))",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          aria-hidden
          sx={{
            width: 36,
            height: 36,
            borderRadius: "999px",
            display: "grid",
            placeItems: "center",
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.08)"
                : "rgba(18,52,86,0.08)",
          }}
        >
          <WarningAmberOutlinedIcon color="warning" />
        </Box>
        <DialogTitle
          id="resolution-guard-title"
          sx={{ p: 0, fontSize: 18, fontWeight: 700 }}
        >
          {APP_TYPO_CONST.components.resolutionGuard.title}
        </DialogTitle>
      </Box>

      <DialogContent id="resolution-guard-desc" sx={{ p: 2.2 }}>
        <Typography variant="body2" color="text.secondary">
          {APP_TYPO_CONST.components.resolutionGuard.description}
        </Typography>

        {/* Soll vs. Ist */}
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              size="small"
              label={`${APP_TYPO_CONST.components.resolutionGuard.labelRecommendation}: ≥ ${minWidth} × ${minHeight}px`}
              sx={{ fontWeight: 500 }}
            />
            <Chip
              size="small"
              color={widthOk && heightOk ? "success" : "default"}
              icon={
                widthOk && heightOk ? <CheckCircleRoundedIcon /> : undefined
              }
              label={`${
                APP_TYPO_CONST.components.resolutionGuard.labelCurrent
              }: ${size ? `${size.w} × ${size.h}px` : "–"}`}
              sx={{ fontWeight: 500 }}
            />
            <Chip
              size="small"
              variant="outlined"
              label={`Ratio: ${aspect.w}:${aspect.h}`}
            />
          </Stack>
        </Box>

        {/* Progress-Indikatoren */}
        <Box sx={{ mt: 2.2, display: "grid", gap: 1.4 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Breite
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {size ? `${size.w}px / ${minWidth}px` : "–"}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={widthPct}
            sx={{
              height: 8,
              borderRadius: 999,
              "& .MuiLinearProgress-bar": {
                backgroundColor: widthOk
                  ? theme.palette.success.main
                  : theme.palette.primary.main,
              },
            }}
          />

          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ mt: 1.2 }}
          >
            <Typography variant="caption" color="text.secondary">
              Höhe
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {size ? `${size.h}px / ${minHeight}px` : "–"}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={heightPct}
            sx={{
              height: 8,
              borderRadius: 999,
              "& .MuiLinearProgress-bar": {
                backgroundColor: heightOk
                  ? theme.palette.success.main
                  : theme.palette.primary.main,
              },
            }}
          />
        </Box>

        <Divider sx={{ my: 2.2 }} />

        <FormControlLabel
          control={
            <Checkbox
              checked={neverAgain}
              onChange={(e) => setNeverAgain(e.target.checked)}
              sx={{ p: 0.5, mr: 1 }}
              inputProps={{
                "aria-label": "Diesen Hinweis nicht mehr anzeigen",
              }}
            />
          }
          label={
            <Typography variant="body2" color="text.secondary">
              Diesen Hinweis auf diesem Gerät nicht mehr anzeigen
            </Typography>
          }
        />
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.4 }}>
        <Button
          variant="text"
          color="inherit"
          onClick={handleClose}
          sx={{ textTransform: "none" }}
        >
          Trotzdem fortfahren
        </Button>
        <Button
          variant="contained"
          onClick={neverAgain ? handleSaveNever : handleClose}
          sx={{ textTransform: "none" }}
        >
          {neverAgain ? "Speichern & schließen" : "OK"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
