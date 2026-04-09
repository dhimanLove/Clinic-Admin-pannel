'use client';

import { PatientRecords } from '@/components/patients/patient-records';

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Patient Records</h1>
        <p className="text-muted-foreground mt-1">
          Treated visits history, briefings, and exports
        </p>
      </div>

      <PatientRecords />
    </div>
  );
}

