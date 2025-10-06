import { Typography } from "@mui/material";
import "./Archive.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

export default function ArchivePage() {
  return (
    <div className="archive-page">
      <div className="archive-page-header page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.archive.headerTitle}
        </Typography>
      </div>
      <div className="archive-page-content page-content">
        archive page content
      </div>
    </div>
  );
}
