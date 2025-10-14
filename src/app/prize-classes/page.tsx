/* eslint-disable  @typescript-eslint/no-explicit-any */
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
        <Typography variant="h6">Gewinnklassen</Typography>
        <Typography variant="body2" color="text.secondary">
          Benötigte Treffer sowie Minimal-/Maximal-Quoten inkl. letztem
          Auftreten.
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

        {/* Responsive CSS-Grid – max. 3 Spalten wie im Dashboard-Feeling */}
        <Box className="cards-grid">
          {sorted.map((it) => (
            <Card
              key={it.class}
              className="card pc-card" // ⟵ gleiche Klasse wie im Dashboard + lokale Feinheiten
              elevation={4}
            >
              <CardContent className="pc-card-content">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Klasse {it.class}
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
                  Benötigt: <b>{it.mainHits}</b> Gewinnzahlen +{" "}
                  <b>{it.euroHits}</b> Eurozahlen
                </Typography>

                <Divider
                  className="pc-divider"
                  style={{ marginTop: "6px", marginBottom: "16px" }}
                />

                <Box className="kv-grid">
                  <Tooltip title="Letztes Auftreten des Minimums">
                    <Box className="kv-row">
                      <span className="kv-label">Minimum</span>
                      <span className="kv-value">
                        {it.minValueStr}{" "}
                        {it.minLastDate ? (
                          <span className="kv-date">({it.minLastDate})</span>
                        ) : null}
                      </span>
                    </Box>
                  </Tooltip>

                  <Tooltip title="Letztes Auftreten des Maximums">
                    <Box className="kv-row">
                      <span className="kv-label">Maximum</span>
                      <span className="kv-value">
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
