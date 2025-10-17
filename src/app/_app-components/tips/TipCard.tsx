"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CheckIcon from "@mui/icons-material/Check";

import TicketModal from "../ticket/TicketModal";
import {
  buildNumberScoringData,
  scoreMainNumber,
} from "../../_app-handlers/handleBuildNumberScoring";

type Tip = {
  id: number;
  numbers: number[]; // 5 aus 1..50
  euroNumbers: number[]; // 2 aus 1..12
};

type Props = {
  tip: Tip;
  openModalFor: number | null;
  onOpenTicket: (id: number) => void;
  onCloseTicket: () => void;
  onRandom: (id: number) => void;
  onReset: (id: number) => void;
  onModalChange: (
    id: number,
    next: { numbers: number[]; euroNumbers: number[] }
  ) => void;
  lastMainSet: Set<number>;
  lastEuroSet: Set<number>;
};

const PILL_SIZE = 32;

export default function TipCard({
  tip,
  openModalFor,
  onOpenTicket,
  onCloseTicket,
  onRandom,
  onReset,
  onModalChange,
  lastMainSet,
  lastEuroSet,
}: Props) {
  // Scoring-Daten (einmal pro Mount)
  const scoringData = React.useMemo(() => buildNumberScoringData(), []);

  // Chip + Ampel-Balken (eine Farbe) + Match-Badge
  const renderScoredPill = (
    n: number,
    isMatch: boolean,
    chipColor: "primary" | "success"
  ) => {
    const s = scoreMainNumber(n, scoringData);
    const tooltipTitle = (
      <Box sx={{ fontSize: 12, lineHeight: 1.3 }}>
        <div>
          <strong>Score:</strong> {s.score} / 6
        </div>
        {s.hits.length ? (
          <div style={{ marginTop: 4 }}>
            {s.hits.map((h) => (
              <div key={h.key}>• {h.label}</div>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 4 }}>
            Keine Treffer der Bewertungs-Kriterien
          </div>
        )}
      </Box>
    );

    // Chip
    const chip = (
      <Chip
        label={n}
        size="small"
        sx={{
          height: PILL_SIZE,
          width: PILL_SIZE,
          borderRadius: 9999,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          bgcolor: `${chipColor}.main`,
          color: `${chipColor}.contrastText`,
          p: 0,
          "& .MuiChip-label": {
            width: "100%",
            px: 0,
            lineHeight: 1,
            textAlign: "center",
          },
          boxShadow: (t) =>
            t.palette.mode === "dark"
              ? "0 1px 2px rgba(0,0,0,.6)"
              : "0 1px 2px rgba(0,0,0,.15)",
        }}
      />
    );

    return (
      <Box
        key={`pill-${chipColor}-${n}`}
        sx={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          mx: 0.25,
        }}
      >
        <Tooltip title={tooltipTitle} arrow>
          <Box sx={{ position: "relative" }}>
            {chip}

            {/* Match-Badge: weißes Checkmark auf kräftigem Grün */}
            {isMatch && (
              <Box
                sx={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  bgcolor: "success.main",
                  color: "common.white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 0 0 2px rgba(255,255,255,0.85), 0 2px 6px rgba(0,0,0,.25)",
                }}
                aria-label="Treffer mit letzter Ziehung"
              >
                <CheckIcon sx={{ fontSize: 14 }} />
              </Box>
            )}
          </Box>
        </Tooltip>

        {/* Ampel-Status-Balken (eine Farbe je Score) */}
        <Box
          sx={{
            mt: 0.5,
            width: PILL_SIZE,
            height: 6,
            bgcolor: s.barColor,
            borderRadius: 1,
            boxShadow: (t) =>
              t.palette.mode === "dark"
                ? "inset 0 0 0 1px rgba(0,0,0,.35)"
                : "inset 0 0 0 1px rgba(255,255,255,.35)",
          }}
          aria-label={`Bewertung für Zahl ${n}: Score ${s.score} von 6`}
        />
      </Box>
    );
  };

  const renderNumberChip = (n: number, color: "primary" | "success") => {
    const isMatch =
      (color === "primary" && lastMainSet.has(n)) ||
      (color === "success" && lastEuroSet.has(n));

    // Hauptzahlen → mit Ampel-Balken + Badge
    if (color === "primary") {
      return renderScoredPill(n, isMatch, "primary");
    }

    // Eurozahlen → kein Ampel-Balken, aber Match-Badge anzeigen
    return (
      <Box key={`euro-${n}`} sx={{ position: "relative", mx: 0.25 }}>
        <Chip
          label={n}
          size="small"
          sx={{
            height: PILL_SIZE,
            width: PILL_SIZE,
            borderRadius: 9999,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            bgcolor: `success.main`,
            color: `success.contrastText`,
            p: 0,
            "& .MuiChip-label": {
              width: "100%",
              px: 0,
              lineHeight: 1,
              textAlign: "center",
            },
            boxShadow: (t) =>
              t.palette.mode === "dark"
                ? "0 1px 2px rgba(0,0,0,.6)"
                : "0 1px 2px rgba(0,0,0,.15)",
          }}
        />
        {isMatch && (
          <Box
            sx={{
              position: "absolute",
              top: -6,
              right: -6,
              width: 18,
              height: 18,
              borderRadius: "50%",
              bgcolor: "success.main",
              color: "common.white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 0 0 2px rgba(255,255,255,0.85), 0 2px 6px rgba(0,0,0,.25)",
            }}
            aria-label="Treffer mit letzter Ziehung"
          >
            <CheckIcon sx={{ fontSize: 14 }} />
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Card className="card tip-card" elevation={4}>
      <CardContent>
        <Box className="tip-card-head">
          <Typography variant="subtitle1" fontWeight={600}>
            Tipp {tip.id}
          </Typography>
          <Box className="tip-actions">
            <Tooltip title="Zufallszahlen">
              <IconButton
                size="small"
                onClick={() => onRandom(tip.id)}
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
                onClick={() => onOpenTicket(tip.id)}
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
                onClick={() => onReset(tip.id)}
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

        {/* Hauptzahlen (mit Ampel-Balken + Badge) */}
        <Box className="row">
          <span className="label">Gewinnzahlen</span>
          <span className="value numbers">
            <Box className="pill-row">
              {tip.numbers?.length ? (
                tip.numbers.map((n) => renderNumberChip(n, "primary"))
              ) : (
                <span>—</span>
              )}
            </Box>
          </span>
        </Box>

        {/* Eurozahlen (nur Badge) */}
        <Box className="row">
          <span className="label">Eurozahlen</span>
          <span className="value numbers">
            <Box className="pill-row">
              {tip.euroNumbers?.length ? (
                tip.euroNumbers.map((n) => renderNumberChip(n, "success"))
              ) : (
                <span>—</span>
              )}
            </Box>
          </span>
        </Box>
      </CardContent>

      {/* Spielschein-Dialog */}
      {openModalFor === tip.id && (
        <TicketModal
          open
          onClose={onCloseTicket}
          title={`Tipp ${tip.id} – Spielschein`}
          numbers={tip.numbers}
          euroNumbers={tip.euroNumbers}
          mainMaxCount={5}
          euroMaxCount={2}
          autoCloseOnComplete={false}
          onChange={(next) => onModalChange(tip.id, next)}
        />
      )}
    </Card>
  );
}
