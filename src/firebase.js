import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBj1IXmx10GVYkrORZ-MqBeco-1DkkgKFg",
  authDomain: "messenger-8c39c.firebaseapp.com",
  projectId: "messenger-8c39c",
  storageBucket: "messenger-8c39c.appspot.com",
  messagingSenderId: "691113172022",
  appId: "1:691113172022:web:37e2e0ddb27ff8efef8c97",
};

const app = initializeApp(firebaseConfig);

export default app;

const auth = getAuth(app);

export { auth };
