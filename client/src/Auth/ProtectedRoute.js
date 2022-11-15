import { Navigate } from "react-router-dom";
import React from "react";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Spin } from "antd";
import Header from "../Pages/Header";
import "./index.css";
const ProtectedRoute = ({ children }) => {
  const {
    authState: { authLoading, isAuthenticated },
  } = useContext(AuthContext);
  if (authLoading) {
    return (
      <div className="loading">
        <Spin />
      </div>
    );
  }
  console.log(isAuthenticated);
  return (
    <>
      {isAuthenticated ? (
        <>
          <Header />
          {children}
        </>
      ) : (
        <Navigate to="/login" />
      )}
    </>
  );
};

export default ProtectedRoute;
