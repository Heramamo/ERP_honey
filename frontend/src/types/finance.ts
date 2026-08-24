export type PoleType = 'IT' | 'Formation' | 'Événementiel' | 'Tourisme';
export type ChargeCategory = 'Fixe' | 'Variable';
export type PaymentStatus = 'PAYÉ' | 'EN ATTENTE';

export interface ChargeItem {
  id: string;
  label: string;
  pole: PoleType;
  type: ChargeCategory;
  amount: number;
  date: string;
  documentUrl?: string;
}

export interface RevenuItem {
  id: string;
  client: string;
  pole: PoleType;
  amount: number;
  status: PaymentStatus;
  date: string;
}

export interface PoleReport {
  pole: PoleType;
  revenus: number;
  chargesFixes: number;
  chargesVariables: number;
  beneficeNet: number;
  marge: number;
}