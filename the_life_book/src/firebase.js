// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCbRuT2FOLsXdnW-Jc5llEhxkqg6rUA0Gw",
  authDomain: "the-life-book-994da.firebaseapp.com",
  projectId: "the-life-book-994da",
  storageBucket: "the-life-book-994da.firebasestorage.app",
  messagingSenderId: "893391059829",
  appId: "1:893391059829:web:7f96833e53975927e7713c",
  measurementId: "G-2CD4SDB80Q"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);

