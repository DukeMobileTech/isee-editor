import { Col, Typography } from "antd";
import React from "react";
import { createSubdomain, updateSubdomain } from "../../utils/api/subdomain";

import * as Yup from "yup";

import { RightSubmitButton } from "../../utils/Buttons";
import { AlertErrorMessage, DRow } from "../../utils/Utils";
import { Field, Form, Formik } from "formik";

const { Text } = Typography;
const SubdomainSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});

const SubdomainForm = props => {
  const subdomain = props.subdomain;

  const onCancel = () => {
    props.fetchDomain();
    props.setVisible(false);
  };

  return (
    <Formik
      initialValues={{
        id: (subdomain && subdomain.id) || null,
        title: (subdomain && subdomain.title) || "",
        name: (subdomain && subdomain.name) || "",
        domain_id: props.domain.id
      }}
      validationSchema={SubdomainSchema}
      onSubmit={values => {
        const obj = {
          id: values.id,
          title: values.title,
          name: values.name,
          domain_id: props.domain.id
        };
        if (values.id) {
          updateSubdomain(
            props.instrument,
            props.scoreScheme.id,
            obj
          ).then(res => onCancel());
        } else {
          createSubdomain(
            props.instrument,
            props.scoreScheme.id,
            obj
          ).then(res => onCancel());
        }
      }}
      render={() => (
        <Form>
          <DRow>
            <Col span={4}>
              <Text strong>Title</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="title"
                placeholder="Enter title"
                type="text"
              />
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="title" type="error" />
            </Col>
          </DRow>
          <DRow>
            <Col span={4}>
              <Text strong>Name</Text>
            </Col>
            <Col span={14}>
              <Field
                className="ant-input"
                name="name"
                placeholder="Enter name"
                type="text"
              />
            </Col>
            <Col span={6}>
              <AlertErrorMessage name="name" type="error" />
            </Col>
          </DRow>
          <RightSubmitButton />
        </Form>
      )}
    />
  );
};

export default SubdomainForm;
