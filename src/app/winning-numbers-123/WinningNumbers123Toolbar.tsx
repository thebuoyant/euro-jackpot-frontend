/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  useTheme,
} from "@mui/material";
import React from "react";
import { useWinningNumbersStore } from "../_app-stores/winning-numbers.store";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

export default function WinningNumbers123Toolbar() {
  const theme = useTheme();
  const { setShowSortedValues123, showSortedValues123 } =
    useWinningNumbersStore() as any;

  const handleChangeSorting = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowSortedValues123(event.target.checked);
  };

  return (
    <Box
      sx={{
        display: "flex",
        p: 1.25,
        mb: 2,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))"
            : "linear-gradient(180deg, rgba(18,52,86,0.05), rgba(18,52,86,0))",
        minHeight: "56px",
      }}
    >
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              onChange={handleChangeSorting}
              checked={showSortedValues123}
            />
          }
          label={`${
            APP_TYPO_CONST.pages.winningNumbers123.toolbar.labelSortingStart
          } (${
            showSortedValues123
              ? APP_TYPO_CONST.pages.winningNumbers123.toolbar.labelSortingOn
              : APP_TYPO_CONST.pages.winningNumbers123.toolbar.labelSortingOff
          })`}
        />
      </FormGroup>
    </Box>
  );
}
