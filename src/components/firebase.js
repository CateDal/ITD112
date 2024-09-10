// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmasy3c5VAgE727pfe_R_nLkR1Elx-7lA",
  authDomain: "lab1-80836.firebaseapp.com",
  projectId: "lab1-80836",
  storageBucket: "lab1-80836.appspot.com",
  messagingSenderId: "486292745783",
  appId: "1:486292745783:web:4ecb661d1d338d4592d9b2",
  measurementId: "G-PBDVY6EGF1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

// Export services
export { app, analytics, db };
