'use client';

import { AppointmentsTable } from '@/components/appointments/appointments-table';
import { AppointmentDetail } from '@/components/appointments/appointment-detail';

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Appointments</h1>
        <p className="text-muted-foreground mt-1">
          Manage and respond to appointment requests
        </p>
      </div>

      {/* Table */}
      <AppointmentsTable />

      {/* Detail Slide-over */}
      <AppointmentDetail />
    </div>
  );
}
