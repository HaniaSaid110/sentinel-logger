import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Log } from "../services/logService";

interface LogsTableProps {
  logs: Log[];
  loading?: boolean;
}

const getLevelBadgeVariant = (level: string) => {
  switch (level) {
    case "INFO":
      return "default"; // or custom color
    case "WARN":
      return "secondary";
    case "ERROR":
      return "destructive";
    default:
      return "outline";
  }
};

export const LogsTable: React.FC<LogsTableProps> = ({ logs, loading }) => {
  if (loading) {
    return (
      <div className="border rounded-md p-8 text-center text-muted-foreground animate-pulse">
        Loading logs...
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center text-muted-foreground">
        No logs found matching your criteria.
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Level</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-right">Count</TableHead>
            <TableHead className="text-right">First Occurrence</TableHead>
            <TableHead className="text-right">Last Occurrence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log._id}>
              <TableCell>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Badge variant={getLevelBadgeVariant(log.level) as any}>
                  {log.level}
                </Badge>
              </TableCell>
              <TableCell className="font-medium max-w-md truncate" title={log.message}>
                {log.message}
              </TableCell>
              <TableCell className="text-right">{log.count}</TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">
                {new Date(log.createdAt).toLocaleString()}
              </TableCell>
              <TableCell className="text-right text-muted-foreground text-sm">
                {new Date(log.updatedAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
