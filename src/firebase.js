import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAazkxHSh5fjNrQE9LzGghBZwYZcFviTBU",
  authDomain: "sfl-crm.firebaseapp.com",
  projectId: "sfl-crm",
  storageBucket: "sfl-crm.appspot.com",
  messagingSenderId: "765849402237",
  appId: "1:765849402237:web:96b7616e9a77916b04ea14",
  measurementId: "G-L0STWG1NBT"
};
firebase.initializeApp(firebaseConfig);

export default firebase;
