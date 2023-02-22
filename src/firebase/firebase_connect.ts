import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PORJECTID,
  storageBucket: "narynotes-b54b3.appspot.com",
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENTID
};

// Initialize Firebase
const Fapp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(Fapp);
const storage = getStorage(Fapp);
export default storage;