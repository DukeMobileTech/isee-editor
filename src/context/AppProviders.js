import React from "react";
import { UserProvider } from "./UserContext";
import { ProjectProvider } from "./ProjectContext";
import { LanguageProvider } from "./LanguageContext";
import { ScoreTypeProvider } from "./ScoreTypeContext";
import { InstrumentQuestionProvider } from "./InstrumentQuestionContext";

function AppProviders({ children }) {
  return (
    <UserProvider>
      <ProjectProvider>
        <InstrumentQuestionProvider>
          <LanguageProvider>
            <ScoreTypeProvider>{children}</ScoreTypeProvider>
          </LanguageProvider>
        </InstrumentQuestionProvider>
      </ProjectProvider>
    </UserProvider>
  );
}

export default AppProviders;
