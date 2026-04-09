"use client";

import { AppointmentsTable } from "@/components/appointments/appointments-table";
import { AppointmentDetail } from "@/components/appointments/appointment-detail";
import { PatientRecords } from "@/components/patients/patient-records";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="rounded-xl">
          <TabsTrigger value="appointments" className="rounded-lg">
            Appointments
          </TabsTrigger>
          <TabsTrigger value="records" className="rounded-lg">
            Patient Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="mt-4">
          <AppointmentsTable />
          <AppointmentDetail />
        </TabsContent>

        <TabsContent value="records" className="mt-4">
          <PatientRecords />
        </TabsContent>
      </Tabs>
    </div>
  );
}
