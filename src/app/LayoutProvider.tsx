"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import LayoutDefinition from "./LayoutDefinition";
import { theme } from "./theme";
import ResolutionGuard from "./_app-components/resolution-guard/ResolutionGuard";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ResolutionGuard />
      <LayoutDefinition>{children}</LayoutDefinition>
    </ThemeProvider>
  );
}
