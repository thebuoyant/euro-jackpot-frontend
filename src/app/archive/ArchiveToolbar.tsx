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
        label={APP_TYPO_CONST.pages.archive.toolbar.labelFrom}
        type="date"
        value={value.from ?? ""}
        onChange={(e) => onChange({ ...value, from: e.target.value || null })}
        InputLabelProps={{ shrink: true }}
        size="small"
        sx={{ width: "170px" }}
      />
      <TextField
        label={APP_TYPO_CONST.pages.archive.toolbar.labelTo}
        type="date"
        value={value.to ?? ""}
        onChange={(e) => onChange({ ...value, to: e.target.value || null })}
        InputLabelProps={{ shrink: true }}
        size="small"
        sx={{ width: "170px" }}
      />
      <Button
        variant="contained"
        color="inherit"
        onClick={onClear}
        sx={{ textTransform: "none", width: "150px" }}
        disableElevation
        disabled
      >
        {APP_TYPO_CONST.pages.archive.toolbar.buttonLabelReset}
      </Button>
      <Button
        variant="contained"
        onClick={onApply}
        sx={{ textTransform: "none", width: "150px" }}
        disableElevation
        disabled
      >
        {APP_TYPO_CONST.pages.archive.toolbar.buttonLabelApply}
      </Button>
    </Box>
  );
}
