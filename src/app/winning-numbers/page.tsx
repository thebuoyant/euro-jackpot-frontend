"use client";

import React from "react";
import { Typography } from "@mui/material";

import "./WinningNumbers.css";

import WinningNumbersToolbar from "./WinningNumbersToolbar";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

export default function WinningNumbersPage() {
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
