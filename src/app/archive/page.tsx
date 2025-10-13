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
  type ClassFilter,
} from "./ArchiveToolbar";
import { getArchiveColumns, type ArchiveRecord } from "./_archiveColumns";
import {
  toComparableUtcNoon,
  toEndOfDayComparable,
} from "../_app-utils/date.util";
import ArchiveTicketDialog from "../_app-components/_static/archive-ticket-dialog/ArchiveTicketDialog";

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

  // Klassen-Filter (Mehrfachauswahl; [] = beide aus => keine Klassen-Filterung)
  const [classFilter, setClassFilter] = useState<ClassFilter>([]);

  // Ticket-Dialog
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketRow, setTicketRow] = useState<ArchiveRecord | null>(null);

  const handleOpenTicket = useCallback((row: ArchiveRecord) => {
    setTicketRow(row);
    setTicketOpen(true);
  }, []);

  const handleCloseTicket = useCallback(() => {
    setTicketOpen(false);
    setTicketRow(null);
  }, []);

  /**
   * Filter records by selected date range, weekday and classes.
   * - Fast path: if no date range, dayFilter === "both" and classes empty, return original array.
   * - Date comparison uses UTC-noon timestamps to avoid TZ/DST issues.
   * - End date is made inclusive via toEndOfDayComparable.
   * - Weekday uses row.tag with values "Di" (Tuesday) or "Fr" (Friday).
   * - Classes: "k1" => anzahlKlasse1 > 0; "k123" => Summe Klassen 1..3 > 0
   *   Leere Auswahl => kein Klassen-Filter (alle zeigen).
   */
  const filteredRecords: ArchiveRecord[] = useMemo(() => {
    if (!Array.isArray(records)) return [];

    const hasFrom = !!dateRange.from;
    const hasTo = !!dateRange.to;
    const isBoth = dayFilter === "both";
    const hasClassSelection = classFilter.length > 0;

    if (!hasFrom && !hasTo && isBoth && !hasClassSelection) {
      return records as ArchiveRecord[];
    }

    const fromTs = hasFrom ? toComparableUtcNoon(dateRange.from!) : null;
    const toTsEndOfDay = hasTo
      ? toEndOfDayComparable(toComparableUtcNoon(dateRange.to!))
      : null;

    const matchesDay = (row: ArchiveRecord) => {
      if (isBoth) return true;
      if (dayFilter === "tue") return row.tag === "Di";
      if (dayFilter === "fri") return row.tag === "Fr";
      return true;
    };

    const matchesClasses = (row: ArchiveRecord) => {
      if (!hasClassSelection) return true;

      let ok = false;

      if (classFilter.includes("k1")) {
        if ((row as any)?.anzahlKlasse1 > 0) ok = true;
      }

      if (classFilter.includes("k123")) {
        const sum123 =
          ((row as any)?.anzahlKlasse1 ?? 0) +
          ((row as any)?.anzahlKlasse2 ?? 0) +
          ((row as any)?.anzahlKlasse3 ?? 0);
        if (sum123 > 0) ok = true;
      }

      return ok;
    };

    return (records as ArchiveRecord[]).filter((row) => {
      if (!matchesDay(row)) return false;
      if (!matchesClasses(row)) return false;

      const ts = toComparableUtcNoon((row as any)?.datum);
      if (ts == null) return false;
      if (fromTs != null && ts < fromTs) return false;
      if (toTsEndOfDay != null && ts > toTsEndOfDay) return false;

      return true;
    });
  }, [records, dateRange, dayFilter, classFilter]);

  /** Fetch records when `numberOfResults` changes. */
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

  /** Details-Drawer öffnen */
  const handleOpenDetails = useCallback(
    (row: ArchiveRecord) => {
      setDrawRecord(row);
      setDrawDetailsIsOpen(true);
    },
    [setDrawRecord, setDrawDetailsIsOpen]
  );

  /** Spalten */
  const columns: GridColDef<ArchiveRecord>[] = useMemo(
    () =>
      getArchiveColumns({
        onOpenDetails: handleOpenDetails,
        onOpenTicket: handleOpenTicket, // ⟵ NEU
      }),
    [handleOpenDetails, handleOpenTicket]
  );

  /** Row-ID */
  const getRowId = useCallback(
    (row: ArchiveRecord) =>
      (row as any).id ??
      `${(row as any).datum}-${(row as any).nummer1}-${(row as any).nummer2}-${
        (row as any).nummer3
      }-${(row as any).nummer4}-${(row as any).nummer5}-${(row as any).zz1}-${
        (row as any).zz2
      }`,
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
          classes={classFilter}
          onClassesChange={setClassFilter}
          onClear={() => {
            setDateRange({ from: null, to: null });
            setDayFilter("both");
            setClassFilter([]);
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

      {/* Spielschein-Dialog */}
      <ArchiveTicketDialog
        open={ticketOpen}
        row={ticketRow}
        onClose={handleCloseTicket}
      />
    </div>
  );
}
