/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";

type Props = { title: string; numberOfRecords?: number };

export default function DashboardCardTopWinningNumbers({ title }: Props) {
  return (
    <Card className="card" elevation={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        top winning numbers goes here
      </CardContent>
    </Card>
  );
}
