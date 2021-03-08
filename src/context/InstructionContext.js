import React, { createContext, useState } from "react";

export const InstructionContext = createContext();

export const InstructionProvider = (props) => {
  const [instructions, setInstructions] = useState([]);

  return (
    <InstructionContext.Provider value={[instructions, setInstructions]}>
      {props.children}
    </InstructionContext.Provider>
  );
};
