import { Table } from "antd";
import React, { useContext } from "react";

import { Link } from "react-router-dom";
import { ProjectContext } from "../../context/ProjectContext";

const Projects = () => {
  // eslint-disable-next-line no-unused-vars
  const [projects, currentProject, setCurrentProject] = useContext(
    ProjectContext
  );

  return (
    <Table dataSource={projects} rowKey={project => project.id}>
      <Table.Column
        title="Name"
        dataIndex="name"
        render={(text, project) => (
          <Link to={`/projects/${project.id}`}>{project.name}</Link>
        )}
      />
      <Table.Column title="Description" dataIndex="description" />
    </Table>
  );
};

export default Projects;