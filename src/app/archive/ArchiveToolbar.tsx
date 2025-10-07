"use client";

import React from "react";
import { Box, Button, TextField } from "@mui/material";

export type ArchiveDateRange = {
  from: string | null; // yyyy-MM-dd (native date input)
  to: string | null; // yyyy-MM-dd
};

type Props = {
  value: ArchiveDateRange;
  onChange: (next: ArchiveDateRange) => void;
  onApply?: () => void; // optional (Filter ist ohnehin reaktiv)
  onClear?: () => void;
};

export default function ArchiveToolbar({
  value,
  onChange,
  onApply,
  onClear,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        flexWrap: "wrap",
        mt: 1,
      }}
    >
      <TextField
        label="Von"
        type="date"
        value={value.from ?? ""}
        onChange={(e) => onChange({ ...value, from: e.target.value || null })}
        InputLabelProps={{ shrink: true }}
        size="small"
      />
      <TextField
        label="Bis"
        type="date"
        value={value.to ?? ""}
        onChange={(e) => onChange({ ...value, to: e.target.value || null })}
        InputLabelProps={{ shrink: true }}
        size="small"
      />
      <Button
        variant="contained"
        onClick={onApply}
        sx={{ textTransform: "none" }}
      >
        Anwenden
      </Button>
      <Button variant="text" onClick={onClear} sx={{ textTransform: "none" }}>
        Zurücksetzen
      </Button>
    </Box>
  );
}
