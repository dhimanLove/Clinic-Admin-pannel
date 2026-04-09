"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Download,
  Eye,
  Filter,
  Mail,
  Phone,
  Search,
  UserCog,
  UsersRound,
} from "lucide-react";
import {
  staffMembers,
  type StaffMember,
  type StaffStatus,
} from "@/data/staffData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  StaffStatus,
  { label: string; className: string; dot: string }
> = {
  "on-duty": {
    label: "On duty",
    className: "bg-success text-white border-success",
    dot: "bg-success",
  },
  "off-duty": {
    label: "Off duty",
    className: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  "on-leave": {
    label: "On leave",
    className: "bg-warning text-warning-foreground border-warning",
    dot: "bg-warning",
  },
};

const avatarColors = [
  "bg-violet-200 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200",
  "bg-emerald-200 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
  "bg-orange-200 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200",
  "bg-sky-200 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200",
  "bg-rose-200 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200",
  "bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  "bg-teal-200 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200",
  "bg-indigo-200 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200",
];

function getAvatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function StaffDialog({
  staff,
  open,
  onOpenChange,
}: {
  staff: StaffMember | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  if (!staff) return null;
  const status = statusConfig[staff.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full rounded-2xl p-0 overflow-hidden gap-0 bg-background max-h-[90vh] overflow-y-auto">
        <div className="bg-muted border-b border-border px-4 sm:px-8 pt-5 sm:pt-7 pb-4 sm:pb-6">
          <DialogHeader className="gap-0">
            <div className="flex items-center gap-3 sm:gap-5">
              <div
                className={cn(
                  "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-base sm:text-xl font-semibold flex-shrink-0",
                  getAvatarColor(staff.name),
                )}
              >
                {getInitials(staff.name)}
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground leading-tight">
                  {staff.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge
                    variant="outline"
                    className={cn("rounded-lg text-xs", status.className)}
                  >
                    {status.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {staff.department} · {staff.city}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-4 sm:px-8 py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-background">
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Contact
            </p>
            <DetailItem
              icon={<Phone className="w-4 h-4" />}
              label="Phone"
              value={staff.phone}
            />
            <DetailItem
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              value={staff.email}
            />
            <DetailItem
              icon={<UserCog className="w-4 h-4" />}
              label="Shift"
              value={staff.shift}
            />
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Professional
            </p>
            <DetailItem
              icon={<UsersRound className="w-4 h-4" />}
              label="Specialization"
              value={staff.specialization}
            />
            <DetailItem
              icon={<UsersRound className="w-4 h-4" />}
              label="Qualification"
              value={staff.qualification}
            />
            <DetailItem
              icon={<UsersRound className="w-4 h-4" />}
              label="Experience"
              value={`${staff.experienceYears} years`}
            />
          </div>
        </div>

        <div className="px-4 sm:px-8 pb-6 sm:pb-7 pt-0 bg-background">
          <div className="bg-muted rounded-xl p-4 border border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Extra details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MetaPill label="Languages" value={staff.languages.join(", ")} />
              <MetaPill
                label="Registration"
                value={staff.registration ?? "—"}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-muted rounded-xl p-3.5">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-xs text-muted-foreground font-medium">
          {label}
        </span>
      </div>
      <p className="text-sm font-medium text-foreground break-words">{value}</p>
    </div>
  );
}

function MetaPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background px-3 py-2.5">
      <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
      <p className="text-sm text-foreground mt-0.5">{value}</p>
    </div>
  );
}

function downloadCsv(
  filename: string,
  rows: Record<string, string | number | null | undefined>[],
) {
  const headers = Object.keys(rows[0] ?? {});
  const escape = (value: unknown) => {
    const str = value == null ? "" : String(value);
    if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function StaffTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StaffStatus | "all">("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<StaffMember | null>(null);

  const departments = useMemo(() => {
    const set = new Set<string>();
    for (const s of staffMembers) set.add(s.department);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return staffMembers
      .filter((s) => {
        const matchesSearch =
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.department.toLowerCase().includes(q) ||
          s.specialization.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q) ||
          s.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
          s.email.toLowerCase().includes(q);
        const matchesStatus =
          statusFilter === "all" || s.status === statusFilter;
        const matchesDept = deptFilter === "all" || s.department === deptFilter;
        return matchesSearch && matchesStatus && matchesDept;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchQuery, statusFilter, deptFilter]);

  const stats = useMemo(() => {
    const total = staffMembers.length;
    const onDuty = staffMembers.filter((s) => s.status === "on-duty").length;
    const offDuty = staffMembers.filter((s) => s.status === "off-duty").length;
    const onLeave = staffMembers.filter((s) => s.status === "on-leave").length;
    const departments = new Set(staffMembers.map((s) => s.department)).size;
    const filteredCount = filtered.length;
    return { total, onDuty, offDuty, onLeave, departments, filteredCount };
  }, [filtered.length]);

  const canClear =
    searchQuery.trim() !== "" || statusFilter !== "all" || deptFilter !== "all";
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDeptFilter("all");
  };

  const openDialog = (s: StaffMember) => {
    setSelected(s);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="rounded-2xl">
          <CardContent className="px-4 py-4">
            <p className="text-xs font-medium text-muted-foreground">
              Total staff
            </p>
            <p className="text-2xl font-semibold text-foreground mt-1">
              {stats.total}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Showing{" "}
              <span className="font-medium text-foreground">
                {stats.filteredCount}
              </span>
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="px-4 py-4">
            <p className="text-xs font-medium text-muted-foreground">On duty</p>
            <p className="text-2xl font-semibold text-foreground mt-1">
              {stats.onDuty}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              <p className="text-xs text-muted-foreground">Available now</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="px-4 py-4">
            <p className="text-xs font-medium text-muted-foreground">
              Off duty
            </p>
            <p className="text-2xl font-semibold text-foreground mt-1">
              {stats.offDuty}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-muted-foreground" />
              <p className="text-xs text-muted-foreground">Not scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="px-4 py-4">
            <p className="text-xs font-medium text-muted-foreground">
              On leave
            </p>
            <p className="text-2xl font-semibold text-foreground mt-1">
              {stats.onLeave}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning" />
              <p className="text-xs text-muted-foreground">Unavailable</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="px-4 py-4">
            <p className="text-xs font-medium text-muted-foreground">
              Departments
            </p>
            <p className="text-2xl font-semibold text-foreground mt-1">
              {stats.departments}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Across locations
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, department, city, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-full sm:w-[220px] h-11 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as StaffStatus | "all")}
          >
            <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="on-duty">On duty</SelectItem>
              <SelectItem value="off-duty">Off duty</SelectItem>
              <SelectItem value="on-leave">On leave</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  className="h-11 rounded-xl"
                  disabled={!canClear}
                  onClick={clearFilters}
                >
                  Clear
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Reset search and filters
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="h-11 rounded-xl"
                  onClick={() => {
                    downloadCsv(
                      `staff-${new Date().toISOString().slice(0, 10)}.csv`,
                      filtered.map((s) => ({
                        id: s.id,
                        name: s.name,
                        department: s.department,
                        specialization: s.specialization,
                        qualification: s.qualification,
                        experienceYears: s.experienceYears,
                        city: s.city,
                        phone: s.phone,
                        email: s.email,
                        status: s.status,
                        shift: s.shift,
                        languages: s.languages.join("; "),
                        registration: s.registration ?? "",
                      })),
                    );
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent sideOffset={6}>
                Download filtered rows (CSV)
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                {[
                  "Doctor",
                  "Department",
                  "Contact",
                  "Qualification",
                  "Status",
                  "Actions",
                ].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      "text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 sm:px-6 py-4",
                      i === 2 && "hidden md:table-cell",
                      i === 3 && "hidden lg:table-cell",
                      i === 5 && "text-right",
                    )}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                          <UsersRound className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          No staff found
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((s, index) => {
                    const status = statusConfig[s.status];
                    return (
                      <motion.tr
                        key={s.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="group hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => openDialog(s)}
                      >
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0",
                                getAvatarColor(s.name),
                              )}
                            >
                              {getInitials(s.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-foreground text-sm truncate">
                                {s.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {s.specialization}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 sm:px-6 py-4">
                          <p className="text-sm font-medium text-foreground">
                            {s.department}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {s.city}
                          </p>
                        </td>

                        <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                          <p className="text-sm text-muted-foreground">
                            {s.phone}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {s.email}
                          </p>
                        </td>

                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {s.qualification}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {s.experienceYears} yrs · {s.shift}
                          </p>
                        </td>

                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn("w-2 h-2 rounded-full", status.dot)}
                            />
                            <Badge
                              variant="outline"
                              className={cn(
                                "rounded-lg text-xs",
                                status.className,
                              )}
                            >
                              {status.label}
                            </Badge>
                          </div>
                        </td>

                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDialog(s);
                              }}
                              aria-label={`View ${s.name}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {staffMembers.length} staff members
      </p>

      <StaffDialog
        staff={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
