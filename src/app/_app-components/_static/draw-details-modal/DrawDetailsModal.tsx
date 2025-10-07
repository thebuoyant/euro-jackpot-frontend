/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import "./DrawDetailsModal.css";
import CloseIcon from "@mui/icons-material/Close";
import { useDrawDetailsStore } from "src/app/_app-stores/draw-details.store";
import { APP_TYPO_CONST } from "src/app/_app-constants/app-typo.const";
import { resolveDay } from "src/app/_app-utils/record.util";
import NumbersList from "../numbers-list/NumbersList";
import ClassCount from "../class-count/ClassCount";

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
              style={{ position: "relative", top: "-4px", right: "-16px" }}
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
            <div className="class-section" style={{ marginTop: "12px" }}>
              <ClassCount
                label={`${APP_TYPO_CONST.common.class} 1`}
                count={drawRecord?.anzahlKlasse1}
                quota={drawRecord?.quoteKlasse1}
              />
              <ClassCount
                label={`${APP_TYPO_CONST.common.class} 2`}
                count={drawRecord?.anzahlKlasse2}
                quota={drawRecord?.quoteKlasse2}
              />
              <ClassCount
                label={`${APP_TYPO_CONST.common.class} 3`}
                count={drawRecord?.anzahlKlasse3}
                quota={drawRecord?.quoteKlasse3}
              />
              <ClassCount
                label={`${APP_TYPO_CONST.common.class} 4`}
                count={drawRecord?.anzahlKlasse4}
                quota={drawRecord?.quoteKlasse4}
              />
              <ClassCount
                label={`${APP_TYPO_CONST.common.class} 5`}
                count={drawRecord?.anzahlKlasse5}
                quota={drawRecord?.quoteKlasse5}
              />
              <ClassCount
                label={`${APP_TYPO_CONST.common.class} 6`}
                count={drawRecord?.anzahlKlasse6}
                quota={drawRecord?.quoteKlasse6}
              />
              <ClassCount
                label={`${APP_TYPO_CONST.common.class} 7`}
                count={drawRecord?.anzahlKlasse7}
                quota={drawRecord?.quoteKlasse7}
              />
              <ClassCount
                label={`${APP_TYPO_CONST.common.class} 8`}
                count={drawRecord?.anzahlKlasse8}
                quota={drawRecord?.quoteKlasse8}
              />
              <ClassCount
                label={`${APP_TYPO_CONST.common.class} 9`}
                count={drawRecord?.anzahlKlasse9}
                quota={drawRecord?.quoteKlasse9}
              />
              <ClassCount
                label={`${APP_TYPO_CONST.common.class} 10`}
                count={drawRecord?.anzahlKlasse10}
                quota={drawRecord?.quoteKlasse10}
              />
              <ClassCount
                label={`${APP_TYPO_CONST.common.class} 11`}
                count={drawRecord?.anzahlKlasse11}
                quota={drawRecord?.quoteKlasse11}
              />
              <ClassCount
                label={`${APP_TYPO_CONST.common.class} 12`}
                count={drawRecord?.anzahlKlasse12}
                quota={drawRecord?.quoteKlasse12}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
