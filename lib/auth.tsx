
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
// FIX: Add file extension to firebase import
import { auth } from './firebase.ts';

interface AuthContextType {
    user: { uid: string; email: string; } | null;
    isLoading: boolean;
    error: string | null;
    isLoggingIn: boolean;
    login: (email: string, pass: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<{ uid: string; email: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
            setUser(firebaseUser);
            setIsLoading(false);
        });
        return unsubscribe; // Cleanup subscription
    }, []);

    const login = async (email: string, pass: string) => {
        setIsLoggingIn(true);
        setError(null);
        try {
            await auth.signInWithEmailAndPassword(email, pass);
            // The onAuthStateChanged listener will handle setting the user
        } catch (e: any) {
            setError(e.message || "Failed to sign in.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    const logout = async () => {
        await auth.signOut();
        // The onAuthStateChanged listener will handle setting the user to null
    };

    const value = { user, isLoading, error, isLoggingIn, login, logout };

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
