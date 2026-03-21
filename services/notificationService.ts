import type { Appointment } from '@/data/mockData';
import { toast } from 'sonner';

// Future-ready: Replace mock implementations with real API calls
// This service is structured for easy integration with:
// - WhatsApp Business API
// - Twilio
// - Custom notification backend

interface NotificationService {
  sendWhatsApp: (appointment: Appointment) => Promise<void>;
  sendSMS: (phone: string, message: string) => Promise<void>;
  sendEmail: (email: string, subject: string, body: string) => Promise<void>;
}

export const notificationService: NotificationService = {
  // Simulate WhatsApp notification
  sendWhatsApp: async (appointment: Appointment) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Future: Replace with actual WhatsApp Business API call
    // const response = await fetch('/api/notifications/whatsapp', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     phone: appointment.patientPhone,
    //     message: `Your appointment on ${appointment.date} at ${appointment.time} has been confirmed.`,
    //   }),
    // });

    // Show toast notification
    toast.success('WhatsApp confirmation sent', {
      description: `Appointment details sent to ${appointment.patientName}`,
    });

    console.log('[NotificationService] WhatsApp sent to:', appointment.patientPhone);
  },

  // Simulate SMS notification
  sendSMS: async (phone: string, message: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Future: Replace with Twilio or similar SMS API
    console.log('[NotificationService] SMS sent to:', phone, message);
    
    toast.success('SMS sent successfully');
  },

  // Simulate email notification
  sendEmail: async (email: string, subject: string, body: string) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Future: Replace with email service (SendGrid, Resend, etc.)
    console.log('[NotificationService] Email sent to:', email, subject, body);
    
    toast.success('Email sent successfully');
  },
};
