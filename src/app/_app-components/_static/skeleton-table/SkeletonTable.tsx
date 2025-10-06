import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Skeleton,
} from "@mui/material";

interface SkeletonTableProps {
  columns?: number;
  rows?: number;
  rowHeight?: number;
  showColumnHeader?: boolean;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  columns = 5,
  rows = 3,
  rowHeight = 20,
  showColumnHeader = true,
}) => {
  // Header
  const renderSkeletonHeader = () => {
    const skeletons = [];
    for (let i = 0; i < columns; i++) {
      skeletons.push(
        <TableCell key={i}>
          <Skeleton variant="text" width="100%" height={30} />
        </TableCell>
      );
    }
    return skeletons;
  };

  // Content
  const renderSkeletonRows = () => {
    const skeletons = [];
    for (let i = 0; i < rows; i++) {
      skeletons.push(
        <TableRow key={i}>
          {Array.from({ length: columns }, (_, index) => (
            <TableCell key={index}>
              <Skeleton variant="text" width="100%" height={rowHeight} />
            </TableCell>
          ))}
        </TableRow>
      );
    }
    return skeletons;
  };

  return (
    <Table>
      {showColumnHeader && (
        <TableHead>
          <TableRow>{renderSkeletonHeader()}</TableRow>
        </TableHead>
      )}
      <TableBody>{renderSkeletonRows()}</TableBody>
    </Table>
  );
};
