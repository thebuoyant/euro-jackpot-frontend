"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
  Tooltip,
  Stack,
} from "@mui/material";

import "./PrizeClasses.css";
import { API_ROUTE_CONST } from "../_app-constants/api-routes.const";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

type PrizeClassSummaryItem = {
  class: number;
  mainHits: number;
  euroHits: number;
  minValue: number;
  minValueStr: string;
  minLastDate: string | null;
  maxValue: number;
  maxValueStr: string;
  maxLastDate: string | null;
};

export default function PrizeClassesPage() {
  const [items, setItems] = useState<PrizeClassSummaryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError(null);
        const res = await fetch(API_ROUTE_CONST.prizeClassesSummary);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const arr = (json?.summary?.items ?? []) as PrizeClassSummaryItem[];
        if (alive) setItems(Array.isArray(arr) ? arr : []);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.error(err);
        if (alive) {
          setItems([]);
          setError("Fehler beim Laden der Gewinnklassen.");
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.class - b.class),
    [items]
  );

  return (
    <div className="prize-classes-page">
      <div className="page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.dashboard.cards.prizeClasses.title}
        </Typography>
      </div>

      <div
        className="page-content"
        style={{ padding: "8px", paddingBottom: "14px" }}
      >
        {error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : null}

        <Box className="cards-grid">
          {sorted.map((it) => (
            <Card key={it.class} className="card pc-card" elevation={2}>
              <CardContent
                className="pc-card-content"
                style={{ cursor: "default" }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    {`${APP_TYPO_CONST.pages.dashboard.cards.prizeClasses.cardLabelClass} ${it.class}`}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${it.mainHits} + ${it.euroHits}`}
                  />
                </Stack>

                <Typography
                  variant="body2"
                  className="pc-subline"
                  color="text.secondary"
                >
                  {
                    APP_TYPO_CONST.pages.dashboard.cards.prizeClasses
                      .cardLabelNeeded
                  }{" "}
                  <b>{it.mainHits}</b>{" "}
                  {
                    APP_TYPO_CONST.pages.dashboard.cards.prizeClasses
                      .cardLabelWinningNumbers
                  }{" "}
                  + <b>{it.euroHits}</b>{" "}
                  {
                    APP_TYPO_CONST.pages.dashboard.cards.prizeClasses
                      .cardLabelEuroNumbers
                  }
                </Typography>

                <Divider
                  className="pc-divider"
                  style={{ marginTop: "6px", marginBottom: "16px" }}
                />

                <Box className="kv-grid">
                  <Tooltip
                    title={
                      APP_TYPO_CONST.pages.dashboard.cards.prizeClasses
                        .cardLabelMinTooltip
                    }
                  >
                    <Box className="kv-row">
                      <span className="kv-label" style={{ cursor: "default" }}>
                        {
                          APP_TYPO_CONST.pages.dashboard.cards.prizeClasses
                            .cardLabelMin
                        }
                      </span>
                      <span className="kv-value" style={{ cursor: "default" }}>
                        {it.minValueStr}{" "}
                        {it.minLastDate ? (
                          <span className="kv-date">({it.minLastDate})</span>
                        ) : null}
                      </span>
                    </Box>
                  </Tooltip>

                  <Tooltip
                    title={
                      APP_TYPO_CONST.pages.dashboard.cards.prizeClasses
                        .cardLabelMaxTooltip
                    }
                  >
                    <Box className="kv-row">
                      <span className="kv-label" style={{ cursor: "default" }}>
                        {
                          APP_TYPO_CONST.pages.dashboard.cards.prizeClasses
                            .cardLabelMax
                        }
                      </span>
                      <span className="kv-value" style={{ cursor: "default" }}>
                        {it.maxValueStr}{" "}
                        {it.maxLastDate ? (
                          <span className="kv-date">({it.maxLastDate})</span>
                        ) : null}
                      </span>
                    </Box>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </div>
    </div>
  );
}
