import React from "react";

const UserContext = React.createContext();

function UserProvider(props) {
  const user = {
    email: localStorage.getItem("userEmail"),
    token: localStorage.getItem("authenticationToken")
  };

  return <UserContext.Provider value={user} {...props} />;
}

function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`);
  }
  return context;
}

export { UserProvider, useUser };
