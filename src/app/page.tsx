import { Typography } from "@mui/material";
import { APP_TYPO_CONST } from "./_app-constants/app-typo.const";

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-page-header page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.home.headerTitle}
        </Typography>
      </div>
      <div className="home-page-content page-content">
        home page content
      </div>
    </div>
  );
}
