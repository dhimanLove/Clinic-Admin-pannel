'use client';

import { StaffTable } from '@/components/staff/staff-table';

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Hospital Staff Record</h1>
        <p className="text-muted-foreground mt-1">
          Browse Indian doctors, departments, and contact details
        </p>
      </div>

      <StaffTable />
    </div>
  );
}

