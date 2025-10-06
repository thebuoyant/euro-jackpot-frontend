"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import LayoutDefinition from "./LayoutDefinition";
import { theme } from "./theme";

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
