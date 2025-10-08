"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Item = { name: string; value: number };

export default function DashboardCardLastDraw({
  title,
  labelDate,
  labelWinningNumbers,
  labelEuroNumbers,
  labelStake,
  data = [],
}: {
  title: string;
  labelDate: string;
  labelWinningNumbers: string;
  labelEuroNumbers: string;
  labelStake: string;
  data?: Item[];
}) {
  return (
    <Card className="card" elevation={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <ul className="card-list">
          <li>
            <span className="label">{`${labelDate}:`}</span>
            <span className="value">—</span>
          </li>
          <li>
            <span className="label">{`${labelWinningNumbers}:`}</span>
            <span className="value">—</span>
          </li>
          <li>
            <span className="label">{`${labelEuroNumbers}:`}</span>
            <span className="value">—</span>
          </li>
          <li>
            <span className="label">{`${labelStake}:`}</span>
            <span className="value">—</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
