import React, { useContext } from "react";
import { Layout } from "antd";
import { connect } from "react-redux";

import { AppHeader } from "./Headers";
import Router from "./Router";
import AppFooter from "./AppFooter";
import { CenteredH1, MainContent } from "../utils/Styles";
import { ProjectContext } from "../context/ProjectContext";

const AuthenticatedApp = ({ projects }) => {
  // eslint-disable-next-line no-unused-vars
  const [currentProjectId, setCurrentProjectId] = useContext(ProjectContext);
  const project = projects.find(p => p.id === Number(currentProjectId));

  return (
    <Layout className="layout">
      <AppHeader />
      <Layout.Content style={{ padding: "0 50px" }}>
        {project && <CenteredH1>{project.name}</CenteredH1>}
        <MainContent>
          <Router />
        </MainContent>
      </Layout.Content>
      <AppFooter />
    </Layout>
  );
};

const mapStateToProps = ({ projects }) => ({
  projects
});

export default connect(mapStateToProps, null)(AuthenticatedApp);
