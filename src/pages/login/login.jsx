import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { loginUser, setUser } from "../../redux/slices/auth";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import userMale from "../../images/userMale.png";
import "./login.css";

import { getStorage, ref, getDownloadURL } from "firebase/storage";
import googleImage from "../../images/google.png";
// import phoneImage from "../../images/phone.png";
import { addNewUserToFirestore } from "../../services/userServices";
// import { Link } from "react-router-dom";

// import {
//   addNewUserToFirestore,
//   signOutAndUpdateStatus,
// } from "../services/userServices";

const Login = () => {
  const dispatch = useDispatch();

  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      signInWithPopup(auth, provider)
        .then(async ({ user }) => {
          const userData = {
            name: user.displayName,
            email: user.email,
            googleId: user.uid,
          };

          addNewUserToFirestore(userData, dispatch, true, true, true);

          //   await signOutAndUpdateStatus(user.uid, true);

          const storage = getStorage();
          const storageRef = ref(
            storage,
            `user_photos/${user.uid}/user-photo.jpg`
          );

          getDownloadURL(storageRef)
            .then((downloadURL) => {
              const photo = downloadURL || userMale;
              console.log(downloadURL);

              dispatch(
                setUser({
                  email: user.email,
                  id: user.uid,
                  token: user.accessToken,
                  name: user.displayName,
                  photo: photo,
                })
              );

              setError(null);
              window.localStorage.setItem("userId", 1);
              dispatch(
                loginUser({ username: "username", password: "password" })
              );
            })
            .catch((error) => {
              if (error.code === "storage/object-not-found") {
                const photo = userMale;
                dispatch(
                  setUser({
                    email: user.email,
                    id: user.uid,
                    token: user.accessToken,
                    name: user.displayName,
                    photo: photo,
                  })
                );
                setError(null);
                console.log("setted");
                window.localStorage.setItem("userId", 1);
                dispatch(
                  loginUser({ username: "username", password: "password" })
                );
              } else {
                console.error(
                  "Error fetching user's photo from Firebase storage:",
                  error
                );
              }
            });
        })
        .catch((error) => {
          console.error("Google Sign-In error:", error);
        });
    } catch (error) {
      console.error("Google Sign-In error:", error);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  return (
    <div className="login-register">
      <div className={"login-container"}>
        <h2>Sign in</h2>
        <form className="login-form" action="#" onSubmit={submitHandler}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group googleLogin">
            <button className="google" onClick={handleGoogleSignIn}>
              Login with Google
              <img src={googleImage} alt="Google" />
            </button>
            {/* <Link to="/loginWithPhone">
              <button className="phone">
                Login with Phone
                <img src={phoneImage} alt="Google" />
              </button>
            </Link> */}
          </div>

          <div className="form-group"></div>
        </form>
      </div>
    </div>
  );
};

export default Login;
