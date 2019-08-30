import React, { createContext } from "react";

export const QuestionTypeContext = createContext();

export const QuestionTypeProvider = props => {
  const question_types = [
    "FREE_RESPONSE",
    "SELECT_ONE",
    "SELECT_ONE_WRITE_OTHER",
    "SELECT_MULTIPLE",
    "SELECT_MULTIPLE_WRITE_OTHER",
    "DROP_DOWN",
    "SLIDER",
    "LABELED_SLIDER",
    "INSTRUCTIONS",
    "GEO_LOCATION",
    "DATE",
    "TIME",
    "MONTH_AND_YEAR",
    "YEAR",
    "RATING",
    "LIST_OF_TEXT_BOXES",
    "LIST_OF_INTEGER_BOXES",
    "INTEGER",
    "DECIMAL_NUMBER",
    "RANGE",
    "PHONE_NUMBER",
    "ADDRESS",
    "EMAIL_ADDRESS"
  ];

  return (
    <QuestionTypeContext.Provider value={question_types}>
      {props.children}
    </QuestionTypeContext.Provider>
  );
};
