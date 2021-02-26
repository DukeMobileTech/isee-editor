import { Spin, Table } from "antd";
import React, { useEffect } from "react";

import { Link } from "react-router-dom";
import { CenteredH4 } from "../../utils/Styles";

import { connect } from "react-redux";
import { loadProjects } from "../../redux/actions/projects";

const Projects = ({ isLoading, projects, loadProjects, error }) => {
  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Spin spinning={isLoading}>
      <CenteredH4>Projects</CenteredH4>
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
    </Spin>
  );
};

const mapStateToProps = ({ isLoading, projects, error }) => ({
  isLoading,
  projects,
  error
});

const mapDispatchToProps = dispatch => ({
  loadProjects: () => dispatch(loadProjects())
});

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
