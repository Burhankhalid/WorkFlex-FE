
export interface Workation {
  id: number;
  employee: string;
  origin: {
    country: string;
    code: string;
  };
  destination: {
    country: string;
    code: string;
  };
  start: string;
  end: string;
  workingDays: number;
  risk: 'HIGH_RISK' | 'NO_RISK' | 'LOW_RISK';
}