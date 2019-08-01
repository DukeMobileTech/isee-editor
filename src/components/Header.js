import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

function Header() {
  return (
    <Container>
      <Navbar sticky="top" bg="light" expand="lg">
        <Navbar.Brand>
          <a href="/">iSEE</a>
        </Navbar.Brand>
      </Navbar>
    </Container>
  );
}

export default Header;
