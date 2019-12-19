import { InstructionProvider } from "./InstructionContext";
import { InstrumentSectionProvider } from "./InstrumentSectionContext";
import { OptionSetProvider } from "./OptionSetContext";
import { ProjectProvider } from "./ProjectContext";
import { QuestionSetProvider } from "./QuestionSetContext";
import React from "react";
import { ScoreTypeProvider } from "./ScoreTypeContext";
import { InstrumentQuestionProvider } from "./InstrumentQuestionContext";
import { OptionProvider } from "./OptionContext";

function AppProviders({ children }) {
  return (
    <ProjectProvider>
      <InstrumentSectionProvider>
        <QuestionSetProvider>
          <OptionProvider>
            <OptionSetProvider>
              <InstructionProvider>
                <InstrumentQuestionProvider>
                  <ScoreTypeProvider>{children}</ScoreTypeProvider>
                </InstrumentQuestionProvider>
              </InstructionProvider>
            </OptionSetProvider>
          </OptionProvider>
        </QuestionSetProvider>
      </InstrumentSectionProvider>
    </ProjectProvider>
  );
}

export default AppProviders;
