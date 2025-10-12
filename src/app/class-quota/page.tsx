/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { Typography } from "@mui/material";

import "./ClassQuota.css";

import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

export default function ClassQuotaPage() {
  return (
    <div className="class-quota-page">
      <div className="class-quota-page-header page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.classQuota.headerTitle}
        </Typography>
      </div>

      <div className="class-quota-page-content page-content">
        content goes here content goes here
      </div>
    </div>
  );
}
