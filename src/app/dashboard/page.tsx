"use client";

import { Card, CardContent, Typography, Divider } from "@mui/material";
import "./Dashboard.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";
import ChartCard from "../_app-components/_static/chart-card/ChartCard";
import DashboardCardLastDraw from "../_app-components/_static/dashboard-card-last-draw/DashboardCardLastDrawCard";

export default function DashboardPage() {
  // Demo data for the charts
  const mock = Array.from({ length: 10 }).map((_, i) => ({
    name: `KW ${i + 1}`,
    value: Math.round(10 + Math.random() * 30),
  }));

  // Build 8+ tiles (mix of simple cards and charts as demo)
  const tiles = [
    { type: "last-draw" as const, title: "Letzte Ziehung" },
    { type: "chart" as const, title: "Einsätze (Demo A)", data: mock },
    { type: "chart" as const, title: "Einsätze (Demo B)", data: mock },
    { type: "chart" as const, title: "Einsätze (Demo C)", data: mock },
    { type: "text" as const, title: "Hinweis A" },
    { type: "text" as const, title: "Hinweis B" },
    { type: "text" as const, title: "Hinweis C" },
    { type: "text" as const, title: "Hinweis D" },
  ];

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
          {/* Render tiles */}
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
          />
          {tiles.map((tile, idx) => {
            if (tile.type === "last-draw") {
              return (
                <Card key={idx} className="card" elevation={4}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {tile.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Demo-Daten
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <ul className="card-list">
                      <li>
                        <span className="label">Datum:</span>
                        <span className="value">—</span>
                      </li>
                      <li>
                        <span className="label">Zahlen:</span>
                        <span className="value">—</span>
                      </li>
                      <li>
                        <span className="label">Eurozahlen:</span>
                        <span className="value">—</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              );
            }

            if (tile.type === "chart") {
              return (
                <Card key={idx} className="card" elevation={4}>
                  <CardContent>
                    <ChartCard title={tile.title} data={tile.data!} />
                  </CardContent>
                </Card>
              );
            }

            // Fallback: simple text/info card
            return (
              <Card key={idx} className="card" elevation={4}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {tile.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hinweis: Demo-UI. Datenanbindung an eure{" "}
                    <code>euro-jackpot-api</code> kann später erfolgen.
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
