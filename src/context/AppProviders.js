import React from "react";
import { UserProvider } from "./UserContext";
import { ProjectProvider } from "./ProjectContext";
import { LanguageProvider } from "./LanguageContext";
import { ScoreTypeProvider } from "./ScoreTypeContext";

function AppProviders({ children }) {
  return (
    <UserProvider>
      <ProjectProvider>
        <LanguageProvider>
          <ScoreTypeProvider>{children}</ScoreTypeProvider>
        </LanguageProvider>
      </ProjectProvider>
    </UserProvider>
  );
}

export default AppProviders;
