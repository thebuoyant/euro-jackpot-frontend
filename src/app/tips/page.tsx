/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  react-hooks/exhaustive-deps */
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
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

import "./Tips.css";
import TicketModal from "../_app-components/ticket/TicketModal";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

type Tip = {
  id: number; // 1..12
  numbers: number[]; // 5 aus 1..50
  euroNumbers: number[]; // 2 aus 1..12
};

const MAX_TIPS = 12;
const N_MAIN = 5;
const N_EURO = 2;
const MAIN_MIN = 1;
const MAIN_MAX = 50;
const EURO_MIN = 1;
const EURO_MAX = 12;
const LS_KEY = "eurojackpot.tips.v1";

/** unique random Set mit Sortierung */
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

function toNumberArray(
  arr: unknown,
  min: number,
  max: number,
  maxLen: number
): number[] {
  if (!Array.isArray(arr)) return [];
  const cleaned = Array.from(
    new Set(
      arr
        .map((x) => Number(x))
        .filter((n) => Number.isInteger(n) && n >= min && n <= max)
    )
  ).slice(0, maxLen);
  cleaned.sort((a, b) => a - b);
  return cleaned;
}

function validateTip(raw: unknown): Tip | null {
  if (typeof raw !== "object" || raw == null) return null;
  const obj = raw as Record<string, unknown>;

  const idNum = Number(obj.id);
  if (!Number.isInteger(idNum) || idNum < 1 || idNum > MAX_TIPS) return null;

  const numbers = toNumberArray(obj.numbers, MAIN_MIN, MAIN_MAX, N_MAIN);
  const euroNumbers = toNumberArray(
    obj.euroNumbers,
    EURO_MIN,
    EURO_MAX,
    N_EURO
  );

  if (numbers.length > N_MAIN || euroNumbers.length > N_EURO) return null;

  return { id: idNum, numbers, euroNumbers };
}

export default function TipsPage() {
  const [tips, setTips] = useState<Tip[]>(
    Array.from({ length: MAX_TIPS }, (_, i) => emptyTip(i + 1)) as Tip[]
  );
  const [openModalFor, setOpenModalFor] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // LS laden
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);

      const next: Tip[] = Array.from({ length: MAX_TIPS }, (_, i) =>
        emptyTip(i + 1)
      ) as Tip[];

      if (Array.isArray(parsed)) {
        parsed.slice(0, MAX_TIPS).forEach((row) => {
          const v = validateTip(row);
          if (v) next[v.id - 1] = v;
        });
        setTips(next);
      }
    } catch {
      // ignore
    }
  }, []);

  // LS speichern
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

  /** Wird vom Modal bei jeder Änderung aufgerufen */
  const handleModalChange = (
    id: number,
    next: { numbers: number[]; euroNumbers: number[] }
  ) => {
    setTips((prev) => {
      const idx = id - 1;
      const clone = [...prev];
      // Sicherheit: Begrenzen + Sortieren
      const nums = Array.from(new Set(next.numbers))
        .slice(0, N_MAIN)
        .sort((a, b) => a - b);
      const euros = Array.from(new Set(next.euroNumbers))
        .slice(0, N_EURO)
        .sort((a, b) => a - b);
      clone[idx] = { ...clone[idx], numbers: nums, euroNumbers: euros };
      return clone;
    });
  };

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

  const handleUploadClick = () => fileRef.current?.click();

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // reset, damit gleiche Datei erneut wählbar ist
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const json: unknown = JSON.parse(text);

        const next: Tip[] = Array.from({ length: MAX_TIPS }, (_, i) =>
          emptyTip(i + 1)
        ) as Tip[];

        if (!Array.isArray(json)) throw new Error("Invalid JSON");

        json.slice(0, MAX_TIPS).forEach((row: unknown) => {
          const v = validateTip(row);
          if (v) next[v.id - 1] = v;
        });
        setTips(next);
      } catch {
        alert("Ungültige Datei. Bitte ein valides JSON mit Tipps hochladen.");
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
      <Toolbar disableGutters sx={{ gap: 1, mb: 2, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
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
          variant="outlined"
          startIcon={<FileUploadOutlinedIcon />}
          onClick={handleUploadClick}
          sx={{ textTransform: "none" }}
        >
          JSON hochladen
        </Button>
      </Toolbar>

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
                    >
                      <CasinoIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Spielschein">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenTicket(tip.id)}
                    >
                      <ConfirmationNumberIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Zurücksetzen">
                    <IconButton
                      size="small"
                      onClick={() => handleReset(tip.id)}
                    >
                      <RestartAltIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Box className="row">
                <span className="label">Gewinnzahlen</span>
                <span className="value numbers">
                  {tip.numbers.length ? tip.numbers.join(" | ") : "—"}
                </span>
              </Box>
              <Box className="row">
                <span className="label">Eurozahlen</span>
                <span className="value numbers">
                  {tip.euroNumbers.length ? tip.euroNumbers.join(" | ") : "—"}
                </span>
              </Box>
            </CardContent>

            {/* Spielschein-Dialog (interaktiv) */}
            {openModalFor === tip.id && (
              <TicketModal
                open
                onClose={handleCloseTicket}
                title={`Tipp ${tip.id} – Spielschein`}
                numbers={tip.numbers}
                euroNumbers={tip.euroNumbers}
                mainMaxCount={N_MAIN}
                euroMaxCount={N_EURO}
                onChange={(next) => handleModalChange(tip.id, next)}
              />
            )}
          </Card>
        ))}
      </Box>
    </div>
  );
}
