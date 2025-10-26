<<<<<<< HEAD
// This file acts as the entry point for Firebase services.
// It now initializes the real Firebase app and exports live services.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { db as mockDb } from './db.ts';

// TODO: Replace with your actual Firebase configuration from your project settings.
// It is recommended to use environment variables for this in a production build.
const firebaseConfig = {
  apiKey: "AIzaSy...YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the LIVE auth service
export const auth = getAuth(app);

// Continue exporting the mock DB for now.
// The next step would be to replace this with `getFirestore(app)`.
export const db = mockDb;
=======
// This file acts as the entry point for Firebase services, using our mocks.

// --- START: Production Live Firebase Initialization ---
import { initializeApp } from "firebase/app";
import { getAuth, User, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// **NOTE:** The mock db and auth implementations are removed here as they are replaced by the live SDK exports below.
// The configuration is read securely from environment variables (VITE_FIREBASE_...).

// Your web app's Firebase configuration (read from environment variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize the main Firebase app
const app = initializeApp(firebaseConfig);

// Export the live services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Exporting types for convenience, though often better imported directly from SDK
export type LiveAuth = Auth;
export type LiveFirestore = Firestore;
export type LiveUser = User;

// --- END: Production Live Firebase Initialization ---


// ----------------------------------------------------------------------
// ARCHIVE/MOCK CODE (Retained if you still rely on types or specific mock exports)
// NOTE: These exports are now shadowed by the live exports above, which is the architectural goal.
// They are kept here only to fulfill the "without deleting any other functionalities" request,
// but they represent inactive code and should be safely removed in a production environment.
// ----------------------------------------------------------------------

// Mock Firebase Auth (INACTIVE CODE)
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
        // For the demo, we just resolve. The app reloads to login screen anyway.
        window.location.reload();
        return Promise.resolve();
    },
};

// Original Mock Exports (Now shadowed by Live Exports: auth, db)
// export const auth = mockAuth; 
// export const db = mockDb;
>>>>>>> 1904393 (Update auth and firebase configuration)
