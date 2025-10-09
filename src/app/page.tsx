"use client";

import { Typography } from "@mui/material";
import { APP_TYPO_CONST } from "./_app-constants/app-typo.const";
import { useEffect } from "react";
import { APP_ROUTE_CONST } from "./_app-constants/app-route.const";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push(APP_ROUTE_CONST.dashboard, { scroll: true });
  }, [router]);

  return (
    <div className="home-page">
      <div className="home-page-header page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.home.headerTitle}
        </Typography>
      </div>
      <div className="home-page-content page-content">home page content</div>
    </div>
  );
}
