"use client";
import React, { useMemo, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { Pills } from "./Pills";
import { handleGetLastDrawData } from "../../../_app-handlers/handleGetLastDrawData";
import { resolveDay } from "../../../_app-utils/record.util";
import type { DrawRecord } from "../../../_app-types/record.types";
import { APP_TYPO_CONST } from "src/app/_app-constants/app-typo.const";

type Props = {
  haveAnyTip: boolean;
  onDownload: () => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TipsToolbar({
  haveAnyTip,
  onDownload,
  onUploadFile,
}: Props) {
  const theme = useTheme();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const lastDraw: DrawRecord | null = useMemo(() => {
    try {
      return handleGetLastDrawData();
    } catch {
      return null;
    }
  }, []);

  return (
    <Paper
      elevation={0}
      className="tips-toolbar-paper"
      sx={{
        p: 1.25,
        mb: 2,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))"
            : "linear-gradient(180deg, rgba(18,52,86,0.05), rgba(18,52,86,0))",
        minHeight: "56px",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          gap: 1,
          flexWrap: "wrap",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {lastDraw && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              flexWrap: "wrap",
              pr: 1,
              mr: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mr: 2, cursor: "default" }}
            >
              {APP_TYPO_CONST.pages.tips.toolbar.lastDraw}: {lastDraw.datum} (
              {resolveDay(lastDraw.tag)})
            </Typography>
            <span className="value numbers" style={{ cursor: "default" }}>
              <Pills
                vals={[
                  lastDraw.nummer1,
                  lastDraw.nummer2,
                  lastDraw.nummer3,
                  lastDraw.nummer4,
                  lastDraw.nummer5,
                ]}
                color="primary"
              />
            </span>
            <span className="value numbers" style={{ cursor: "default" }}>
              <Pills vals={[lastDraw.zz1, lastDraw.zz2]} color="success" />
            </span>
          </Box>
        )}
        <div className="action-section">
          <Button
            variant="contained"
            color="inherit"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={onDownload}
            disabled={!haveAnyTip}
            sx={{ textTransform: "none", width: "240px" }}
          >
            {APP_TYPO_CONST.pages.tips.toolbar.download}
          </Button>

          <input
            type="file"
            accept="application/json"
            ref={fileRef}
            style={{ display: "none" }}
            onChange={onUploadFile}
          />
          <Button
            variant="contained"
            color="inherit"
            startIcon={<FileUploadOutlinedIcon />}
            onClick={() => fileRef.current?.click()}
            sx={{ textTransform: "none", width: "240px", marginLeft: "8px" }}
          >
            {APP_TYPO_CONST.pages.tips.toolbar.upload}
          </Button>
        </div>
      </Toolbar>
    </Paper>
  );
}
