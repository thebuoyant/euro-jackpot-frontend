"use client";

import { Box, Paper, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { APP_ROUTE_CONST } from "./_app-constants/app-route.const";
import { APP_TYPO_CONST } from "./_app-constants/app-typo.const";

export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push(APP_ROUTE_CONST.dashboard);
  };

  return (
    <Box
      className="home-page"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        px: 3,
        py: 6,
        height: "100%",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))"
            : "linear-gradient(180deg, rgba(18,52,86,0.05), rgba(18,52,86,0))",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
        sx={{ mb: 1, textAlign: "center", letterSpacing: 0.3 }}
      >
        {APP_TYPO_CONST.pages?.home?.headerTitle ?? "Herzlich Willkommen"}
      </Typography>

      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ maxWidth: 800, textAlign: "center", mb: 3 }}
      >
        {APP_TYPO_CONST.pages?.home?.welcomeText ?? ""}
      </Typography>

      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 700,
          borderRadius: 3,
          overflow: "hidden",
          px: 1.5,
          py: 1.5,
          background: (t) =>
            t.palette.mode === "dark"
              ? "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))"
              : "linear-gradient(180deg, rgba(18,52,86,0.06), rgba(18,52,86,0.02))",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "3 / 2",
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: "#0e2a4a",
          }}
          onClick={handleStart}
        >
          <Image
            src="/images/welcome.png"
            alt="EuroJackpotFrontend – Visualisierung und Analyseoberfläche"
            fill
            sizes="(max-width: 1200px) 100vw, 1100px"
            style={{
              objectFit: "contain",
              display: "block",
              cursor: "pointer",
            }}
            priority
          />
        </Box>
      </Paper>

      {/* Disclaimer */}
      {/* <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          maxWidth: 700,
          textAlign: "center",
          mt: 6,
          fontSize: "0.85rem",
          lineHeight: 1.6,
        }}
      >
        Alle EuroJackpot-Daten wurden sorgfältig zusammengetragen und mit
        KI-gestützten Verfahren auf Konsistenz und Richtigkeit geprüft. Trotz
        umfangreicher Kontrollen kann keine Gewähr für absolute Genauigkeit oder
        Vollständigkeit übernommen werden. Diese Anwendung dient ausschließlich
        Informations- und Analysezwecken und steht nicht in Verbindung mit
        offiziellen Lotteriebetreibern.
      </Typography> */}
    </Box>
  );
}
