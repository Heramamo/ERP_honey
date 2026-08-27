import type { Pole, Revenu, Charge, BilanPole } from "../service/finance.service";

export interface PoleState {
    poles: Pole[];
    loading: boolean;
    error: string | null;
}

export interface RevenuState {
    revenus: Revenu[];
    loading: boolean;
    error: string | null;
}

export interface ChargeState {
    charges: Charge[];
    current: Charge | null;
    loading: boolean;
    error: string | null;
}

export interface BilanState {
    bilans: Record<number, BilanPole>;
    current: BilanPole | null;
    loading: boolean;
    error: string | null;
}
