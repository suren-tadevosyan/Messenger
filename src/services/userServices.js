import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import firestore from "../fireStore";
import { auth } from "../firebase.js";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
export const addNewUserToFirestore = async (
  formData,
  dispatch,
  setErrorMessage,
  setErrorModalVisible
) => {
  try {
    console.log(formData);

    const userRef = collection(firestore, "users");
    const querySnapshot = await getDocs(
      query(userRef, where("email", "==", formData.email))
    );

    if (!querySnapshot.empty) {
    } else {
      const userData = {
        email: formData.email,
        name: formData.name,
        userId: formData.googleId,
        isActive: true,
      };

      await addDoc(userRef, userData);
      console.log("New user created successfully");
    }
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      const message = "User with this email already exists";
      setErrorMessage(message);
      setErrorModalVisible(true);
      console.log("User with this email already exists");
    } else {
      console.error("Error creating user:", error.message);
    }
  }
};

export const getAllUsers = async () => {
  const userRef = collection(firestore, "users");
  const allUsersQuery = query(userRef);

  const querySnapshot = await getDocs(allUsersQuery);

  const allUsers = [];
  querySnapshot.forEach((doc) => {
    allUsers.push(doc.data());
  });

  return allUsers;
};
export function setUpRecaptha(number) {
  console.log(auth);
  const recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {}
  );
  recaptchaVerifier.render();
  return new Promise((resolve, reject) => {
    signInWithPhoneNumber(auth, number, recaptchaVerifier)
      .then((confirmationResult) => {
        console.log(confirmationResult);
        resolve(confirmationResult);
      })
      .catch((error) => {
        console.error("Error signing in with phone number:", error.message);
        reject(error);
      });
  });
}
