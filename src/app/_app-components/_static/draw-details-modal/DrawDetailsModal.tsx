/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import "./DrawDetailsModal.css";
import CloseIcon from "@mui/icons-material/Close";
import { useDrawDetailsStore } from "src/app/_app-stores/draw-details.store";
import { APP_TYPO_CONST } from "src/app/_app-constants/app-typo.const";
import { resolveDay } from "src/app/_app-utils/record.util";

export default function DrawDetailsModal() {
  const { isOpen, setIsOpen, drawRecord } = useDrawDetailsStore() as any;

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="lg"
        className="modal-draw-detail"
      >
        <DialogTitle style={{ display: "flex" }}>
          <div className="modal-draw-detail-header-wrapper">
            {`${APP_TYPO_CONST.components.drawDetailsModal.title}: ${
              drawRecord?.datum ?? ""
            } (${resolveDay(drawRecord?.tag ?? "Fr")})`}
            <div className="close-icon">
              <IconButton className="icon-button" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="draw-details-section">details</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
