import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ProtectedRoute } from "./protected";
import Login from "../pages/login/login";
import Home from "../pages/home/home";
import Header from "../pages/header/header";
import AuthorPage from "../pages/authorPage/authorPage";

const AppRoutes = () => {
  const { isLoggedIn } = useSelector((state) => state.user);
  console.log(isLoggedIn);
  return (
    <>
      
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
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
