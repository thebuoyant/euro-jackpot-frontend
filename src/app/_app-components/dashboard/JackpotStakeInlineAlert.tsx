"use client";

import * as React from "react";
import { Alert } from "@mui/material";
import { useDashboardStore } from "src/app/_app-stores/dashboard.store";
import { handleJackpotStakeThreshold } from "src/app/_app-handlers/handleJackpotStakeThreshold";
import type { DrawRecord } from "src/app/_app-types/record.types";

type Props = {
  targetProb?: number; // default 0.5
  nearPct?: number; // default 0.9
};

export default function JackpotStakeInlineAlert({
  targetProb = 0.5,
  nearPct = 0.9,
}: Props) {
  const { allDrawRecords, lastDrawRecord } = (useDashboardStore() as any) ?? {};
  const records: DrawRecord[] = Array.isArray(allDrawRecords)
    ? allDrawRecords
    : [];
  const currentStake = Number(lastDrawRecord?.spielEinsatz ?? 0);

  if (!records.length || !currentStake) return null;

  const { threshold } = handleJackpotStakeThreshold(records, {
    targetProb,
    binCount: 12,
    minPerBin: 10,
  });

  if (!threshold) return null;

  const ratio = currentStake / threshold;
  if (ratio < nearPct) return null; // erst ab "kurz davor" anzeigen

  const over = ratio >= 1;
  const restPct = Math.max(0, Math.round((1 - ratio) * 100));
  const deltaOver = Math.max(0, Math.round((ratio - 1) * 100));

  return (
    <Alert
      severity={over ? "warning" : "info"}
      sx={{
        mt: 1,
        mb: -0.5, // kompakt halten
        "& .MuiAlert-message": { width: "100%" },
      }}
    >
      {over ? (
        <>
          Spieleinsatz über K1-Schwelle: <strong>{deltaOver}%</strong> darüber.
          Erhöhte Chance auf Gewinnklasse 1.
        </>
      ) : (
        <>
          Spieleinsatz nahe K1-Schwelle (≥ {Math.round(nearPct * 100)} %): Noch{" "}
          <strong>{restPct}%</strong> bis zum Richtwert.
        </>
      )}
    </Alert>
  );
}
