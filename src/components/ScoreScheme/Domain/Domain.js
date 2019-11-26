import { Button, Col, Icon, Modal, Row } from "antd";
import React from "react";
import { useFormState } from "react-use-form-state";
import { createDomain, updateDomain } from "../../../utils/api/domain";

const Domain = props => {
  const domain = props.domain
    ? props.domain
    : { title: "", score_scheme_id: props.scoreSchemeId };
  const title = domain.title.length > 0 ? domain.title : "New Domain";
  const [formState, { text }] = useFormState({
    title: domain.title
  });

  const handleSubmit = e => {
    domain.title = e.values.title;

    if (domain.id) {
      updateDomain(props.instrument, domain)
        .then(response => {
          if (response.status === 204) {
            props.fetchDomains();
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      createDomain(props.instrument, domain)
        .then(response => {
          if (response.status === 201) {
            props.fetchDomains();
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const onCancel = () => {
    props.setVisible(false);
  };

  return (
    <Modal
      title={title}
      visible={props.visible}
      footer={null}
      onCancel={onCancel}
    >
      <Row>
        <Col span={6}>Title</Col>
        <Col span={18}>
          <input
            {...text("title")}
            required
            minLength="1"
            className="ant-input"
          />
        </Col>
      </Row>

      <br />
      <Row>
        <Col span={10}></Col>
        <Button type="primary" onClick={() => handleSubmit(formState)}>
          <Icon type="save" />
        </Button>
      </Row>
    </Modal>
  );
};

export default Domain;
