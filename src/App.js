import React from "react";
import { Layout } from "antd";

import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import Router from "./components/Router";
import Login from "./components/Login";
import { MainContent } from "./utils/Styles";

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
