// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD10Kn-__gyfrxJS3ljq9yMyPPaMIiu5ko',
  authDomain: 'my-project-patchamomma.firebaseapp.com',
  projectId: 'my-project-patchamomma',
  storageBucket:'my-project-patchamomma.firebasestorage.app',
  messagingSenderId: '518421407309',
  appId: '1:518421407309:web:ad79d656c63ef05b49de04',
  measurementId: 'G-9BTVR36491',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
import { getAuth } from 'firebase/auth';
export const auth = getAuth(app);

export default app;