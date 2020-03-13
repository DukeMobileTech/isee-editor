import { Col, Modal, Typography } from "antd";
import React from "react";
import { createDomain, updateDomain } from "../../utils/api/domain";
import * as Yup from "yup";

import { RightSubmitButton } from "../../utils/Buttons";
import { AlertErrorMessage, DRow } from "../../utils/Utils";
import { Field, Form, Formik } from "formik";

import { modalWidth } from "../../utils/Constants";

const { Text } = Typography;
const DomainSchema = Yup.object().shape({
  title: Yup.string().required("Title is required")
});

const Domain = props => {
  const domain = props.domain;
  const title =
    domain.title && domain.title.length > 0 ? domain.title : "New Domain";

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
          title: (domain && domain.title) || "",
          score_scheme_id: props.scoreSchemeId
        }}
        validationSchema={DomainSchema}
        onSubmit={values => {
          if (domain.id) {
            updateDomain(props.instrument, {
              id: domain.id,
              title: values.title,
              score_scheme_id: props.scoreSchemeId
            }).then(res => props.fetchDomains());
          } else {
            createDomain(props.instrument, {
              title: values.title,
              score_scheme_id: props.scoreSchemeId
            }).then(res => props.fetchDomains());
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

export default Domain;
