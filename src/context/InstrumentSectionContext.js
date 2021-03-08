import React, { createContext, useState } from "react";

export const InstrumentSectionContext = createContext();

export const InstrumentSectionProvider = (props) => {
  const [sections, setSections] = useState([]);

  return (
    <InstrumentSectionContext.Provider value={[sections, setSections]}>
      {props.children}
    </InstrumentSectionContext.Provider>
  );
};
