"use client";

import { Typography } from "@mui/material";
import "./Dashboard.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";
import DashboardCardLastDraw from "../_app-components/_dynamic/dashboard-card-last-draw/DashboardCardLastDraw";
import DashboardCardFirstDraw from "../_app-components/_dynamic/dashboard-card-first-draw/DashboardCardFirstDraw";
import DashboardCardStake from "../_app-components/_dynamic/dashboard-card-stake/DashboardCardStake";
import DashboardCardTopWinningNumbers from "../_app-components/_dynamic/dashboard-card-top-winning-numbers/DashboardCardTopWinningNumbers";
import DashboardCardTopWinningNumbers123 from "../_app-components/_dynamic/dashboard-card-top-winning-numbers-123/DashboardCardTopWinningNumbers123";
import DashboardCardSpecialData from "../_app-components/_dynamic/dashboard-card-special-data/DashboardCardSpecialData";
import DashboardCardNumberGaps from "../_app-components/_dynamic/dashboard-card-number-gaps/DashboardCardNumberGaps";
import DashboardCardPopularNumbers from "../_app-components/_dynamic/dashboard-card-popular-numbers/DashboardCardPopularNumbers";

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
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
          />
          <DashboardCardStake
            title={APP_TYPO_CONST.pages.dashboard.cards.stake.title}
            numberOfRecords={36}
          />
          <DashboardCardTopWinningNumbers
            title={APP_TYPO_CONST.pages.dashboard.cards.topWinningNumbers.title}
          />
          <DashboardCardTopWinningNumbers123
            title={
              APP_TYPO_CONST.pages.dashboard.cards.topWinningNumbers123.title
            }
          />
          <DashboardCardSpecialData
            title={APP_TYPO_CONST.pages.dashboard.cards.specialData.title}
          />
          <DashboardCardNumberGaps
            title={APP_TYPO_CONST.pages.dashboard.cards.numberGaps.title}
          />
          <DashboardCardPopularNumbers
            title={APP_TYPO_CONST.pages.dashboard.cards.popularNumbers.title}
            ticketPrice={2.0}
          />
        </div>
      </div>
    </div>
  );
}
