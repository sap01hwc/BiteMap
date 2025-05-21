import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  GoogleAuthProvider,
  OAuthProvider
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAflIN4ByDNGgYvg6Xf143xKQGjnS6vmjA",
  authDomain: "bitemap-5e914.firebaseapp.com",
  projectId: "bitemap-5e914",
  storageBucket: "bitemap-5e914.appspot.com",
  messagingSenderId: "672796711368",
  appId: "1:672796711368:web:21d860e4b6781d3eac88fd",
  measurementId: "G-BP95K6KRJZ"
};

const app = initializeApp(firebaseConfig);

// ✅ Don't export until initialized
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { app, auth, db, googleProvider, appleProvider };

console.log('✅ Firebase initialized with persistent auth');