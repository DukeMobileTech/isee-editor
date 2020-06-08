import AppFooter from "./components/AppFooter";
import { AppHeader } from "./components/Headers";
import { Layout } from "antd";
import Login from "./components/Login";
import { MainContent, CenteredH1 } from "./utils/Styles";
import React, { useContext } from "react";
import Router from "./components/Router";
import { ProjectContext } from "./context/ProjectContext";

const { Content } = Layout;

const AuthenticatedApp = () => {
  // eslint-disable-next-line no-unused-vars
  const [projects, currentProjectId, setCurrentProjectId] = useContext(
    ProjectContext
  );
  const project = projects.find(p => p.id === Number(currentProjectId));

  return (
    <Layout className="layout">
      <AppHeader />
      <Content style={{ padding: "0 50px" }}>
        {project && <CenteredH1>{project.name}</CenteredH1>}
        <MainContent>
          <Router />
        </MainContent>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export const App = () => {
  return sessionStorage.getItem("email") && sessionStorage.getItem("jwt") ? (
    <AuthenticatedApp />
  ) : (
    <Login />
  );
};
