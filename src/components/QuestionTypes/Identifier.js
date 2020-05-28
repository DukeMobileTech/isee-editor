import React from "react";
import { Row, Col } from "antd";

export const Identifier = ({ iq }) => {
  return (
    <Row type="flex" gutter={8} justify="space-between" align="top">
      <Col>
        <strong>{`${iq.number_in_instrument}) `}</strong>
        <small>{iq.identifier}</small>
      </Col>
      <Col>
        <small
          style={{ float: "right" }}
        >{`${iq.section_title} | ${iq.display_title}`}</small>
      </Col>
    </Row>
  );
};
