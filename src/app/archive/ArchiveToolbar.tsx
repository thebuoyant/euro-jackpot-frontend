"use client";

import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

export type ArchiveDateRange = {
  from: string | null; // yyyy-MM-dd (native date input)
  to: string | null; // yyyy-MM-dd
};

type Props = {
  value: ArchiveDateRange;
  onChange: (next: ArchiveDateRange) => void;
  onApply?: () => void; // optional (filter is already reactive)
  onClear?: () => void;
};

export default function ArchiveToolbar({
  value,
  onChange,
  onApply, // not used here but kept for extensibility
  onClear,
}: Props) {
  // --- Helpers ---------------------------------------------------------------

  /** Normalize empty strings to null for consistent state shape. */
  const orNull = (s: string) => (s?.trim() ? s : null);

  /**
   * ISO yyyy-MM-dd strings compare lexicographically in chronological order.
   * This function enforces a valid range and returns a corrected pair.
   */
  const clampRange = (
    from: string | null,
    to: string | null
  ): ArchiveDateRange => {
    if (from && to) {
      if (from > to) return { from, to: from }; // snap "to" forward
      if (to < from) return { from: to, to }; // snap "from" backward
    }
    return { from, to };
  };

  // --- Handlers --------------------------------------------------------------

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFrom = orNull(e.target.value);
    onChange(clampRange(nextFrom, value.to));
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTo = orNull(e.target.value);
    onChange(clampRange(value.from, nextTo));
  };

  // --- Render ----------------------------------------------------------------

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
        label={APP_TYPO_CONST.pages.archive.toolbar.labelFrom}
        type="date"
        value={value.from ?? ""}
        onChange={handleFromChange}
        size="small"
        sx={{ width: "170px" }}
        // Use slotProps instead of deprecated InputLabelProps
        slotProps={{
          inputLabel: { shrink: true },
          // Pass native input attributes to the input slot
          input: {
            inputProps: {
              max: value.to ?? undefined,
              "aria-label": "from date",
            },
          },
        }}
      />

      <TextField
        label={APP_TYPO_CONST.pages.archive.toolbar.labelTo}
        type="date"
        value={value.to ?? ""}
        onChange={handleToChange}
        size="small"
        sx={{ width: "170px" }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            inputProps: {
              min: value.from ?? undefined,
              "aria-label": "to date",
            },
          },
        }}
      />

      <Button
        variant="contained"
        color="inherit"
        onClick={onClear}
        sx={{ textTransform: "none", width: "150px" }}
        disableElevation
      >
        {APP_TYPO_CONST.pages.archive.toolbar.buttonLabelReset}
      </Button>
    </Box>
  );
}
