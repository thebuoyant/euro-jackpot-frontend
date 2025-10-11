/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import { DrawRecord } from "src/app/_app-types/record.types";
import {
  formatNumberToString,
  resolveDay,
} from "src/app/_app-utils/record.util";
import { useDashboardStore } from "src/app/_app-stores/dashboard.store";
import { API_ROUTE_CONST } from "src/app/_app-constants/api-routes.const";

export default function DashboardCardLastDraw({
  title,
  labelDate,
  labelWinningNumbers,
  labelEuroNumbers,
  labelStake,
  labelDay,
  isFirstClassDraw = false,
}: {
  title: string;
  labelDate: string;
  labelWinningNumbers: string;
  labelEuroNumbers: string;
  labelStake: string;
  labelDay: string;
  isFirstClassDraw?: boolean;
}) {
  const { lastDrawRecord, setIsLoadingLastDrawData, setLastDrawRecord } =
    useDashboardStore() as any;

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setIsLoadingLastDrawData(true);

        const res = await fetch(`${API_ROUTE_CONST.lastDraw}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        setLastDrawRecord(data.lastDrawRecord);
        if (alive)
          setLastDrawRecord((data?.lastDrawRecord ?? {}) as DrawRecord);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.error(err);
        if (alive) setLastDrawRecord(null);
      } finally {
        if (alive) setIsLoadingLastDrawData(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [setIsLoadingLastDrawData, setLastDrawRecord]);

  if (!lastDrawRecord) {
    return null;
  }

  /**
   * Intensives, „richtiges“ Gold:
   * - Mehrere eng gesetzte Farbstopps (metallische Bänder + harte Highlights)
   * - Conic + Linear Gradients kombiniert (metallischer Glanz ohne Animation)
   * - Subtile Noise-/Grain-Textur und innere Vignette (beides strikt im Card-Bereich)
   * - Kein Überlaufen: overflow:hidden; Pseudo-Elemente sind auf inset begrenzt
   * - Kräftiger, aber lesbarer Kontrast (dunkle Typo)
   */
  const goldenSx = isFirstClassDraw
    ? {
        position: "relative",
        overflow: "hidden",
        color: "#1a1303",
        // Metallic Base (lineare Bänder + specular Highlights)
        backgroundImage: `
          linear-gradient(
            135deg,
            #3e2c00 0%,
            #6f5200 6%,
            #8f6b00 10%,
            #b78727 16%,
            #d4ad3d 22%,
            #f2d675 28%,
            #ffe88a 32%,
            #fff3b8 36%,
            #ffd700 40%,
            #f2cf66 46%,
            #caa43b 54%,
            #9e7c16 62%,
            #7d5f00 70%,
            #b78727 78%,
            #f2d675 86%,
            #d4ad3d 94%,
            #6f5200 100%
          ),
          conic-gradient(
            from 210deg at 30% 30%,
            #fff9d1 0deg,
            #caa43b 18deg,
            #7d5f00 38deg,
            #ffd700 60deg,
            #b78727 82deg,
            #f2d675 110deg,
            #9e7c16 150deg,
            #fff3b8 180deg,
            #caa43b 210deg,
            #7d5f00 260deg,
            #ffd700 300deg,
            #b78727 330deg,
            #fff9d1 360deg
          )
        `,
        backgroundBlendMode: "soft-light, normal",
        border: "1px solid rgba(80, 58, 0, 0.6)",
        boxShadow:
          "0 12px 28px rgba(110, 85, 0, 0.35), 0 6px 14px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.65)",

        // Sehr subtile „gebürstete“ Struktur (feine vertikale Linien)
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 6px)",
          opacity: 0.28,
          mixBlendMode: "soft-light",
        },

        // Innere Vignette für Tiefe (bleibt innerhalb der Karte)
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 45%), radial-gradient(120% 100% at 50% 100%, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.0) 46%)",
          mixBlendMode: "overlay",
        },

        // Typo & Divider anpassen
        "& .MuiTypography-root": { color: "#1a1303" },
        "& .MuiDivider-root": { borderColor: "rgba(60, 44, 0, 0.28)" },

        // Dezentere Hover-Veredelung (kein Shift, bleibt im Card-Bereich)
        transition: "box-shadow 160ms ease-out",
        "&:hover": {
          boxShadow:
            "0 14px 32px rgba(110, 85, 0, 0.42), 0 6px 16px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.70)",
        },
      }
    : undefined;

  return (
    <Card className="card" elevation={4} sx={goldenSx}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Divider
          sx={{
            my: 2,
            borderColor: isFirstClassDraw ? "rgba(60, 44, 0, 0.28)" : undefined,
          }}
        />

        <ul className="card-list" style={{ height: "100%" }}>
          <li>
            <span className="label">{`${labelDate}:`}</span>
            <span className="value">{lastDrawRecord.datum}</span>
          </li>
          <li>
            <span className="label">{`${labelWinningNumbers}:`}</span>
            <span className="value">{`${lastDrawRecord.nummer1} | ${lastDrawRecord.nummer2} | ${lastDrawRecord.nummer3} | ${lastDrawRecord.nummer4} | ${lastDrawRecord.nummer5}`}</span>
          </li>
          <li>
            <span className="label">{`${labelEuroNumbers}:`}</span>
            <span className="value">{`${lastDrawRecord.zz1} | ${lastDrawRecord.zz2}`}</span>
          </li>
          <li>
            <span className="label">{`${labelStake}:`}</span>
            <span className="value">{`${formatNumberToString(
              lastDrawRecord.spielEinsatz,
              2
            )} €`}</span>
          </li>
          <li>
            <span className="label">{`${labelDay}:`}</span>
            <span className="value">{`${resolveDay(lastDrawRecord.tag)}`}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
