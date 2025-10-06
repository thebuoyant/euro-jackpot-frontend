"use client";

import { Typography } from "@mui/material";
import "./Archive.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";
import { useEffect } from "react";
import { API_ROUTE_CONST } from "../_app-constants/api-routes.const";
import { useArchiveStore } from "../_app-stores/archive.store";

export default function ArchivePage() {
  const { setIsLoading, setRecords, records, numberOfResults } =
    useArchiveStore() as any;

  useEffect(() => {
    const backendCall = async () => {
      setIsLoading(true);

      const res = await fetch(
        `${API_ROUTE_CONST.archive}?numberOfResults=${numberOfResults}`,
        {
          method: "GET",
        }
      );
      const data = await res.json();

      setRecords(data.records);
      setIsLoading(false);
    };

    backendCall();
  }, []);

  console.log("records", records);

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
