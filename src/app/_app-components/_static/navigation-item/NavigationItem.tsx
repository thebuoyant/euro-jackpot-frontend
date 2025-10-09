/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Typography } from "@mui/material";
import "./NavigationItem.css";
import clsx from "clsx";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import BarChartIcon from "@mui/icons-material/BarChart";

type NavigationItemProps = {
  height?: number;
  backgoundColor?: string;
  iconColor?: string;
  iconType?: "dashboard" | "archive" | "winning-numbers";
  isActive?: boolean;
  title?: string;
  titleColor?: string;
  onClick?: ({}: any) => void;
};

export default function NavigationItem({
  height = 36,
  backgoundColor = "#123456",
  iconType = "dashboard",
  iconColor = "#ffffff",
  isActive = false,
  title = "Title",
  titleColor = "#ffffff",
  onClick = () => {},
}: NavigationItemProps) {
  const classNameNavigationItem = clsx("navigation-item", {
    active: isActive,
  });

  const renderIcon = () => {
    switch (iconType) {
      case "dashboard":
        return (
          <DashboardIcon
            data-testid="DashboardIcon"
            fontSize="medium"
            sx={{ color: isActive ? "#123456" : iconColor }}
          />
        );
      case "archive":
        return (
          <InventoryIcon
            fontSize="medium"
            sx={{ color: isActive ? "#123456" : iconColor }}
          />
        );
      case "winning-numbers":
        return (
          <BarChartIcon
            fontSize="medium"
            sx={{ color: isActive ? "#123456" : iconColor }}
          />
        );
      default:
        return (
          <DashboardIcon
            data-testid="DashboardIcon"
            fontSize="medium"
            sx={{ color: isActive ? "#123456" : iconColor }}
          />
        );
    }
  };

  const handleOnClick = () => {
    if (onClick) {
      onClick({ title });
    }
  };

  return (
    <div
      className={classNameNavigationItem}
      onClick={handleOnClick}
      style={{
        backgroundColor: isActive ? "#ffffff" : backgoundColor,
        height: height,
        border: `2px solid ${isActive ? "#123456" : backgoundColor}`,
      }}
    >
      <div className="navigation-item-icon">{renderIcon()}</div>
      <div className="navigation-item-title">
        <Typography
          variant="subtitle2"
          style={{ color: isActive ? "#123456" : titleColor }}
        >
          {title}
        </Typography>
      </div>
    </div>
  );
}
