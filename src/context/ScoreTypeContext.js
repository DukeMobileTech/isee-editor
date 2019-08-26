import React, { createContext } from "react";

export const ScoreTypeContext = createContext();

export const ScoreTypeProvider = props => {
  const types = [
    "MATCH",
    "BANK",
    "SUM",
    "INDEX",
    "LOOKUP",
    "SEARCH",
    "GROUP-AVERAGE",
    "CALCULATION",
    "ROSTER"
  ];

  return (
    <ScoreTypeContext.Provider value={types}>
      {props.children}
    </ScoreTypeContext.Provider>
  );
};
