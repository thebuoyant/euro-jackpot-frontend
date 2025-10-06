import { APP_TYPO_CONST } from "src/app/_app-constants/app-typo.const";
import NavigationItem from "../_static/navigation-item/NavigationItem";
import "./AppSidebar.css";

export default function AppSidebar() {
  return (
    <div className="app-sidebar">
      <div className="app-sidebar-content">
        <NavigationItem
          title={APP_TYPO_CONST.sidebar.navItemDashboard}
          iconType="dashboard"
        />
        <NavigationItem
          title={APP_TYPO_CONST.sidebar.navItemArchive}
          iconType="archive"
        />
      </div>
    </div>
  );
}
