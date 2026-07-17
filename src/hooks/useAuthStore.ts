import { create } from 'zustand';
import type { User } from 'firebase/auth';

export type UserRole = 'consumer' | 'merchant' | null;

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null, role: UserRole) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user, role) => set({ user, role, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  clearAuth: () => set({ user: null, role: null, isAuthenticated: false, isLoading: false }),
}));
