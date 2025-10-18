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
import NumberPillsInline from "src/app/_app-components/_shared/NumberPillsInline";

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
  const {
    firstDrawRecord,
    setIsLoadingFirstDrawData,
    setFirstDrawRecord,
    isLoadingFirstDrawData,
  } = useDashboardStore() as any;

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setIsLoadingFirstDrawData(true);
        const res = await fetch(`${API_ROUTE_CONST.firstDraw}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive)
          setFirstDrawRecord(
            (data?.firstDrawRecord ?? null) as DrawRecord | null
          );
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.error(err);
        if (alive) setFirstDrawRecord(null);
      } finally {
        if (alive) {
          setIsLoadingFirstDrawData(false);
          hasFetchedRef.current = true;
        }
      }
    })();

    return () => {
      alive = false;
    };
  }, [setIsLoadingFirstDrawData, setFirstDrawRecord]);

  const showSkeleton = !hasFetchedRef.current || isLoadingFirstDrawData;

  const mainNumbers: number[] = firstDrawRecord
    ? [
        firstDrawRecord.nummer1,
        firstDrawRecord.nummer2,
        firstDrawRecord.nummer3,
        firstDrawRecord.nummer4,
        firstDrawRecord.nummer5,
      ].map(Number)
    : [];
  const euroNumbers: number[] = firstDrawRecord
    ? [firstDrawRecord.zz1, firstDrawRecord.zz2].map(Number)
    : [];

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
        ) : !firstDrawRecord ? (
          <Typography variant="body2" color="text.secondary">
            Keine Daten vorhanden.
          </Typography>
        ) : (
          <ul className="card-list" style={{ height: "100%" }}>
            <li>
              <span className="label">{`${labelDate}:`}</span>
              <span className="value">{firstDrawRecord.datum}</span>
            </li>

            <li>
              <span className="label">{`${labelWinningNumbers}:`}</span>
              <span
                className="value"
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                <NumberPillsInline
                  values={mainNumbers}
                  color="primary"
                  aria-label="Gewinnzahlen"
                />
              </span>
            </li>

            <li>
              <span className="label">{`${labelEuroNumbers}:`}</span>
              <span
                className="value"
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                <NumberPillsInline
                  values={euroNumbers}
                  color="success"
                  aria-label="Eurozahlen"
                />
              </span>
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
              <span className="value">{resolveDay(firstDrawRecord.tag)}</span>
            </li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
