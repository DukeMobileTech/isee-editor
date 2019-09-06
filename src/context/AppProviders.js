import React from "react";
import { UserProvider } from "./UserContext";
import { ProjectProvider } from "./ProjectContext";
import { ScoreTypeProvider } from "./ScoreTypeContext";

function AppProviders({ children }) {
  return (
    <UserProvider>
      <ProjectProvider>
        <ScoreTypeProvider>{children}</ScoreTypeProvider>
      </ProjectProvider>
    </UserProvider>
  );
}

export default AppProviders;
