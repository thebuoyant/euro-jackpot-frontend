"use client";

import React, { useEffect } from "react";
import { Typography } from "@mui/material";

import "./WinningNumbers.css";

import WinningNumbersToolbar from "./WinningNumbersToolbar";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";
import { API_ROUTE_CONST } from "../_app-constants/api-routes.const";
import { WinningNumbersCount } from "../_app-handlers/handleCountWinningNumbers";
import { useWinningNumbersStore } from "../_app-stores/winning-numbers.store";

export default function WinningNumbersPage() {
  const {
    setIsLoadingWinningNumbers,
    setWinningNumbersCounts,
    winningNumbersCounts,
  } = useWinningNumbersStore() as any;

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setIsLoadingWinningNumbers(true);

        const res = await fetch(
          `${API_ROUTE_CONST.winningNumbers}?sortedValues=${false}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const response = await res.json();
        const winningNumbersCounts = response.data;

        setWinningNumbersCounts(winningNumbersCounts);

        if (alive)
          setIsLoadingWinningNumbers(
            (response?.records ?? []) as WinningNumbersCount[]
          );
      } catch (err) {
        // Log only outside production to keep prod console clean
        if (process.env.NODE_ENV !== "production") console.error(err);
        if (alive) setWinningNumbersCounts([]);
      } finally {
        if (alive) setIsLoadingWinningNumbers(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [setIsLoadingWinningNumbers, setWinningNumbersCounts]);
  console.log("winningNumbersCounts", winningNumbersCounts);
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
        page content
      </div>
    </div>
  );
}
