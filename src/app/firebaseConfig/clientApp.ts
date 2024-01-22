// Import the functions you need from the SDKs you need
import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCh5Eh6K_2FuBinkAwuxW4rIZAkAWkAeLY",
  authDomain: "wahid-fit-ai.firebaseapp.com",
  projectId: "wahid-fit-ai",
  storageBucket: "wahid-fit-ai.appspot.com",
  messagingSenderId: "1025761003701",
  appId: "1:1025761003701:web:98154618d5c33ff3dc96fc",
  measurementId: "G-DK5NH7KV4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
