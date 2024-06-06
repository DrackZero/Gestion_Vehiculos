import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js';
import { getFirestore, collection, addDoc, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL,listAll } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyBbXy23qymFiz0WmBplgIJnAFjH3-KONCg",
  authDomain: "gestion-flota-vehicular.firebaseapp.com",
  databaseURL: "https://gestion-flota-vehicular-default-rtdb.firebaseio.com",
  projectId: "gestion-flota-vehicular",
  storageBucket: "gestion-flota-vehicular.appspot.com",
  messagingSenderId: "627217609320",
  appId: "1:627217609320:web:2aa43299d7742a202181dd",
  measurementId: "G-QP77C1200N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage,
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signOut,
   onAuthStateChanged,
   collection,
   addDoc,
   doc,
   setDoc,
   getDocs,
   getDoc,
   updateDoc,
   deleteDoc,
   ref,
   uploadBytes,
   getDownloadURL,
   listAll };
