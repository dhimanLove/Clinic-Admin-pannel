export type AppointmentStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface Doctor {
  id: string;
  name: string;
  email: string;
  clinicName: string;
  phone: string;
  specialization: string;
  avatar?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  issue: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
  // Set when an appointment is actually treated/completed
  completedAt?: string;
  treatmentSummary?: string;
}

/* ================= DOCTORS ================= */

export const doctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Neeraj Sharma',
    email: 'neeraj@dentalclinic.com',
    clinicName: 'Neeraj Dental Clinic, Delhi',
    phone: '+91 98765 43210',
    specialization: 'General Dentistry',
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Patel',
    email: 'priya@smiledental.com',
    clinicName: 'Smile Dental Care, Ahmedabad',
    phone: '+91 98765 43211',
    specialization: 'Orthodontics',
  },
  {
    id: 'doc-3',
    name: 'Dr. Amit Kumar',
    email: 'amit@perfectteeth.com',
    clinicName: 'Perfect Teeth Clinic, Lucknow',
    phone: '+91 98765 43212',
    specialization: 'Periodontics',
  },
  {
    id: 'doc-4',
    name: 'Dr. Sneha Reddy',
    email: 'sneha@brightsmile.com',
    clinicName: 'Bright Smile Dental, Hyderabad',
    phone: '+91 98765 43213',
    specialization: 'Cosmetic Dentistry',
  },
];

/* ================= LOGIN ================= */

export const mockCredentials: Record<string, string> = {
  'neeraj@dentalclinic.com': 'neeraj123',
  'priya@smiledental.com': 'priya123',
  'amit@perfectteeth.com': 'amit123',
  'sneha@brightsmile.com': 'sneha123',
};

/* ================= INDIAN DATA ================= */

const issues = [
  'Severe tooth pain',
  'Routine dental checkup',
  'Wisdom tooth removal',
  'Teeth whitening',
  'Cavity filling',
  'Gum bleeding problem',
  'Root canal treatment',
  'Braces consultation',
  'Tooth sensitivity',
  'Broken tooth repair',
  'Dental implant consultation',
  'Bad breath issue',
  'Loose tooth problem',
];

const patientNames = [
  'Rahul Sharma',
  'Anita Verma',
  'Rohit Singh',
  'Pooja Gupta',
  'Aman Yadav',
  'Neha Kapoor',
  'Vikas Jain',
  'Karan Malhotra',
  'Sneha Iyer',
  'Arjun Mehta',
  'Priyanka Das',
  'Sandeep Chauhan',
  'Deepak Mishra',
  'Nisha Rathi',
  'Manoj Tiwari',
  'Ritika Saxena',
  'Abhishek Pandey',
  'Shivam Agarwal',
  'Anjali Nair',
  'Harsh Vardhan',
];

/* ================= HELPERS ================= */

function generatePhone(): string {
  return `+91 ${Math.floor(70000 + Math.random() * 29999)}${Math.floor(10000 + Math.random() * 89999)}`;
}

function generateEmail(name: string): string {
  return `${name.toLowerCase().replace(/ /g, '.')}@gmail.com`;
}

function getRandomDate(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

function getRandomTime(): string {
  const hours = Math.floor(9 + Math.random() * 9);
  const minutes = Math.random() > 0.5 ? '00' : '30';
  return `${hours}:${minutes}`;
}

/* ================= GENERATOR ================= */

function generateAppointments(): Appointment[] {
  const appointments: Appointment[] = [];
  let appointmentId = 1;

  doctors.forEach((doctor) => {
    // Ensure every doctor has enough "real" treated patients for Patient Records UI
    const minCompletedPatients = 10;
    const completedSeedNames = patientNames.slice(0, minCompletedPatients);
    for (let i = 0; i < completedSeedNames.length; i++) {
      const patientName = completedSeedNames[i];
      const patientPhone = generatePhone();
      const patientEmail = generateEmail(patientName);
      const visitsPerPatient = 3 + (i % 2); // 3–4 visits each
      for (let v = 0; v < visitsPerPatient; v++) {
        const daysOffset = -1 * (4 + i * 3 + v * 14); // spread in the past (roughly biweekly)
        const date = getRandomDate(daysOffset);
        const time = getRandomTime();
        appointments.push({
          id: `apt-${appointmentId++}`,
          doctorId: doctor.id,
          patientName,
          patientPhone,
          patientEmail,
          issue: issues[Math.floor(Math.random() * issues.length)],
          date,
          time,
          status: 'completed',
          notes: '',
          completedAt: new Date().toISOString(),
          treatmentSummary:
            'Diagnosis recorded. Procedure completed successfully. Medicines prescribed and follow‑up advised.',
          createdAt: new Date(Date.now() - Math.random() * 18 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }

    const numAppointments = 25 + Math.floor(Math.random() * 15); // 🔥 MORE DATA

    for (let i = 0; i < numAppointments; i++) {
      const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];

      const rand = Math.random();
      let status: AppointmentStatus = rand < 0.4 ? 'pending' : rand < 0.78 ? 'accepted' : 'rejected';

      const daysOffset = Math.floor(Math.random() * 30) - 10;
      // If it's in the past and was accepted, some are completed to seed "records"
      const shouldAutoComplete = daysOffset < 0 && status === 'accepted' && Math.random() < 0.45;
      if (shouldAutoComplete) status = 'completed';

      appointments.push({
        id: `apt-${appointmentId++}`,
        doctorId: doctor.id,
        patientName,
        patientPhone: generatePhone(),
        patientEmail: generateEmail(patientName),
        issue: issues[Math.floor(Math.random() * issues.length)],
        date: getRandomDate(daysOffset),
        time: getRandomTime(),
        status,
        notes: '',
        completedAt: status === 'completed' ? new Date().toISOString() : undefined,
        treatmentSummary:
          status === 'completed'
            ? 'Treatment completed. Vitals stable. Follow-up advised as needed.'
            : undefined,
        createdAt: new Date(
          Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
      });
    }
  });

  return appointments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export const appointments: Appointment[] = generateAppointments();