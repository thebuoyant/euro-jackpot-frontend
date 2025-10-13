"use client";

import * as React from "react";
import { Tooltip } from "@mui/material";
import { type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import GridOnIcon from "@mui/icons-material/GridOn";

import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";
import { APP_CONST } from "../_app-constants/app.const";
import { formatNumberToString } from "../_app-utils/record.util";

export type ArchiveRecord = {
  id?: string;
  datum: string;
  nummer1: number;
  nummer2: number;
  nummer3: number;
  nummer4: number;
  nummer5: number;
  zz1: number;
  zz2: number;
  spielEinsatz: number;
  tag: string;
  anzahlKlasse1: number;
  quoteKlasse1: number;
};

export type GetArchiveColumnsArgs = {
  onOpenDetails: (row: ArchiveRecord) => void;
  onOpenTicket: (row: ArchiveRecord) => void; // ⟵ NEU
};

export function getArchiveColumns(
  args: GetArchiveColumnsArgs
): GridColDef<ArchiveRecord>[] {
  const { onOpenDetails, onOpenTicket } = args;

  const renderStake = (
    params: GridRenderCellParams<ArchiveRecord, unknown>
  ) => <>{formatNumberToString(params.row.spielEinsatz, 2)}</>;

  const renderClass1 = (
    params: GridRenderCellParams<ArchiveRecord, unknown>
  ) => {
    const countClass = params.row.anzahlKlasse1;
    const countQuoteKlasse1 = params.row.quoteKlasse1;

    if (countClass > 0) {
      if (countQuoteKlasse1 === APP_CONST.maxJackpotValue) {
        return (
          <Tooltip title={APP_TYPO_CONST.pages.archive.table.tooltip.classMax}>
            <StarIcon className="star-icon" style={{ height: "100%" }} />
          </Tooltip>
        );
      }
      return (
        <Tooltip title={APP_TYPO_CONST.pages.archive.table.tooltip.classOne}>
          <StarBorderIcon className="star-icon" style={{ height: "100%" }} />
        </Tooltip>
      );
    }
    return <></>;
  };

  const renderActions = (
    params: GridRenderCellParams<ArchiveRecord, unknown>
  ) => {
    const handleOpenDetails = () => onOpenDetails(params.row);
    const handleOpenTicket = () => onOpenTicket(params.row);

    const labelDetails =
      APP_TYPO_CONST?.pages?.archive?.table?.tooltip?.actionDrawDetails ??
      "Details der Ziehung";
    const labelTicket =
      APP_TYPO_CONST?.pages?.archive?.table?.tooltip?.actionShowTicket ??
      "Spielschein anzeigen";

    return (
      <div
        className="actions-wrapper"
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Tooltip title={labelDetails}>
          <span onClick={handleOpenDetails}>
            <PlaylistAddCheckCircleIcon
              className="star-icon"
              style={{
                height: "100%",
                cursor: "pointer",
                position: "relative",
                top: "6px",
              }}
            />
          </span>
        </Tooltip>

        <Tooltip title={labelTicket}>
          <span onClick={handleOpenTicket}>
            <GridOnIcon
              className="star-icon"
              style={{
                height: "100%",
                cursor: "pointer",
                position: "relative",
                top: "6px",
              }}
            />
          </span>
        </Tooltip>
      </div>
    );
  };

  return [
    {
      field: "datum",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelDate,
      width: 100,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      hideable: false,
      resizable: false,
    },
    {
      field: "nummer1",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber1,
      width: 125,
      align: "right",
      headerAlign: "right",
      sortable: false,
      filterable: false,
      hideable: false,
      resizable: false,
    },
    {
      field: "nummer2",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber2,
      width: 125,
      align: "right",
      headerAlign: "right",
      sortable: false,
      filterable: false,
      hideable: false,
      resizable: false,
    },
    {
      field: "nummer3",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber3,
      width: 125,
      align: "right",
      headerAlign: "right",
      sortable: false,
      filterable: false,
      hideable: false,
      resizable: false,
    },
    {
      field: "nummer4",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber4,
      width: 125,
      align: "right",
      headerAlign: "right",
      sortable: false,
      filterable: false,
      hideable: false,
      resizable: false,
    },
    {
      field: "nummer5",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber5,
      width: 125,
      align: "right",
      headerAlign: "right",
      sortable: false,
      filterable: false,
      hideable: false,
      resizable: false,
    },
    {
      field: "zz1",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelEuroNumber1,
      width: 105,
      align: "right",
      headerAlign: "right",
      sortable: false,
      filterable: false,
      hideable: false,
      resizable: false,
    },
    {
      field: "zz2",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelEuroNumber2,
      width: 105,
      align: "right",
      headerAlign: "right",
      sortable: false,
      filterable: false,
      hideable: false,
      resizable: false,
    },
    {
      field: "spielEinsatz",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelStake,
      width: 150,
      align: "right",
      headerAlign: "right",
      sortable: false,
      filterable: false,
      hideable: false,
      resizable: false,
      renderCell: renderStake,
    },
    {
      field: "tag",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelDay,
      width: 50,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      hideable: false,
      resizable: false,
    },
    {
      field: "anzahlKlasse1",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelClass1,
      width: 90,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      hideable: false,
      resizable: false,
      renderCell: renderClass1,
    },
    {
      field: "1",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelActions,
      sortable: false,
      filterable: false,
      hideable: false,
      resizable: false,
      renderCell: renderActions,
    },
  ];
}
