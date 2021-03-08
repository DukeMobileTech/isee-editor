import React, { createContext, useState } from "react";

export const OptionSetContext = createContext();

export const OptionSetProvider = (props) => {
  const [optionSets, setOptionSets] = useState([]);

  return (
    <OptionSetContext.Provider value={[optionSets, setOptionSets]}>
      {props.children}
    </OptionSetContext.Provider>
  );
};
