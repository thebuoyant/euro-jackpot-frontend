"use client";

import * as React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useDashboardStore } from "src/app/_app-stores/dashboard.store";
import { handleJackpotStakeThreshold } from "src/app/_app-handlers/handleJackpotStakeThreshold";
import type { DrawRecord } from "src/app/_app-types/record.types";

// Optionaler globaler Snackbar-Store (wenn vorhanden)
let useSnackbar: any = null;
try {
  // nur importieren, wenn es den Store gibt
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // @ts-ignore
  useSnackbar =
    require("src/app/_app-store/snackbar.store")?.useSnackbar ?? null;
} catch {
  // ignore
}

type Props = {
  targetProb?: number; // default 0.5 (50 %)
  nearPct?: number; // "kurz davor" ab Anteil, default 0.9 (= 90 % des Thresholds)
  rememberKey?: string; // LocalStorage-Key, um doppelte Hinweise pro Ziehung zu vermeiden
};

export default function JackpotStakeHint({
  targetProb = 0.5,
  nearPct = 0.9,
  rememberKey = "ejf.lastJackpotStakeNotifiedAt",
}: Props) {
  const { allDrawRecords, lastDrawRecord } = (useDashboardStore() as any) ?? {};
  const records: DrawRecord[] = Array.isArray(allDrawRecords)
    ? allDrawRecords
    : [];
  const currentStake = Number(lastDrawRecord?.spielEinsatz ?? 0);
  const drawId = String(lastDrawRecord?.datum ?? ""); // eindeutiger Marker pro Ziehung

  const [localOpen, setLocalOpen] = React.useState(false);
  const [localMsg, setLocalMsg] = React.useState<string>("");

  React.useEffect(() => {
    if (!records.length || !currentStake || !drawId) return;

    const { threshold } = handleJackpotStakeThreshold(records, {
      targetProb,
      binCount: 12,
      minPerBin: 10,
    });

    if (!threshold) return;

    const ratio = currentStake / threshold; // >=1 = drüber, >=nearPct = kurz davor
    const storageFlag =
      typeof window !== "undefined"
        ? window.localStorage.getItem(rememberKey)
        : null;

    // schon benachrichtigt? (für diese Ziehung)
    if (storageFlag === drawId) return;

    // Nachricht bauen
    let msg = "";
    if (ratio >= 1) {
      msg = `Spieleinsatz über K1-Schwelle: ${Math.round((ratio - 1) * 100)} % darüber. Erhöhte Chance auf einen Gewinn in Klasse 1.`;
    } else if (ratio >= nearPct) {
      msg = `Spieleinsatz nahe K1-Schwelle (≥ ${Math.round(nearPct * 100)} %): Noch ${Math.round((1 - ratio) * 100)} % bis zum Richtwert.`;
    }

    if (!msg) return;

    // Globaler Snackbar-Store vorhanden?
    if (useSnackbar) {
      try {
        const store = useSnackbar.getState
          ? useSnackbar.getState()
          : useSnackbar();
        const show = store?.show;
        if (show) {
          show({
            message: msg,
            severity: ratio >= 1 ? "warning" : "info",
            anchor: { vertical: "top", horizontal: "center" },
            duration: 5000,
          });
          if (typeof window !== "undefined") {
            window.localStorage.setItem(rememberKey, drawId);
          }
          return;
        }
      } catch {
        // fallback auf lokale Snackbar
      }
    }

    // Lokale Snackbar (Fallback)
    setLocalMsg(msg);
    setLocalOpen(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(rememberKey, drawId);
    }
  }, [records, currentStake, drawId, targetProb, nearPct, rememberKey]);

  // Lokaler Fallback-Snackbar-Renderer (wird nie angezeigt, wenn globaler Store genutzt wird)
  return (
    <Snackbar
      open={localOpen}
      onClose={() => setLocalOpen(false)}
      autoHideDuration={5000}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        severity="warning"
        variant="filled"
        onClose={() => setLocalOpen(false)}
        sx={{ width: "100%" }}
      >
        {localMsg}
      </Alert>
    </Snackbar>
  );
}
