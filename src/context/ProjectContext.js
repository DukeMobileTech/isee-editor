import React, { createContext, useState } from "react";

export const ProjectContext = createContext();

export const ProjectProvider = props => {
  const [currentProjectId, setCurrentProjectId] = useState(
    sessionStorage.getItem("projectId")
  );

  return (
    <ProjectContext.Provider value={[currentProjectId, setCurrentProjectId]}>
      {props.children}
    </ProjectContext.Provider>
  );
};
