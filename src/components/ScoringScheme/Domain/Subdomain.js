import React, { useEffect } from "react";
import { Row, Col, Button, Icon, Modal } from "antd";
import { useFormState } from "react-use-form-state";
import { updateSubdomain, createSubdomain } from "../../../utils/API";

const Subdomain = props => {
  const domain = props.domain;
  const subdomain = props.subdomain
    ? props.subdomain
    : { title: "", domain_id: domain.id };
  const title = subdomain.title.length > 0 ? subdomain.title : "New Domain";
  const [formState, { text }] = useFormState();

  useEffect(() => {
    formState.setField("title", subdomain.title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subdomain.id]);

  const handleSubmit = e => {
    subdomain.title = e.values.title;

    if (subdomain.id) {
      updateSubdomain(props.instrument, domain.score_scheme_id, subdomain)
        .then(response => {
          if (response.status === 204) {
            props.fetchDomains();
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      createSubdomain(props.instrument, domain.score_scheme_id, subdomain)
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
      destroyOnClose={true}
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

export default Subdomain;
