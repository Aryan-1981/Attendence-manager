"use client";

import { useAttendance } from "@/hooks/useAttendance";
import { StatusBadge } from "@/components/attendance/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SortField = "studentName" | "date" | "checkIn" | "checkOut" | "status";

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

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3.5 h-3.5 ml-1 opacity-40" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1 text-indigo-500" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1 text-indigo-500" />
    );
  };

  const handleExport = () => {
    toast.loading("Exporting attendance data...", { duration: 2000 });
    setTimeout(() => toast.success("Export complete! File downloaded."), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full sm:w-auto">
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

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing {data.length} of {totalRecords} records
      </p>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden glass">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[50px] text-xs">#</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("studentName")}
                    className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                  >
                    Student <SortIcon field="studentName" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("date")}
                    className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                  >
                    Date <SortIcon field="date" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("checkIn")}
                    className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                  >
                    Check-In <SortIcon field="checkIn" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("checkOut")}
                    className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                  >
                    Check-Out <SortIcon field="checkOut" />
                  </button>
                </TableHead>
                <TableHead className="text-xs">Duration</TableHead>
                <TableHead>
                  <button
                    onClick={() => handleSort("status")}
                    className="flex items-center text-xs font-medium hover:text-foreground transition-colors"
                  >
                    Status <SortIcon field="status" />
                  </button>
                </TableHead>
                <TableHead className="text-xs text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-[300px]">
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
                data.map((record, index) => (
                  <TableRow
                    key={record.id}
                    className="border-border/30 hover:bg-accent/30 transition-colors table-row-enter"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {(currentPage - 1) * 10 + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                          {record.studentAvatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{record.studentName}</p>
                          <p className="text-[11px] text-muted-foreground font-mono">
                            {record.studentId}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{record.date}</TableCell>
                    <TableCell className="text-sm font-mono">
                      {record.checkIn}
                    </TableCell>
                    <TableCell className="text-sm font-mono">
                      {record.checkOut}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">
                      {record.duration}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={record.status} />
                    </TableCell>
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
                  </TableRow>
                ))
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
