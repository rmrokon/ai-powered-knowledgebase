import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { IAuth } from '../api/repositories/auth-repository';

interface AuthState {
  isLoggedIn: boolean;
  initializing: boolean;
  user: IAuth["user"] | null;
  login: (user: IAuth["user"]) => void;
  logout: () => void;
  setInitializing: (val: boolean) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthZstore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isLoggedIn: false,
        initializing: true,
        user: null,
        login: (user) =>set({ isLoggedIn: true, initializing: false, user: user }, false, 'auth/login'),
        logout: () =>
          set({ isLoggedIn: false }, false, 'auth/logout'),
        setInitializing: (val) =>
          set({ initializing: val }, false, 'auth/setInitializing'),
        setHasHydrated: (state) => set({ initializing: state }),
      }),
      {
        name: 'auth-storage', // localStorage key
        partialize: (state) => ({
          isLoggedIn: state.isLoggedIn,
          initializing: state.initializing,
          user: state.user
        }),
      }
    ),
    {
      name: 'authStore',
    }
  )
);
