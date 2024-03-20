import React from "react";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  
    const token = localStorage.getItem("token");

    const isAuthenticated = token ? true : false;
  
    return isAuthenticated ? ( <Outlet />) : (<Navigate to="/login"/>);

  };

export default ProtectedRoutes;