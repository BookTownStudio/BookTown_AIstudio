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