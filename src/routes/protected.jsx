import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";


export const ProtectedRoute = () => {
  const { isLoggedIn } = useSelector(({ user }) => user);

  if (!isLoggedIn) {
    console.log("here");
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
