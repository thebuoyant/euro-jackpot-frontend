import { createTheme } from "@mui/material/styles";
import { deDE as deDECore } from "@mui/material/locale";
import { deDE as deDEGrid } from "@mui/x-data-grid/locales";

export const theme = createTheme(
  {
    palette: {
      primary: { main: "#123456" },
    },
  },
  deDECore,
  deDEGrid
);
