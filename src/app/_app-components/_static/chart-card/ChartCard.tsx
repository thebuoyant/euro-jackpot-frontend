'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@mui/material';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

type Item = { name: string; value: number };

export default function ChartCard({ title, data }: { title: string; data: Item[] }) {
  return (
    <Card sx={{ height: 360 }}>
      <CardHeader title={title} />
      <CardContent sx={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
