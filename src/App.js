import AppFooter from "./components/AppFooter";
import { AppHeader } from "./components/Headers";
import { Layout } from "antd";
import Login from "./components/Login";
import { MainContent } from "./utils/Styles";
import React from "react";
import Router from "./components/Router";

const { Content } = Layout;

const AuthenticatedApp = () => {
  return (
    <Layout className="layout">
      <AppHeader />
      <Content style={{ padding: "0 50px" }}>
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
