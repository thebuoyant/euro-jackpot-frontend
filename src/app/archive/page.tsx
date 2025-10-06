"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
} from "@mui/x-data-grid";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

import "./Archive.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";
import { API_ROUTE_CONST } from "../_app-constants/api-routes.const";
import { APP_CONST } from "../_app-constants/app.const";
import { useArchiveStore } from "../_app-stores/archive.store";
import { formatNumberToString } from "../_app-utils/record.util";
import { SkeletonTable } from "../_app-components/_static/skeleton-table/SkeletonTable";

export default function ArchivePage() {
  const { setIsLoading, setRecords, records, numberOfResults, isLoading } =
    useArchiveStore() as any;

  // Fixe Seitengröße 15 — Pagination-Buttons bleiben sichtbar
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 15,
  });

  // Daten holen (mit AbortController)
  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${API_ROUTE_CONST.archive}?numberOfResults=${numberOfResults}`,
          { signal: ac.signal }
        );
        const data = await res.json();
        setRecords(data.records ?? []);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") console.error(err);
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    })();

    return () => ac.abort();
  }, [numberOfResults, setIsLoading, setRecords]);

  // Spalten
  const columns: GridColDef[] = useMemo(
    () => [
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
        headerName:
          APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber1,
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
        headerName:
          APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber2,
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
        headerName:
          APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber3,
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
        headerName:
          APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber4,
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
        headerName:
          APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber5,
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
        renderCell: (params) => (
          <>{formatNumberToString(params.row.spielEinsatz, 2)}</>
        ),
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
        renderCell: (params) => {
          const countClass = params.row.anzahlKlasse1;
          const countQuoteKlasse1 = params.row.quoteKlasse1;
          if (countClass > 0) {
            if (countQuoteKlasse1 === APP_CONST.maxJackpotValue) {
              return (
                <Tooltip
                  title={APP_TYPO_CONST.pages.archive.table.tooltip.classMax}
                >
                  <StarIcon
                    className="table-star-icon"
                    sx={{ position: "relative", top: 0.5 }}
                  />
                </Tooltip>
              );
            }
            return (
              <Tooltip
                title={APP_TYPO_CONST.pages.archive.table.tooltip.classOne}
              >
                <StarBorderIcon
                  className="table-star-icon"
                  sx={{ position: "relative", top: 0.5 }}
                />
              </Tooltip>
            );
          }
          return <></>;
        },
      },
    ],
    []
  );

  // Stabile Row-ID (kein Math.random)
  const getRowId = (row: any) =>
    row.id ??
    `${row.datum}-${row.nummer1}-${row.nummer2}-${row.nummer3}-${row.nummer4}-${row.nummer5}-${row.zz1}-${row.zz2}`;

  return (
    <div className="archive-page">
      <div className="archive-page-header page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.archive.headerTitle}
        </Typography>
      </div>

      <div className="archive-page-content page-content">
        {isLoading ? (
          <SkeletonTable columns={10} rows={15} rowHeight={3} />
        ) : (
          <Box sx={{ height: 634, width: "100%" }}>
            <DataGrid
              className="archive-table"
              rows={records}
              columns={columns}
              getRowId={getRowId}
              density="compact"
              disableRowSelectionOnClick
              // Header-Actions deaktivieren
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              sortingOrder={[]}
              // Pagination: fix 15, nur Buttons sichtbar
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[15]}
            />
          </Box>
        )}
      </div>
    </div>
  );
}
