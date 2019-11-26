import { InstructionProvider } from "./InstructionContext";
import { InstrumentSectionProvider } from "./InstrumentSectionContext";
import { OptionSetProvider } from "./OptionSetContext";
import { ProjectProvider } from "./ProjectContext";
import { QuestionSetProvider } from "./QuestionSetContext";
import React from "react";
import { ScoreTypeProvider } from "./ScoreTypeContext";

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
