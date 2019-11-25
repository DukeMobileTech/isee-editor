import React from "react";
import { Layout, Menu, Divider, Button, Icon } from "antd";
import styled from "styled-components";

const { Header } = Layout;

const Logo = styled.div`
  width: 120px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  margin: 10px;
  float: left;
  text-align: center;
`;

const AppHeader = () => {
  const handleSignout = e => {
    e.preventDefault();
    sessionStorage.clear();
    window.location = "/";
  };

  return (
    <Header>
      <Logo>iSEE</Logo>
      <Menu theme="light" mode="horizontal" style={{ lineHeight: "64px" }}>
        <Menu.Item key="1">
          <a href="/banks">Banks</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a href="/">Instruments</a>
        </Menu.Item>
        <Menu.Item key="3">
          <a href="/surveys">Responses</a>
        </Menu.Item>
        <Menu.Item key="4" style={{ float: "right" }}>
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
      </Menu>
    </Header>
  );
};

export default AppHeader;
