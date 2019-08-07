import React from "react";
import { UserProvider } from "./UserContext";

function AppProviders({ children }) {
  return <UserProvider>{children}</UserProvider>;
}

export default AppProviders;
