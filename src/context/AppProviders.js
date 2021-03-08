import React from "react";
import { InstructionProvider } from "./InstructionContext";
import { InstrumentQuestionProvider } from "./InstrumentQuestionContext";
import { InstrumentSectionProvider } from "./InstrumentSectionContext";
import { OptionProvider } from "./OptionContext";
import { OptionSetProvider } from "./OptionSetContext";
import { ProjectProvider } from "./ProjectContext";
import { QuestionSetProvider } from "./QuestionSetContext";

function AppProviders({ children }) {
  return (
    <ProjectProvider>
      <InstrumentSectionProvider>
        <QuestionSetProvider>
          <OptionProvider>
            <OptionSetProvider>
              <InstructionProvider>
                <InstrumentQuestionProvider>
                  {children}
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
