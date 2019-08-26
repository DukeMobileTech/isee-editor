import React from "react";
import { Layout, Menu, Divider, Button, Icon } from "antd";
import styled from "styled-components";

import { logout } from "../utils/API";

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
    logout().then(() => {
      window.location.reload();
    });
  };

  return (
    <Header>
      <Logo>iSEE</Logo>
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        style={{ lineHeight: "64px" }}
      >
        <Menu.Item key="1">
          <a href="/">Home</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a href="/banks">Banks</a>
        </Menu.Item>
        <Menu.Item key="3" style={{ float: "right" }}>
          {localStorage.getItem("userEmail") &&
            localStorage.getItem("authenticationToken") && (
              <span>
                <Icon type="user" />
                {localStorage.getItem("userEmail")}
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
