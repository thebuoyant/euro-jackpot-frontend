/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";
import { Card, CardContent, Divider, Typography, Box } from "@mui/material";
import { DrawRecord } from "src/app/_app-types/record.types";
import {
  formatNumberToString,
  resolveDay,
} from "src/app/_app-utils/record.util";
import { useDashboardStore } from "src/app/_app-stores/dashboard.store";
import { API_ROUTE_CONST } from "src/app/_app-constants/api-routes.const";
import SkeletonKeyValueList from "src/app/_app-components/_static/skeleton-key-value-list/SkeletonKeyValueList";

export default function DashboardCardLastDraw({
  title,
  labelDate,
  labelWinningNumbers,
  labelEuroNumbers,
  labelStake,
  labelDay,
}: {
  title: string;
  labelDate: string;
  labelWinningNumbers: string;
  labelEuroNumbers: string;
  labelStake: string;
  labelDay: string;
}) {
  const {
    lastDrawRecord,
    setIsLoadingLastDrawData,
    setLastDrawRecord,
    isLoadingLastDrawData,
  } = useDashboardStore() as any;

  // ⬇️ Merkt, ob der allererste Fetch bereits einmal durchgelaufen ist
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setIsLoadingLastDrawData(true);
        const res = await fetch(`${API_ROUTE_CONST.lastDraw}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive)
          setLastDrawRecord(
            (data?.lastDrawRecord ?? null) as DrawRecord | null
          );
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.error(err);
        if (alive) setLastDrawRecord(null);
      } finally {
        if (alive) {
          setIsLoadingLastDrawData(false);
          hasFetchedRef.current = true; // ⬅️ erster Fetch abgeschlossen
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [setIsLoadingLastDrawData, setLastDrawRecord]);

  // 🔑 Anzeige-Logik:
  const showSkeleton = !hasFetchedRef.current || isLoadingLastDrawData;

  // 🎖️ Gold-Hintergrund aktivieren, wenn Klasse 1 Gewinner vorhanden
  const isJackpotHit = !!(
    lastDrawRecord && Number(lastDrawRecord.anzahlKlasse1) > 0
  );

  // 🎨 Professioneller Gold-Gradient + feiner Rahmen/Glanz
  const goldenStyles = isJackpotHit
    ? {
        // Card-Wrapper
        sxCard: {
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          // subtiler „glow“
          boxShadow:
            "0 10px 25px rgba(0,0,0,0.20), inset 0 0 0 1px rgba(255,255,255,0.15)",
        } as const,
        // CardContent Hintergrund (Gradient + Textkontrast)
        sxContent: {
          background:
            // sanfter Goldverlauf, mit leichtem „Sheen“
            "linear-gradient(145deg, #b4882c 0%, #d4a638 25%, #f1d27a 50%, #d4a638 75%, #b07e27 100%)",
          // dezenter Glanzfilm oben links
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0.00) 60%)",
            pointerEvents: "none",
          },
          position: "relative",
          color: "rgba(0,0,0,0.85)",
          // etwas mehr „Card“-Feeling
          border: "1px solid rgba(0,0,0,0.08)",
        } as const,
        // Divider auf Gold
        sxDivider: {
          my: 2,
          borderColor: "rgba(0,0,0,0.18)",
          opacity: 0.7,
        } as const,
        // Labels/Values für lesbaren Kontrast auf Gold
        sxList: {
          "& .label": { color: "rgba(0,0,0,0.78)", fontWeight: 600 },
          "& .value": { color: "rgba(0,0,0,0.90)", fontWeight: 500 },
        } as const,
        // Titel dunkler für Kontrast
        sxTitle: {
          color: "rgba(0,0,0,0.92)",
          textShadow: "0 1px 0 rgba(255,255,255,0.4)",
        } as const,
      }
    : {
        // Standard-Stile, wenn kein Jackpot-Hit
        sxCard: {} as const,
        sxContent: {} as const,
        sxDivider: { my: 2 } as const,
        sxList: {} as const,
        sxTitle: {},
      };

  return (
    <Card
      className="card"
      elevation={isJackpotHit ? 8 : 4}
      sx={goldenStyles.sxCard}
    >
      <CardContent sx={goldenStyles.sxContent}>
        <Typography variant="h6" gutterBottom sx={goldenStyles.sxTitle}>
          {title}
        </Typography>

        <Divider sx={goldenStyles.sxDivider} />

        {showSkeleton ? (
          <Box>
            <SkeletonKeyValueList
              rows={5}
              labelWidth={120}
              valueMaxWidth="70%"
              lineHeight={22}
              gap={10}
            />
          </Box>
        ) : !lastDrawRecord ? (
          <Typography
            variant="body2"
            color={isJackpotHit ? "inherit" : "text.secondary"}
          >
            Keine Daten vorhanden.
          </Typography>
        ) : (
          <ul
            className="card-list"
            style={{ height: "100%", ...goldenStyles.sxList }}
          >
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
              <span className="value">{resolveDay(lastDrawRecord.tag)}</span>
            </li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
