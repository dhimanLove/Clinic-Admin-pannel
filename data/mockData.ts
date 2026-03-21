export type AppointmentStatus = 'pending' | 'accepted' | 'rejected';

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
  [x: string]: string;
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
}

export const doctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Neeraj Sharma',
    email: 'neeraj@dentalclinic.com',
    clinicName: 'Neeraj Dental Clinic',
    phone: '+91 98765 43210',
    specialization: 'General Dentistry',
  },
  {
    id: 'doc-2',
    name: 'Dr. Priya Patel',
    email: 'priya@smiledental.com',
    clinicName: 'Smile Dental Care',
    phone: '+91 98765 43211',
    specialization: 'Orthodontics',
  },
  {
    id: 'doc-3',
    name: 'Dr. Amit Kumar',
    email: 'amit@perfectteeth.com',
    clinicName: 'Perfect Teeth Clinic',
    phone: '+91 98765 43212',
    specialization: 'Periodontics',
  },
  {
    id: 'doc-4',
    name: 'Dr. Sneha Reddy',
    email: 'sneha@brightsmile.com',
    clinicName: 'Bright Smile Dental',
    phone: '+91 98765 43213',
    specialization: 'Cosmetic Dentistry',
  },
];

// Mock credentials for login (password is same as email prefix for demo)
export const mockCredentials: Record<string, string> = {
  'neeraj@dentalclinic.com': 'neeraj123',
  'priya@smiledental.com': 'priya123',
  'amit@perfectteeth.com': 'amit123',
  'sneha@brightsmile.com': 'sneha123',
};

const issues = [
  'Tooth pain in lower molar',
  'Routine checkup and cleaning',
  'Wisdom tooth extraction consultation',
  'Teeth whitening inquiry',
  'Cavity filling needed',
  'Gum bleeding issue',
  'Dental crown replacement',
  'Root canal treatment',
  'Braces consultation',
  'Tooth sensitivity',
  'Broken tooth repair',
  'Dental implant consultation',
];

const patientNames = [
  'Rahul Verma',
  'Anita Singh',
  'Vikram Malhotra',
  'Meera Joshi',
  'Suresh Gupta',
  'Kavita Nair',
  'Rajesh Khanna',
  'Pooja Sharma',
  'Arun Pillai',
  'Deepa Menon',
  'Manish Tiwari',
  'Sunita Rao',
  'Prakash Iyer',
  'Rekha Das',
  'Vivek Saxena',
];

function generatePhone(): string {
  return `+91 ${Math.floor(70000 + Math.random() * 29999)} ${Math.floor(10000 + Math.random() * 89999)}`;
}

function generateEmail(name: string): string {
  return `${name.toLowerCase().replace(' ', '.')}@email.com`;
}

function getRandomDate(daysOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

function getRandomTime(): string {
  const hours = Math.floor(9 + Math.random() * 9);
  const minutes = Math.random() > 0.5 ? '00' : '30';
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

function generateAppointments(): Appointment[] {
  const appointments: Appointment[] = [];
  let appointmentId = 1;

  doctors.forEach((doctor) => {
    const numAppointments = 10 + Math.floor(Math.random() * 6);

    for (let i = 0; i < numAppointments; i++) {
      const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
      const statusRandom = Math.random();
      let status: AppointmentStatus;

      if (statusRandom < 0.4) {
        status = 'pending';
      } else if (statusRandom < 0.75) {
        status = 'accepted';
      } else {
        status = 'rejected';
      }

      const daysOffset = Math.floor(Math.random() * 30) - 5;

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
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  });

  return appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const appointments: Appointment[] = generateAppointments();
