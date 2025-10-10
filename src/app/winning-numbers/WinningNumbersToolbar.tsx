/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { Box, FormControlLabel, FormGroup, Switch } from "@mui/material";
import React from "react";
import { useWinningNumbersStore } from "../_app-stores/winning-numbers.store";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

export default function WinningNumbersToolbar() {
  const { setShowSortedValues, showSortedValues } =
    useWinningNumbersStore() as any;

  const handleChangeSorting = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowSortedValues(event.target.checked);
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
            <Switch onChange={handleChangeSorting} checked={showSortedValues} />
          }
          label={`${
            APP_TYPO_CONST.pages.winningNumbers.toolbar.labelSortingStart
          } (${
            showSortedValues
              ? APP_TYPO_CONST.pages.winningNumbers.toolbar.labelSortingOn
              : APP_TYPO_CONST.pages.winningNumbers.toolbar.labelSortingOff
          })`}
        />
      </FormGroup>
    </Box>
  );
}
