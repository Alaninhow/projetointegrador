// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDorgEMS377QYGtOI37IxFEeUvyshThiVI",
  authDomain: "recanto-davet.firebaseapp.com",
  databaseURL: "https://recanto-davet-default-rtdb.firebaseio.com",
  projectId: "recanto-davet",
  storageBucket: "recanto-davet.firebasestorage.app",
  messagingSenderId: "235509008499",
  appId: "1:235509008499:web:a6bb458cf251be9adc0206"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Configure emulators for development (optional)
if (__DEV__) {
  try {
    // Uncomment these lines if you want to use Firebase emulators
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // connectFunctionsEmulator(functions, 'localhost', 5001);
    // connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    console.log('Emulators already connected or not available');
  }
}
