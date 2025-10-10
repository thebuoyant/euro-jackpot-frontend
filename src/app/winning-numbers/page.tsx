/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { Typography } from "@mui/material";

import "./WinningNumbers.css";

import WinningNumbersToolbar from "./WinningNumbersToolbar";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";
import { API_ROUTE_CONST } from "../_app-constants/api-routes.const";
import { useWinningNumbersStore } from "../_app-stores/winning-numbers.store";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { APP_COLOR_CONST } from "../_app-constants/app-color.const";

type WinningNumbersItem = { key: number; value: number };
type EuroNumbersItem = { key: number; value: number };

export default function WinningNumbersPage() {
  const {
    setIsLoadingWinningNumbers,
    setWinningNumbersCounts,
    winningNumbersCounts,
    showSortedValues,
    setEuroNumbersCounts,
    euroNumbersCounts,
  } = useWinningNumbersStore() as any;

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setIsLoadingWinningNumbers(true);

        const res = await fetch(
          `${API_ROUTE_CONST.winningNumbers}?sortedValues=${showSortedValues}`,
          { signal: ac.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const data = (json?.data ?? []) as WinningNumbersItem[];

        setWinningNumbersCounts(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          if (process.env.NODE_ENV !== "production") console.error(err);
          setWinningNumbersCounts([]);
        }
      } finally {
        setIsLoadingWinningNumbers(false);
      }
    })();

    return () => ac.abort();
  }, [setIsLoadingWinningNumbers, setWinningNumbersCounts, showSortedValues]);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setIsLoadingWinningNumbers(true);

        const res = await fetch(
          `${API_ROUTE_CONST.euroNumbers}?sortedValues=${showSortedValues}`,
          { signal: ac.signal }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const data = (json?.data ?? []) as EuroNumbersItem[];

        setEuroNumbersCounts(Array.isArray(data) ? data : []);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          if (process.env.NODE_ENV !== "production") console.error(err);
          setEuroNumbersCounts([]);
        }
      } finally {
        setIsLoadingWinningNumbers(false);
      }
    })();

    return () => ac.abort();
  }, [setIsLoadingWinningNumbers, setWinningNumbersCounts, showSortedValues]);

  console.log("euroNumbersCounts", euroNumbersCounts);

  return (
    <div className="winning-numbers-page">
      <div className="winning-numbers-page-header page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.winningNumbers.headerTitle}
        </Typography>
      </div>

      <div className="winning-numbers-toolbar">
        <WinningNumbersToolbar />
      </div>

      <div className="winning-numbers-page-content page-content">
        <div className="wining-numbers-wrapper">
          <Typography variant="body1" gutterBottom>
            {APP_TYPO_CONST.pages.winningNumbers.titleWinningNumbers}
          </Typography>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={winningNumbersCounts} // [{ key, value }]
              margin={{ top: 8, right: 12, left: 0, bottom: 28 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="key"
                tick={{ fontSize: 10 }} // kleinere Tick-Labels
                interval={0} // alle Ticks anzeigen (optional)
                height={32} // etwas Platz unten
              >
                <Label value="" position="insideBottom" offset={-16} />
              </XAxis>

              <Bar dataKey="value" name="Einsatz" isAnimationActive={false}>
                <LabelList
                  dataKey="value"
                  position="top"
                  style={{ fontSize: 10 }} // kleinere Font für Bar-Labels
                />
                {winningNumbersCounts.map((_: any, idx: number) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={APP_COLOR_CONST.colorPrimary}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
