/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { Box, FormControlLabel, FormGroup, Switch } from "@mui/material";
import React from "react";
import { useWinningNumbersStore } from "../_app-stores/winning-numbers.store";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

export default function WinningNumbers123Toolbar() {
  const { setShowSortedValues123, showSortedValues123 } =
    useWinningNumbersStore() as any;

  const handleChangeSorting = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowSortedValues123(event.target.checked);
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
