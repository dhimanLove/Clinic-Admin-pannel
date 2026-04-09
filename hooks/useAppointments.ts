import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { appointments as initialAppointments, type Appointment, type AppointmentStatus } from '@/data/mockData';
import { notificationService } from '@/services/notificationService';

interface AppointmentsState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  isDetailOpen: boolean;
  
  // Actions
  getAppointmentsForDoctor: (doctorId: string) => Appointment[];
  updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
  updateAppointmentNotes: (appointmentId: string, notes: string) => void;
  completeAppointment: (appointmentId: string, treatmentSummary: string) => void;
  setSelectedAppointment: (appointment: Appointment | null) => void;
  setDetailOpen: (open: boolean) => void;
  
  // Stats
  getStats: (doctorId: string) => {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    completed: number;
  };
}

export const useAppointments = create<AppointmentsState>()(
  persist(
    (set, get) => ({
      appointments: initialAppointments,
      selectedAppointment: null,
      isDetailOpen: false,

      // Future-ready: Filter by doctor_id (simulates RLS)
      getAppointmentsForDoctor: (doctorId: string) => {
        return get().appointments.filter((apt) => apt.doctorId === doctorId);
      },

      updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === appointmentId ? { ...apt, status } : apt
          ),
          selectedAppointment:
            state.selectedAppointment?.id === appointmentId
              ? { ...state.selectedAppointment, status }
              : state.selectedAppointment,
        }));

        // Trigger notification simulation
        if (status === 'accepted') {
          const appointment = get().appointments.find((apt) => apt.id === appointmentId);
          if (appointment) {
            notificationService.sendWhatsApp(appointment);
          }
        }
      },

      updateAppointmentNotes: (appointmentId: string, notes: string) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === appointmentId ? { ...apt, notes } : apt
          ),
          selectedAppointment:
            state.selectedAppointment?.id === appointmentId
              ? { ...state.selectedAppointment, notes }
              : state.selectedAppointment,
        }));
      },

      completeAppointment: (appointmentId: string, treatmentSummary: string) => {
        const completedAt = new Date().toISOString();
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === appointmentId
              ? { ...apt, status: 'completed', completedAt, treatmentSummary }
              : apt
          ),
          selectedAppointment:
            state.selectedAppointment?.id === appointmentId
              ? { ...state.selectedAppointment, status: 'completed', completedAt, treatmentSummary }
              : state.selectedAppointment,
        }));
      },

      setSelectedAppointment: (appointment: Appointment | null) => {
        set({ selectedAppointment: appointment, isDetailOpen: appointment !== null });
      },

      setDetailOpen: (open: boolean) => {
        set({ isDetailOpen: open });
        if (!open) {
          set({ selectedAppointment: null });
        }
      },

      getStats: (doctorId: string) => {
        const doctorAppointments = get().appointments.filter((apt) => apt.doctorId === doctorId);

        return {
          total: doctorAppointments.length,
          pending: doctorAppointments.filter((apt) => apt.status === 'pending').length,
          accepted: doctorAppointments.filter((apt) => apt.status === 'accepted').length,
          rejected: doctorAppointments.filter((apt) => apt.status === 'rejected').length,
          completed: doctorAppointments.filter((apt) => apt.status === 'completed').length,
        };
      },
    }),
    {
      name: 'dental-admin-appointments-v3',
      partialize: (state) => ({
        appointments: state.appointments,
      }),
    }
  )
);
