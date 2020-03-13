import { Col, Modal, Typography } from "antd";
import React from "react";
import { createSubdomain, updateSubdomain } from "../../utils/api/subdomain";

import * as Yup from "yup";

import { RightSubmitButton } from "../../utils/Buttons";
import { AlertErrorMessage, DRow } from "../../utils/Utils";
import { Field, Form, Formik } from "formik";

import { modalWidth } from "../../utils/Constants";

const { Text } = Typography;
const SubdomainSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});

const Subdomain = props => {
  const subdomain = props.subdomain;
  const title =
    subdomain.title && subdomain.title.length > 0
      ? subdomain.title
      : "New Subdomain";

  const onCancel = () => {
    props.fetchDomains();
    props.setVisible(false);
  };

  return (
    <Modal
      title={title}
      visible={props.visible}
      footer={null}
      onCancel={() => props.setVisible(false)}
      width={modalWidth}
    >
      <Formik
        initialValues={{
          title: (subdomain && subdomain.title) || "",
          domain_id: props.domain.id
        }}
        validationSchema={SubdomainSchema}
        onSubmit={values => {
          if (subdomain.id) {
            updateSubdomain(props.instrument, props.domain.score_scheme_id, {
              id: subdomain.id,
              title: values.title,
              domain_id: props.domain.id
            }).then(res => onCancel());
          } else {
            createSubdomain(props.instrument, props.domain.score_scheme_id, {
              title: values.title,
              domain_id: props.domain.id
            }).then(res => onCancel());
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
            <RightSubmitButton />
          </Form>
        )}
      />
    </Modal>
  );
};

export default Subdomain;
