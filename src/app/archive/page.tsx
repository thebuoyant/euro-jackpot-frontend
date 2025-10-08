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
import ArchiveToolbar, {
  type ArchiveDateRange,
  type DayFilter,
} from "./ArchiveToolbar";
import { getArchiveColumns, type ArchiveRecord } from "./_archiveColumns";
import {
  toComparableUtcNoon,
  toEndOfDayComparable,
} from "../_app-utils/date.util";

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

  // Weekday filter state: 'tue' | 'fri' | 'both' (controlled by ArchiveToolbar)
  const [dayFilter, setDayFilter] = useState<DayFilter>("both");

  /**
   * Filter records by selected date range and weekday.
   * - Fast path: if no date range and dayFilter === "both", return original array.
   * - Date comparison uses UTC-noon timestamps to avoid TZ/DST issues.
   * - End date is made inclusive via toEndOfDayComparable.
   * - Weekday uses row.tag with values "Di" (Tuesday) or "Fr" (Friday).
   */
  const filteredRecords: ArchiveRecord[] = useMemo(() => {
    if (!Array.isArray(records)) return [];

    const hasFrom = !!dateRange.from;
    const hasTo = !!dateRange.to;
    const isBoth = dayFilter === "both";

    if (!hasFrom && !hasTo && isBoth) {
      // Nothing to filter - return original array (avoids extra work)
      return records as ArchiveRecord[];
    }

    // Date range boundaries (comparable UTC-noon timestamps)
    const fromTs = hasFrom ? toComparableUtcNoon(dateRange.from!) : null;
    const toTsEndOfDay = hasTo
      ? toEndOfDayComparable(toComparableUtcNoon(dateRange.to!))
      : null;

    // Weekday predicate: "Di" = Tue, "Fr" = Fri
    const matchesDay = (row: ArchiveRecord) => {
      if (isBoth) return true;
      if (dayFilter === "tue") return row.tag === "Di";
      if (dayFilter === "fri") return row.tag === "Fr";
      return true;
    };

    return (records as ArchiveRecord[]).filter((row) => {
      // 1) Weekday check (cheap bailout)
      if (!matchesDay(row)) return false;

      // 2) Date range check (if present)
      const ts = toComparableUtcNoon(row?.datum);
      if (ts == null) return false;
      if (fromTs != null && ts < fromTs) return false;
      if (toTsEndOfDay != null && ts > toTsEndOfDay) return false;

      return true;
    });
  }, [records, dateRange, dayFilter]);

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
          day={dayFilter}
          onDayChange={setDayFilter}
          onClear={() => {
            setDateRange({ from: null, to: null });
            setDayFilter("both");
          }}
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
