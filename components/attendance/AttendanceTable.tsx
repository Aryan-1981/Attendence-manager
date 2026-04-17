"use client";

import { useMemo, useState } from "react";
import { useAttendance } from "@/hooks/useAttendance";
import { StatusBadge } from "@/components/attendance/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  FileX,
  Calendar,
  SlidersHorizontal,
  X,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SortField = "studentName" | "date" | "checkIn" | "checkOut" | "status";

type ColumnKey =
  | "student"
  | "date"
  | "checkIn"
  | "checkOut"
  | "duration"
  | "status"
  | "actions";

const defaultColumns: Record<ColumnKey, boolean> = {
  student: true,
  date: true,
  checkIn: true,
  checkOut: true,
  duration: true,
  status: true,
  actions: true,
};

export function AttendanceTable() {
  const {
    data,
    totalRecords,
    totalPages,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    sortField,
    sortDirection,
    handleSort,
  } = useAttendance();

  const [columns, setColumns] = useState(defaultColumns);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const visibleIds = useMemo(() => data.map((r) => r.id), [data]);
  const selectedIds = useMemo(() => Object.keys(selected).filter((id) => selected[id]), [selected]);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected[id]);

  const toggleAllVisible = (next: boolean) => {
    setSelected((prev) => {
      const copy = { ...prev };
      for (const id of visibleIds) copy[id] = next;
      return copy;
    });
  };

  const clearSelection = () => setSelected({});

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-40" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1 text-indigo-500" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1 text-indigo-500" />
    );
  };

  const handleExport = () => {
    toast.loading("Exporting attendance data...", { duration: 1400 });
    setTimeout(() => toast.success("Export complete! File downloaded."), 1400);
  };

  const handleBulkDelete = () => {
    toast("Bulk action", {
      description: `Pretending to delete ${selectedIds.length} record(s).`,
      action: {
        label: "Undo",
        onClick: () => toast.message("Restored"),
      },
    });
    clearSelection();
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full lg:w-auto">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 bg-secondary/30 border-border/50 text-sm"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? "all")}>
              <SelectTrigger className="w-[140px] h-9 bg-secondary/30 border-border/50 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateRange.from || ""}
                  onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
                  className="pl-9 h-9 w-[150px] bg-secondary/30 border-border/50 text-sm"
                />
              </div>
              <span className="text-muted-foreground text-xs">to</span>
              <Input
                type="date"
                value={dateRange.to || ""}
                onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
                className="h-9 w-[150px] bg-secondary/30 border-border/50 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Column visibility */}
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setColumnsOpen((v) => !v)}
                className="gap-2 h-9 border-border/50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Columns
              </Button>

              {columnsOpen && (
                <div className="absolute right-0 mt-2 z-20 w-56 rounded-2xl border border-border/60 glass overflow-hidden shadow-xl">
                  <div className="px-3 py-2 flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground">Visible columns</p>
                    <button
                      type="button"
                      onClick={() => setColumnsOpen(false)}
                      className="p-1 rounded-md hover:bg-accent/40"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="h-px bg-border/60" />
                  <div className="p-2 space-y-1">
                    {(Object.keys(defaultColumns) as ColumnKey[])
                      .filter((k) => k !== "actions")
                      .map((key) => (
                        <button
                          key={key}
                          type="button"
                          className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl hover:bg-accent/30 transition-colors"
                          onClick={() => setColumns((prev) => ({ ...prev, [key]: !prev[key] }))}
                        >
                          <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                          <Checkbox checked={columns[key]} onCheckedChange={() => {}} aria-label={`Toggle ${key}`} />
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2 h-9 border-border/50"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Results + Bulk actions */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Showing {data.length} of {totalRecords} records
          </p>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-2.5 py-1.5 glass">
              <span className="text-xs text-muted-foreground tabular-nums">
                {selectedIds.length} selected
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 px-2 rounded-full gap-1.5"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={clearSelection}
                aria-label="Clear selection"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/50 overflow-hidden glass">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[44px]">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={allVisibleSelected}
                      onCheckedChange={(v) => toggleAllVisible(v)}
                      aria-label="Select all"
                    />
                  </div>
                </TableHead>

                {columns.student && (
                  <TableHead>
                    <button
                      onClick={() => handleSort("studentName")}
                      className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                    >
                      Student <SortIcon field="studentName" />
                    </button>
                  </TableHead>
                )}

                {columns.date && (
                  <TableHead>
                    <button
                      onClick={() => handleSort("date")}
                      className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                    >
                      Date <SortIcon field="date" />
                    </button>
                  </TableHead>
                )}

                {columns.checkIn && (
                  <TableHead>
                    <button
                      onClick={() => handleSort("checkIn")}
                      className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                    >
                      Check-In <SortIcon field="checkIn" />
                    </button>
                  </TableHead>
                )}

                {columns.checkOut && (
                  <TableHead>
                    <button
                      onClick={() => handleSort("checkOut")}
                      className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                    >
                      Check-Out <SortIcon field="checkOut" />
                    </button>
                  </TableHead>
                )}

                {columns.duration && <TableHead className="text-xs">Duration</TableHead>}

                {columns.status && (
                  <TableHead>
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                    >
                      Status <SortIcon field="status" />
                    </button>
                  </TableHead>
                )}

                {columns.actions && <TableHead className="text-xs text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-[320px]">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <FileX className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">No records found</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((record, index) => {
                  const isSelected = Boolean(selected[record.id]);

                  return (
                    <TableRow
                      key={record.id}
                      data-state={isSelected ? "selected" : undefined}
                      className={cn(
                        "border-border/30 hover:bg-accent/30 transition-colors table-row-enter",
                        isSelected && "bg-indigo-500/5"
                      )}
                      style={{ animationDelay: `${index * 25}ms` }}
                    >
                      <TableCell className="w-[44px]">
                        <div className="flex items-center justify-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(v) =>
                              setSelected((prev) => ({ ...prev, [record.id]: v }))
                            }
                            aria-label={`Select ${record.studentName}`}
                          />
                        </div>
                      </TableCell>

                      {columns.student && (
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                              {record.studentAvatar}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{record.studentName}</p>
                              <p className="text-[11px] text-muted-foreground font-mono">{record.studentId}</p>
                            </div>
                          </div>
                        </TableCell>
                      )}

                      {columns.date && (
                        <TableCell className="text-sm text-muted-foreground">{record.date}</TableCell>
                      )}

                      {columns.checkIn && <TableCell className="text-sm font-mono">{record.checkIn}</TableCell>}

                      {columns.checkOut && <TableCell className="text-sm font-mono">{record.checkOut}</TableCell>}

                      {columns.duration && (
                        <TableCell className="text-sm text-muted-foreground font-mono">{record.duration}</TableCell>
                      )}

                      {columns.status && (
                        <TableCell>
                          <StatusBadge status={record.status} />
                        </TableCell>
                      )}

                      {columns.actions && (
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              toast(`Details for ${record.studentName}`, {
                                description: `${record.status} on ${record.date}`,
                              })
                            }
                          >
                            <Eye className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Page numbers */}
            <div className="flex items-center gap-1 mx-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className={cn(
                      "h-8 w-8 text-xs",
                      currentPage === page && "bg-indigo-500 hover:bg-indigo-600 text-white"
                    )}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
