"use client";

import { Box, Typography } from "@mui/material";
import "./Archive.css";
import { APP_TYPO_CONST } from "../_app-constants/app-typo.const";
import { useEffect } from "react";
import { API_ROUTE_CONST } from "../_app-constants/api-routes.const";
import { useArchiveStore } from "../_app-stores/archive.store";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { SkeletonTable } from "../_app-components/_static/skeleton-table/SkeletonTable";

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

  console.log("records", records);

  const columns: GridColDef[] = [
    {
      field: "datum",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelDate,
      width: 100,
    },
    {
      field: "nummer1",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber1,
      width: 115,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "nummer2",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber2,
      width: 115,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "nummer3",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber3,
      width: 115,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "nummer4",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber4,
      width: 115,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "nummer5",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelWinningNumber5,
      width: 115,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "zz1",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelEuroNumber1,
      width: 100,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "zz2",
      headerName: APP_TYPO_CONST.pages.archive.table.headerLabelEuroNumber2,
      width: 100,
      align: "right",
      headerAlign: "right",
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
