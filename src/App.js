import React from "react";
import AppRoutes from "./components/AppRoutes";
import { useUser } from "./context/UserContext";
import Login from "./components/Login";

function App() {
  const user = useUser();

  return user.email && user.token ? <AppRoutes /> : <Login />;
}

export default App;
