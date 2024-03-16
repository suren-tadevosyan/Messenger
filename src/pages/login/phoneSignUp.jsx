import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  addNewUserToFirestorePhone,
  setUpRecaptha,
} from "../../services/userServices";
import { Form } from "react-bootstrap";
import "./phone.css";

import { useDispatch } from "react-redux";
import { loginUser, setUser } from "../../redux/slices/auth";

const PhoneSignUp = () => {
  const [error, setError] = useState("");
  const [number, setNumber] = useState("");
  const [flag, setFlag] = useState(false);
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getOtp = async (e) => {
    e.preventDefault();
    console.log(number);

    setError("");
    if (number === "" || number === undefined)
      return setError("Please enter a valid phone number!");
    try {
      const response = await setUpRecaptha(number, dispatch);
      setResult(response);
      setFlag(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (otp === "" || otp === null) return;
    try {
      const userCredential = await result.confirm(otp);
      const user = userCredential.user;


      const userData = {
        name: number,
        phone: user.phoneNumber,
        id: user.uid,
      };
      await addNewUserToFirestorePhone(userData, dispatch);
      dispatch(setUser(userData));
      dispatch(loginUser({ username: "username", password: "password" }));

      window.localStorage.setItem("userId", 1);

      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="login-register">
        <div className="phoneAuth">
          <h2 className="phoneH1">Firebase Phone Auth</h2>

          <form
            onSubmit={getOtp}
            style={{ display: !flag ? "flex" : "none" }}
            className="sendOtp"
          >
            <div className="numberInp">
              <PhoneInput
                defaultCountry="AM"
                value={number}
                onChange={setNumber}
                placeholder="Enter Phone Number"
              />
              {error && <div style={{ color: "red" }}>{error}</div>}
              <div id="recaptcha-container" />
            </div>
            <div>
              <Link to="/">
                <Button variant="secondary">Cancel</Button>
              </Link>
              &nbsp;
              <Button type="submit" variant="primary">
                Send Otp
              </Button>
            </div>
          </form>

          <Form
            onSubmit={verifyOtp}
            style={{ display: flag ? "flex" : "none" }}
            className="sendOtp"
          >
            <Form.Group className="verify" controlId="formBasicOtp">
              <Form.Control
                type="otp"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
              />
            </Form.Group>
            <div className="button-right">
              <Link to="/">
                <Button variant="secondary">Cancel</Button>
              </Link>
              &nbsp;
              <Button type="submit" variant="primary">
                Verify
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default PhoneSignUp;
