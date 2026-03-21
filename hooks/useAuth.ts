import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doctors, mockCredentials, type Doctor } from '@/data/mockData';

interface AuthState {
  isAuthenticated: boolean;
  currentDoctor: Doctor | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// Future-ready: This hook structure mirrors Supabase Auth patterns
// Replace implementation with Supabase Auth when ready
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      currentDoctor: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Future: Replace with Supabase signInWithPassword
        const correctPassword = mockCredentials[email];
        
        if (!correctPassword) {
          set({ isLoading: false, error: 'Invalid email address' });
          return false;
        }

        if (correctPassword !== password) {
          set({ isLoading: false, error: 'Invalid password' });
          return false;
        }

        const doctor = doctors.find((d) => d.email === email);
        
        if (!doctor) {
          set({ isLoading: false, error: 'Doctor account not found' });
          return false;
        }

        set({
          isAuthenticated: true,
          currentDoctor: doctor,
          isLoading: false,
          error: null,
        });

        return true;
      },

      logout: () => {
        // Future: Replace with Supabase signOut
        set({
          isAuthenticated: false,
          currentDoctor: null,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'dental-admin-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        currentDoctor: state.currentDoctor,
      }),
    }
  )
);

// Future-ready session hook
export function useSession() {
  const { isAuthenticated, currentDoctor, isLoading } = useAuth();
  
  return {
    session: isAuthenticated ? { user: currentDoctor } : null,
    isLoading,
    // Future: Add Supabase session refresh logic
  };
}
