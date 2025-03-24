// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDNCcxzUW7Evec-CEnT3lOX8cn83JAWu_o",
  authDomain: "collabai-50143.firebaseapp.com",
  projectId: "collabai-50143",
  storageBucket: "collabai-50143.firebasestorage.app",
  messagingSenderId: "948294729052",
  appId: "1:948294729052:web:0776c54b6c316a5007d599",
  measurementId: "G-R9239HM2L4"
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { db };
