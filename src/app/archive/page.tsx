"use client";

import { Box, Typography } from "@mui/material";
import "./Archive.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";
import { useEffect } from "react";
import { API_ROUTE_CONST } from "../_app-constants/api-routes.const";
import { useArchiveStore } from "../_app-stores/archive.store";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { SkeletonTable } from "../_app-components/_static/skeleton-table/SkeletonTable";
import { formatNumberToString } from "../_app-utils/record.util";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { APP_CONST } from "../_app-constants/app.const";

export default function ArchivePage() {
  const { setIsLoading, setRecords, records, numberOfResults, isLoading } =
    useArchiveStore() as any;

  useEffect(() => {
    const backendCall = async () => {
      setIsLoading(true);

      const res = await fetch(
        `${API_ROUTE_CONST.archive}?numberOfResults=${numberOfResults}`,
        {
          method: "GET",
        }
      );
      const data = await res.json();

      setRecords(data.records || []);
      setIsLoading(false);
    };

    backendCall();
  }, []);

  const columns: GridColDef[] = [
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
      renderCell: (params) => {
        return <>{formatNumberToString(params.row.spielEinsatz, 2)}</>;
      },
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
              <StarIcon
                className="table-start-icon"
                style={{ position: "relative", top: "6px" }}
              />
            );
          }
          return (
            <StarBorderIcon
              className="table-start-icon"
              style={{ position: "relative", top: "6px" }}
            />
          );
        }

        return <>{countClass > 0}</>;
      },
    },
    // {
    //   field: "actions",
    //   headerName: t.page.owners.tableColumnOwnerActions,
    //   width: 150,
    //   align: "left",
    //   headerAlign: "left",
    //   renderCell: (params) => {
    //     return (
    //       <>
    //         <Tooltip title={t.general.tooltip.read}>
    //           <IconButton
    //             disableRipple
    //             onClick={() => openDrawer("read-owner", params.row)}
    //             color="primary"
    //             size="small"
    //           >
    //             <ManageSearchIcon
    //               style={{ position: "relative", top: "-2px" }}
    //             />
    //           </IconButton>
    //         </Tooltip>
    //       </>
    //     );
    //   },
    // },
  ];

  const renderOwnersGrid = () => {
    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    }

    return (
      <Box sx={{ height: 705, width: "100%" }}>
        <DataGrid
          className="owners-table"
          rows={records}
          columns={columns}
          disableRowSelectionOnClick
          getRowId={() => {
            return getRandomInt(99999999);
          }}
          showToolbar={false}
          density="compact"
          disableColumnFilter
          disableColumnMenu
        />
      </Box>
    );
  };

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
          renderOwnersGrid()
        )}
      </div>
    </div>
  );
}
