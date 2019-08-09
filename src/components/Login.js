import React from "react";
import { login } from "../utils/API";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import LoginHeader from "./LoginHeader";
import Footer from "./Footer";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
});

const Login = () => {
  return (
    <Formik
      initialValues={{
        email: "",
        password: ""
      }}
      validationSchema={LoginSchema}
      onSubmit={(values, { resetForm }) => {
        const credentials = {
          email: values.email,
          password: values.password
        };
        login(credentials)
          .then(response => {})
          .catch(error => {
            resetForm();
          });
      }}
      render={() => (
        <Form>
          <LoginHeader />
          <Container id="content">
            <h2 className="text-center">Sign in</h2>
            <Row className="form-group">
              <Col sm="2">
                <label htmlFor="email">Email address</label>
              </Col>
              <Col sm="7">
                <Field
                  className="form-control"
                  name="email"
                  placeholder="Enter email"
                  type="email"
                />
              </Col>
              <Col sm="3">
                <ErrorMessage
                  name="email"
                  render={msg => <Alert variant="danger">{msg}</Alert>}
                />
              </Col>
            </Row>
            <Row className="form-group">
              <Col sm="2">
                <label htmlFor="password">Password</label>
              </Col>
              <Col sm="7">
                <Field
                  className="form-control"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                />
              </Col>
              <Col sm="3">
                <ErrorMessage
                  name="password"
                  render={msg => <Alert variant="danger">{msg}</Alert>}
                />
              </Col>
            </Row>
            <div className="text-center">
              <Button className="btn btn-primary" type="submit">
                Save
              </Button>
            </div>
          </Container>
          <Footer />
        </Form>
      )}
    />
  );
};

export default Login;
