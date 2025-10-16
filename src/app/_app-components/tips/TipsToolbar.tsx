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
import { handleGetLastDrawData } from "../../_app-handlers/handleGetLastDrawData";
import { resolveDay } from "../../_app-utils/record.util";
import type { DrawRecord } from "../../_app-types/record.types";

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
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))"
            : "linear-gradient(180deg, rgba(18,52,86,0.05), rgba(18,52,86,0))",
      }}
    >
      <Toolbar disableGutters sx={{ gap: 1, flexWrap: "wrap" }}>
        {lastDraw && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              flexWrap: "wrap",
              pr: 1,
              mr: 1,
              borderRight: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
              Letzte Ziehung: {lastDraw.datum} ({resolveDay(lastDraw.tag)})
            </Typography>
            <span className="value numbers">
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
            <span className="value numbers">
              <Pills vals={[lastDraw.zz1, lastDraw.zz2]} color="success" />
            </span>
          </Box>
        )}

        <Button
          variant="contained"
          color="primary"
          startIcon={<FileDownloadOutlinedIcon />}
          onClick={onDownload}
          disabled={!haveAnyTip}
          sx={{ textTransform: "none" }}
        >
          JSON herunterladen
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
          color="success"
          startIcon={<FileUploadOutlinedIcon />}
          onClick={() => fileRef.current?.click()}
          sx={{ textTransform: "none" }}
        >
          JSON hochladen
        </Button>
      </Toolbar>
    </Paper>
  );
}
