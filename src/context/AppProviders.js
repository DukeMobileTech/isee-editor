import React from "react";
import { UserProvider } from "./UserContext";
import { ProjectProvider } from "./ProjectContext";
import { ScoreTypeProvider } from "./ScoreTypeContext";
import { InstrumentSectionProvider } from "./InstrumentSectionContext";

function AppProviders({ children }) {
  return (
    <UserProvider>
      <ProjectProvider>
        <InstrumentSectionProvider>
          <ScoreTypeProvider>{children}</ScoreTypeProvider>
        </InstrumentSectionProvider>
      </ProjectProvider>
    </UserProvider>
  );
}

export default AppProviders;
