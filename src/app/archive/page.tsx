/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
} from "@mui/x-data-grid";

import "./Archive.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";
import { API_ROUTE_CONST } from "../_app-constants/api-routes.const";
import { useArchiveStore } from "../_app-stores/archive.store";
import { SkeletonTable } from "../_app-components/_static/skeleton-table/SkeletonTable";
import { useDrawDetailsStore } from "../_app-stores/draw-details.store";
import ArchiveToolbar, { type ArchiveDateRange } from "./ArchiveToolbar";
import { getArchiveColumns, type ArchiveRecord } from "./_archiveColumns";

export default function ArchivePage() {
  const { setIsLoading, setRecords, records, numberOfResults, isLoading } =
    useArchiveStore() as any;

  const { setIsOpen: setDrawDetailsIsOpen, setDrawRecord } =
    useDrawDetailsStore() as any;

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
   * Parse a date string into a comparable UTC timestamp (set to 12:00)
   * to avoid time zone edge cases when comparing only calendar days.
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
   * - If both from/to are empty -> return original array (fast path).
   * - End date is included by extending the comparable end to ~end-of-day.
   */
  const filteredRecords: ArchiveRecord[] = useMemo(() => {
    if (!Array.isArray(records)) return [];
    const hasFrom = !!dateRange.from;
    const hasTo = !!dateRange.to;
    if (!hasFrom && !hasTo) return records as ArchiveRecord[];

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
   * Stable handler injected into the column factory to open the details drawer.
   * Keeping this as a memoized callback avoids unnecessary column re-creation.
   */
  const handleOpenDetails = useCallback(
    (row: ArchiveRecord) => {
      setDrawRecord(row);
      setDrawDetailsIsOpen(true);
    },
    [setDrawRecord, setDrawDetailsIsOpen]
  );

  /** Stable column model provided by the factory (extracted for readability). */
  const columns: GridColDef<ArchiveRecord>[] = useMemo(
    () => getArchiveColumns({ onOpenDetails: handleOpenDetails }),
    [handleOpenDetails]
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
      <div className="archive-page-header page-header">
        <Typography variant="h6">
          {APP_TYPO_CONST.pages.archive.headerTitle}
        </Typography>
      </div>
      <div className="archive-toolbar">
        <ArchiveToolbar
          value={dateRange}
          onChange={setDateRange}
          onClear={() => setDateRange({ from: null, to: null })}
        />
      </div>
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
