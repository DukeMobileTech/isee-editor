import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Display from "./Display";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Section = props => {
  const section = props.section;
  const displays = props.displays.filter(dis => dis.section_id === section.id);

  return (
    <Accordion key={`${section.id}_${section.title}`}>
      {displays.map((display, index) => {
        return (
          <Card key={display.id}>
            <Accordion.Toggle as={Card.Header} eventKey={`${index}`}>
              <Row>
                <Col xs={2}>
                  <h5>{display.position}</h5>
                </Col>
                <Col>
                  <h5>{display.title}</h5>
                </Col>
              </Row>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={`${index}`}>
              <Card.Body>
                <Display display={display} />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        );
      })}
    </Accordion>
  );
};

export default Section;
