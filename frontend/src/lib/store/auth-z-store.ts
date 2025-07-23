import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { IAuth } from '../api/repositories/auth-repository';

interface AuthState {
  isLoggedIn: boolean;
  user: IAuth["user"] | null;
  login: (user: IAuth["user"]) => void;
  logout: () => void;
}

export const useAuthZstore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isLoggedIn: false,
        initializing: true,
        user: null,
        login: (user) => set({ isLoggedIn: true, user: user }, false, 'auth/login'),
        logout: () => set({ isLoggedIn: false, user: null }, false, 'auth/logout'),
      }),
      {
        name: 'auth-storage', // localStorage key
        partialize: (state) => ({
          isLoggedIn: state.isLoggedIn,
          user: state.user
        }),
      }
    ),
    {
      name: 'authStore',
    }
  )
);
