import { Col, Typography } from "antd";
import React from "react";
import { createDomain, updateDomain } from "../../utils/api/domain";
import * as Yup from "yup";

import { RightSubmitButton } from "../../utils/Buttons";
import { AlertErrorMessage, DRow } from "../../utils/Utils";
import { Field, Form, Formik } from "formik";

const { Text } = Typography;
const DomainSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});

const DomainForm = props => {
  const domain = props.domain;

  return (
    <Formik
      initialValues={{
        id: (domain && domain.id) || null,
        title: (domain && domain.title) || "",
        score_scheme_id: props.scoreSchemeId,
        name: (domain && domain.name) || ""
      }}
      validationSchema={DomainSchema}
      onSubmit={values => {
        const domainObj = {
          id: values.id,
          title: values.title,
          name: values.name,
          score_scheme_id: props.scoreSchemeId
        };
        if (values.id) {
          updateDomain(props.instrument, domainObj).then(res =>
            props.fetchDomains()
          );
        } else {
          createDomain(props.instrument, domainObj).then(res =>
            props.fetchDomains()
          );
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

export default DomainForm;
