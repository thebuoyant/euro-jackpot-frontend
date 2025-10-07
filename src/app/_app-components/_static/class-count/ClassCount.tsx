import { Typography } from "@mui/material";
import "./ClassCount.css";
import {
  formatNumberToEuroString,
  formatNumberToString,
} from "src/app/_app-utils/record.util";

type ClassCountProps = {
  label?: string;
  count?: number;
  quota?: number;
};

export default function ClassCount({
  label = "Class",
  count = 0,
  quota = 0,
}: ClassCountProps) {
  return (
    <div className="class-count">
      <div className="header" style={{ height: "20px" }}>
        <Typography variant="body2">{label}</Typography>
      </div>
      <div className="content">
        <div className="left">
          <Typography variant="caption">
            {formatNumberToString(count, 0)}
          </Typography>
        </div>
        <div className="right">
          <Typography variant="caption">
            {formatNumberToEuroString(quota)}
          </Typography>
        </div>
      </div>
    </div>
  );
}
