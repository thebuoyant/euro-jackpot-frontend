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
          hasFetchedRef.current = true; // ⬅️ jetzt wissen wir: erster Fetch ist durch
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [setIsLoadingLastDrawData, setLastDrawRecord]);

  // 🔑 Anzeige-Logik:
  // - Solange wir noch nie gefetched haben ODER loading=true ⇒ Skeleton
  // - Danach: wenn kein Record ⇒ "Keine Daten"
  const showSkeleton = !hasFetchedRef.current || isLoadingLastDrawData;

  return (
    <Card className="card" elevation={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Divider sx={{ my: 2 }} />

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
          <Typography variant="body2" color="text.secondary">
            Keine Daten vorhanden.
          </Typography>
        ) : (
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
              <span className="value">{resolveDay(lastDrawRecord.tag)}</span>
            </li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
