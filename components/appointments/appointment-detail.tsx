'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, User, Phone, Mail, Calendar, Clock, FileText, Check, Ban } from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-warning text-warning-foreground border-warning' },
  accepted: { label: 'Accepted', className: 'bg-success text-success-foreground border-success' },
  rejected: { label: 'Rejected', className: 'bg-danger text-white border-danger' },
};

export function AppointmentDetail() {
  const {
    selectedAppointment,
    isDetailOpen,
    setDetailOpen,
    updateAppointmentStatus,
    updateAppointmentNotes,
  } = useAppointments();

  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedAppointment) {
      setNotes(selectedAppointment.notes);
    }
  }, [selectedAppointment]);

  const handleSaveNotes = () => {
    if (selectedAppointment) {
      updateAppointmentNotes(selectedAppointment.id, notes);
    }
  };

  const handleAccept = () => {
    if (selectedAppointment) {
      updateAppointmentStatus(selectedAppointment.id, 'accepted');
    }
  };

  const handleReject = () => {
    if (selectedAppointment) {
      updateAppointmentStatus(selectedAppointment.id, 'rejected');
    }
  };

  return (
    <AnimatePresence>
      {isDetailOpen && selectedAppointment && (
        <>
          {/* 🔥 Solid Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => setDetailOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-bg border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
              <div>
                <h2 className="text-lg font-semibold text-text">Appointment Details</h2>
                <p className="text-sm text-muted">#{selectedAppointment.id}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-muted"
                onClick={() => setDetailOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted">Status:</span>
                <Badge
                  variant="outline"
                  className={cn('rounded-lg px-3 py-1', statusConfig[selectedAppointment.status].className)}
                >
                  {statusConfig[selectedAppointment.status].label}
                </Badge>
              </div>

              {/* Patient Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted uppercase tracking-wider">
                  Patient Information
                </h3>

                <div className="bg-card rounded-xl p-4 space-y-4 border border-border">
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Name</p>
                      <p className="font-medium text-text">{selectedAppointment.patientName}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Phone</p>
                      <p className="font-medium text-text">{selectedAppointment.patientPhone}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary  flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Email</p>
                      <p className="font-medium text-text">{selectedAppointment.patientEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted uppercase tracking-wider">
                  Appointment Details
                </h3>

                <div className="bg-card rounded-xl p-4 space-y-4 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Date</p>
                      <p className="font-medium text-text">
                        {format(new Date(selectedAppointment.date), 'EEEE, MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Time</p>
                      <p className="font-medium text-text">{selectedAppointment.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Issue</p>
                      <p className="font-medium text-text">{selectedAppointment.issue}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted uppercase tracking-wider">
                  Notes
                </Label>

                <Textarea
                  placeholder="Add notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px] rounded-xl bg-card border border-border"
                />

                <Button
                  variant="secondary"
                  className="rounded-xl"
                  onClick={handleSaveNotes}
                  disabled={notes === selectedAppointment.notes}
                >
                  Save Notes
                </Button>
              </div>
            </div>

            {/* Footer */}
            {selectedAppointment.status === 'pending' && (
              <div className="border-t border-border px-6 py-4 bg-card">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl text-danger border-danger hover:bg-danger hover:text-white"
                    onClick={handleReject}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Reject
                  </Button>

                  <Button
                    className="flex-1 rounded-xl bg-success text-white hover:opacity-90"
                    onClick={handleAccept}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}