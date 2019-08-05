import React from "react";
import { UserProvider } from "./UserContext";

function AppProviders({ children }) {
  console.log("rendering in app providers");
  return <UserProvider>{children}</UserProvider>;
}

export default AppProviders;
