"use client";

import React from "react";
import { Card, CardContent, Divider, Typography } from "@mui/material";
import { DrawRecord } from "src/app/_app-types/record.types";
import {
  formatNumberToString,
  resolveDay,
} from "src/app/_app-utils/record.util";

export default function DashboardCardFirstDraw({
  title,
  labelDate,
  labelWinningNumbers,
  labelEuroNumbers,
  labelStake,
  labelDay,
  draw,
}: {
  title: string;
  labelDate: string;
  labelWinningNumbers: string;
  labelEuroNumbers: string;
  labelStake: string;
  labelDay: string;
  draw: DrawRecord;
}) {
  if (!draw) {
    return null;
  }

  return (
    <Card className="card" elevation={4}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <ul className="card-list" style={{ height: "100%" }}>
          <li>
            <span className="label">{`${labelDate}:`}</span>
            <span className="value">{draw.datum}</span>
          </li>
          <li>
            <span className="label">{`${labelWinningNumbers}:`}</span>
            <span className="value">{`${draw.nummer1} | ${draw.nummer2} | ${draw.nummer3} | ${draw.nummer4} | ${draw.nummer5}`}</span>
          </li>
          <li>
            <span className="label">{`${labelEuroNumbers}:`}</span>
            <span className="value">{`${draw.zz1} | ${draw.zz2}`}</span>
          </li>
          <li>
            <span className="label">{`${labelStake}:`}</span>
            <span className="value">{`${formatNumberToString(
              draw.spielEinsatz,
              2
            )} €`}</span>
          </li>
          <li>
            <span className="label">{`${labelDay}:`}</span>
            <span className="value">{`${resolveDay(draw.tag)}`}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
