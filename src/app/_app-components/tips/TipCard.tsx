"use client";
import React from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import CasinoIcon from "@mui/icons-material/Casino";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import TicketModal from "../../_app-components/ticket/TicketModal";
import { PillsMatched } from "./PillsMatched";
import { Tip, N_MAIN, N_EURO } from "../../_app-stores/tips.store";

type Props = {
  tip: Tip;
  openModalFor: number | null;
  onOpenTicket: (id: number) => void;
  onCloseTicket: () => void;
  onRandom: (id: number) => void;
  onReset: (id: number) => void;
  onModalChange: (
    id: number,
    next: { numbers: number[]; euroNumbers: number[] }
  ) => void;
  lastMainSet: Set<number>;
  lastEuroSet: Set<number>;
};

export default function TipCard({
  tip,
  openModalFor,
  onOpenTicket,
  onCloseTicket,
  onRandom,
  onReset,
  onModalChange,
  lastMainSet,
  lastEuroSet,
}: Props) {
  return (
    <Card className="card tip-card" elevation={4}>
      <CardContent>
        <Box className="tip-card-head">
          <Typography variant="subtitle1" fontWeight={600}>
            Tipp {tip.id}
          </Typography>
          <Box className="tip-actions">
            <Tooltip title="Zufallszahlen">
              <IconButton
                size="small"
                onClick={() => onRandom(tip.id)}
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <CasinoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Spielschein">
              <IconButton
                size="small"
                onClick={() => onOpenTicket(tip.id)}
                sx={{
                  bgcolor: "success.main",
                  color: "success.contrastText",
                  "&:hover": { bgcolor: "success.dark" },
                }}
              >
                <ConfirmationNumberIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Zurücksetzen">
              <IconButton
                size="small"
                onClick={() => onReset(tip.id)}
                sx={{
                  bgcolor: "warning.main",
                  color: "warning.contrastText",
                  "&:hover": { bgcolor: "warning.dark" },
                }}
              >
                <RestartAltIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box className="row">
          <span className="label">Gewinnzahlen</span>
          <span className="value numbers">
            <PillsMatched
              vals={tip.numbers}
              color="primary"
              matchSet={lastMainSet}
            />
          </span>
        </Box>
        <Box className="row">
          <span className="label">Eurozahlen</span>
          <span className="value numbers">
            <PillsMatched
              vals={tip.euroNumbers}
              color="success"
              matchSet={lastEuroSet}
            />
          </span>
        </Box>
      </CardContent>

      {openModalFor === tip.id && (
        <TicketModal
          open
          onClose={onCloseTicket}
          title={`Tipp ${tip.id} – Spielschein`}
          numbers={tip.numbers}
          euroNumbers={tip.euroNumbers}
          mainMaxCount={N_MAIN}
          euroMaxCount={N_EURO}
          autoCloseOnComplete={false}
          onChange={(next) => onModalChange(tip.id, next)}
        />
      )}
    </Card>
  );
}
