import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { 
    getFirestore, 
    doc, 
    setDoc,
    getDoc,
    collection,
    getDocs,
    query
} from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js';
import { 
    getAuth, 
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyAYV-Q-poTRxX3bXu1FSXZNudjawrz2cFg",
    authDomain: "formbuilder-a2ebf.firebaseapp.com",
    projectId: "formbuilder-a2ebf",
    storageBucket: "formbuilder-a2ebf.appspot.com",
    messagingSenderId: "492963659710",
    appId: "1:492963659710:web:d5ac053fc6a79ebcb1c3ef",
    measurementId: "G-G005G3ZJ0M"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

auth.settings.appVerificationDisabledForTesting = false;
auth.useDeviceLanguage();

export { 
    db, 
    auth, 
    GoogleAuthProvider, 
    signInWithPopup,
    onAuthStateChanged,
    doc,
    setDoc,
    getDoc,
    collection,
    getDocs,
    query
};