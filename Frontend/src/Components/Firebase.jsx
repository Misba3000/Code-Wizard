// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiTRhps9mcfwqh5136ViCMEzV49fUh778",
  authDomain: "wizard-bdcc2.firebaseapp.com",
  projectId: "wizard-bdcc2",
  storageBucket: "wizard-bdcc2.firebasestorage.app",
  messagingSenderId: "449790501594",
  appId: "1:449790501594:web:cc8bfce3f5c6b11a3ffbe3",
  measurementId: "G-SJJ11GVZHH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app); 
export default app;