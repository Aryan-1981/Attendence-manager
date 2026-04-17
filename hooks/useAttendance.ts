"use client";

import { useState, useMemo } from "react";
import { attendanceRecords } from "@/lib/mock-data";
import type { AttendanceRecord } from "@/lib/mock-data";

type SortField = "studentName" | "date" | "checkIn" | "checkOut" | "status";
type SortDirection = "asc" | "desc";

interface UseAttendanceOptions {
  initialPageSize?: number;
}

export function useAttendance({ initialPageSize = 10 }: UseAttendanceOptions = {}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(initialPageSize);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...attendanceRecords];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.studentId.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Date range filter
    if (dateRange.from) {
      result = result.filter((r) => r.date >= dateRange.from!);
    }
    if (dateRange.to) {
      result = result.filter((r) => r.date <= dateRange.to!);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });

    return result;
  }, [search, statusFilter, dateRange, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredAndSorted.length / pageSize);
  const paginatedData = filteredAndSorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return {
    data: paginatedData,
    totalRecords: filteredAndSorted.length,
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
  };
}
