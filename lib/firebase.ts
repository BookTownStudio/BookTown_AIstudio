// This file acts as the entry point for Firebase services, using our mocks.
import { db as mockDb } from './db';

// Mock Firebase Auth
const mockAuth = {
    // A mock user
    currentUser: {
        uid: 'alex_doe',
        email: 'test@booktown.com',
    },
    onAuthStateChanged: (callback: (user: any) => void) => {
        // Immediately call with the mock user
        setTimeout(() => callback(mockAuth.currentUser), 100);
        // Return a dummy unsubscribe function
        return () => {};
    },
    signInWithEmailAndPassword: async (email: string, pass: string) => {
        console.log(`[MockAuth] Signing in with ${email}`);
        await new Promise(res => setTimeout(res, 500));
        if (email === 'test@booktown.com' && pass === 'password') {
            return { user: mockAuth.currentUser };
        }
        throw new Error("Invalid credentials");
    },
    signOut: async () => {
        console.log('[MockAuth] Signing out');
        mockAuth.currentUser = null as any; // This will break things, a real app needs state management
        // For the demo, we just resolve. The app reloads to login screen anyway.
        window.location.reload();
        return Promise.resolve();
    },
};


export const auth = mockAuth;
export const db = mockDb;
