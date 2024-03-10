import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ProtectedRoute } from "./protected";
import Login from "../pages/login/login";
import Home from "../pages/home/home";

import AuthorPage from "../pages/authorPage/authorPage";
import PhoneSignUp from "../pages/login/phoneSignUp";

const AppRoutes = () => {
  const { isLoggedIn } = useSelector((state) => state.user);

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/loginWithPhone"
          element={isLoggedIn ? <Navigate to="/home" /> : <PhoneSignUp />}
        />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/*" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/authorPage" element={<AuthorPage />} />

          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
