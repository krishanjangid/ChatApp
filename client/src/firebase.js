// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlOe6heb3fFKtuNGZc_fYWIuiqQ3vTnFQ",
  authDomain: "live-chat-20e8b.firebaseapp.com",
  projectId: "live-chat-20e8b",
  storageBucket: "live-chat-20e8b.appspot.com",
  messagingSenderId: "238105661492",
  appId: "1:238105661492:web:b3fea1e139eb410962fa61",
  measurementId: "G-79EL0LH1HE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
