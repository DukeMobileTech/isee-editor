import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

const Header = props => {
  const handleSignout = e => {
    e.preventDefault();
    const token = localStorage.getItem("authenticationToken");
    axios
      .delete(
        `http://localhost:3000/api/v4/sessions?authentication_token=${token}`
      )
      .then(res => {
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("authenticationToken");
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
