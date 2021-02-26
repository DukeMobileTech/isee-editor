import React from "react";

import Login from "./components/Login";
import AuthenticatedApp from "./components/AuthenticatedApp";

export const App = () => {
  return sessionStorage.getItem("email") && sessionStorage.getItem("jwt") ? (
    <AuthenticatedApp />
  ) : (
    <Login />
  );
};
