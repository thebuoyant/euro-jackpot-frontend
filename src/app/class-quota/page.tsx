/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Divider } from "@mui/material";

import "./ClassQuota.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

/** a11y-Helper wie in der MUI-Doku */
function a11yProps(index: number) {
  return {
    id: `class-tab-${index}`,
    "aria-controls": `class-tabpanel-${index}`,
  };
}

function TabPanel({
  children,
  value,
  index,
}: {
  children?: React.ReactNode;
  value: number;
  index: number;
}) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`class-tabpanel-${index}`}
      aria-labelledby={`class-tab-${index}`}
      style={{ height: "100%" }}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function ClassQuotaPage() {
  // Aktive Klasse (0-basiert für Tabs; Klasse = value+1)
  const [value, setValue] = useState(0);

  const handleChange = (_e: React.SyntheticEvent, next: number) => {
    setValue(next);
    // ⬇️ Hier könntest du später deinen Handler triggern:
    // const quotaClass = next + 1;
    // loadData(quotaClass);
  };

  // Labels für Tabs (1..12)
  const tabItems = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="class-quota-page">
      <div className="class-quota-page-header page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.classQuota.headerTitle}
        </Typography>
      </div>

      <div className="class-quota-page-content page-content">
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Klassen-Tabs"
          >
            {tabItems.map((k, idx) => (
              <Tab
                key={k}
                label={`Klasse ${k}`}
                disableRipple
                {...a11yProps(idx)}
                sx={{ textTransform: "none", minHeight: 44 }}
              />
            ))}
          </Tabs>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Panels – später hier deinen Handler-Content einfügen */}
        {tabItems.map((k, idx) => (
          <TabPanel key={k} value={value} index={idx}>
            {/* Placeholder-Content – hier kannst du Recharts/Listen etc. rendern */}
            <Typography variant="subtitle1" gutterBottom>
              {`Ausgewählte Klasse: ${k}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {/* Beispiel: Hier später die Daten aus handleGetClassQuota(k) darstellen */}
              Content für Klasse {k} kommt hier hin …
            </Typography>
            {/* Platzhalter für Diagramm */}
            <Box
              sx={{
                mt: 2,
                height: 260,
                borderRadius: 1,
                border: "1px dashed",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                color: "text.secondary",
              }}
            >
              Diagramm/Chart für Klasse {k}
            </Box>
          </TabPanel>
        ))}
      </div>
    </div>
  );
}
