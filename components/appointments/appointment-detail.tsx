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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-warning text-warning-foreground border-warning' },
  accepted: { label: 'Accepted', className: 'bg-success text-success-foreground border-success' },
  completed: { label: 'Completed', className: 'bg-primary text-primary-foreground border-primary' },
  rejected: { label: 'Rejected', className: 'bg-danger text-white border-danger' },
};

export function AppointmentDetail() {
  const {
    selectedAppointment,
    isDetailOpen,
    setDetailOpen,
    updateAppointmentStatus,
    updateAppointmentNotes,
    completeAppointment,
  } = useAppointments();

  const [notes, setNotes] = useState('');
  const [completeOpen, setCompleteOpen] = useState(false);
  const [treatmentSummary, setTreatmentSummary] = useState('');

  useEffect(() => {
    if (selectedAppointment) {
      setNotes(selectedAppointment.notes);
      setTreatmentSummary(selectedAppointment.treatmentSummary ?? selectedAppointment.notes ?? '');
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

  const handleComplete = () => {
    if (!selectedAppointment) return;
    completeAppointment(selectedAppointment.id, treatmentSummary.trim());
    setCompleteOpen(false);
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
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-background text-foreground border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Appointment Details</h2>
                <p className="text-sm text-muted-foreground">#{selectedAppointment.id}</p>
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
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge
                  variant="outline"
                  className={cn('rounded-lg px-3 py-1', statusConfig[selectedAppointment.status].className)}
                >
                  {statusConfig[selectedAppointment.status].label}
                </Badge>
              </div>

              {/* Patient Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Patient Information
                </h3>

                <div className="bg-card rounded-xl p-4 space-y-4 border border-border">
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium text-foreground">{selectedAppointment.patientName}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{selectedAppointment.patientPhone}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10  flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">{selectedAppointment.patientEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Appointment Details
                </h3>

                <div className="bg-card rounded-xl p-4 space-y-4 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">
                        {format(new Date(selectedAppointment.date), 'EEEE, MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="font-medium text-foreground">{selectedAppointment.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Issue</p>
                      <p className="font-medium text-foreground">{selectedAppointment.issue}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
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
            <div className="border-t border-border px-6 py-4 bg-card">
              {selectedAppointment.status === 'pending' ? (
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
              ) : selectedAppointment.status === 'accepted' ? (
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1 rounded-xl"
                    onClick={() => setCompleteOpen(true)}
                  >
                    Mark as treated
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={() => setDetailOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setDetailOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
            <DialogContent className="max-w-xl rounded-2xl">
              <DialogHeader>
                <DialogTitle>Complete appointment</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Label>Treatment summary (will be used in patient record + PDF/CSV)</Label>
                <Textarea
                  value={treatmentSummary}
                  onChange={(e) => setTreatmentSummary(e.target.value)}
                  className="min-h-[140px] rounded-xl"
                  placeholder="Example: Diagnosis, procedure done, medicines, follow-up date..."
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" className="rounded-xl" onClick={() => setCompleteOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="rounded-xl" onClick={handleComplete} disabled={treatmentSummary.trim() === ''}>
                    Save as completed
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </AnimatePresence>
  );
}