import React, { createContext, useEffect, useState } from "react";

import { getProjects } from "../utils/api/project";

export const ProjectContext = createContext();

export const ProjectProvider = props => {
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(
    sessionStorage.getItem("projectId")
  );

  useEffect(() => {
    const fetchProjects = async () => {
      const results = await getProjects();
      setProjects(results.data);
    };
    if (sessionStorage.getItem("email") && sessionStorage.getItem("jwt")) {
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProjectContext.Provider
      value={[projects, currentProjectId, setCurrentProjectId]}
    >
      {props.children}
    </ProjectContext.Provider>
  );
};
