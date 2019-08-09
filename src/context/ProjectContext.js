import React, { useState, createContext, useEffect } from "react";
import { getProjects } from "../utils/API";
import { useUser } from "./UserContext";

export const ProjectContext = createContext();

export const ProjectProvider = props => {
  const [projects, setProjects] = useState([]);
  const user = useUser();

  useEffect(() => {
    const fetchProjects = async () => {
      const results = await getProjects();
      setProjects(results.data);
    };
    if (user.email && user.token) {
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProjectContext.Provider value={projects}>
      {props.children}
    </ProjectContext.Provider>
  );
};
