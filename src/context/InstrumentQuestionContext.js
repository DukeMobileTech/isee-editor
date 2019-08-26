import React, { useState, createContext } from "react";

export const InstrumentQuestionContext = createContext();

export const InstrumentQuestionProvider = props => {
  const [instrumentQuestions, setInstrumentQuestions] = useState([]);

  return (
    <InstrumentQuestionContext.Provider
      value={[instrumentQuestions, setInstrumentQuestions]}
    >
      {props.children}
    </InstrumentQuestionContext.Provider>
  );
};
