import AppHeader from "./_app-components/app-header/AppHeader";
import AppSidebar from "./_app-components/app-sidebar/AppSidebar";
import { APP_LAYOUT_CONST } from "./_app-constants/app-layout.const";

export default function LayoutDefinition({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarWidth = APP_LAYOUT_CONST.sidebarWidth;
  const headerHeight = APP_LAYOUT_CONST.headerHeight;
  const calculatedContentHeight = `calc(100% - ${headerHeight}px)`;
  const calculatedContentMainWidth = `calc(100% - ${sidebarWidth}px)`;

  return (
    <div className="layout-definition">
      <div className="layout-header" style={{ height: `${headerHeight}px` }}>
        <AppHeader />
      </div>
      <div
        className="layout-content"
        style={{ display: "flex", height: calculatedContentHeight }}
      >
        <div
          className="layout-content-sidebar"
          style={{
            width: `${sidebarWidth}px`,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <AppSidebar />
        </div>
        <div
          className="layout-content-main"
          style={{
            height: "100%",
            width: `${calculatedContentMainWidth}`,
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
