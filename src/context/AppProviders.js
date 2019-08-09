import React from "react";
import { UserProvider } from "./UserContext";
import { ProjectProvider } from "./ProjectContext";
import { LanguageProvider } from "./LanguageContext";

function AppProviders({ children }) {
  return (
    <UserProvider>
      <ProjectProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </ProjectProvider>
    </UserProvider>
  );
}

export default AppProviders;
