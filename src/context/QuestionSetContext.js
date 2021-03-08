import React, { createContext, useState } from "react";

export const QuestionSetContext = createContext();

export const QuestionSetProvider = (props) => {
  const [questionSets, setQuestionSets] = useState([]);

  return (
    <QuestionSetContext.Provider value={[questionSets, setQuestionSets]}>
      {props.children}
    </QuestionSetContext.Provider>
  );
};
