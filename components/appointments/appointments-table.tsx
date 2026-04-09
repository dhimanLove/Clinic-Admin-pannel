"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import {
  Check,
  X,
  Eye,
  Search,
  Filter,
  CalendarX,
  Phone,
  Clock,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useAppointments";
import type { Appointment, AppointmentStatus } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-warning text-warning-foreground border-warning",
    dot: "bg-warning",
  },
  accepted: {
    label: "Accepted",
    className: "bg-success text-white border-success",
    dot: "bg-success",
  },
  completed: {
    label: "Completed",
    className: "bg-primary text-primary-foreground border-primary",
    dot: "bg-primary",
  },
  rejected: {
    label: "Rejected",
    className: "bg-danger text-white border-danger",
    dot: "bg-danger",
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

/* ── WhatsApp helper ── */
function openWhatsAppRejection(appointment: Appointment) {
  const message = encodeURIComponent(
    `Dear ${appointment.patientName}, your appointment scheduled on ${format(new Date(appointment.date), "MMM d, yyyy")} at ${appointment.time} has been rejected. Please contact us to reschedule.`,
  );
  const phone = appointment.patientPhone.replace(/\D/g, "");
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}

/* ── Detail Dialog ── */
function AppointmentDialog({
  appointment,
  open,
  onOpenChange,
  onAccept,
  onReject,
}: {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAccept: (a: Appointment) => void;
  onReject: (a: Appointment) => void;
}) {
  if (!appointment) return null;
  const status = statusConfig[appointment.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full rounded-2xl p-0 overflow-hidden gap-0 bg-background max-h-[90vh] overflow-y-auto">
        {/* ── Header ── */}
        <div className="bg-muted border-b border-border px-4 sm:px-8 pt-5 sm:pt-7 pb-4 sm:pb-6">
          <DialogHeader className="gap-0">
            <div className="flex items-center gap-3 sm:gap-5">
              <div
                className={cn(
                  "w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-base sm:text-xl font-semibold flex-shrink-0",
                  getAvatarColor(appointment.patientName),
                )}
              >
                {getInitials(appointment.patientName)}
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground leading-tight">
                  {appointment.patientName}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge
                    variant="outline"
                    className={cn("rounded-lg text-xs", status.className)}
                  >
                    {status.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Booked{" "}
                    {formatDistanceToNow(new Date(appointment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span className="text-muted-foreground text-xs hidden sm:inline">
                    ·
                  </span>
                  <span className="text-xs text-muted-foreground font-mono hidden sm:inline">
                    #{appointment.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* ── Body — 1 col mobile, 2 col desktop ── */}
        <div className="px-4 sm:px-8 py-5 sm:py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 bg-background">
          {/* Left col */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Contact & Schedule
            </p>
            <DetailItem
              icon={<Phone className="w-4 h-4" />}
              label="Phone"
              value={appointment.patientPhone}
            />
            <DetailItem
              icon={<Calendar className="w-4 h-4" />}
              label="Date"
              value={format(new Date(appointment.date), "EEEE, MMM d yyyy")}
            />
            <DetailItem
              icon={<Clock className="w-4 h-4" />}
              label="Time"
              value={appointment.time}
            />
            <DetailItem
              icon={<User className="w-4 h-4" />}
              label="Doctor"
              value={`Dr. ${appointment.doctorId ?? "Assigned"}`}
            />
          </div>

          {/* Right col */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Clinical Details
            </p>
            <div className="bg-muted rounded-xl p-4 sm:min-h-[220px]">
              <div className="flex items-center gap-2 mb-2.5">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Chief Complaint
                </span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {appointment.issue}
              </p>
              {appointment.notes && (
                <>
                  <div className="border-t border-border my-3" />
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                    Notes
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {appointment.notes}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-4 sm:px-8 pb-5 sm:pb-7 pt-4 flex flex-wrap items-center gap-3 border-t border-border bg-background">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <div className="flex-1" />
          {appointment.status === "pending" && (
            <>
              <Button
                variant="outline"
                className="rounded-xl text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40"
                onClick={() => {
                  onReject(appointment);
                  onOpenChange(false);
                }}
              >
                <X className="w-4 h-4 mr-1.5" />
                Reject
              </Button>
              <Button
                className="rounded-xl bg-success text-white hover:opacity-90 shadow-none border-0"
                onClick={() => {
                  onAccept(appointment);
                  onOpenChange(false);
                }}
              >
                <Check className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Accept Appointment</span>
                <span className="sm:hidden">Accept</span>
              </Button>
            </>
          )}
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
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

/* ── Main Table ── */
export function AppointmentsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all",
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);

  const { currentDoctor } = useAuth();
  const { getAppointmentsForDoctor, updateAppointmentStatus } =
    useAppointments();

  const allAppointments = currentDoctor
    ? getAppointmentsForDoctor(currentDoctor.id)
    : [];

  const filteredAppointments = allAppointments
    .filter((apt) => {
      const matchesSearch =
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientPhone.includes(searchQuery);
      const matchesStatus =
        statusFilter === "all" || apt.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const openDialog = (appointment: Appointment) => {
    setSelectedAppt(appointment);
    setDialogOpen(true);
  };

  const handleAccept = (appointment: Appointment) => {
    updateAppointmentStatus(appointment.id, "accepted");
  };

  const handleReject = (appointment: Appointment) => {
    updateAppointmentStatus(appointment.id, "rejected");
    openWhatsAppRejection(appointment);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, issue, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as AppointmentStatus | "all")}
        >
          <SelectTrigger className="w-full sm:w-[180px] h-11 rounded-xl">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted">
                {["Patient", "Phone", "Issue", "Date", "Status", "Actions"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={cn(
                        "text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 sm:px-6 py-4",
                        i === 1 && "hidden md:table-cell",
                        i === 2 && "hidden lg:table-cell",
                        i === 5 && "text-right",
                      )}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence mode="popLayout">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                          <CalendarX className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">
                          No appointments found
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Try adjusting your search or filter
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment, index) => {
                    const status = statusConfig[appointment.status];
                    return (
                      <motion.tr
                        key={appointment.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="group hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => openDialog(appointment)}
                      >
                        {/* Patient */}
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0",
                                getAvatarColor(appointment.patientName),
                              )}
                            >
                              {getInitials(appointment.patientName)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">
                                {appointment.patientName}
                              </p>
                              <p className="text-xs text-muted-foreground md:hidden">
                                {appointment.patientPhone}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {appointment.patientPhone}
                          </span>
                        </td>

                        {/* Issue */}
                        <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                          <span className="text-sm text-muted-foreground line-clamp-1">
                            {appointment.issue}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 sm:px-6 py-4">
                          <p className="text-sm font-medium text-foreground">
                            {format(new Date(appointment.date), "MMM d, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.time}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-4 sm:px-6 py-4">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-lg text-xs",
                              status.className,
                            )}
                          >
                            {status.label}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDialog(appointment);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {appointment.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg text-success hover:text-success hover:bg-success/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAccept(appointment);
                                  }}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(appointment);
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
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

      {/* Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredAppointments.length} of {allAppointments.length}{" "}
        appointments
      </p>

      {/* Detail Dialog */}
      <AppointmentDialog
        appointment={selectedAppt}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  );
}
