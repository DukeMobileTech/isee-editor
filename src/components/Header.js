import React from "react";

import Navbar from "react-bootstrap/Navbar";

function Header() {
  return (
    <Navbar sticky="top" bg="light" expand="lg">
      <Navbar.Brand>
        <a href="/">iSEE</a>
      </Navbar.Brand>
    </Navbar>
  );
}

export default Header;
