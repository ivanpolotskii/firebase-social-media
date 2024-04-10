// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDW1umVnf4yFUWNB43sWGw82VGIerIZBzk",
  authDomain: "react-social-b7eed.firebaseapp.com",
  projectId: "react-social-b7eed",
  storageBucket: "react-social-b7eed.appspot.com",
  messagingSenderId: "916707846897",
  appId: "1:916707846897:web:fdd6188c3e4ebbe5fd9750"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);