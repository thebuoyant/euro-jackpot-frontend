/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Typography } from "@mui/material";

import "./Archive.css";

import WinningNumbersToolbar from "./WinningNumbersToolbar";

export default function WinningNumbersPage() {
  return (
    <div className="winning-numbers-page">
      <div className="winning-numbers-page-header page-header">
        <Typography variant="h6">title</Typography>
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
