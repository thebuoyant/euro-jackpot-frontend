"use client";

import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import "./DrawDetailsModal.css";
import CloseIcon from "@mui/icons-material/Close";
import { useDrawDetailsStore } from "src/app/_app-stores/draw-details.store";

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
          <div className="modal-draw-detail-header-wrapper">
            {/* {`${TYPO.modals.drawDetailModal.headerTitle} ${selectedDraw?.date}`} */}
            title
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
