import { create } from 'zustand';
import type { User } from 'firebase/auth';

export type UserRole = 'consumer' | 'merchant' | null;

interface AuthState {
  user: User | null;
  role: UserRole;
  isProfileCompleted: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null, role: UserRole, isProfileCompleted?: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isProfileCompleted: false,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user, role, isProfileCompleted = false) => 
    set({ 
      user, 
      role, 
      isProfileCompleted, 
      isAuthenticated: !!user, 
      isLoading: false 
    }),
  setLoading: (isLoading) => set({ isLoading }),
  clearAuth: () => set({ user: null, role: null, isProfileCompleted: false, isAuthenticated: false, isLoading: false }),
}));
