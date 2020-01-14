import { Button, Divider, Icon, Layout, Menu } from "antd";

import React, { useContext } from "react";
import styled from "styled-components";
import { CenteredH1, CenteredH2 } from "../utils/Styles";
import { ProjectContext } from "../context/ProjectContext";

const Logo = styled.div`
  width: 120px;
  height: 50px;
  margin: 10px;
  float: left;
  text-align: center;
  font-weight: bold;
  font-size: 30px;
`;

const header = {
  lineHeight: "64px",
  textAlign: "center",
  fontWeight: "bold"
};

export const AppHeader = props => {
  // eslint-disable-next-line no-unused-vars
  const [projects, currentProjectId, setCurrentProjectId] = useContext(
    ProjectContext
  );

  const handleSignout = e => {
    e.preventDefault();
    sessionStorage.clear();
    window.location = "/";
  };

  const handleClick = e => {
    e.preventDefault();
    window.location = "/";
  };

  const UserMenuItem = props => {
    return (
      <Menu.Item
        key="4"
        style={{ float: "right", marginRight: "10px" }}
        {...props}
      >
        {sessionStorage.getItem("email") && sessionStorage.getItem("jwt") && (
          <span>
            <Icon type="user" />
            {sessionStorage.getItem("email")}
            <Divider type="vertical" />
            <Button type="danger" onClick={handleSignout}>
              Log out
            </Button>
          </span>
        )}
      </Menu.Item>
    );
  };

  return (
    <Layout.Header>
      <Logo onClick={handleClick}>iSEE</Logo>
      {currentProjectId && (
        <Menu theme="light" mode="horizontal" style={header}>
          <Menu.Item key="1">
            <a href="/banks">Banks</a>
          </Menu.Item>
          <Menu.Item key="2">
            <a href={`/projects/${currentProjectId}`}>Instruments</a>
          </Menu.Item>
          <Menu.Item key="3">
            <a href="/surveys">Responses</a>
          </Menu.Item>
          <UserMenuItem {...props} />
        </Menu>
      )}
      {!currentProjectId && (
        <Menu theme="light" mode="horizontal" style={header}>
          <UserMenuItem {...props} />
        </Menu>
      )}
    </Layout.Header>
  );
};

export const ProjectHeader = ({ project }) => {
  return <CenteredH1>{project && project.name}</CenteredH1>;
};

export const InstrumentHeader = ({ instrument }) => {
  return <CenteredH2>{instrument && instrument.title}</CenteredH2>;
};