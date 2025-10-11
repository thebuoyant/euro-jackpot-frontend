import { APP_TYPO_CONST } from "src/app/_app-constants/app-typo.const";
import NavigationItem from "../_static/navigation-item/NavigationItem";
import "./AppSidebar.css";
import { usePathname, useRouter } from "next/navigation";
import { APP_ROUTE_CONST } from "src/app/_app-constants/app-route.const";

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigationToDashboard = () => {
    router.push(APP_ROUTE_CONST.dashboard, { scroll: true });
  };

  const handleNavigationToArchive = () => {
    router.push(APP_ROUTE_CONST.archive, { scroll: true });
  };

  const handleNavigationToWinningNumbers = () => {
    router.push(APP_ROUTE_CONST.winningNumbers, { scroll: true });
  };

  const handleNavigationToWinningNumbers123 = () => {
    router.push(APP_ROUTE_CONST.winningNumbers123, { scroll: true });
  };

  return (
    <div className="app-sidebar">
      <div className="app-sidebar-content">
        <NavigationItem
          title={APP_TYPO_CONST.sidebar.navItemDashboard}
          iconType="dashboard"
          isActive={pathname?.includes("dashboard")}
          onClick={handleNavigationToDashboard}
        />
        <NavigationItem
          title={APP_TYPO_CONST.sidebar.navItemArchive}
          iconType="archive"
          isActive={pathname?.includes("archive")}
          onClick={handleNavigationToArchive}
        />
        <NavigationItem
          title={APP_TYPO_CONST.sidebar.navItemWinningNumbers}
          iconType="winning-numbers"
          isActive={pathname?.includes("winning-numbers")}
          onClick={handleNavigationToWinningNumbers}
        />
        <NavigationItem
          title={APP_TYPO_CONST.sidebar.navItemWinningNumbers123}
          iconType="winning-numbers"
          isActive={pathname?.includes("winning-numbers-123")}
          onClick={handleNavigationToWinningNumbers123}
        />
      </div>
    </div>
  );
}
