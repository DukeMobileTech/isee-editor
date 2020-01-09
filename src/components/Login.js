import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import AppFooter from "./AppFooter";
import { AppHeader } from "./Headers";
import { Layout, Form as AntForm } from "antd";
import { MainContent, CenteredH2 } from "../utils/Styles";
import { CenteredSubmitButton } from "../utils/Buttons";
import { AlertErrorMessage } from "../utils/Utils";
import axios from "axios";

const { Content } = Layout;
const FormItem = AntForm.Item;

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
        axios
          .create({
            baseURL: process.env.REACT_APP_BASE_URL,
            responseType: "json"
          })
          .post("/user_token", {
            auth: { email: values.email, password: values.password }
          })
          .then(response => {
            console.log("response", response);
            sessionStorage.setItem("email", values.email);
            sessionStorage.setItem("jwt", response.data.jwt);
            window.location = "/";
          })
          .catch(error => {
            resetForm();
          });
      }}
      render={() => (
        <Form>
          <AppHeader />
          <Content style={{ padding: "0 50px" }}>
            <MainContent>
              <CenteredH2>Sign in</CenteredH2>
              <FormItem>
                <Field
                  className="ant-input"
                  name="email"
                  placeholder="Enter email"
                  type="email"
                />
                <AlertErrorMessage name="email" type="error" />
              </FormItem>
              <FormItem>
                <Field
                  className="ant-input"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                />
                <AlertErrorMessage name="password" type="error" />
              </FormItem>
              <CenteredSubmitButton text="Log in" />
            </MainContent>
          </Content>
          <AppFooter />
        </Form>
      )}
    />
  );
};

export default Login;
