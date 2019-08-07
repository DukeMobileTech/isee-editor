import React from "react";
import { withRouter } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { logout } from "../utils/API";

const Header = props => {
  const handleSignout = e => {
    e.preventDefault();
    logout().then(() => {
      props.history.push("/login");
    });
  };

  return (
    <Container>
      <Navbar sticky="top" bg="light" expand="lg">
        <Navbar.Brand>
          <a href="/">iSEE</a>
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text className="mr-1">
            {localStorage.getItem("userEmail") &&
              `Signed in as: ${localStorage.getItem("userEmail")}`}
          </Navbar.Text>
          <Button variant="danger" onClick={handleSignout}>
            Log out
          </Button>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
};

export default withRouter(Header);
