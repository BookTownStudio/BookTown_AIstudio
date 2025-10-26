
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// Import the REAL Firebase auth instance and necessary functions/types
import { 
    User, 
    onAuthStateChanged, 
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { auth as firebaseAuth } from './firebase.ts';

interface AuthContextType {
    user: User | null; // Use the actual Firebase User type
    isGuest: boolean;
    isLoading: boolean;
    error: string | null;
    isLoggingIn: boolean;
    login: (email: string, pass: string) => void;
    logout: () => void;
    enterGuestMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // This is the core of the change. We subscribe to Firebase's real auth state.
        const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
            setUser(firebaseUser); // The user object is now the real Firebase user
            if (firebaseUser) {
                setIsGuest(false); // If a real user is detected, exit guest mode.
            }
            setIsLoading(false);
        });
        return unsubscribe; // Cleanup subscription on unmount
    }, []);

    const enterGuestMode = () => {
        setIsGuest(true);
    };

    const login = async (email: string, pass: string) => {
        setIsLoggingIn(true);
        setError(null);
        try {
            // Use the real Firebase SDK function
            await signInWithEmailAndPassword(firebaseAuth, email, pass);
            // The onAuthStateChanged listener will handle setting the user
        } catch (e: any) {
            // Firebase provides detailed error codes and messages
            setError(e.message || "Failed to sign in.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    const logout = async () => {
        setIsGuest(false); // Also exit guest mode on logout
        // Use the real Firebase SDK function
        await signOut(firebaseAuth);
        // The onAuthStateChanged listener will handle setting the user to null
    };

    const value = { user, isGuest, isLoading, error, isLoggingIn, login, logout, enterGuestMode };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};