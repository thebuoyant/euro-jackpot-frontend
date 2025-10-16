/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  Toolbar,
  Button,
  Paper,
  Chip,
  Badge,
  useTheme,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import "./Tips.css";
import TicketModal from "../_app-components/ticket/TicketModal";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

// Letzte Ziehung + Day helper + Typen
import { handleGetLastDrawData } from "../_app-handlers/handleGetLastDrawData";
import { resolveDay } from "../_app-utils/record.util";
import type { DrawRecord } from "../_app-types/record.types";

type Tip = {
  id: number; // 1..12
  numbers: number[]; // exakt 5 aus 1..50 (oder leer wenn komplett leerer Tipp)
  euroNumbers: number[]; // exakt 2 aus 1..12 (oder leer wenn komplett leerer Tipp)
};

const MAX_TIPS = 12;
const N_MAIN = 5;
const N_EURO = 2;
const MAIN_MIN = 1;
const MAIN_MAX = 50;
const EURO_MIN = 1;
const EURO_MAX = 12;
const LS_KEY = "eurojackpot.tips.v1";

// Kontrastgrün für Treffer-Badge (bewusst anders als MUI "success")
const BADGE_GREEN = "#00C853"; // green A700

// ---------------- Helpers

function uniqueRandomSet(count: number, min: number, max: number): number[] {
  const out: number[] = [];
  while (out.length < count) {
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!out.includes(n)) out.push(n);
  }
  out.sort((a, b) => a - b);
  return out;
}

function randomTip(id: number): Tip {
  return {
    id,
    numbers: uniqueRandomSet(N_MAIN, MAIN_MIN, MAIN_MAX),
    euroNumbers: uniqueRandomSet(N_EURO, EURO_MIN, EURO_MAX),
  };
}

function emptyTip(id: number): Tip {
  return { id, numbers: [] as number[], euroNumbers: [] as number[] };
}

/** strict: Ganzzahlen, Range, Duplikate, exakt requiredLen */
function validateNumberArrayStrict(
  arr: unknown,
  min: number,
  max: number,
  requiredLen: number,
  label: string,
  err: string[]
): number[] | null {
  if (!Array.isArray(arr)) {
    err.push(`${label}: erwartet ein Array.`);
    return null;
  }

  // Cast + primitive Checks
  const raw = arr.map((x) => Number(x));
  raw.forEach((n, i) => {
    if (!Number.isInteger(n)) err.push(`${label}[${i}]: keine Ganzzahl.`);
  });
  raw.forEach((n, i) => {
    if (Number.isInteger(n) && (n < min || n > max)) {
      err.push(`${label}[${i}]: ${n} außerhalb von ${min}..${max}.`);
    }
  });

  // uniq + length
  const uniq = Array.from(
    new Set(raw.filter((n) => Number.isInteger(n) && n >= min && n <= max))
  );
  if (uniq.length !== raw.length) {
    err.push(`${label}: Duplikate gefunden.`);
  }
  if (uniq.length !== requiredLen) {
    err.push(
      `${label}: exakt ${requiredLen} Werte erwartet (gefunden: ${uniq.length}).`
    );
  }

  if (err.length) return null;
  uniq.sort((a, b) => a - b);
  return uniq;
}

/**
 * Strenge Tipp-Validierung:
 * - id 1..12, keine Duplikate
 * - Sonderfall: beide Arrays leer -> erlaubt (kein Fehler)
 * - sonst: exakt 5/2, Range, Ganzzahlen, keine Duplikate
 */
function validateTipStrict(
  row: unknown,
  idx: number,
  seenIds: Set<number>,
  errors: string[]
): Tip | null {
  if (typeof row !== "object" || row == null) {
    errors.push(`Eintrag #${idx + 1}: kein Objekt.`);
    return null;
  }
  const obj = row as Record<string, unknown>;

  // id prüfen
  const idNum = Number(obj.id);
  if (!Number.isInteger(idNum) || idNum < 1 || idNum > MAX_TIPS) {
    errors.push(`Eintrag #${idx + 1}: id fehlt/ungültig (1..${MAX_TIPS}).`);
    return null;
  }
  if (seenIds.has(idNum)) {
    errors.push(`Eintrag #${idx + 1}: id ${idNum} doppelt.`);
    return null;
  }

  // Roh-Arrays (können fehlen → leeres Array)
  const rawNums = Array.isArray(obj.numbers) ? obj.numbers : [];
  const rawEuros = Array.isArray(obj.euroNumbers) ? obj.euroNumbers : [];

  // Kompletter Leer-Tipp: erlaubt
  const isEmpty = rawNums.length === 0 && rawEuros.length === 0;
  if (isEmpty) {
    seenIds.add(idNum);
    return { id: idNum, numbers: [], euroNumbers: [] };
  }

  // Befüllter Tipp => strikt
  const localErr: string[] = [];
  const nums = validateNumberArrayStrict(
    rawNums,
    MAIN_MIN,
    MAIN_MAX,
    N_MAIN,
    `Eintrag #${idx + 1} – numbers`,
    localErr
  );
  const euros = validateNumberArrayStrict(
    rawEuros,
    EURO_MIN,
    EURO_MAX,
    N_EURO,
    `Eintrag #${idx + 1} – euroNumbers`,
    localErr
  );

  if (localErr.length > 0 || !nums || !euros) {
    errors.push(...localErr);
    return null;
  }

  seenIds.add(idNum);
  return { id: idNum, numbers: nums, euroNumbers: euros };
}

// ---------------- Page

export default function TipsPage() {
  const [tips, setTips] = useState<Tip[]>(
    Array.from({ length: MAX_TIPS }, (_, i) => emptyTip(i + 1)) as Tip[]
  );
  const [openModalFor, setOpenModalFor] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const theme = useTheme();

  // Upload/Feedback
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    sev: "success" | "error" | "warning" | "info";
  }>({
    open: false,
    msg: "",
    sev: "info",
  });
  const [errorDialog, setErrorDialog] = useState<{
    open: boolean;
    lines: string[];
  }>({ open: false, lines: [] });

  // letzte Ziehung (Toolbar + Match-Badges)
  const lastDraw: DrawRecord | null = useMemo(() => {
    try {
      return handleGetLastDrawData();
    } catch {
      return null;
    }
  }, []);

  const lastMainSet = useMemo(
    () =>
      lastDraw
        ? new Set([
            lastDraw.nummer1,
            lastDraw.nummer2,
            lastDraw.nummer3,
            lastDraw.nummer4,
            lastDraw.nummer5,
          ])
        : new Set<number>(),
    [lastDraw]
  );

  const lastEuroSet = useMemo(
    () =>
      lastDraw ? new Set([lastDraw.zz1, lastDraw.zz2]) : new Set<number>(),
    [lastDraw]
  );

  // LocalStorage laden (streng), invalide verwerfen
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);

      const baseline: Tip[] = Array.from({ length: MAX_TIPS }, (_, i) =>
        emptyTip(i + 1)
      ) as Tip[];

      if (Array.isArray(parsed)) {
        const errs: string[] = [];
        const seen = new Set<number>();
        const valid: Tip[] = [];

        parsed.slice(0, MAX_TIPS).forEach((row, idx) => {
          const before = errs.length;
          const v = validateTipStrict(row, idx, seen, errs);
          if (v) valid[v.id - 1] = v;
          else if (errs.length === before) {
            errs.push(`Eintrag #${idx + 1}: unbekannter Fehler.`);
          }
        });

        const merged = [...baseline];
        for (let i = 0; i < MAX_TIPS; i++) {
          if (valid[i]) merged[i] = valid[i]!;
        }
        setTips(merged);

        if (errs.length) {
          setSnack({
            open: true,
            msg: "Einige lokal gespeicherte Tipps waren ungültig und wurden verworfen.",
            sev: "warning",
          });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // LocalStorage speichern
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(tips));
    } catch {
      // ignore
    }
  }, [tips]);

  const handleRandom = (id: number) => {
    setTips((prev) => {
      const idx = id - 1;
      const clone = [...prev];
      clone[idx] = randomTip(id);
      return clone;
    });
  };

  const handleReset = (id: number) => {
    setTips((prev) => {
      const idx = id - 1;
      const clone = [...prev];
      clone[idx] = emptyTip(id);
      return clone;
    });
  };

  const handleOpenTicket = (id: number) => setOpenModalFor(id);
  const handleCloseTicket = () => setOpenModalFor(null);

  /** Änderungen aus dem Modal – Teilauswahl zulassen, UI begrenzt ohnehin */
  const handleModalChange = (
    id: number,
    next: { numbers: number[]; euroNumbers: number[] }
  ) => {
    setTips((prev) => {
      const idx = id - 1;
      const clone = [...prev];

      const nums = Array.from(new Set(next.numbers))
        .filter((n) => Number.isInteger(n) && n >= MAIN_MIN && n <= MAIN_MAX)
        .slice(0, N_MAIN)
        .sort((a, b) => a - b);

      const euros = Array.from(new Set(next.euroNumbers))
        .filter((n) => Number.isInteger(n) && n >= EURO_MIN && n <= EURO_MAX)
        .slice(0, N_EURO)
        .sort((a, b) => a - b);

      clone[idx] = { ...clone[idx], numbers: nums, euroNumbers: euros };
      return clone;
    });
  };

  // Download
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(tips, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = "eurojackpot-tips.json";
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Upload
  const handleUploadClick = () => fileRef.current?.click();

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset für erneutes Hochladen
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const json: unknown = JSON.parse(text);
        if (!Array.isArray(json))
          throw new Error("Die JSON-Datei enthält kein Array.");

        const baseline: Tip[] = Array.from({ length: MAX_TIPS }, (_, i) =>
          emptyTip(i + 1)
        ) as Tip[];
        const errs: string[] = [];
        const seen = new Set<number>();
        const valid: Tip[] = [];

        json.slice(0, MAX_TIPS).forEach((row: unknown, idx) => {
          const before = errs.length;
          const v = validateTipStrict(row, idx, seen, errs);
          if (v) valid[v.id - 1] = v;
          else if (errs.length === before) {
            // falls etwas schief lief aber keine Meldung generiert wurde
            errs.push(`Eintrag #${idx + 1}: unbekannter Fehler.`);
          }
        });

        const accepted = valid.filter(Boolean).length;
        if (accepted === 0) {
          // Nichts überschreiben
          setSnack({
            open: true,
            msg: "Keine gültigen Tipps in der Datei gefunden.",
            sev: "error",
          });
          if (errs.length) setErrorDialog({ open: true, lines: errs });
          return;
        }

        // valide in baseline mergen
        const merged = [...baseline];
        for (let i = 0; i < MAX_TIPS; i++) {
          if (valid[i]) merged[i] = valid[i]!;
        }
        setTips(merged);

        if (errs.length) {
          setErrorDialog({ open: true, lines: errs });
          setSnack({
            open: true,
            msg: `Teilweise gültig. Übernommen: ${accepted} Tipp(e).`,
            sev: "warning",
          });
        } else {
          setSnack({
            open: true,
            msg: `Tipps geladen (${accepted}).`,
            sev: "success",
          });
        }
      } catch (err: any) {
        setSnack({
          open: true,
          msg: err?.message || "Ungültige Datei.",
          sev: "error",
        });
      }
    };
    reader.readAsText(file);
  };

  const haveAnyTip = useMemo(
    () =>
      tips.some(
        (t) => (t.numbers?.length ?? 0) > 0 || (t.euroNumbers?.length ?? 0) > 0
      ),
    [tips]
  );

  /** Pills – einheitliche Größe (unverändert) */
  const renderPills = (vals: number[], color: "primary" | "success") => {
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

  /** Pills mit optionalem Match-Badge (gegen letzte Ziehung) */
  const renderPillsMatched = (
    vals: number[],
    color: "primary" | "success",
    matchSet?: Set<number>
  ) => {
    if (!vals?.length) return <span className="value numbers">—</span>;
    const PILL_SIZE = 32;
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
              variant="dot"
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              sx={{
                "& .MuiBadge-badge": {
                  // größer & kontrastreich grün
                  bgcolor: BADGE_GREEN,
                  color: BADGE_GREEN,
                  width: 14,
                  height: 14,
                  minWidth: 14,
                  borderRadius: "50%",
                  border: "2px solid #fff",
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

  return (
    <div className="tips-page">
      <div className="page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST?.pages?.tips?.headerTitle ?? "Meine Tipps"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lege bis zu 12 Tippreihen an. Zufallszahlen, Spielschein-Ansicht und
          Export/Import.
        </Typography>
      </div>

      {/* Toolbar */}
      <Paper
        elevation={0}
        className="tips-toolbar-paper"
        sx={{
          p: 1.25,
          mb: 2,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))"
              : "linear-gradient(180deg, rgba(18,52,86,0.05), rgba(18,52,86,0))",
        }}
      >
        <Toolbar disableGutters sx={{ gap: 1, flexWrap: "wrap" }}>
          {/* Letzte Ziehung – Datum + Zahlen (ohne Badges) */}
          {lastDraw && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                flexWrap: "wrap",
                pr: 1,
                mr: 1,
                borderRight: (t) => `1px solid ${t.palette.divider}`,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mr: 0.5 }}
              >
                Letzte Ziehung: {lastDraw.datum} ({resolveDay(lastDraw.tag)})
              </Typography>
              <span className="value numbers">
                {renderPills(
                  [
                    lastDraw.nummer1,
                    lastDraw.nummer2,
                    lastDraw.nummer3,
                    lastDraw.nummer4,
                    lastDraw.nummer5,
                  ],
                  "primary"
                )}
              </span>
              <span className="value numbers">
                {renderPills([lastDraw.zz1, lastDraw.zz2], "success")}
              </span>
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={handleDownload}
            disabled={!haveAnyTip}
            sx={{ textTransform: "none" }}
          >
            JSON herunterladen
          </Button>
          <input
            type="file"
            accept="application/json"
            ref={fileRef}
            style={{ display: "none" }}
            onChange={handleUploadFile}
          />
          <Button
            variant="contained"
            color="success"
            startIcon={<FileUploadOutlinedIcon />}
            onClick={handleUploadClick}
            sx={{ textTransform: "none" }}
          >
            JSON hochladen
          </Button>
        </Toolbar>
      </Paper>

      {/* Grid mit 12 Karten */}
      <Box className="tips-grid">
        {tips.map((tip) => (
          <Card key={tip.id} className="card tip-card" elevation={4}>
            <CardContent>
              <Box className="tip-card-head">
                <Typography variant="subtitle1" fontWeight={600}>
                  Tipp {tip.id}
                </Typography>
                <Box className="tip-actions">
                  <Tooltip title="Zufallszahlen">
                    <IconButton
                      size="small"
                      onClick={() => handleRandom(tip.id)}
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        "&:hover": { bgcolor: "primary.dark" },
                      }}
                    >
                      <CasinoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Spielschein">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenTicket(tip.id)}
                      sx={{
                        bgcolor: "success.main",
                        color: "success.contrastText",
                        "&:hover": { bgcolor: "success.dark" },
                      }}
                    >
                      <ConfirmationNumberIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Zurücksetzen">
                    <IconButton
                      size="small"
                      onClick={() => handleReset(tip.id)}
                      sx={{
                        bgcolor: "warning.main",
                        color: "warning.contrastText",
                        "&:hover": { bgcolor: "warning.dark" },
                      }}
                    >
                      <RestartAltIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box className="row">
                <span className="label">Gewinnzahlen</span>
                <span className="value numbers">
                  {renderPillsMatched(tip.numbers, "primary", lastMainSet)}
                </span>
              </Box>
              <Box className="row">
                <span className="label">Eurozahlen</span>
                <span className="value numbers">
                  {renderPillsMatched(tip.euroNumbers, "success", lastEuroSet)}
                </span>
              </Box>
            </CardContent>

            {/* Spielschein-Dialog */}
            {openModalFor === tip.id && (
              <TicketModal
                open
                onClose={handleCloseTicket}
                title={`Tipp ${tip.id} – Spielschein`}
                numbers={tip.numbers}
                euroNumbers={tip.euroNumbers}
                mainMaxCount={N_MAIN}
                euroMaxCount={N_EURO}
                autoCloseOnComplete={false}
                onChange={(next) => handleModalChange(tip.id, next)}
              />
            )}
          </Card>
        ))}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.sev}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>

      {/* Fehler-Detaildialog (nur bei Upload) */}
      <Dialog
        open={errorDialog.open}
        onClose={() => setErrorDialog({ open: false, lines: [] })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Probleme beim Import</DialogTitle>
        <DialogContent dividers>
          {errorDialog.lines.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Keine Details verfügbar.
            </Typography>
          ) : (
            <Box component="ul" sx={{ m: 0, pl: 3 }}>
              {errorDialog.lines.map((line, i) => (
                <li key={i}>
                  <Typography variant="body2">{line}</Typography>
                </li>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialog({ open: false, lines: [] })}>
            Schließen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
