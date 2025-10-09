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

export default function DashboardCardFirstDraw({
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
  const { firstDrawRecord, setIsLoadingFirstDrawData, setFirstDrawRecord } =
    useDashboardStore() as any;

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setIsLoadingFirstDrawData(true);

        const res = await fetch(`${API_ROUTE_CONST.firstDraw}`);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        setFirstDrawRecord(data.firstDrawRecord);
        if (alive)
          setFirstDrawRecord((data?.firstDrawRecord ?? {}) as DrawRecord);
      } catch (err) {
        // Log only outside production to keep prod console clean
        if (process.env.NODE_ENV !== "production") console.error(err);
        if (alive) setFirstDrawRecord(null);
      } finally {
        if (alive) setIsLoadingFirstDrawData(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [setIsLoadingFirstDrawData, setFirstDrawRecord]);

  if (!firstDrawRecord) {
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
            <span className="value">{firstDrawRecord.datum}</span>
          </li>
          <li>
            <span className="label">{`${labelWinningNumbers}:`}</span>
            <span className="value">{`${firstDrawRecord.nummer1} | ${firstDrawRecord.nummer2} | ${firstDrawRecord.nummer3} | ${firstDrawRecord.nummer4} | ${firstDrawRecord.nummer5}`}</span>
          </li>
          <li>
            <span className="label">{`${labelEuroNumbers}:`}</span>
            <span className="value">{`${firstDrawRecord.zz1} | ${firstDrawRecord.zz2}`}</span>
          </li>
          <li>
            <span className="label">{`${labelStake}:`}</span>
            <span className="value">{`${formatNumberToString(
              firstDrawRecord.spielEinsatz,
              2
            )} €`}</span>
          </li>
          <li>
            <span className="label">{`${labelDay}:`}</span>
            <span className="value">{`${resolveDay(
              firstDrawRecord.tag
            )}`}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
