/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { Typography } from "@mui/material";
import "./Dashboard.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";
import DashboardCardLastDraw from "../_app-components/_static/dashboard-card-last-draw/DashboardCardLastDraw";
import { useDashboardStore } from "../_app-stores/dashboard.store";
import { useEffect } from "react";
import { API_ROUTE_CONST } from "../_app-constants/api-routes.const";
import { DrawRecord } from "../_app-types/record.types";
import DashboardCardFirstDraw from "../_app-components/_static/dashboard-card-first-draw/DashboardCardFirstDraw";
import DashboardCardStake from "../_app-components/_static/dashboard-card-stake/DashboardCardStake";
import { useArchiveStore } from "../_app-stores/archive.store";

export default function DashboardPage() {
  const {
    lastDrawRecord,
    setIsLoadingLastDrawData,
    setLastDrawRecord,
    firstDrawRecord,
    setIsLoadingFirstDrawData,
    setFirstDrawRecord,
  } = useDashboardStore() as any;

  const { records } = useArchiveStore() as any;

  // last draw data
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

  // first draw data
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

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-page-header page-header">
        <Typography variant="h6" component="h1">
          {APP_TYPO_CONST.pages.dashboard.headerTitle}
        </Typography>
      </div>

      {/* Scrollable content region */}
      <div className="dashboard-page-content page-content">
        {/* Two-column CSS grid (no MUI Grid component) */}
        <div
          className="dashboard-grid"
          role="region"
          aria-label="Dashboard layout"
        >
          <DashboardCardLastDraw
            title={APP_TYPO_CONST.pages.dashboard.cards.lastDraw.title}
            labelDate={APP_TYPO_CONST.pages.dashboard.cards.lastDraw.labelDate}
            labelWinningNumbers={
              APP_TYPO_CONST.pages.dashboard.cards.lastDraw.labelWinningNumbers
            }
            labelEuroNumbers={
              APP_TYPO_CONST.pages.dashboard.cards.lastDraw.labelEuroNumbers
            }
            labelStake={
              APP_TYPO_CONST.pages.dashboard.cards.lastDraw.labelStake
            }
            labelDay={APP_TYPO_CONST.pages.dashboard.cards.lastDraw.labelDay}
            draw={lastDrawRecord}
          />
          <DashboardCardFirstDraw
            title={APP_TYPO_CONST.pages.dashboard.cards.firstDraw.title}
            labelDate={APP_TYPO_CONST.pages.dashboard.cards.firstDraw.labelDate}
            labelWinningNumbers={
              APP_TYPO_CONST.pages.dashboard.cards.firstDraw.labelWinningNumbers
            }
            labelEuroNumbers={
              APP_TYPO_CONST.pages.dashboard.cards.firstDraw.labelEuroNumbers
            }
            labelStake={
              APP_TYPO_CONST.pages.dashboard.cards.firstDraw.labelStake
            }
            labelDay={APP_TYPO_CONST.pages.dashboard.cards.firstDraw.labelDay}
            draw={firstDrawRecord}
          />
          <DashboardCardStake
            title={APP_TYPO_CONST.pages.dashboard.cards.stake.title}
            numberOfRecords={36}
          />
        </div>
      </div>
    </div>
  );
}
