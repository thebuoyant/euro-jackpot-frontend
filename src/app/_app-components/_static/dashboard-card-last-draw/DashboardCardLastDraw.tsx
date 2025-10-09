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
}: {
  title: string;
  labelDate: string;
  labelWinningNumbers: string;
  labelEuroNumbers: string;
  labelStake: string;
  labelDay: string;
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
        // Log only outside production to keep prod console clean
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

  return (
    <Card className="card" elevation={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Divider sx={{ my: 2 }} />

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
