import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjYp39jo_Vi11Z3rt5nA8VCol6ogxM4f8",
  authDomain: "to-do-app-10c3a.firebaseapp.com",
  projectId: "to-do-app-10c3a",
  storageBucket: "to-do-app-10c3a.firebasestorage.app",
  messagingSenderId: "615674344642",
  appId: "1:615674344642:web:d3d2b036c2a0bd2b63b75b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
