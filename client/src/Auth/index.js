import React from "react";
import { Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import { Spin } from "antd";
import "./index.css";
const Auth = () => {
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
  return <>{isAuthenticated ? <Navigate to="/" /> : <Login />}</>;
};

export default Auth;
