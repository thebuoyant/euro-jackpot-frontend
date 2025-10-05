import { Typography } from "@mui/material";
import "./Dashboard.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-page-header page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.dashboard.headerTitle}
        </Typography>
      </div>
      <div className="dashboard-page-content page-content">
        dashboard page content
      </div>
    </div>
  );
}
