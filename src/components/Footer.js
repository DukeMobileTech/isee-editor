import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

function Footer() {
  return (
    <Container>
      <Navbar sticky="bottom" bg="light" expand="lg">
        <Container>
          <Nav className="m-auto">
            <Nav.Link href="">Privacy</Nav.Link>
            <Nav.Link href="">About</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </Container>
  );
}

export default Footer;
