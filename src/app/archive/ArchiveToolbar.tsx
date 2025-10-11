"use client";

import React from "react";
import {
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

export type ArchiveDateRange = {
  from: string | null; // yyyy-MM-dd (native date input)
  to: string | null; // yyyy-MM-dd (native date input)
};

/** Weekday filter: 'tue' (Dienstag), 'fri' (Freitag), or 'both' (both days). */
export type DayFilter = "tue" | "fri" | "both";

/** Klassen-Filter: Mehrfachauswahl ("k1", "k123"). Leeres Array = kein Klassen-Filter. */
export type ClassFilter = Array<"k1" | "k123">;

type Props = {
  value: ArchiveDateRange;
  onChange: (next: ArchiveDateRange) => void;
  onApply?: () => void; // optional (filter is already reactive)
  onClear?: () => void;

  /** Controlled weekday filter (lives in page.tsx) */
  day: DayFilter;
  onDayChange: (next: DayFilter) => void;

  /** Controlled classes filter (lives in page.tsx) */
  classes: ClassFilter;
  onClassesChange: (next: ClassFilter) => void;
};

export default function ArchiveToolbar({
  value,
  onChange,
  onClear,
  day,
  onDayChange,
  classes,
  onClassesChange,
}: Props) {
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

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextFrom = orNull(e.target.value);
    onChange(clampRange(nextFrom, value.to));
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTo = orNull(e.target.value);
    onChange(clampRange(value.from, nextTo));
  };

  const handleDayGroupChange = (
    _e: React.MouseEvent<HTMLElement>,
    next: DayFilter | null
  ) => {
    // Guard: ToggleButtonGroup with exclusive selection may pass null if the active one is clicked again.
    if (next) onDayChange(next);
  };

  const handleClassesChange = (
    _e: React.MouseEvent<HTMLElement>,
    next: ClassFilter | null
  ) => {
    // Bei MUI kann next null sein → als [] behandeln (beide aus)
    onClassesChange(next ?? []);
  };

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
        label={APP_TYPO_CONST?.pages?.archive?.toolbar?.labelFrom ?? "Von"}
        type="date"
        value={value.from ?? ""}
        onChange={handleFromChange}
        size="small"
        sx={{ width: "170px" }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            inputProps: {
              max: value.to ?? undefined,
              "aria-label": "from date",
            },
          },
        }}
      />
      <TextField
        label={APP_TYPO_CONST?.pages?.archive?.toolbar?.labelTo ?? "Bis"}
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
        {APP_TYPO_CONST?.pages?.archive?.toolbar?.buttonLabelReset ??
          "Zurücksetzen"}
      </Button>

      {/* Weekday filter (exclusive) */}
      <ToggleButtonGroup
        exclusive
        value={day}
        onChange={handleDayGroupChange}
        size="small"
        aria-label="weekday filter"
        sx={{ ml: 8 }}
      >
        <ToggleButton
          value="tue"
          sx={{ textTransform: "none", width: "150px" }}
        >
          {APP_TYPO_CONST?.pages?.archive?.toolbar?.buttonLabelTuesday ??
            "Dienstag"}
        </ToggleButton>
        <ToggleButton
          value="fri"
          sx={{ textTransform: "none", width: "150px" }}
        >
          {APP_TYPO_CONST?.pages?.archive?.toolbar?.buttonLabelFriday ??
            "Freitag"}
        </ToggleButton>
        <ToggleButton
          value="both"
          sx={{ textTransform: "none", width: "150px" }}
        >
          {APP_TYPO_CONST?.pages?.archive?.toolbar?.buttonLabelBoth ?? "Beides"}
        </ToggleButton>
      </ToggleButtonGroup>

      {/* Klassen-Filter (Mehrfachauswahl) */}
      <ToggleButtonGroup
        value={classes}
        onChange={handleClassesChange}
        size="small"
        aria-label="klassen filter"
        sx={{ ml: 2 }}
      >
        <ToggleButton value="k1" sx={{ textTransform: "none", width: "150px" }}>
          {APP_TYPO_CONST?.pages?.archive?.toolbar?.buttonLabelClass1 ??
            "Klasse 1"}
        </ToggleButton>
        <ToggleButton
          value="k123"
          sx={{ textTransform: "none", width: "170px" }}
        >
          {APP_TYPO_CONST?.pages?.archive?.toolbar?.buttonLabelClass123 ??
            "Klassen 1-2-3"}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
