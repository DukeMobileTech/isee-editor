import React from "react";
import { UserProvider } from "./UserContext";
import { ProjectProvider } from "./ProjectContext";
import { ScoreTypeProvider } from "./ScoreTypeContext";
import { InstrumentSectionProvider } from "./InstrumentSectionContext";
import { QuestionSetProvider } from "./QuestionSetContext";
import { OptionSetProvider } from "./OptionSetContext";
import { InstructionProvider } from "./InstructionContext";

function AppProviders({ children }) {
  return (
    <UserProvider>
      <ProjectProvider>
        <InstrumentSectionProvider>
          <QuestionSetProvider>
            <OptionSetProvider>
              <InstructionProvider>
                <ScoreTypeProvider>{children}</ScoreTypeProvider>
              </InstructionProvider>
            </OptionSetProvider>
          </QuestionSetProvider>
        </InstrumentSectionProvider>
      </ProjectProvider>
    </UserProvider>
  );
}

export default AppProviders;
