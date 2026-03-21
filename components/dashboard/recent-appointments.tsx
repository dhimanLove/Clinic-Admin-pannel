'use client';

import { motion } from 'framer-motion';
import { formatDistanceToNow, format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useAppointments } from '@/hooks/useAppointments';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, CalendarX } from 'lucide-react';

const statusConfig = {
  pending: {
    label:     'Pending',
    className: 'bg-warning/10 text-warning-foreground border-warning/20',
    dot:       'bg-warning',
  },
  accepted: {
    label:     'Accepted',
    className: 'bg-success/10 text-success border-success/20',
    dot:       'bg-success',
  },
  rejected: {
    label:     'Rejected',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
    dot:       'bg-destructive',
  },
};

/** Deterministic avatar color from name */
function avatarColor(name: string) {
  const colors = [

    'bg-violet-200 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200',
    'bg-emerald-200 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
    'bg-orange-200 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
    'bg-sky-200 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200',
    'bg-rose-200 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200',
    'bg-amber-200 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
    'bg-teal-200 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200',
    'bg-indigo-200 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200',

  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function RecentAppointments() {
  const { currentDoctor } = useAuth();
  const { getAppointmentsForDoctor } = useAppointments();

  const appointments = currentDoctor
    ? getAppointmentsForDoctor(currentDoctor.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
      className="bg-card border border-border rounded-2xl"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Recent Appointments</h3>
          {appointments.length > 0 && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {appointments.length} latest
            </p>
          )}
        </div>
        <Link
          href="/appointments"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* List */}
      <div className="divide-y divide-border">
        {appointments.length === 0 ? (
          <div className="px-6 py-14 flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <CalendarX className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No appointments yet</p>
            <p className="text-xs text-muted-foreground">
              New appointments will appear here
            </p>
          </div>
        ) : (
          appointments.map((appointment, index) => {
            const status = statusConfig[appointment.status];
            const ago = formatDistanceToNow(new Date(appointment.createdAt), {
              addSuffix: true,
            });

            return (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05, duration: 0.2 }}
                className="px-6 py-3.5 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={cn(
                      'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-semibold flex-shrink-0',
                      avatarColor(appointment.patientName)
                    )}
                  >
                    {initials(appointment.patientName)}
                  </div>

                  {/* Name + issue */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {appointment.patientName}
                      </p>
                      {/* Status dot on mobile */}
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full flex-shrink-0 sm:hidden',
                          status.dot
                        )}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {appointment.issue}
                    </p>
                  </div>

                  {/* Date + time + badge */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-medium text-foreground">
                        {format(new Date(appointment.date), 'MMM d')}
                      </p>
                      <p className="text-xs text-muted-foreground">{appointment.time}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn('rounded-lg text-xs hidden sm:inline-flex', status.className)}
                    >
                      {status.label}
                    </Badge>
                  </div>
                </div>

                {/* Relative time */}
                <p className="text-[11px] text-muted-foreground/60 mt-2 ml-12">
                  Added {ago}
                </p>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer — only when there are items */}
      {appointments.length > 0 && (
        <div className="px-6 py-3 border-t border-border">
          <Link
            href="/appointments"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            See all appointments
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </motion.div>
  );
}