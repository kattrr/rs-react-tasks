import { create } from 'zustand';

export interface FormData {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  acceptTerms: boolean;
  picture: string; // base64
  country: string;
  createdAt: Date;
  formType: 'uncontrolled' | 'hookform';
}

interface FormStore {
  formData: FormData[];
  countries: string[];
  addFormData: (data: Omit<FormData, 'id' | 'createdAt'>) => void;
  setCountries: (countries: string[]) => void;
  clearFormData: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
  formData: [],
  countries: [],
  addFormData: (data) =>
    set((state) => ({
      formData: [
        ...state.formData,
        {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        },
      ],
    })),
  setCountries: (countries) => set({ countries }),
  clearFormData: () => set({ formData: [] }),
}));
