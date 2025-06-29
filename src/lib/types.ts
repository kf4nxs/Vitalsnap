export interface VitalReading {
  id: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  oxygenSaturation: number;
  date: string; // ISO string
}

export interface GlucoseReading {
  id: string;
  glucose: number;
  context: 'before-meal' | 'after-meal' | 'fasting' | 'random';
  date: string; // ISO string
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}
