export interface Workation {
  workationId: string;
  employee: string;
  origin: string;
  destination: string;
  start: string;
  end: string;
  workingDays: number;
  risk: 'HIGH' | 'NO' | 'LOW';
}