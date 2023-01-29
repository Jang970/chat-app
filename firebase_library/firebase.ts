import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBupiwoLTjWvGboVOlQx6hS-O_cA2LRgLc",
  authDomain: "chat-app-c9432.firebaseapp.com",
  projectId: "chat-app-c9432",
  storageBucket: "chat-app-c9432.appspot.com",
  messagingSenderId: "808893925116",
  appId: "1:808893925116:web:58f9b4670c39e7890db979",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export const auth = firebase.auth();
export const db = firebase.firestore();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
