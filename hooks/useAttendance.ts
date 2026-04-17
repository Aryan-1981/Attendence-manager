"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";

type SortField = "studentName" | "date" | "checkIn" | "checkOut" | "status";
type SortDirection = "asc" | "desc";

interface UseAttendanceOptions {
  initialPageSize?: number;
}

type DbAttendanceRow = {
  id: string | number;
  name: string;
  day: string; // YYYY-MM-DD
  device_id?: string | null;
  created_at?: string | null;
};

export type AttendanceRecord = {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  department: string;
  date: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  status: "Present" | "Absent" | "Late";
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const take = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return take || "?";
}

export function useAttendance({ initialPageSize = 10 }: UseAttendanceOptions = {}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(initialPageSize);

  const [rows, setRows] = useState<DbAttendanceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/attendance?limit=1000`, { cache: "no-store" });
        const json = (await res.json().catch(() => ({}))) as any;
        if (!res.ok) throw new Error(json?.error || "Failed to load attendance");
        if (!cancelled) setRows(Array.isArray(json?.data) ? json.data : []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load attendance");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const t = window.setInterval(load, 8000);
    return () => {
      cancelled = true;
      window.clearInterval(t);
    };
  }, []);

  const attendanceRecords: AttendanceRecord[] = useMemo(() => {
    return rows.map((r) => {
      const name = String(r.name || "").trim();
      const day = String(r.day || "").slice(0, 10);
      const created = r.created_at ? new Date(r.created_at) : null;
      const checkIn = created ? format(created, "HH:mm") : "--:--";

      return {
        id: String(r.id),
        studentId: name ? name.toUpperCase().replace(/\s+/g, "-") : "UNKNOWN",
        studentName: name || "Unknown",
        studentAvatar: initials(name || "Unknown"),
        department: "—",
        date: day,
        checkIn,
        checkOut: "--:--",
        duration: "--",
        status: "Present",
      };
    });
  }, [rows]);

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

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) => r.studentName.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (dateRange.from) {
      result = result.filter((r) => r.date >= dateRange.from!);
    }
    if (dateRange.to) {
      result = result.filter((r) => r.date <= dateRange.to!);
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === "asc" ? 1 : -1;
      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });

    return result;
  }, [attendanceRecords, dateRange, search, sortDirection, sortField, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedData = filteredAndSorted.slice((safePage - 1) * pageSize, safePage * pageSize);

  return {
    data: paginatedData,
    totalRecords: filteredAndSorted.length,
    totalPages,
    currentPage: safePage,
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
    loading,
    error,
  };
}
