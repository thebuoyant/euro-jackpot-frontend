"use client";

import { Typography } from "@mui/material";
import "./Archive.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";
import { useEffect } from "react";
import { API_ROUTE_CONST } from "../_app-constants/api-routes.const";

export default function ArchivePage() {
  useEffect(() => {
    const backendCall = async () => {
      const res = await fetch(
        // `${API_ROUTE_CONST.archive}?numberOfResults=${0}`,
        `${API_ROUTE_CONST.archive}`,
        {
          method: "GET",
        }
      );
      const data = await res.json();

      console.log("data", data);
    };

    backendCall();
  }, []);

  return (
    <div className="archive-page">
      <div className="archive-page-header page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.archive.headerTitle}
        </Typography>
      </div>
      <div className="archive-page-content page-content">
        archive page content
      </div>
    </div>
  );
}
