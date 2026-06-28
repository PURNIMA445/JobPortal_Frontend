// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcDu0g-Qgb-IcDWT-P9w0_iWUEyGEnlwA",
  authDomain: "smart-job-portal-746bb.firebaseapp.com",
  projectId: "smart-job-portal-746bb",
  storageBucket: "smart-job-portal-746bb.firebasestorage.app",
  messagingSenderId: "497288656479",
  appId: "1:497288656479:web:e268c6fb33c36236848dea"
};

// 1. Initialize Firebase safely (prevents Next.js crash)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. Set up Auth and Providers
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

const githubProvider = new GithubAuthProvider();

// 3. EXPORT them so components can find them!
export { auth, googleProvider, githubProvider };