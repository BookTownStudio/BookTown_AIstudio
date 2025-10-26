// This file acts as the entry point for Firebase services.
// It now initializes the real Firebase app and exports live services.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { db as mockDb } from './db.ts';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJgY4Sjc3Iywm78-I3ELNtzozGYN7frZU",
  authDomain: "booktown-ai.firebaseapp.com",
  projectId: "booktown-ai",
  storageBucket: "booktown-ai.appspot.com",
  messagingSenderId: "431931238693",
  appId: "1:431931238693:web:653a41a7ea25481b3152cc",
  measurementId: "G-XGGHB03493"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the LIVE auth service
export const auth = getAuth(app);

// Continue exporting the mock DB for now.
// The next step would be to replace this with `getFirestore(app)`.
export const db = mockDb;