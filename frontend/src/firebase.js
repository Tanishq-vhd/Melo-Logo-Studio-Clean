// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

/* 🔑 Firebase config (from Firebase console) */
const firebaseConfig = {
  apiKey: "AIzaSyB2ybIrQ1k3MCx3LjjbrUFWHhag7n7zqAY",
  authDomain: "melo-924ec.firebaseapp.com",
  projectId: "melo-924ec",
  storageBucket: "melo-924ec.firebasestorage.app",
  messagingSenderId: "1040205426146",
  appId: "1:1040205426146:web:c1399a9459d74e5ccf9dbb",
  measurementId: "G-WE1WWG5WCJ"
};

/* 🔥 Initialize Firebase */
const app = initializeApp(firebaseConfig);

/* 🔐 Auth */
export const auth = getAuth(app);

/* 🔵 Google Provider */
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});
