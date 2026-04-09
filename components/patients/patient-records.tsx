'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Download, FileText, Search, UserRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/useAppointments';
import type { Appointment } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type PatientRecord = {
  patientKey: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  visits: Appointment[];
};

function downloadCsv(filename: string, rows: Record<string, string | number | null | undefined>[]) {
  const headers = Object.keys(rows[0] ?? {});
  const escape = (value: unknown) => {
    const str = value == null ? '' : String(value);
    if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function downloadPdfBriefing(filename: string, appointment: Appointment) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  const lines: string[] = [
    'Patient Visit Briefing',
    '',
    `Appointment ID: ${appointment.id}`,
    `Patient: ${appointment.patientName}`,
    `Phone: ${appointment.patientPhone}`,
    `Email: ${appointment.patientEmail}`,
    `Doctor ID: ${appointment.doctorId}`,
    '',
    `Visit date: ${format(new Date(appointment.date), 'MMM d, yyyy')}  ${appointment.time}`,
    `Status: ${appointment.status}`,
    '',
    `Chief complaint: ${appointment.issue}`,
    '',
    `Treatment summary: ${appointment.treatmentSummary ?? ''}`,
    '',
    `Notes: ${appointment.notes ?? ''}`,
    '',
    `Completed at: ${appointment.completedAt ? format(new Date(appointment.completedAt), 'MMM d, yyyy, h:mm a') : ''}`,
  ];

  const wrapped = doc.splitTextToSize(lines.join('\n'), 180);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(wrapped, 15, 18);
  doc.save(filename);
}

const avatarColors = [
  'bg-violet-200 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
  'bg-emerald-200 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
  'bg-orange-200 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
  'bg-sky-200 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
  'bg-rose-200 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
  'bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
  'bg-teal-200 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200',
  'bg-indigo-200 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',
];

function getAvatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function PatientRecords() {
  const [query, setQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const { currentDoctor } = useAuth();
  const { getAppointmentsForDoctor } = useAppointments();

  const records = useMemo<PatientRecord[]>(() => {
    if (!currentDoctor) return [];
    const appts = getAppointmentsForDoctor(currentDoctor.id).filter((a) => a.status === 'completed');
    const map = new Map<string, PatientRecord>();

    for (const a of appts) {
      const patientKey = a.patientEmail || `${a.patientName}::${a.patientPhone}`;
      const existing = map.get(patientKey);
      if (!existing) {
        map.set(patientKey, {
          patientKey,
          patientName: a.patientName,
          patientPhone: a.patientPhone,
          patientEmail: a.patientEmail,
          visits: [a],
        });
      } else {
        existing.visits.push(a);
      }
    }

    const list = Array.from(map.values()).map((r) => ({
      ...r,
      visits: r.visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    }));

    list.sort((a, b) => {
      const ad = new Date(a.visits[0]?.date ?? 0).getTime();
      const bd = new Date(b.visits[0]?.date ?? 0).getTime();
      return bd - ad;
    });

    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((r) => {
      return (
        r.patientName.toLowerCase().includes(q) ||
        r.patientEmail.toLowerCase().includes(q) ||
        r.patientPhone.replace(/\s/g, '').includes(q.replace(/\s/g, ''))
      );
    });
  }, [currentDoctor, getAppointmentsForDoctor, query]);

  const selected = useMemo(() => {
    if (!records.length) return null;
    const key = selectedKey ?? records[0]?.patientKey ?? null;
    if (!key) return null;
    return records.find((r) => r.patientKey === key) ?? null;
  }, [records, selectedKey]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient by name, email, or phone..."
            className="pl-10 h-11 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-xl">
            {records.length} patients
          </Badge>
          <Badge variant="outline" className="rounded-xl">
            {records.reduce((sum, r) => sum + r.visits.length, 0)} visits
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-4">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Patient list
            </p>
          </div>
          <div className="max-h-[560px] overflow-y-auto divide-y divide-border">
            {records.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <UserRound className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm font-medium text-foreground">No completed visits yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Mark an accepted appointment as treated to create a record.
                </p>
              </div>
            ) : (
              records.map((r) => {
                const isActive = selected?.patientKey === r.patientKey;
                const last = r.visits[0];
                return (
                  <button
                    key={r.patientKey}
                    onClick={() => setSelectedKey(r.patientKey)}
                    className={cn(
                      'w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors',
                      isActive && 'bg-muted'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold flex-shrink-0',
                          getAvatarColor(r.patientName)
                        )}
                      >
                        {getInitials(r.patientName)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">{r.patientName}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          Last visit {last ? format(new Date(last.date), 'MMM d, yyyy') : '—'} · {r.visits.length} visit(s)
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="space-y-4">
          {selected ? (
            <>
              <Card className="rounded-2xl">
                <CardContent className="px-5 py-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Patient</p>
                      <p className="text-lg font-semibold text-foreground truncate">{selected.patientName}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {selected.patientPhone} · {selected.patientEmail}
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      className="rounded-xl"
                      onClick={() => {
                        const rows = selected.visits.map((v) => ({
                          appointmentId: v.id,
                          date: v.date,
                          time: v.time,
                          issue: v.issue,
                          treatmentSummary: v.treatmentSummary ?? '',
                          notes: v.notes ?? '',
                          completedAt: v.completedAt ?? '',
                        }));
                        downloadCsv(
                          `patient-${selected.patientName.replace(/\s+/g, '-')}-visits.csv`,
                          rows
                        );
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export visits (CSV)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-muted flex items-center justify-between">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Visit records
                  </p>
                  <Badge variant="outline" className="rounded-xl">
                    {selected.visits.length} total
                  </Badge>
                </div>

                <div className="divide-y divide-border">
                  {selected.visits.map((v) => (
                    <div key={v.id} className="px-5 py-4">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground">
                              {format(new Date(v.date), 'EEEE, MMM d, yyyy')} · {v.time}
                            </p>
                            <Badge variant="outline" className="rounded-lg">
                              Completed
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            <span className="font-medium text-foreground">Complaint:</span> {v.issue}
                          </p>
                          <div className="mt-3 bg-muted rounded-xl p-3 border border-border">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <p className="text-xs font-medium text-muted-foreground">Briefing</p>
                            </div>
                            <p className="text-sm text-foreground mt-2 whitespace-pre-wrap">
                              {v.treatmentSummary || '—'}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col gap-2">
                          <Button
                            variant="secondary"
                            className="rounded-xl"
                            onClick={() => {
                              downloadCsv(`visit-${v.id}.csv`, [
                                {
                                  appointmentId: v.id,
                                  patientName: v.patientName,
                                  patientPhone: v.patientPhone,
                                  patientEmail: v.patientEmail,
                                  doctorId: v.doctorId,
                                  date: v.date,
                                  time: v.time,
                                  issue: v.issue,
                                  treatmentSummary: v.treatmentSummary ?? '',
                                  notes: v.notes ?? '',
                                  completedAt: v.completedAt ?? '',
                                },
                              ]);
                            }}
                          >
                            CSV
                          </Button>
                          <Button
                            className="rounded-xl"
                            onClick={() => downloadPdfBriefing(`visit-${v.id}.pdf`, v)}
                          >
                            PDF
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

