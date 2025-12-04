import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
}

interface AdminState {
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  adminMode: boolean;
  toggleAdminMode: () => void;
  setAdminMode: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setLoggedIn: (v) => set({ isLoggedIn: v }),
}));

export const useAdminStore = create<AdminState>((set) => ({
  isAdmin: false,
  adminMode: false,
  setIsAdmin: (value) => set({ isAdmin: value }),
  toggleAdminMode: () => set((state) => ({ adminMode: !state.adminMode })),
  setAdminMode: (value) => set({ adminMode: value }),
}));
