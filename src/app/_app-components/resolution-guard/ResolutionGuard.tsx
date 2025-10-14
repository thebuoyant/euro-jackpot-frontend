/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Typography,
} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { APP_CONST } from "../../_app-constants/app.const";

type Props = {
  /** Optional Override – standardmäßig werden die Werte aus APP_CONST.ui.resolution genutzt */
  minWidth?: number;
  minHeight?: number;
  storageKey?: string;
};

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

export default function ResolutionGuard({
  minWidth = APP_CONST.ui.resolution.minWidth,
  minHeight = APP_CONST.ui.resolution.minHeight,
  storageKey = APP_CONST.ui.resolution.storageKey,
}: Props) {
  const size = useDebouncedWindowSize(200);

  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const [sessionDismissed, setSessionDismissed] = useState(false);
  const [neverAgain, setNeverAgain] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setDismissed(raw === "1");
    } catch {
      setDismissed(false);
    }
  }, [storageKey]);

  const below = useMemo(() => {
    if (!size) return false;
    return size.w < minWidth || size.h < minHeight;
  }, [size, minWidth, minHeight]);

  const open = useMemo(() => {
    if (dismissed == null) return false;
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="resolution-guard-title"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.06)",
        },
      }}
    >
      <DialogTitle
        id="resolution-guard-title"
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <WarningAmberOutlinedIcon color="warning" sx={{ fontSize: 24 }} />
        Bildschirmgröße empfohlen
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Für die Diagramme und Tabellen ist eine größere Auflösung
          empfehlenswert. Deine aktuelle Fenstergröße könnte die Darstellung
          einschränken.
        </Typography>

        <Box sx={{ mt: 1.5, mb: 1 }}>
          <Typography variant="body2">
            <b>Empfehlung:</b> mindestens{" "}
            <b>
              {minWidth} × {minHeight} px
            </b>{" "}
            (Ratio ca. {APP_CONST.ui.resolution.aspect.w}:
            {APP_CONST.ui.resolution.aspect.h})
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            Aktuell erkannt: <b>{size ? `${size.w} × ${size.h} px` : "–"}</b>
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <FormControlLabel
          control={
            <Checkbox
              checked={neverAgain}
              onChange={(e) => setNeverAgain(e.target.checked)}
              sx={{ p: 0.5, mr: 1 }}
            />
          }
          label={
            <Typography variant="body2" color="text.secondary">
              Diesen Hinweis auf diesem Gerät nicht mehr anzeigen
            </Typography>
          }
        />
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.25 }}>
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
