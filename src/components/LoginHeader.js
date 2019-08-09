import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const LoginHeader = () => {
  return (
    <Container>
      <Navbar sticky="top" bg="light" expand="lg">
        <Navbar.Brand>
          <a href="/">iSEE</a>
        </Navbar.Brand>
      </Navbar>
    </Container>
  );
};

export default LoginHeader;
