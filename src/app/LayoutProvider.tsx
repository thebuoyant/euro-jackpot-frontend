"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import LayoutDefinition from "./LayoutDefinition";

const theme = createTheme();

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LayoutDefinition>{children}</LayoutDefinition>
    </ThemeProvider>
  );
}
