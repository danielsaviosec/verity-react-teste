import { create } from 'zustand';
import type { PersonalInfo, AddressInfo, WorkInfo } from '../types';

interface RegistrationStore {
  personal: PersonalInfo | null;
  address: AddressInfo | null;
  work: WorkInfo | null;
  savePersonal: (data: PersonalInfo) => void;
  saveAddress: (data: AddressInfo) => void;
  saveWork: (data: WorkInfo) => void;
  clear: () => void;
}

export const useRegistration = create<RegistrationStore>((set) => ({
  personal: null,
  address: null,
  work: null,
  savePersonal: (data) => set({ personal: data }),
  saveAddress: (data) => set({ address: data }),
  saveWork: (data) => set({ work: data }),
  clear: () => set({ personal: null, address: null, work: null }),
}));

export function isComplete(state: RegistrationStore): boolean {
  return Boolean(state.personal && state.address && state.work);
}
