/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

import "./Tips.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

import TipCard from "../_app-components/tips/TipCard";
import TipsToolbar from "../_app-components/tips/TipsToolbar";

import { useTipsStore, Tip, MAX_TIPS } from "../_app-stores/tips.store";

// --- strikte Validierung (wie vorher, leicht gekürzt für Import)
const N_MAIN = 5,
  N_EURO = 2,
  MAIN_MIN = 1,
  MAIN_MAX = 50,
  EURO_MIN = 1,
  EURO_MAX = 12;

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
  const raw = arr.map((x) => Number(x));
  raw.forEach((n, i) => {
    if (!Number.isInteger(n)) err.push(`${label}[${i}]: keine Ganzzahl.`);
  });
  raw.forEach((n, i) => {
    if (Number.isInteger(n) && (n < min || n > max))
      err.push(`${label}[${i}]: ${n} außerhalb von ${min}..${max}.`);
  });
  const uniq = Array.from(
    new Set(raw.filter((n) => Number.isInteger(n) && n >= min && n <= max))
  );
  if (uniq.length !== raw.length) err.push(`${label}: Duplikate gefunden.`);
  if (uniq.length !== requiredLen)
    err.push(
      `${label}: exakt ${requiredLen} Werte erwartet (gefunden: ${uniq.length}).`
    );
  if (err.length) return null;
  uniq.sort((a, b) => a - b);
  return uniq;
}

function validateTipStrict(
  row: unknown,
  idx: number,
  seen: Set<number>,
  errors: string[]
): Tip | null {
  if (typeof row !== "object" || row == null) {
    errors.push(`Eintrag #${idx + 1}: kein Objekt.`);
    return null;
  }
  const obj = row as Record<string, unknown>;
  const idNum = Number(obj.id);
  if (!Number.isInteger(idNum) || idNum < 1 || idNum > MAX_TIPS) {
    errors.push(`Eintrag #${idx + 1}: id fehlt/ungültig (1..${MAX_TIPS}).`);
    return null;
  }
  if (seen.has(idNum)) {
    errors.push(`Eintrag #${idx + 1}: id ${idNum} doppelt.`);
    return null;
  }
  const rawNums = Array.isArray(obj.numbers) ? obj.numbers : [];
  const rawEuros = Array.isArray(obj.euroNumbers) ? obj.euroNumbers : [];
  if (rawNums.length === 0 && rawEuros.length === 0) {
    seen.add(idNum);
    return { id: idNum, numbers: [], euroNumbers: [] };
  }
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
  seen.add(idNum);
  return { id: idNum, numbers: nums, euroNumbers: euros };
}

export default function TipsPage() {
  const { tips, setTip, randomizeTip, resetTip, replaceAll } = useTipsStore();
  const [openModalFor, setOpenModalFor] = useState<number | null>(null);

  // Snackbar & Import-Fehlerdialog
  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    sev: "info" as "success" | "error" | "warning" | "info",
  });
  const [errorDialog, setErrorDialog] = useState<{
    open: boolean;
    lines: string[];
  }>({
    open: false,
    lines: [],
  });

  const haveAnyTip = useMemo(
    () =>
      tips.some(
        (t) => (t.numbers?.length ?? 0) > 0 || (t.euroNumbers?.length ?? 0) > 0
      ),
    [tips]
  );

  // letzte Ziehung Sets (für Matches)
  const { lastMainSet, lastEuroSet } = useMemo(() => {
    try {
      const {
        handleGetLastDrawData,
      } = require("../_app-handlers/handleGetLastDrawData");
      const d = handleGetLastDrawData();
      return {
        lastMainSet: new Set([
          d.nummer1,
          d.nummer2,
          d.nummer3,
          d.nummer4,
          d.nummer5,
        ]),
        lastEuroSet: new Set([d.zz1, d.zz2]),
      };
    } catch {
      return { lastMainSet: new Set<number>(), lastEuroSet: new Set<number>() };
    }
  }, [tips]); // Recompute ist billig, ändert sich selten

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
  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const json: unknown = JSON.parse(text);
        if (!Array.isArray(json))
          throw new Error("Die JSON-Datei enthält kein Array.");

        const errs: string[] = [];
        const seen = new Set<number>();
        const valid: Tip[] = [];

        (json as unknown[]).slice(0, MAX_TIPS).forEach((row, idx) => {
          const before = errs.length;
          const v = validateTipStrict(row, idx, seen, errs);
          if (v) valid[v.id - 1] = v;
          else if (errs.length === before)
            errs.push(`Eintrag #${idx + 1}: unbekannter Fehler.`);
        });

        const baseline: Tip[] = Array.from({ length: MAX_TIPS }, (_, i) => ({
          id: i + 1,
          numbers: [],
          euroNumbers: [],
        }));
        const merged = [...baseline];
        let accepted = 0;
        for (let i = 0; i < MAX_TIPS; i++) {
          if (valid[i]) {
            merged[i] = valid[i]!;
            accepted++;
          }
        }

        if (accepted === 0) {
          setSnack({
            open: true,
            msg: "Keine gültigen Tipps in der Datei gefunden.",
            sev: "error",
          });
          if (errs.length) setErrorDialog({ open: true, lines: errs });
          return;
        }

        replaceAll(merged);

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

  return (
    <Box
      className="tips-page"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
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
      <TipsToolbar
        haveAnyTip={haveAnyTip}
        onDownload={handleDownload}
        onUploadFile={handleUploadFile}
      />

      {/* Scrollbarer Bereich für die Karten (Fix) */}
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 0.5 }}>
        <Box className="tips-grid">
          {tips.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              openModalFor={openModalFor}
              onOpenTicket={(id) => setOpenModalFor(id)}
              onCloseTicket={() => setOpenModalFor(null)}
              onRandom={(id) => randomizeTip(id)}
              onReset={(id) => resetTip(id)}
              onModalChange={(id, next) =>
                useTipsStore.getState().setTip(id, next)
              }
              lastMainSet={lastMainSet}
              lastEuroSet={lastEuroSet}
            />
          ))}
        </Box>
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
    </Box>
  );
}
