import { APP_COLOR_CONST } from "src/app/_app-constants/app-color.const";
import "./AppHeader.css";
import { Typography } from "@mui/material";
import { APP_CONST } from "src/app/_app-constants/app.const";

export default function AppHeader() {
  return (
    <div
      className="app-header"
      style={{
        backgroundColor: APP_COLOR_CONST.colorPrimary,
        color: APP_COLOR_CONST.colorWhite,
      }}
    >
      <Typography variant="h6">{APP_CONST.appTitle}</Typography>
    </div>
  );
}
