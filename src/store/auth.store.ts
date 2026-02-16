import { create } from 'zustand';
import { User } from '@prisma/client';

interface AuthState {
    user: Partial<User> | null;
    isAuthenticated: boolean;
    login: (user: Partial<User>) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: {
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        // Mock user for now
    },
    isAuthenticated: true,
    login: (user) => set({ user, isAuthenticated: true }),
    logout: () => set({ user: null, isAuthenticated: false }),
}));
