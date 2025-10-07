/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import "./DrawDetailsModal.css";
import CloseIcon from "@mui/icons-material/Close";
import { useDrawDetailsStore } from "src/app/_app-stores/draw-details.store";
import { APP_TYPO_CONST } from "src/app/_app-constants/app-typo.const";
import { resolveDay } from "src/app/_app-utils/record.util";
import NumbersList from "../numbers-list/NumbersList";

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
        <DialogTitle>
          <div
            className="modal-draw-detail-header-wrapper"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {`${APP_TYPO_CONST.components.drawDetailsModal.title}: ${
              drawRecord?.datum ?? ""
            } (${resolveDay(drawRecord?.tag ?? "Fr")})`}
            <div
              className="close-icon"
              style={{ position: "relative", top: "-4px", right: "-8px" }}
            >
              <IconButton className="icon-button" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="draw-details-section">
            <NumbersList
              winningNumber1={drawRecord?.nummer1 || 1}
              winningNumber2={drawRecord?.nummer2 || 2}
              winningNumber3={drawRecord?.nummer3 || 3}
              winningNumber4={drawRecord?.nummer4 || 4}
              winningNumber5={drawRecord?.nummer5 || 5}
              euroNumber1={drawRecord?.zz1 || 6}
              euroNumber2={drawRecord?.zz2 || 7}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
