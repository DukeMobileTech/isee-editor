import React, { useContext } from "react";
import { Button, Divider, Layout, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components";

import { CenteredH2 } from "../utils/Styles";
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
            <UserOutlined />
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
            <a
              href={`${process.env.REACT_APP_BASE_URL}/admin`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Admin
            </a>
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

export const InstrumentHeader = ({ instrument }) => {
  return <CenteredH2>{instrument && instrument.title}</CenteredH2>;
};
