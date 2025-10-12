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

  const handleNavigationToClassQuota = () => {
    router.push(APP_ROUTE_CONST.classQuota, { scroll: true });
  };

  return (
    <div className="app-sidebar">
      <div className="app-sidebar-content">
        <NavigationItem
          title={APP_TYPO_CONST.sidebar.navItemDashboard}
          iconType="dashboard"
          isActive={pathname === APP_ROUTE_CONST.dashboard}
          onClick={handleNavigationToDashboard}
        />
        <NavigationItem
          title={APP_TYPO_CONST.sidebar.navItemArchive}
          iconType="archive"
          isActive={pathname === APP_ROUTE_CONST.archive}
          onClick={handleNavigationToArchive}
        />
        <NavigationItem
          title={APP_TYPO_CONST.sidebar.navItemWinningNumbers}
          iconType="winning-numbers"
          isActive={pathname === APP_ROUTE_CONST.winningNumbers}
          onClick={handleNavigationToWinningNumbers}
        />
        <NavigationItem
          title={APP_TYPO_CONST.sidebar.navItemWinningNumbers123}
          iconType="winning-numbers"
          isActive={pathname === APP_ROUTE_CONST.winningNumbers123}
          onClick={handleNavigationToWinningNumbers123}
        />
        <NavigationItem
          title={APP_TYPO_CONST.sidebar.navItemClassQuota}
          iconType="quota"
          isActive={pathname === APP_ROUTE_CONST.classQuota}
          onClick={handleNavigationToClassQuota}
        />
      </div>
    </div>
  );
}
