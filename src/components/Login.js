import React from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

class Login extends React.Component {
  handleLogin = e => {
    e.preventDefault();
    const user = {
      email: this.email.value,
      password: this.password.value
    };
    localStorage.setItem("userEmail", user.email);
    axios.post("http://localhost:3000/api/v4/sessions", { user }).then(res => {
      localStorage.setItem(
        "authenticationToken",
        res.data.authentication_token
      );
      this.props.history.push("/");
    });
  };

  render() {
    return (
      <Container id="content">
        <h2 className="text-center">Sign in</h2>
        <Form onSubmit={this.handleLogin}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              ref={input => (this.email = input)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              ref={input => (this.password = input)}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    );
  }
}

export default Login;
