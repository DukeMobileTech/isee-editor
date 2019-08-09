import React, { createContext } from "react";

export const LanguageContext = createContext();

export const LanguageProvider = props => {
  const languages = [
    { name: "English", code: "en" },
    { name: "Amharic", code: "am" },
    { name: "Arabic", code: "ar" },
    { name: "Khmer", code: "km" },
    { name: "Spanish", code: "es" },
    { name: "Swahili", code: "sw" },
    { name: "Telugu", code: "te" },
    { name: "Chinese", code: "zh" }
  ];

  return (
    <LanguageContext.Provider value={languages}>
      {props.children}
    </LanguageContext.Provider>
  );
};
