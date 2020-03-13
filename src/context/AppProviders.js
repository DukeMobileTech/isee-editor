import { InstructionProvider } from "./InstructionContext";
import { InstrumentSectionProvider } from "./InstrumentSectionContext";
import { OptionSetProvider } from "./OptionSetContext";
import { ProjectProvider } from "./ProjectContext";
import { QuestionSetProvider } from "./QuestionSetContext";
import React from "react";
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
