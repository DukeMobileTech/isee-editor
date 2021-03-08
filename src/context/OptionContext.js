import React, { createContext, useState } from "react";

export const OptionContext = createContext();

export const OptionProvider = (props) => {
  const [options, setOptions] = useState([]);

  return (
    <OptionContext.Provider value={[options, setOptions]}>
      {props.children}
    </OptionContext.Provider>
  );
};
