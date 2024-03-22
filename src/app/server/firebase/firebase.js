// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6HkrQk_14MOdTTmOqTdcpL1Zyj6hupHQ",
  authDomain: "ai-pandapal.firebaseapp.com",
  projectId: "ai-pandapal",
  storageBucket: "ai-pandapal.appspot.com",
  messagingSenderId: "250675140287",
  appId: "1:250675140287:web:ca1bdb08d6699c42fd580a",
  measurementId: "G-K3HPEVEK81",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
