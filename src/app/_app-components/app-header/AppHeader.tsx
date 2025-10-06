import { APP_COLOR_CONST } from "src/app/_app-constants/app-color.const";
import "./AppHeader.css";
import { Typography } from "@mui/material";
import { APP_CONST } from "src/app/_app-constants/app.const";
import { useRouter } from "next/navigation";
import { APP_ROUTE_CONST } from "src/app/_app-constants/app-route.const";

export default function AppHeader() {
  const router = useRouter();

  const handleNavigationToHome = () => {
    router.push(APP_ROUTE_CONST.home, { scroll: true });
  };

  return (
    <div
      className="app-header"
      style={{
        backgroundColor: APP_COLOR_CONST.colorPrimary,
        color: APP_COLOR_CONST.colorWhite,
        cursor: "pointer",
      }}
      onClick={handleNavigationToHome}
    >
      <Typography variant="h6">{APP_CONST.appTitle}</Typography>
    </div>
  );
}
