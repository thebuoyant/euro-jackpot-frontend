import { APP_LAYOUT_CONST } from "./_app-constants/app-layout.const";

export default function LayoutDefinition({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarWidth = APP_LAYOUT_CONST.sidebarWidth;

  return (
    <div className="layout-definition">
      <div className="layout-header">header</div>
      <div className="layout-content" style={{ display: "flex" }}>
        <div
          className="layout-content-sidebar"
          style={{ width: `${sidebarWidth}px` }}
        >
          sidebar
        </div>
        <div className="layout-content-main">{children}</div>
      </div>
    </div>
  );
}
