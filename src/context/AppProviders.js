import React from "react";
import { ProjectProvider } from "./ProjectContext";
import { ScoreTypeProvider } from "./ScoreTypeContext";
import { InstrumentSectionProvider } from "./InstrumentSectionContext";
import { QuestionSetProvider } from "./QuestionSetContext";
import { OptionSetProvider } from "./OptionSetContext";
import { InstructionProvider } from "./InstructionContext";

function AppProviders({ children }) {
  return (
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
  );
}

export default AppProviders;
