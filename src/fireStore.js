import { getFirestore } from "firebase/firestore";
import app from "./firebase.js";

const firestore = getFirestore(app);

export default firestore;
