import React from "react";
import AuthenticatedApp from "./components/AuthenticatedApp";
import Login from "./components/Login";

export const App = () => {
  return sessionStorage.getItem("email") && sessionStorage.getItem("jwt") ? (
    <AuthenticatedApp />
  ) : (
    <Login />
  );
};
