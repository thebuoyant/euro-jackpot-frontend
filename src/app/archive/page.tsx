/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import PlaylistAddCheckCircleIcon from "@mui/icons-material/PlaylistAddCheckCircle";
import { useDrawDetailsStore } from "../_app-stores/draw-details.store";
import ArchiveToolbar, { type ArchiveDateRange } from "./ArchiveToolbar";

/** Optional typing for a single record; adjust if API changes */
type ArchiveRecord = {
  id?: string;
  datum: string; // e.g. "03.05.2024"
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

export default function ArchivePage() {
  // Global archive state (Zustand)
  const { setIsLoading, setRecords, records, numberOfResults, isLoading } =
    useArchiveStore() as any;

  // Drawer for draw details (Zustand)
  const { setIsOpen: setDrawDetailsIsOpen, setDrawRecord } =
    useDrawDetailsStore() as any;

  // Local pagination state for DataGrid
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 15,
  });

  // Date range state controlled by ArchiveToolbar
  const [dateRange, setDateRange] = useState<ArchiveDateRange>({
    from: null,
    to: null,
  });

  /**
   * Parse a date string into a comparable UTC timestamp set to 12:00,
   * which avoids time zone edge cases when comparing only calendar days.
   * Supports "yyyy-MM-dd", "dd.MM.yyyy", and "dd.MM.yy" (assumed 20yy).
   */
  const parseToComparableDate = useCallback((raw: string): number | null => {
    if (!raw) return null;

    // ISO yyyy-MM-dd
    const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      const [, y, m, d] = iso;
      return Date.UTC(Number(y), Number(m) - 1, Number(d), 12, 0, 0, 0);
    }

    // dd.MM.yyyy
    const de = raw.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (de) {
      const [, d, m, y] = de;
      return Date.UTC(Number(y), Number(m) - 1, Number(d), 12, 0, 0, 0);
    }

    // dd.MM.yy -> 20yy
    const deshort = raw.match(/^(\d{2})\.(\d{2})\.(\d{2})$/);
    if (deshort) {
      const [, d, m, yy] = deshort;
      const y = 2000 + Number(yy);
      return Date.UTC(Number(y), Number(m) - 1, Number(d), 12, 0, 0, 0);
    }

    return null;
  }, []);

  /**
   * Filter records by selected date range.
   * - If both from/to are empty -> return original array (no extra work).
   * - End date is included by extending the comparable end to ~end-of-day.
   */
  const filteredRecords = useMemo(() => {
    if (!Array.isArray(records)) return [];
    const hasFrom = !!dateRange.from;
    const hasTo = !!dateRange.to;
    if (!hasFrom && !hasTo) return records as ArchiveRecord[]; // fast path when no filter is set

    const fromTs = hasFrom ? parseToComparableDate(dateRange.from!) : null;
    const toTsEndOfDay = hasTo
      ? (() => {
          const base = parseToComparableDate(dateRange.to!);
          if (base == null) return null;
          // Move from 12:00 to ~23:00 to include the end day safely (TZ-neutral)
          return base + 11 * 60 * 60 * 1000;
        })()
      : null;

    return (records as ArchiveRecord[]).filter((row) => {
      const ts =
        typeof row?.datum === "string"
          ? parseToComparableDate(row.datum)
          : null;
      if (ts == null) return false;
      if (fromTs != null && ts < fromTs) return false;
      if (toTsEndOfDay != null && ts > toTsEndOfDay) return false;
      return true;
    });
  }, [records, dateRange, parseToComparableDate]);

  /**
   * Fetch records when `numberOfResults` changes.
   * Uses an "alive" flag to avoid updating unmounted state.
   */
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `${API_ROUTE_CONST.archive}?numberOfResults=${numberOfResults}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (alive) setRecords((data?.records ?? []) as ArchiveRecord[]);
      } catch (err) {
        // Log only outside production to keep prod console clean
        if (process.env.NODE_ENV !== "production") console.error(err);
        if (alive) setRecords([]);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [numberOfResults, setIsLoading, setRecords]);

  /**
   * Stable columns configuration.
   * Inline renderers are kept lightweight; factor out heavy logic if needed.
   */
  const columns: GridColDef<ArchiveRecord>[] = useMemo(
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
                  <StarIcon className="star-icon" style={{ height: "100%" }} />
                </Tooltip>
              );
            }
            return (
              <Tooltip
                title={APP_TYPO_CONST.pages.archive.table.tooltip.classOne}
              >
                <StarBorderIcon
                  className="star-icon"
                  style={{ height: "100%" }}
                />
              </Tooltip>
            );
          }
          return <></>;
        },
      },
      {
        field: "1",
        headerName: APP_TYPO_CONST.pages.archive.table.headerLabelActions,
        sortable: false,
        filterable: false,
        hideable: false,
        resizable: false,
        renderCell: (params) => {
          const handleDrawDetailsClick = () => {
            setDrawRecord(params.row);
            setDrawDetailsIsOpen(true);
          };

          return (
            <div
              className="actions-wrapper"
              style={{ height: "100%", display: "flex", alignItems: "center" }}
            >
              <Tooltip
                title={
                  APP_TYPO_CONST.pages.archive.table.tooltip.actionDrawDetails
                }
              >
                <span onClick={handleDrawDetailsClick}>
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
            </div>
          );
        },
      },
    ],
    [setDrawDetailsIsOpen, setDrawRecord]
  );

  /** Stable row id fallback when no explicit `id` is present. */
  const getRowId = useCallback(
    (row: ArchiveRecord) =>
      row.id ??
      `${row.datum}-${row.nummer1}-${row.nummer2}-${row.nummer3}-${row.nummer4}-${row.nummer5}-${row.zz1}-${row.zz2}`,
    []
  );

  return (
    <div className="archive-page">
      {/* Page header */}
      <div className="archive-page-header page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.archive.headerTitle}
        </Typography>
      </div>

      {/* Toolbar: date range filter */}
      <div className="archive-toolbar">
        <ArchiveToolbar
          value={dateRange}
          onChange={setDateRange}
          onClear={() => setDateRange({ from: null, to: null })}
        />
      </div>

      {/* Page content */}
      <div className="archive-page-content page-content">
        {isLoading ? (
          <SkeletonTable columns={10} rows={15} rowHeight={3} />
        ) : (
          <Box sx={{ height: 634, width: "100%" }}>
            <DataGrid
              className="archive-table"
              rows={filteredRecords}
              columns={columns}
              getRowId={getRowId}
              density="compact"
              disableRowSelectionOnClick
              disableColumnMenu
              disableColumnFilter
              disableColumnSelector
              sortingOrder={[]}
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
